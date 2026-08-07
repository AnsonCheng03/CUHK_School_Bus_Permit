const form = document.querySelector('.permit-form');
const views = new Map([...document.querySelectorAll('.spa-view')].map((view) => [view.dataset.view, view]));
const currentStep = document.querySelector('.current-step');
const editButton = document.querySelector('.edit-link');
const unofficialBadge = document.querySelector('.unofficial-badge');
const brandHome = document.querySelector('.brand-home');
const creationMount = document.querySelector('.creation-card-mount');
const previewMount = document.querySelector('.preview-card-mount');
const cardScaler = document.querySelector('.card-scaler');
const card = document.querySelector('.card');
const cardFront = document.querySelector('.card-front');
const cardBack = document.querySelector('.card-back');
const cardArtwork = document.querySelector('.card-artwork');
const cardObject = document.querySelector('.card-object');
const paintCanvas = document.querySelector('.paint-canvas');
const brushHead = document.querySelector('.brush-head');
const generationProgress = document.querySelector('.generation-progress');
const generationProgressFill = document.querySelector('.generation-progress-fill');
const fullscreenPreview = document.querySelector('.fullscreen-preview');
const fullscreenMount = document.querySelector('.fullscreen-card-mount');
const fullscreenButton = document.querySelector('.fullscreen-button');
const editPermitButton = document.querySelector('.edit-permit-button');
const shareImageButton = document.querySelector('.share-image-button');
const shareButtonLabel = shareImageButton.querySelector('.button-label');
const siteHeader = document.querySelector('.site-header');
const siteFooter = document.querySelector('.site-footer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let permitParams = new URLSearchParams();
let activeView = 'form';
let generationRun = 0;
let generatedSignature = '';
let flipTimer;
let isFullscreen = false;
let appInitialized = false;

function paramsSignature(params) {
    return ['Type', 'Name', 'SID', 'Major', 'Valid'].map((key) => params.get(key) || '').join('|');
}

function buildUrl(viewName, params = permitParams) {
    const url = new URL(window.location.href);
    url.search = '';
    if (viewName !== 'form') {
        url.searchParams.set('step', viewName);
        ['Type', 'Name', 'SID', 'Major', 'Valid'].forEach((key) => {
            const value = params.get(key);
            if (value) url.searchParams.set(key, value);
        });
    }
    return url;
}

function updateHistory(viewName, mode) {
    if (mode === 'none') return;
    const method = mode === 'replace' ? 'replaceState' : 'pushState';
    history[method]({ view: viewName }, '', buildUrl(viewName));
}

function updateHeader(viewName) {
    const step = viewName === 'form' ? '01' : viewName === 'creating' ? '02' : '03';
    currentStep.textContent = step;
    editButton.hidden = viewName === 'form';
    unofficialBadge.hidden = viewName !== 'form';
    siteHeader.hidden = viewName !== 'form';
    siteFooter.hidden = viewName !== 'form';
    document.body.dataset.view = viewName;
}

function commitView(viewName) {
    if (viewName !== 'preview' && isFullscreen) {
        isFullscreen = false;
        fullscreenPreview.hidden = true;
        document.body.classList.remove('fullscreen-open');
        cardObject.setAttribute('tabindex', '0');
    }

    views.forEach((view, name) => {
        const active = name === viewName;
        view.hidden = !active;
        view.classList.toggle('is-active', active);
        view.classList.remove('is-entering');
        if (active && !document.startViewTransition && !reducedMotion) {
            view.classList.add('is-entering');
            window.setTimeout(() => view.classList.remove('is-entering'), 650);
        }
    });

    activeView = viewName;
    updateHeader(viewName);
    document.title = viewName === 'form'
        ? '製作校巴證 | 中大校巴資訊站 CU BUS INFOPAGE'
        : viewName === 'creating'
            ? '正在繪製校巴證 | 中大校巴資訊站'
            : '校巴證預覽 | 中大校巴資訊站';

    if (viewName === 'creating') creationMount.append(cardScaler);
    if (viewName === 'preview') previewMount.append(cardScaler);
    cardScaler.setAttribute('aria-hidden', viewName === 'form' ? 'true' : 'false');
    requestAnimationFrame(resizeCard);
}

async function switchView(viewName, historyMode = 'push') {
    updateHistory(viewName, historyMode);
    generationRun += viewName === 'form' ? 1 : 0;

    if (appInitialized && document.startViewTransition && !reducedMotion) {
        const transition = document.startViewTransition(() => commitView(viewName));
        await transition.finished;
    } else {
        commitView(viewName);
    }

    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
}

function setCardData(params) {
    const type = params.get('Type') === 'Lesson' ? 'Lesson' : 'Transit';
    const isTransit = type === 'Transit';
    const today = new Date();
    const defaultValid = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 1}`;

    document.querySelector('.cardname h1').textContent = isTransit ? '穿梭校巴證' : '轉堂校巴證';
    document.querySelector('.cardname h2').textContent = isTransit ? 'Shuttle Bus Permit' : 'Meet-Class Bus Permit';
    const artworkSource = `getcard/images/${isTransit ? 'schbus_d.png' : 'schbus_l.png'}`;
    card.style.background = `url("${artworkSource}")`;
    cardArtwork.src = artworkSource;
    document.querySelectorAll('.routes .transit, .routes .lesson').forEach((route) => {
        route.style.display = '';
    });
    document.querySelectorAll(isTransit ? '.routes .lesson' : '.routes .transit').forEach((route) => {
        route.style.display = 'none';
    });
    document.querySelector('.studatas .Name .value span').textContent = params.get('Name') || '';
    document.querySelector('.studatas .SID .value span').textContent = params.get('SID') || '1155125528';
    document.querySelector('.studatas .Major .value span').textContent = params.get('Major') || 'B.A. in Fine Arts';
    document.querySelector('.studatas .Valid .value span').textContent = formatPermitDate(params.get('Valid')) || defaultValid;
}

function formatPermitDate(value) {
    if (!value) return '';
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (isoMatch) return `${Number(isoMatch[3])}/${Number(isoMatch[2])}/${isoMatch[1]}`;
    return value;
}

function dateInputValue(value) {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const legacyMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
    if (!legacyMatch) return '';
    return `${legacyMatch[3]}-${legacyMatch[2].padStart(2, '0')}-${legacyMatch[1].padStart(2, '0')}`;
}

function localIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setProgress(value) {
    const rounded = Math.max(0, Math.min(100, Math.round(value)));
    generationProgressFill.style.transform = `scaleX(${rounded / 100})`;
    generationProgress.setAttribute('aria-valuenow', String(rounded));
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = src;
    });
}

function animateProgress(from, to, duration, runId) {
    return new Promise((resolve) => {
        const start = performance.now();
        function frame(now) {
            if (runId !== generationRun) {
                resolve(false);
                return;
            }
            const elapsed = Math.min(1, (now - start) / duration);
            setProgress(from + (to - from) * elapsed);
            if (elapsed < 1) requestAnimationFrame(frame);
            else resolve(true);
        }
        requestAnimationFrame(frame);
    });
}

function preparePaintCanvas() {
    paintCanvas.hidden = false;
    const context = paintCanvas.getContext('2d');
    context.clearRect(0, 0, 560, 356);
    context.fillStyle = '#1c0729';
    context.fillRect(0, 0, 560, 356);
    context.strokeStyle = 'rgba(242, 197, 104, 0.14)';
    context.lineWidth = 1;
    for (let x = 18; x < 560; x += 28) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, 356);
        context.stroke();
    }
    return context;
}

function paintPermit(runId) {
    const context = preparePaintCanvas();
    const rows = 9;
    const duration = 3600;
    const start = performance.now();
    brushHead.classList.add('visible');

    return new Promise((resolve) => {
        function frame(now) {
            if (runId !== generationRun) {
                brushHead.classList.remove('visible');
                resolve(false);
                return;
            }

            const progress = Math.min(1, (now - start) / duration);
            const rowPosition = progress * rows;
            const rowIndex = Math.min(rows - 1, Math.floor(rowPosition));
            const rowProgress = Math.min(1, rowPosition - rowIndex);
            const direction = rowIndex % 2 === 0 ? 1 : -1;
            const startX = direction === 1 ? -30 : 590;
            const endX = direction === 1 ? -30 + 620 * rowProgress : 590 - 620 * rowProgress;
            const y = 22 + rowIndex * 40;

            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 52;
            context.beginPath();
            context.moveTo(startX, y);
            context.quadraticCurveTo((startX + endX) / 2, y + Math.sin(progress * 28) * 5, endX, y);
            context.stroke();
            context.restore();

            brushHead.style.setProperty('--brush-x', `${endX - 24}px`);
            brushHead.style.setProperty('--brush-y', `${y - 8}px`);
            setProgress(22 + progress * 62);

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                context.clearRect(0, 0, 560, 356);
                brushHead.classList.remove('visible');
                paintCanvas.hidden = true;
                resolve(true);
            }
        }
        requestAnimationFrame(frame);
    });
}

function resetGeneration() {
    window.clearTimeout(flipTimer);
    cardObject.classList.remove('is-back', 'is-ready', 'is-flipping');
    cardObject.setAttribute('aria-disabled', 'true');
    cardObject.setAttribute('aria-pressed', 'false');
    setProgress(0);
    preparePaintCanvas();
}

function markComplete() {
    paintCanvas.hidden = true;
    brushHead.classList.remove('visible');
    setProgress(100);
    cardObject.classList.add('is-ready');
    cardObject.setAttribute('aria-disabled', 'false');
}

async function createPermit(prepared = false) {
    const runId = ++generationRun;
    const type = permitParams.get('Type') === 'Lesson' ? 'Lesson' : 'Transit';
    if (!prepared) resetGeneration();
    setCardData(permitParams);
    resizeCard();

    await Promise.all([
        preloadImage('getcard/images/CUHK.png'),
        preloadImage(`getcard/images/${type === 'Transit' ? 'schbus_d.png' : 'schbus_l.png'}`),
        animateProgress(0, 22, 950, runId)
    ]);
    if (runId !== generationRun) return;

    if (!await paintPermit(runId)) return;

    if (!await animateProgress(84, 100, 520, runId)) return;

    generatedSignature = paramsSignature(permitParams);
    markComplete();
    if (runId === generationRun && activeView === 'creating') await openPreview('push');
}

function setCardSide(showBack) {
    const currentlyBack = cardObject.classList.contains('is-back');
    cardObject.setAttribute('aria-pressed', String(showBack));
    cardObject.setAttribute('aria-label', showBack ? '翻回校巴證正面' : '查看校巴證條款');
    cardFront.setAttribute('aria-hidden', String(showBack));
    cardBack.setAttribute('aria-hidden', String(!showBack));
    if (currentlyBack === showBack) return;

    window.clearTimeout(flipTimer);
    cardObject.classList.add('is-flipping');
    cardObject.classList.toggle('is-back', showBack);
    flipTimer = window.setTimeout(() => cardObject.classList.remove('is-flipping'), reducedMotion ? 20 : 1120);
}

function flipCard() {
    if (isFullscreen) return;
    if (cardObject.classList.contains('is-ready')) {
        setCardSide(!cardObject.classList.contains('is-back'));
    }
}

function resizeCard() {
    const mount = isFullscreen ? fullscreenMount : activeView === 'preview' ? previewMount : creationMount;
    if (!mount || !mount.clientWidth) return;
    const availableWidth = Math.max(280, mount.clientWidth - 24);
    const availableHeight = Math.max(210, mount.clientHeight - 24);
    const maxScale = isFullscreen ? 1.65 : 1;
    const scale = Math.min(maxScale, availableWidth / 560, availableHeight / 356);
    document.documentElement.style.setProperty('--card-scale', scale.toFixed(3));
}

function populateForm(params) {
    ['Name', 'SID', 'Major'].forEach((name) => {
        const input = form.elements.namedItem(name);
        if (input && params.has(name)) input.value = params.get(name);
    });
    if (params.has('Valid')) form.elements.Valid.value = dateInputValue(params.get('Valid'));
    const type = params.get('Type');
    if (type && form.elements.Type) form.elements.Type.value = type;
}

async function openForm(historyMode = 'push') {
    await switchView('form', historyMode);
}

async function openCreating(historyMode = 'push', shouldGenerate = true) {
    setCardData(permitParams);
    if (shouldGenerate) resetGeneration();
    await switchView('creating', historyMode);
    if (shouldGenerate) createPermit(true);
    else markComplete();
}

async function openPreview(historyMode = 'push') {
    generationRun++;
    setCardData(permitParams);
    markComplete();
    setCardSide(false);
    await switchView('preview', historyMode);
}

function drawAmbient() {
    const canvas = document.querySelector('.ambient-canvas');
    const context = canvas.getContext('2d');
    const dots = Array.from({ length: 38 }, (_, index) => ({
        x: (index * 89) % window.innerWidth,
        y: (index * 137) % window.innerHeight,
        size: index % 5 === 0 ? 1.7 : 0.8,
        phase: index * 0.7
    }));

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(time = 0) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        dots.forEach((dot) => {
            const opacity = 0.14 + (Math.sin(time * 0.001 + dot.phase) + 1) * 0.12;
            context.fillStyle = `rgba(242,197,104,${opacity})`;
            context.beginPath();
            context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            context.fill();
        });
        if (!reducedMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(draw);
}

function openFullscreenPreview() {
    isFullscreen = true;
    setCardSide(false);
    fullscreenPreview.hidden = false;
    fullscreenMount.append(cardScaler);
    document.body.classList.add('fullscreen-open');
    cardObject.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => {
        resizeCard();
        fullscreenPreview.focus({ preventScroll: true });
    });
}

function closeFullscreenPreview() {
    if (!isFullscreen) return;
    isFullscreen = false;
    previewMount.append(cardScaler);
    fullscreenPreview.hidden = true;
    document.body.classList.remove('fullscreen-open');
    cardObject.setAttribute('tabindex', '0');
    requestAnimationFrame(resizeCard);
    fullscreenButton.focus({ preventScroll: true });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function roundedRectangle(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
}

function drawSpacedText(context, text, x, y, spacing) {
    let cursor = x;
    [...text].forEach((character) => {
        context.fillText(character, cursor, y);
        cursor += context.measureText(character).width + spacing;
    });
}

async function renderPermitImage() {
    const type = permitParams.get('Type') === 'Lesson' ? 'Lesson' : 'Transit';
    const isTransit = type === 'Transit';
    const [background, logo] = await Promise.all([
        loadImage(`getcard/images/${isTransit ? 'schbus_d.png' : 'schbus_l.png'}`),
        loadImage('getcard/images/CUHK.png')
    ]);
    const canvas = document.createElement('canvas');
    canvas.width = 1120;
    canvas.height = 712;
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    roundedRectangle(context, 0, 0, 560, 356, 20);
    context.clip();
    context.drawImage(background, 0, 0, 560, 356);
    context.drawImage(logo, 35, 23, 53, 42);

    context.fillStyle = '#fff';
    context.textBaseline = 'alphabetic';
    context.font = '15px Arial, sans-serif';
    drawSpacedText(context, '香港中文大學', 98, 39, 3.1);
    context.font = '12.5px Georgia, serif';
    context.fillText('The Chinese University of Hong Kong', 98, 56);
    context.textAlign = 'center';
    context.font = '16px Arial, sans-serif';
    context.fillText('落車前請按鐘一次', 443, 39);
    context.font = '10px Arial, sans-serif';
    context.fillText('TO STOP PRESS THE BELL ONCE', 443, 54);
    context.textAlign = 'left';

    context.font = 'bold 45px Arial, sans-serif';
    drawSpacedText(context, isTransit ? '穿梭校巴證' : '轉堂校巴證', 37, 116, 1.5);
    context.font = '20.5px Arial, sans-serif';
    context.fillText(isTransit ? 'SHUTTLE BUS PERMIT' : 'MEET-CLASS BUS PERMIT', 40, 143);
    context.fillStyle = 'rgb(236,240,241)';
    context.font = '10px Arial, sans-serif';
    context.fillText('持證者獲交通事務處批准乘搭下列的穿梭校巴路線', 40, 163);
    context.fillText('The Permit Holder is allowed to ride on the following routes', 40, 176);

    const routeSets = isTransit
        ? [
            ['1', '#fff149', '#f3b53a'], ['2', '#fff149', '#f3b53a'], ['3', '#a4cc39', '#318761'],
            ['4', '#f1a63b', '#e75a24'], ['8', '#ffe3a8', '#ffc55a'], ['N', '#d1b4d5', '#7961a8'], ['H', '#896391', '#453087']
        ]
        : [
            ['5', '#c2d6ea', '#29a1d8'], ['6A', '#7c8644', '#585823'], ['6B', '#4f88c1', '#3f438f'], ['7', '#c2c2c2', '#666666']
        ];
    routeSets.forEach(([label, from, to], index) => {
        const x = 40 + index * 31;
        const gradient = context.createLinearGradient(x, 0, x + 31, 0);
        gradient.addColorStop(0, from);
        gradient.addColorStop(1, to);
        context.fillStyle = gradient;
        context.fillRect(x, 188, 31, 20);
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.font = 'bold 15px Arial, sans-serif';
        context.fillText(label, x + 15.5, 204);
    });

    const today = new Date();
    const values = [
        ['學生姓名  Name', permitParams.get('Name') || ''],
        ['學生編號  Student ID', permitParams.get('SID') || '1155125528'],
        ['主修科目  Major', permitParams.get('Major') || 'B.A. in Fine Arts'],
        ['有效期至  Valid Until', formatPermitDate(permitParams.get('Valid')) || `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 1}`]
    ];
    context.textAlign = 'left';
    values.forEach(([label, value], index) => {
        const y = 242 + index * 23;
        context.fillStyle = '#fff';
        context.font = '12px Arial, sans-serif';
        context.fillText(label, 40, y);
        context.font = '13px Arial, sans-serif';
        context.fillText(value, 160, y);
    });

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create permit image')), 'image/png');
    });
}

async function sharePermitImage() {
    const originalLabel = '分享圖片';
    shareImageButton.disabled = true;
    shareButtonLabel.textContent = '製作中…';
    try {
        const blob = await renderPermitImage();
        const file = new File([blob], 'cuhk-bus-permit.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title: '中大校巴證', files: [file] });
            shareButtonLabel.textContent = originalLabel;
        } else {
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = 'cuhk-bus-permit.png';
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            shareButtonLabel.textContent = '已儲存';
        }
    } catch (error) {
        if (error?.name !== 'AbortError') shareButtonLabel.textContent = '未能分享';
        else shareButtonLabel.textContent = originalLabel;
    } finally {
        shareImageButton.disabled = false;
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    permitParams = new URLSearchParams(new FormData(form));
    const buttonLabel = form.querySelector('.generate-button span');
    buttonLabel.textContent = '進入繪製室…';
    await openCreating('push', true);
    buttonLabel.textContent = '開始繪製';
});

cardObject.addEventListener('click', flipCard);
cardObject.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flipCard();
    }
});

brandHome.addEventListener('click', (event) => {
    event.preventDefault();
    if (activeView !== 'form') openForm('push');
});
editButton.addEventListener('click', () => openForm('push'));
fullscreenButton.addEventListener('click', openFullscreenPreview);
editPermitButton.addEventListener('click', () => openForm('push'));
fullscreenPreview.addEventListener('click', closeFullscreenPreview);
shareImageButton.addEventListener('click', sharePermitImage);
document.querySelector('.printbtn').addEventListener('click', () => window.print());
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isFullscreen) closeFullscreenPreview();
});

window.addEventListener('resize', resizeCard, { passive: true });
window.addEventListener('popstate', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewName = urlParams.get('step');
    if (!viewName || !views.has(viewName)) {
        await openForm('none');
        return;
    }

    permitParams = urlParams;
    populateForm(permitParams);
    if (!permitParams.get('Name')) {
        await openForm('replace');
    } else if (viewName === 'preview') {
        await openPreview('none');
    } else {
        const alreadyGenerated = generatedSignature === paramsSignature(permitParams);
        await openCreating('none', !alreadyGenerated);
    }
});

async function initialize() {
    drawAmbient();
    const validInput = form.elements.Valid;
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    validInput.min = localIsoDate(today);
    validInput.value = localIsoDate(nextYear);
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get('step');
    permitParams = urlParams;

    if (permitParams.get('Name')) populateForm(permitParams);
    if (requestedView === 'preview' && permitParams.get('Name')) {
        generatedSignature = paramsSignature(permitParams);
        await openPreview('none');
    } else if (requestedView === 'creating' && permitParams.get('Name')) {
        await openCreating('none', true);
    } else {
        await openForm('replace');
    }
    appInitialized = true;
}

initialize();
