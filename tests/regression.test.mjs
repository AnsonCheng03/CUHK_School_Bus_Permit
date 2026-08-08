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
const saveCardStyles = read('savecard/style.css');
const worker = read('service-worker.js');
const printStart = styles.indexOf('@media print');
const printStyles = printStart >= 0 ? styles.slice(printStart) : '';

test('JavaScript files parse successfully', () => {
    for (const file of ['bootstrap.js', 'script.js', 'service-worker.js']) {
        const result = spawnSync(process.execPath, ['--check', file], {
            cwd: projectRoot,
            encoding: 'utf8'
        });
        assert.equal(result.status, 0, result.stderr || `${file} failed syntax validation`);
    }
});

test('critical loader paints before the application chunk', () => {
    const bootstrap = read('bootstrap.js');
    assert.match(html, /body\.is-booting > :not\(\.app-loader\) \{ display: none !important; \}/);
    assert.match(html, /body\.is-booting \{[^}]*overflow-y: scroll;[^}]*scrollbar-gutter: stable;/);
    assert.match(styles, /body\.is-booting \{[\s\S]*overflow-y: scroll;[\s\S]*scrollbar-gutter: stable;/);
    assert.match(html, /<script src="bootstrap\.js\?v=\d+" defer><\/script>/);
    assert.doesNotMatch(html, /<link rel="preload" as="image" href="getcard\/images\//);
    assert.doesNotMatch(html, /<script src="script\.js\?/);
    assert.match(bootstrap, /requestAnimationFrame\(\(\) => requestAnimationFrame/);
    assert.match(bootstrap, /await Promise\.all\(styles\.map\(loadStyle\)\)/);
    assert.match(bootstrap, /script\.src = `script\.js\?v=/);
    assert.match(script, /querySelector\('script\[src\*="bootstrap\.js"\]'\)/);
    assert.match(worker, /bootstrap\.js\?v=\$\{RELEASE_VERSION\}/);
});

test('all three SPA steps and required actions remain present', () => {
    for (const view of ['form', 'creating', 'preview']) {
        assert.match(html, new RegExp(`data-view="${view}"`));
    }
    for (const control of ['fullscreen-button', 'edit-permit-button', 'share-image-button', 'printbtn']) {
        assert.match(html, new RegExp(`class="[^"]*${control}`));
    }
    assert.equal((html.match(/<circle cx="12" cy="12" r="9" \/>/g) || []).length, 2);
    assert.match(styles, /\.type-options svg[\s\S]*fill: none[\s\S]*stroke-width: 1\.8/);
    assert.match(script, /siteHeader\.hidden = viewName !== 'form'/);
    assert.match(script, /siteFooter\.hidden = viewName !== 'form'/);
});

test('iOS Safari can promote the native CU Bus app', () => {
    assert.match(html, /<meta name="apple-itunes-app" content="app-id=6736944558">/);
    assert.match(html, /href="https:\/\/apps\.apple\.com\/us\/app\/cu-bus\/id6736944558"/);
    assert.match(html, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.cubus\.app"/);
});

test('Android can launch the installed CU Bus app with a web fallback', () => {
    assert.match(html, /data-platform="android" href="https:\/\/cu-bus\.online\/open-app"/);
    assert.match(html, /data-i18n-aria-label="openApp"/);
    assert.match(script, /openAppText: '開啟 App'/);
    assert.match(script, /openAppText: 'Open app'/);
    assert.match(script, /setAttribute\('data-platform', destination\)/);
});

test('mobile app banner avoids Safari compositing shadows', () => {
    assert.match(styles, /@media \(max-width: 680px\)[\s\S]*\.app-promo \{[\s\S]*box-shadow: none;[\s\S]*-webkit-backdrop-filter: none;[\s\S]*backdrop-filter: none;/);
});

test('online status and manual update flow remain accessible', () => {
    assert.match(html, /class="network-update-button"[^>]*data-state="online"/);
    assert.match(html, /class="update-dialog"[^>]*aria-labelledby="update-dialog-title"[^>]*aria-describedby="update-dialog-message"/);
    assert.match(html, /class="update-progress[^"]*" role="progressbar"[^>]*aria-valuenow="0"/);
    assert.match(script, /window\.addEventListener\('online', updateNetworkStatus\)/);
    assert.match(script, /window\.addEventListener\('offline', updateNetworkStatus\)/);
    assert.match(script, /fetch\(indexUrl, \{ cache: 'no-store' \}\)/);
    assert.match(script, /latestVersion === assetVersion/);
    assert.match(script, /cacheName\.startsWith\('cu-bus-permit-'\)/);
    assert.match(script, /serviceWorker\.register\([\s\S]*encodeURIComponent\(latestVersion\)/);
    assert.match(worker, /type: 'CACHE_PROGRESS'/);
    assert.match(worker, /broadcastProgress\(completed, APP_SHELL\.length\)/);
    assert.match(styles, /\.update-dialog\[open\][\s\S]*animation: update-dialog-in/);
    assert.match(styles, /\.update-dialog\.is-closing::backdrop[\s\S]*animation: update-backdrop-out/);
    assert.match(styles, /\.update-progress\.is-hidden[\s\S]*visibility: hidden/);
    assert.match(styles, /\.update-dialog-close\.is-placeholder[\s\S]*visibility: hidden/);
    assert.match(script, /updateProgress\.classList\.toggle\('is-hidden', !showProgress\)/);
    assert.match(script, /updateDialogClose\.classList\.toggle\('is-placeholder', !closable\)/);
    assert.match(script, /updateDialog\.classList\.add\('is-closing'\)/);
    assert.match(script, /event\.preventDefault\(\);[\s\S]*closeUpdateDialog\(\)/);
    assert.match(script, /siteHeader\.hidden = viewName !== 'form'/);
    assert.doesNotMatch(styles, /site-header\.status-only/);
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
    assert.match(styles, /\.field input\[type="date"\][\s\S]*display: inline-block/);
    assert.match(styles, /\.field input\[type="date"\][\s\S]*line-height: 46px/);
    assert.match(styles, /\.field input\[type="date"\][\s\S]*padding: 0 15px/);
    assert.match(styles, /::-webkit-date-and-time-value[\s\S]*height: 46px/);
    assert.match(styles, /::-webkit-date-and-time-value[\s\S]*align-items: center/);
    assert.match(styles, /::-webkit-date-and-time-value[\s\S]*justify-content: flex-start/);
    assert.match(styles, /::-webkit-datetime-edit[\s\S]*line-height: 46px/);
    assert.match(styles, /::-webkit-datetime-edit[\s\S]*justify-content: flex-start/);
    assert.match(script, /Math\.max\(1, mount\.clientWidth - 24\)/);
    assert.match(script, /visualViewport\?\.addEventListener\('resize', resizeCard/);
});

test('card generation and completion animations do not regress', () => {
    assert.match(styles, /blank-card-slide-in/);
    assert.match(styles, /new-card-spin 1050ms cubic-bezier\([^)]*\) 1 both/);
    assert.match(styles, /rotateY\(360deg\)/);
    assert.doesNotMatch(styles, /rotateY\(1080deg\)/);
    assert.match(script, /Math\.min\(512, endX - 24\)/);
    assert.match(styles, /opacity 650ms ease-out/);
    assert.match(styles, /box-shadow 550ms cubic-bezier/);
    assert.match(styles, /\.card-object\.is-painting \.card-edge[\s\S]*display: none !important/);
    assert.match(styles, /\.paint-canvas[\s\S]*inset: -1px[\s\S]*width: 562px[\s\S]*height: 358px/);
    assert.match(styles, /\.paint-canvas[\s\S]*border-radius: 0[\s\S]*transform: translateZ\(9px\)/);
    assert.match(styles, /\.brush-head[\s\S]*translate3d\(var\(--brush-x, 0\), var\(--brush-y, 0\), 10px\)/);
    assert.match(styles, /\.paint-canvas[\s\S]*transition: opacity 650ms ease-out/);
    assert.match(styles, /\.paint-canvas\.is-fading[\s\S]*opacity: 0/);
    assert.match(script, /paintCanvas\.classList\.add\('is-fading'\)/);
    assert.match(script, /event\.propertyName === 'opacity'/);
});

test('full-screen preview moves the existing card without fading it', () => {
    assert.match(script, /function openFullscreenPreview\(\) \{[\s\S]*const cardStartRect = cardScaler\.getBoundingClientRect\(\)/);
    assert.match(script, /fullscreenMount\.append\(cardScaler\)[\s\S]*resizeCard\(\)[\s\S]*animateCardMove\(cardStartRect\)/);
    assert.match(script, /function openFullscreenPreview\(\)[\s\S]*cardObject\.setAttribute\('tabindex', '0'\)/);
    assert.match(styles, /\.fullscreen-preview::before[\s\S]*animation: fullscreen-in/);
    assert.match(styles, /\.fullscreen-close[\s\S]*animation: fullscreen-close-in 260ms ease both/);
    assert.match(styles, /\.fullscreen-preview\.is-closing \.fullscreen-close[\s\S]*opacity: 0[\s\S]*transform: scale\(0\.92\)/);
    assert.match(styles, /\.fullscreen-preview \.card-mount[\s\S]*z-index: 1/);
    assert.match(script, /function animateCardBackToPreview\(\)[\s\S]*targetRect = previewMount\.getBoundingClientRect\(\)/);
    assert.match(script, /closeFullscreenPreview\(\)[\s\S]*await animateCardBackToPreview\(\)[\s\S]*previewMount\.append\(cardScaler\)/);
    assert.doesNotMatch(script, /function flipCard\(\) \{\s*if \(isFullscreen\) return/);
    assert.match(script, /fullscreenPreview\.addEventListener\('click',[\s\S]*closest\('\.card-scaler, \.fullscreen-close'\)[\s\S]*closeFullscreenPreview\(\)/);
});

test('card remains unselectable and retains a distinct bilingual back', () => {
    assert.match(styles, /\.card-object[\s\S]*user-select: none/);
    assert.match(styles, /\.card-front \.card \{[\s\S]*box-shadow: none/);
    assert.match(styles, /\.card-front \{[\s\S]*box-shadow: 0 24px 52px/);
    assert.match(html, /class="card-back"/);
    assert.match(html, /<strong lang="zh-HK">乘車須知<\/strong>/);
    assert.match(html, /<span lang="en">Passenger Notice<\/span>/);
    assert.match(html, /本證為非官方創作，不代表乘車資格或身份證明/);
    assert.doesNotMatch(html, /令大家嘅旅程更舒服|a little appreciation makes every journey better/);
    assert.match(html, /lang="zh-HK"/);
    assert.match(html, /lang="en"/);
});

test('WCAG interaction structure and focus management remain present', () => {
    assert.match(html, /class="skip-link" href="#main-content"/);
    assert.match(html, /id="main-content" tabindex="-1"/);
    assert.match(html, /class="builder-layout form-only" aria-labelledby="page-title"/);
    assert.match(html, /class="creation-layout"[^>]*data-i18n-aria-label="creatingLabel"[^>]*tabindex="-1"/);
    assert.match(html, /class="preview-panel-spa"[^>]*data-i18n-aria-label="previewLabel"/);
    assert.match(html, /id="app-status" role="status" aria-live="polite" aria-atomic="true"/);
    assert.match(html, /class="fullscreen-preview"[^>]*role="dialog"[^>]*aria-modal="true"/);
    assert.match(html, /class="fullscreen-close"[^>]*data-i18n-aria-label="closeFullscreen"/);
    assert.match(html, /class="card-object" role="button" tabindex="-1"[^>]*aria-describedby="card-accessible-description"/);
    assert.match(script, /cardScaler\.setAttribute\('aria-hidden', String\(!cardIsAvailable\)\)/);
    assert.match(script, /cardObject\.setAttribute\('tabindex', cardIsAvailable && !isFullscreen \? '0' : '-1'\)/);
    assert.match(script, /pageShell\.inert = true[\s\S]*pageShell\.setAttribute\('inert', ''\)[\s\S]*pageShell\.setAttribute\('aria-hidden', 'true'\)/);
    assert.match(script, /pageShell\.inert = false[\s\S]*pageShell\.removeAttribute\('inert'\)[\s\S]*pageShell\.removeAttribute\('aria-hidden'\)/);
    assert.match(script, /event\.key === 'Tab'[\s\S]*focusTargets = \[fullscreenCloseButton, cardObject\][\s\S]*focusTargets\[nextIndex\]\.focus/);
    assert.match(script, /creationMain\?\.focus/);
    assert.match(script, /cardObject\.focus\(\{ preventScroll: true \}\)[\s\S]*announce\(t\('previewStatus'\)\)/);
    assert.match(script, /function updateCardAccessibleDescription\([^)]*showBack[\s\S]*\.terms-list li > span\[lang=/);
    assert.match(script, /function setCardSide\(showBack\)[\s\S]*updateCardAccessibleDescription\(permitParams, showBack\)/);
    assert.match(html, /class="preview-actions" role="group"[^>]*data-i18n-aria-label="actionsLabel"/);
    for (const actionLabel of ['previewActionLabel', 'editActionLabel', 'shareActionLabel', 'printActionLabel']) {
        assert.match(html, new RegExp(`class="[^"]*action-button[^"]*"[^>]*tabindex="0"[^>]*data-i18n-aria-label="${actionLabel}"`));
    }
    assert.match(html, /class="[^"]*fullscreen-button[^"]*"[^>]*aria-haspopup="dialog"[^>]*aria-controls="fullscreen-preview"/);
    assert.match(html, /class="[^"]*edit-permit-button[^"]*"[^>]*aria-controls="permit-form"/);
});

test('WCAG motion, focus visibility, language, and status support remain present', () => {
    assert.match(styles, /\.skip-link:focus[\s\S]*transform: translateY\(0\)/);
    assert.match(styles, /\.field input:focus-visible[\s\S]*outline: 3px solid var\(--purple\)/);
    assert.match(styles, /\.fullscreen-close:focus-visible[\s\S]*outline: 3px solid var\(--gold\)/);
    assert.match(styles, /\.preview-actions \.action-button:focus-visible[\s\S]*outline: 3px solid #fff[\s\S]*box-shadow: 0 0 0 6px/);
    assert.match(styles, /@media \(forced-colors: active\)/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important/);
    assert.match(script, /function animateProgress[\s\S]*if \(reducedMotion\)[\s\S]*setProgress\(to\)/);
    assert.match(script, /function paintPermit[\s\S]*if \(reducedMotion\)[\s\S]*paintCanvas\.hidden = true/);
    assert.match(script, /shareImageButton\.setAttribute\('aria-busy', 'true'\)/);
    assert.match(script, /announce\(t\('shareSaved'\)\)/);
    assert.match(html, /lang="zh-HK"/);
    assert.match(html, /lang="en"/);
});

test('print keeps both card sides, removes shadows, and uses the website QR', () => {
    assert.notEqual(printStyles, '', 'print stylesheet is missing');
    assert.match(printStyles, /box-shadow: none !important/);
    assert.match(printStyles, /\.card-front,\s*\n\s*\.card-back[\s\S]*backface-visibility: visible/);
    assert.match(printStyles, /height: 734px/);
    assert.match(printStyles, /\.preview-card-mount[\s\S]*margin: 0 auto !important/);
    assert.match(printStyles, /\.card-scaler[\s\S]*left: 0 !important[\s\S]*margin: 0 auto !important/);
    assert.match(printStyles, /\.preview-view[\s\S]*height: 297mm !important[\s\S]*display: table !important/);
    assert.match(printStyles, /\.preview-panel-spa[\s\S]*display: table-cell !important[\s\S]*padding: 14mm 0 !important[\s\S]*vertical-align: middle/);
    assert.match(saveCardStyles, /@media print[\s\S]*\.preview-object[\s\S]*margin: 0 auto !important/);
    assert.match(saveCardStyles, /@media print[\s\S]*\.preview-page[\s\S]*height: 297mm !important[\s\S]*display: table !important/);
    assert.doesNotMatch(saveCardStyles, /@media print[\s\S]*justify-content: right/);
    assert.match(html, /website-qr\.png/);
    assert.match(html, /href="https:\/\/cu-bus\.online\/"/);
});

test('shared image rendering stays shadow-free', () => {
    const renderStart = script.indexOf('async function renderPermitImage');
    const renderEnd = script.indexOf('async function sharePermitImage');
    assert.ok(renderStart >= 0 && renderEnd > renderStart, 'share renderer is missing');
    assert.doesNotMatch(script.slice(renderStart, renderEnd), /shadow(?:Blur|Color|OffsetX|OffsetY)\s*=/);
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
    const workerVersion = worker.match(/const RELEASE_VERSION = '(\d+)'/)?.[1];
    assert.equal(workerVersion, versions[0], 'service worker release version must match the app shell');

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
