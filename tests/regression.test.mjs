import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Run from the project root: node --test tests/regression.test.mjs
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const html = read('index.html');
const script = read('script.js');
const styles = `${read('style.css')}\n${read('spa.css')}`;
const worker = read('service-worker.js');
const printStart = styles.indexOf('@media print');
const printStyles = printStart >= 0 ? styles.slice(printStart) : '';

test('JavaScript files parse successfully', () => {
    for (const file of ['script.js', 'service-worker.js']) {
        const result = spawnSync(process.execPath, ['--check', file], {
            cwd: projectRoot,
            encoding: 'utf8'
        });
        assert.equal(result.status, 0, result.stderr || `${file} failed syntax validation`);
    }
});

test('all three SPA steps and required actions remain present', () => {
    for (const view of ['form', 'creating', 'preview']) {
        assert.match(html, new RegExp(`data-view="${view}"`));
    }
    for (const control of ['fullscreen-button', 'edit-permit-button', 'share-image-button', 'printbtn']) {
        assert.match(html, new RegExp(`class="[^"]*${control}`));
    }
    assert.match(script, /siteHeader\.hidden = viewName !== 'form'/);
    assert.match(script, /siteFooter\.hidden = viewName !== 'form'/);
});

test('startup waits for IndexedDB and every visible app image', () => {
    assert.match(html, /class="app-loader"/);
    assert.match(script, /window\.indexedDB\.open\(databaseName, 1\)/);
    assert.match(script, /preloadStartupImages\(\)/);
    assert.match(script, /minimumStartupTime\(\)/);
    assert.doesNotMatch(script, /localStorage|sessionStorage|openDatabase\s*\(/i);

    for (const asset of [
        'getcard/images/schbus_d.png',
        'getcard/images/schbus_l.png',
        'getcard/images/CUHK.png',
        'bus-app-icon-256.png',
        'app-store-badge.svg',
        'google-play-badge.png',
        'website-qr.png'
    ]) {
        assert.match(script, new RegExp(asset.replaceAll('.', '\\.')));
        assert.ok(existsSync(new URL(`../${asset}`, import.meta.url)), `${asset} is missing`);
    }
});

test('permit draft and manually changed date remain persistent', () => {
    assert.match(script, /form\.addEventListener\('input', scheduleFormDraftSave\)/);
    assert.match(script, /validDateChanged/);
    assert.match(script, /input: `\$\{year\}-07-31`/);
    assert.match(script, /display: `31\/7\/\$\{year\}`/);
    assert.match(script, /defaultPermitExpiry\(today\)\.display/);
});

test('mobile viewport and safe areas remain constrained', () => {
    assert.match(html, /viewport-fit=cover/);
    assert.match(styles, /100dvh/);
    for (const edge of ['top', 'right', 'bottom', 'left']) {
        assert.match(styles, new RegExp(`safe-area-inset-${edge}`));
    }
    assert.match(styles, /permit-form input:not\(\[type="radio"\]\)[\s\S]*font-size: 16px/);
    assert.match(styles, /\.field input\[type="date"\][\s\S]*padding: 0/);
    assert.match(styles, /::-webkit-date-and-time-value[\s\S]*height: 100%/);
    assert.match(styles, /::-webkit-date-and-time-value[\s\S]*align-items: center/);
    assert.match(script, /Math\.max\(1, mount\.clientWidth - 24\)/);
    assert.match(script, /visualViewport\?\.addEventListener\('resize', resizeCard/);
});

test('card generation and completion animations do not regress', () => {
    assert.match(styles, /blank-card-slide-in/);
    assert.match(styles, /new-card-spin 1050ms/);
    assert.match(styles, /rotateY\(1080deg\)/);
    assert.match(script, /Math\.min\(512, endX - 24\)/);
    assert.match(styles, /opacity 650ms ease-out/);
    assert.match(styles, /box-shadow 550ms cubic-bezier/);
});

test('card remains unselectable and retains a distinct bilingual back', () => {
    assert.match(styles, /\.card-object[\s\S]*user-select: none/);
    assert.match(html, /class="card-back"/);
    assert.match(html, /Terms &amp; Notice/);
    assert.match(html, /lang="zh-HK"/);
    assert.match(html, /lang="en"/);
});

test('print keeps both card sides, removes shadows, and uses the website QR', () => {
    assert.notEqual(printStyles, '', 'print stylesheet is missing');
    assert.match(printStyles, /box-shadow: none !important/);
    assert.match(printStyles, /\.card-front,\s*\n\s*\.card-back[\s\S]*backface-visibility: visible/);
    assert.match(printStyles, /height: 734px/);
    assert.match(html, /website-qr\.png/);
    assert.match(html, /href="https:\/\/cu-bus\.online\/"/);
});

test('service worker supports offline use and deterministic updates', () => {
    assert.match(script, /updateViaCache: 'none'/);
    assert.match(script, /registration\.update\(\)/);
    assert.match(worker, /cache: 'reload'/);
    assert.match(worker, /cache: 'no-cache'/);
    assert.match(worker, /self\.skipWaiting\(\)/);
    assert.match(worker, /self\.clients\.claim\(\)/);
    assert.match(worker, /networkFirstNavigation/);
    assert.match(worker, /RELEASE_VERSION/);

    const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
    assert.ok(versions.length >= 4, 'versioned core assets are missing');
    assert.equal(new Set(versions).size, 1, 'core asset versions must match');

    for (const asset of [
        'index.html', 'style.css', 'spa.css', 'script.js', 'site.webmanifest',
        'getcard/style.css', 'getcard/images/CUHK.png',
        'getcard/images/schbus_d.png', 'getcard/images/schbus_l.png',
        'bus-app-icon-256.png', 'app-store-badge.svg',
        'google-play-badge.png', 'website-qr.png'
    ]) {
        assert.match(worker, new RegExp(asset.replaceAll('.', '\\.')));
        assert.ok(existsSync(new URL(`../${asset}`, import.meta.url)), `${asset} is missing`);
    }
});
