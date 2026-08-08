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
const languageToggles = [...document.querySelectorAll('.language-toggle')];
const platformDestinations = [...document.querySelectorAll('[data-platform]')];
const siteHeader = document.querySelector('.site-header');
const siteFooter = document.querySelector('.site-footer');
const appLoader = document.querySelector('.app-loader');
const titleMeta = document.querySelector('meta[name="title"]');
const descriptionMeta = document.querySelector('meta[name="description"]');
const robotsMeta = document.querySelector('meta[name="robots"]');
const canonicalLink = document.querySelector('link[rel="canonical"]');
const ogTitleMeta = document.querySelector('meta[property="og:title"]');
const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
const ogUrlMeta = document.querySelector('meta[property="og:url"]');
const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
const twitterDescriptionMeta = document.querySelector('meta[name="twitter:description"]');
const contentLanguageMeta = document.querySelector('meta[http-equiv="Content-Language"]');
const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const startupImageSources = [
    'getcard/images/schbus_d.png',
    'getcard/images/schbus_l.png',
    'getcard/images/CUHK.png',
    'bus-app-icon-256.png',
    'app-store-badge.svg',
    'google-play-badge.png',
    'website-qr.png'
];

const canonicalUrl = 'https://cu-bus.online/_permit/';
const seoByLanguage = {
    zh: {
        form: {
            title: '校巴證製作 | 中大校巴資訊站 CU BUS INFOPAGE',
            description: '搭校巴一定唔可以唔提校巴證～ 你可以喺度整一張屬於你嘅電子版校巴證！',
            socialDescription: '搭校巴一定唔可以唔提校巴證～ 你可以喺度整一張屬於你嘅電子版校巴證！',
            robots: 'index, follow, max-image-preview:large'
        },
        creating: {
            title: '正在繪製校巴證 | 中大校巴資訊站',
            description: '正在為你繪製專屬中大校巴證。',
            socialDescription: '使用中大校巴證製作器建立個人化校巴證圖片。',
            robots: 'noindex, nofollow, noarchive'
        },
        preview: {
            title: '校巴證預覽 | 中大校巴資訊站',
            description: '預覽、分享或列印你的個人化中大校巴證。',
            socialDescription: '使用中大校巴證製作器建立個人化校巴證圖片。',
            robots: 'noindex, nofollow, noarchive'
        }
    },
    en: {
        form: {
            title: 'School Bus Permit Generator | CU Bus Infopage',
            description: 'Create your own digital CUHK school bus permit image to preview, share or print. This is an unofficial creative tool.',
            socialDescription: 'Create your own digital CUHK school bus permit image.',
            robots: 'index, follow, max-image-preview:large'
        },
        creating: {
            title: 'Creating Your Bus Permit | CU Bus Infopage',
            description: 'Your personalised school bus permit is being created.',
            socialDescription: 'Create your own digital CUHK school bus permit image.',
            robots: 'noindex, nofollow, noarchive'
        },
        preview: {
            title: 'Bus Permit Preview | CU Bus Infopage',
            description: 'Preview, share or print your personalised school bus permit.',
            socialDescription: 'Create your own digital CUHK school bus permit image.',
            robots: 'noindex, nofollow, noarchive'
        }
    }
};

const translations = {
    zh: {
        homeLabel: '返回校巴證製作首頁', brandName: '中大校巴資訊站', brandSub: '校巴證製作',
        rebuild: '重新製作', unofficial: '非官方工具', formTitle: '校巴證資料', busTypeLegend: '想乘搭哪種校巴？',
        transitTitle: '穿梭校巴', transitSub: '校園穿梭路線', lessonTitle: '轉堂校巴', lessonSub: '課堂接駁路線',
        nameLabel: '姓名', required: '必填', namePlaceholder: '例如：CHAN Siu-ming（陳小明）',
        sidLabel: '學生編號', sidPlaceholder: '例如：1155125528', majorLabel: '主修科目', majorPlaceholder: '例如：Fine Arts',
        validLabel: '有效期', validSub: '截止日期', privacy: '只輸入你願意顯示於校巴證上的資料', generate: '開始繪製',
        generateEntering: '進入繪製室…', creatingLabel: '正在繪製校巴證', theatreLabel: '校巴證繪製舞台', progressLabel: '校巴證製作進度',
        previewLabel: '校巴證及操作', appLabel: '下載 CU Bus 應用程式', downloadIos: '在 App Store 下載 CU Bus', downloadAndroid: '在 Google Play 下載 CU Bus', visitWebsite: '前往 CU Bus 網站', visitWebsiteText: '探索 CU Bus', qrLabel: 'CU Bus 網站 QR code',
        qrAlt: '前往 cu-bus.online 的 QR code', scanWebsite: '掃描瀏覽網站', actionsLabel: '校巴證操作',
        previewButton: '預覽', editButton: '編輯', shareButton: '分享圖片', printButton: '列印',
        footerCommunity: '為中大社群而製作', footerUnofficial: '此工具並非由香港中文大學官方提供', fullscreenLabel: '校巴證全螢幕預覽',
        showBack: '查看校巴證條款', showFront: '翻回校巴證正面', shareWorking: '製作中…', shareSaved: '已儲存', shareFailed: '未能分享', shareTitle: '中大校巴證'
    },
    en: {
        homeLabel: 'Return to the permit generator', brandName: 'CU Bus Infopage', brandSub: 'School Bus Permit',
        rebuild: 'Start again', unofficial: 'Unofficial tool', formTitle: 'Permit details', busTypeLegend: 'Which bus would you like to take?',
        transitTitle: 'Shuttle Bus', transitSub: 'Campus shuttle routes', lessonTitle: 'Meet-Class Bus', lessonSub: 'Between-class routes',
        nameLabel: 'Name', required: 'Required', namePlaceholder: 'e.g. CHAN Siu-ming',
        sidLabel: 'Student ID', sidPlaceholder: 'e.g. 1155125528', majorLabel: 'Major', majorPlaceholder: 'e.g. Fine Arts',
        validLabel: 'Valid until', validSub: 'Expiry date', privacy: 'Only enter information you want shown on the permit', generate: 'Create permit',
        generateEntering: 'Opening studio…', creatingLabel: 'Creating school bus permit', theatreLabel: 'Permit creation stage', progressLabel: 'Permit creation progress',
        previewLabel: 'Permit and actions', appLabel: 'Download the CU Bus app', downloadIos: 'Download CU Bus on the App Store', downloadAndroid: 'Get CU Bus on Google Play', visitWebsite: 'Visit the CU Bus website', visitWebsiteText: 'Explore CU Bus', qrLabel: 'CU Bus website QR code',
        qrAlt: 'QR code for cu-bus.online', scanWebsite: 'Scan to visit', actionsLabel: 'Permit actions',
        previewButton: 'Preview', editButton: 'Edit', shareButton: 'Share image', printButton: 'Print',
        footerCommunity: 'Made for the CUHK community', footerUnofficial: 'This tool is not officially provided by CUHK', fullscreenLabel: 'Full-screen permit preview',
        showBack: 'View permit terms', showFront: 'Return to the permit front', shareWorking: 'Creating…', shareSaved: 'Saved', shareFailed: 'Unable to share', shareTitle: 'CUHK School Bus Permit'
    }
};

let permitParams = new URLSearchParams();
let currentLanguage = 'zh';
let activeView = 'form';
let generationRun = 0;
let generatedSignature = '';
let flipTimer;
let cardMoveTimer;
let cardMoveRun = 0;
let isFullscreen = false;
let isClosingFullscreen = false;
let isDiscarding = false;
let appInitialized = false;
let draftSaveTimer;
let validDateChanged = false;

const permitFieldNames = ['Type', 'Name', 'SID', 'Major', 'Valid'];
const databaseName = 'cu-bus-permit';
const databaseStoreName = 'preferences';
const formDraftKey = 'form-draft';
const languagePreferenceKey = 'language';
let permitDatabasePromise;

function openPermitDatabase() {
    if (permitDatabasePromise) return permitDatabasePromise;
    permitDatabasePromise = new Promise((resolve) => {
        if (!window.indexedDB) {
            resolve(null);
            return;
        }

        try {
            const request = window.indexedDB.open(databaseName, 1);
            request.onupgradeneeded = () => {
                if (!request.result.objectStoreNames.contains(databaseStoreName)) {
                    request.result.createObjectStore(databaseStoreName);
                }
            };
            request.onsuccess = () => {
                const database = request.result;
                database.onversionchange = () => database.close();
                resolve(database);
            };
            request.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
    return permitDatabasePromise;
}

async function readSavedValue(key) {
    const database = await openPermitDatabase();
    if (!database) return null;
    return new Promise((resolve) => {
        try {
            const request = database.transaction(databaseStoreName, 'readonly').objectStore(databaseStoreName).get(key);
            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

async function writeSavedValue(key, value) {
    const database = await openPermitDatabase();
    if (!database) return false;
    return new Promise((resolve) => {
        try {
            const transaction = database.transaction(databaseStoreName, 'readwrite');
            transaction.objectStore(databaseStoreName).put(value, key);
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
            transaction.onabort = () => resolve(false);
        } catch {
            resolve(false);
        }
    });
}

function currentFormDraft() {
    const data = new FormData(form);
    return {
        ...Object.fromEntries(permitFieldNames.map((name) => [name, String(data.get(name) || '')])),
        validDateChanged
    };
}

function savedDraftParams(draft) {
    const params = new URLSearchParams();
    if (!draft || typeof draft !== 'object') return params;
    permitFieldNames.forEach((name) => {
        if (name === 'Valid' && draft.validDateChanged !== true) return;
        if (typeof draft[name] === 'string') params.set(name, draft[name]);
    });
    return params;
}

function saveFormDraft() {
    return writeSavedValue(formDraftKey, currentFormDraft());
}

function scheduleFormDraftSave() {
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = window.setTimeout(() => void saveFormDraft(), 220);
}

function paramsSignature(params) {
    return permitFieldNames.map((key) => params.get(key) || '').join('|');
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

function updateSeo(viewName) {
    const languageSeo = seoByLanguage[currentLanguage] || seoByLanguage.zh;
    const seo = languageSeo[viewName] || languageSeo.form;
    document.title = seo.title;
    titleMeta?.setAttribute('content', seo.title);
    descriptionMeta?.setAttribute('content', seo.description);
    robotsMeta?.setAttribute('content', seo.robots);
    canonicalLink?.setAttribute('href', canonicalUrl);
    ogTitleMeta?.setAttribute('content', seo.title);
    ogDescriptionMeta?.setAttribute('content', seo.socialDescription);
    ogUrlMeta?.setAttribute('content', canonicalUrl);
    twitterTitleMeta?.setAttribute('content', seo.title);
    twitterDescriptionMeta?.setAttribute('content', seo.socialDescription);
    contentLanguageMeta?.setAttribute('content', currentLanguage === 'en' ? 'en' : 'zh-HK');
    ogLocaleMeta?.setAttribute('content', currentLanguage === 'en' ? 'en_GB' : 'zh_HK');
}

function t(key) {
    return translations[currentLanguage]?.[key] || translations.zh[key] || key;
}

function setLanguage(language, persist = true) {
    currentLanguage = language === 'en' ? 'en' : 'zh';
    document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'zh-HK';
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
        element.setAttribute('alt', t(element.dataset.i18nAlt));
    });
    languageToggles.forEach((button) => {
        button.textContent = currentLanguage === 'zh' ? 'EN' : '中';
        button.setAttribute('aria-label', currentLanguage === 'zh' ? 'Switch to English' : '切換至中文');
        button.setAttribute('lang', currentLanguage === 'zh' ? 'en' : 'zh-HK');
    });
    updateSeo(activeView);
    setCardSide(cardObject.classList.contains('is-back'));
    if (persist) {
        void writeSavedValue(languagePreferenceKey, currentLanguage);
    }
}

function detectAppPlatform(userAgent = '', platform = '', maxTouchPoints = 0) {
    const isIpadDesktopMode = platform === 'MacIntel' && maxTouchPoints > 1;
    return /iPhone|iPad|iPod/i.test(userAgent) || isIpadDesktopMode
        ? 'ios'
        : /Android/i.test(userAgent) || /Android/i.test(platform)
            ? 'android'
            : 'web';
}

function configureAppDestination() {
    const destination = detectAppPlatform(
        navigator.userAgent || '',
        navigator.userAgentData?.platform || navigator.platform || '',
        navigator.maxTouchPoints || 0
    );
    platformDestinations.forEach((link) => {
        link.hidden = link.dataset.platform !== destination;
    });
}

function commitView(viewName, skipFallbackEntry = false, forceEntry = false) {
    if (viewName !== 'preview' && isFullscreen) {
        isFullscreen = false;
        isClosingFullscreen = false;
        fullscreenPreview.hidden = true;
        document.body.classList.remove('fullscreen-open');
        cardObject.setAttribute('tabindex', '0');
    }

    views.forEach((view, name) => {
        const active = name === viewName;
        view.hidden = !active;
        view.classList.toggle('is-active', active);
        view.classList.remove('is-entering', 'is-leaving');
        if (active && !reducedMotion && !skipFallbackEntry && (!document.startViewTransition || forceEntry)) {
            view.classList.add('is-entering');
            window.setTimeout(() => view.classList.remove('is-entering'), 650);
        }
    });

    activeView = viewName;
    updateHeader(viewName);
    updateSeo(viewName);

    if (viewName === 'creating') creationMount.append(cardScaler);
    if (viewName === 'preview') previewMount.append(cardScaler);
    cardScaler.setAttribute('aria-hidden', viewName === 'form' ? 'true' : 'false');
    resizeCard();
}

function playExitAnimation(element, className, animationName, fallbackDuration) {
    if (!element || reducedMotion) return Promise.resolve();
    element.classList.add(className);
    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(fallbackTimer);
            element.removeEventListener('animationend', onAnimationEnd);
            element.classList.remove(className);
            resolve();
        };
        const onAnimationEnd = (event) => {
            if (event.target === element && event.animationName === animationName) finish();
        };
        const fallbackTimer = window.setTimeout(finish, fallbackDuration);
        element.addEventListener('animationend', onAnimationEnd);
    });
}

function animateCardMove(fromRect) {
    if (!fromRect || reducedMotion) return;
    const toRect = cardScaler.getBoundingClientRect();
    if (!fromRect.width || !toRect.width) return;

    const deltaX = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const deltaY = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    const targetScale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-scale')) || 1;
    const startScale = targetScale * (fromRect.width / toRect.width);
    const runId = ++cardMoveRun;

    window.clearTimeout(cardMoveTimer);
    cardScaler.classList.remove('is-relocating');
    cardScaler.style.setProperty('--card-move-x', `${deltaX}px`);
    cardScaler.style.setProperty('--card-move-y', `${deltaY}px`);
    cardScaler.style.setProperty('--card-move-scale', String(startScale));
    cardScaler.getBoundingClientRect();
    cardScaler.classList.add('is-relocating');

    requestAnimationFrame(() => {
        if (runId !== cardMoveRun) return;
        cardScaler.style.setProperty('--card-move-x', '0px');
        cardScaler.style.setProperty('--card-move-y', '0px');
        cardScaler.style.setProperty('--card-move-scale', String(targetScale));
    });

    cardMoveTimer = window.setTimeout(() => {
        if (runId !== cardMoveRun) return;
        cardScaler.classList.remove('is-relocating');
        cardScaler.style.removeProperty('--card-move-x');
        cardScaler.style.removeProperty('--card-move-y');
        cardScaler.style.removeProperty('--card-move-scale');
    }, 760);
}

async function switchView(viewName, historyMode = 'push', skipViewTransition = false) {
    updateHistory(viewName, historyMode);
    generationRun += viewName === 'form' ? 1 : 0;
    const animateCard = activeView === 'creating' && viewName === 'preview' && !reducedMotion;
    const cardStartRect = animateCard ? cardScaler.getBoundingClientRect() : null;

    const useNativeTransition = !skipViewTransition && appInitialized && document.startViewTransition && !reducedMotion;
    if (useNativeTransition) {
        const transition = document.startViewTransition(() => commitView(viewName));
        await transition.finished;
    } else {
        if (appInitialized && !reducedMotion && !skipViewTransition) {
            if (animateCard) {
                await playExitAnimation(generationProgress, 'is-leaving', 'progress-leave', 330);
            } else {
                await playExitAnimation(views.get(activeView), 'is-leaving', 'view-leave', 390);
            }
        }
        commitView(viewName, animateCard, skipViewTransition && appInitialized);
        if (animateCard) {
            animateCardMove(cardStartRect);
            const previewView = views.get('preview');
            previewView.classList.add('is-revealing');
            window.setTimeout(() => previewView.classList.remove('is-revealing'), 720);
        }
    }

    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
}

function setCardData(params) {
    const type = params.get('Type') === 'Lesson' ? 'Lesson' : 'Transit';
    const isTransit = type === 'Transit';
    const defaultValid = defaultPermitExpiry().display;

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

function defaultPermitExpiry(date = new Date()) {
    const year = date.getFullYear() + 1;
    return {
        input: `${year}-07-31`,
        display: `31/7/${year}`
    };
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

function preloadStartupImages() {
    return Promise.all([...new Set(startupImageSources)].map(preloadImage));
}

function minimumStartupTime() {
    if (reducedMotion) return Promise.resolve();
    return new Promise((resolve) => window.setTimeout(resolve, 850));
}

function dismissAppLoader() {
    if (!appLoader) {
        document.body.classList.remove('is-booting');
        return Promise.resolve();
    }
    if (reducedMotion) {
        appLoader.hidden = true;
        document.body.classList.remove('is-booting');
        return Promise.resolve();
    }

    appLoader.classList.add('is-leaving');
    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(fallbackTimer);
            appLoader.removeEventListener('animationend', onAnimationEnd);
            appLoader.hidden = true;
            document.body.classList.remove('is-booting');
            resolve();
        };
        const onAnimationEnd = (event) => {
            if (event.target === appLoader && event.animationName === 'app-loader-out') finish();
        };
        const fallbackTimer = window.setTimeout(finish, 700);
        appLoader.addEventListener('animationend', onAnimationEnd);
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

function setEdgeReveal(progress) {
    const segment = Math.max(0, Math.min(1, progress)) * 4;
    const top = Math.max(0, Math.min(1, segment));
    const right = Math.max(0, Math.min(1, segment - 1));
    const bottom = Math.max(0, Math.min(1, segment - 2));
    const left = Math.max(0, Math.min(1, segment - 3));
    cardObject.style.setProperty('--edge-top-hidden', `${(1 - top) * 100}%`);
    cardObject.style.setProperty('--edge-right-hidden', `${(1 - right) * 100}%`);
    cardObject.style.setProperty('--edge-bottom-hidden', `${(1 - bottom) * 100}%`);
    cardObject.style.setProperty('--edge-left-hidden', `${(1 - left) * 100}%`);
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
            setEdgeReveal(progress);
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

            const brushX = Math.max(0, Math.min(512, endX - 24));
            brushHead.style.setProperty('--brush-x', `${brushX}px`);
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
    cardObject.classList.remove('is-back', 'is-ready', 'is-flipping', 'is-presenting', 'is-shining', 'is-new', 'is-entering-stage', 'is-stage-pending');
    cardObject.classList.add('is-painting');
    cardObject.setAttribute('aria-disabled', 'true');
    cardObject.setAttribute('aria-pressed', 'false');
    setEdgeReveal(0);
    setProgress(0);
    preparePaintCanvas();
}

function markComplete(interactive = true, newFinish = true) {
    paintCanvas.hidden = true;
    brushHead.classList.remove('visible');
    cardObject.classList.remove('is-painting');
    cardObject.classList.toggle('is-new', newFinish);
    setEdgeReveal(1);
    setProgress(100);
    cardObject.classList.toggle('is-ready', interactive);
    cardObject.setAttribute('aria-disabled', String(!interactive));
}

async function presentCompletedCard(runId) {
    if (runId !== generationRun) return false;
    if (!reducedMotion) {
        await playExitAnimation(cardObject, 'is-presenting', 'new-card-spin', 2080);
        if (runId !== generationRun) return false;
        cardObject.classList.add('is-new', 'is-shining');
        await new Promise((resolve) => window.setTimeout(resolve, 920));
        cardObject.classList.remove('is-shining');
        if (runId !== generationRun) return false;
    } else {
        cardObject.classList.add('is-new');
    }
    cardObject.classList.add('is-ready');
    cardObject.setAttribute('aria-disabled', 'false');
    return true;
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
    markComplete(false, false);
    if (!await presentCompletedCard(runId)) return;
    if (runId === generationRun && activeView === 'creating') await openPreview('push');
}

function setCardSide(showBack) {
    const currentlyBack = cardObject.classList.contains('is-back');
    cardObject.setAttribute('aria-pressed', String(showBack));
    cardObject.setAttribute('aria-label', showBack ? t('showFront') : t('showBack'));
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
    const availableWidth = Math.max(1, mount.clientWidth - 24);
    const availableHeight = Math.max(1, mount.clientHeight - 24);
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

async function discardCardAndOpenForm(historyMode = 'push') {
    if (activeView !== 'preview' || reducedMotion) {
        await openForm(historyMode);
        return;
    }
    if (isDiscarding) return;

    isDiscarding = true;
    editPermitButton.disabled = true;
    cardObject.setAttribute('tabindex', '-1');
    window.clearTimeout(cardMoveTimer);
    cardMoveRun++;
    cardScaler.classList.remove('is-relocating');
    cardScaler.style.removeProperty('--card-move-x');
    cardScaler.style.removeProperty('--card-move-y');
    cardScaler.style.removeProperty('--card-move-scale');

    const rect = cardScaler.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const baseScale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-scale')) || 1;
    const exitX = window.innerWidth + rect.width * 0.72 - centerX;
    const exitY = window.innerHeight + rect.height * 0.72 - centerY;
    const peakX = Math.max(42, exitX * 0.3);
    const peakY = -Math.min(170, Math.max(82, centerY * 0.24));

    cardScaler.style.setProperty('--discard-peak-x', `${peakX}px`);
    cardScaler.style.setProperty('--discard-peak-y', `${peakY}px`);
    cardScaler.style.setProperty('--discard-exit-x', `${exitX}px`);
    cardScaler.style.setProperty('--discard-exit-y', `${exitY}px`);
    cardScaler.style.setProperty('--discard-peak-scale', String(baseScale * 1.035));
    cardScaler.style.setProperty('--discard-final-scale', String(baseScale * 0.1));
    document.body.classList.add('discarding-card');
    cardScaler.classList.add('is-discarding');

    await new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(fallbackTimer);
            cardScaler.removeEventListener('animationend', onAnimationEnd);
            resolve();
        };
        const onAnimationEnd = (event) => {
            if (event.target === cardScaler && event.animationName === 'discard-card') finish();
        };
        const fallbackTimer = window.setTimeout(finish, 950);
        cardScaler.addEventListener('animationend', onAnimationEnd);
    });

    await switchView('form', historyMode, true);
    cardScaler.classList.remove('is-discarding');
    document.body.classList.remove('discarding-card');
    ['--discard-peak-x', '--discard-peak-y', '--discard-exit-x', '--discard-exit-y', '--discard-peak-scale', '--discard-final-scale']
        .forEach((property) => cardScaler.style.removeProperty(property));
    editPermitButton.disabled = false;
    cardObject.setAttribute('tabindex', '0');
    isDiscarding = false;
    form.elements.Name?.focus({ preventScroll: true });
}

async function openCreating(historyMode = 'push', shouldGenerate = true) {
    setCardData(permitParams);
    if (shouldGenerate) {
        resetGeneration();
        cardObject.classList.add('is-stage-pending');
    }
    const entranceRun = generationRun;
    await switchView('creating', historyMode);
    if (activeView !== 'creating' || entranceRun !== generationRun) {
        cardObject.classList.remove('is-stage-pending');
        return;
    }
    if (shouldGenerate) {
        cardObject.classList.remove('is-stage-pending');
        await playExitAnimation(cardObject, 'is-entering-stage', 'blank-card-slide-in', 900);
        if (activeView !== 'creating' || entranceRun !== generationRun) return;
        createPermit(true);
    } else {
        markComplete();
    }
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
    isClosingFullscreen = false;
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

async function closeFullscreenPreview() {
    if (!isFullscreen || isClosingFullscreen) return;
    isClosingFullscreen = true;
    if (!reducedMotion) {
        await playExitAnimation(fullscreenPreview, 'is-closing', 'fullscreen-out', 340);
    }
    isFullscreen = false;
    previewMount.append(cardScaler);
    fullscreenPreview.hidden = true;
    document.body.classList.remove('fullscreen-open');
    cardObject.setAttribute('tabindex', '0');
    requestAnimationFrame(resizeCard);
    fullscreenButton.focus({ preventScroll: true });
    isClosingFullscreen = false;
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
        ['有效期至  Valid Until', formatPermitDate(permitParams.get('Valid')) || defaultPermitExpiry(today).display]
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
    const originalLabel = t('shareButton');
    shareImageButton.disabled = true;
    shareButtonLabel.textContent = t('shareWorking');
    try {
        const blob = await renderPermitImage();
        const file = new File([blob], 'cuhk-bus-permit.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title: t('shareTitle'), files: [file] });
            shareButtonLabel.textContent = originalLabel;
        } else {
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = 'cuhk-bus-permit.png';
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            shareButtonLabel.textContent = t('shareSaved');
        }
    } catch (error) {
        if (error?.name !== 'AbortError') shareButtonLabel.textContent = t('shareFailed');
        else shareButtonLabel.textContent = originalLabel;
    } finally {
        shareImageButton.disabled = false;
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    permitParams = new URLSearchParams(new FormData(form));
    window.clearTimeout(draftSaveTimer);
    void saveFormDraft();
    const buttonLabel = form.querySelector('.generate-button span');
    buttonLabel.textContent = t('generateEntering');
    await openCreating('push', true);
    buttonLabel.textContent = t('generate');
});

form.addEventListener('input', scheduleFormDraftSave);
form.addEventListener('change', scheduleFormDraftSave);
form.elements.Valid.addEventListener('input', () => { validDateChanged = true; });
form.elements.Valid.addEventListener('change', () => { validDateChanged = true; });
window.addEventListener('pagehide', () => {
    window.clearTimeout(draftSaveTimer);
    void saveFormDraft();
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
languageToggles.forEach((button) => {
    button.addEventListener('click', () => setLanguage(currentLanguage === 'zh' ? 'en' : 'zh'));
});
fullscreenButton.addEventListener('click', openFullscreenPreview);
editPermitButton.addEventListener('click', () => discardCardAndOpenForm('push'));
fullscreenPreview.addEventListener('click', closeFullscreenPreview);
shareImageButton.addEventListener('click', sharePermitImage);
document.querySelector('.printbtn').addEventListener('click', () => window.print());
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isFullscreen) closeFullscreenPreview();
});

window.addEventListener('resize', resizeCard, { passive: true });
window.visualViewport?.addEventListener('resize', resizeCard, { passive: true });
window.addEventListener('popstate', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewName = urlParams.get('step');
    if (!viewName || !views.has(viewName)) {
        await openForm('none');
        return;
    }

    permitParams = urlParams;
    validDateChanged = permitParams.has('Valid');
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

function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './',
                updateViaCache: 'none'
            });
            void registration.update();
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') void registration.update();
            });
        } catch {
            // The app remains usable online if service workers are unavailable.
        }
    }, { once: true });
}

async function initialize() {
    drawAmbient();
    const [storedLanguage, storedDraft] = await Promise.all([
        readSavedValue(languagePreferenceKey),
        readSavedValue(formDraftKey),
        preloadStartupImages(),
        minimumStartupTime()
    ]);
    const savedLanguage = storedLanguage === 'en' ? 'en' : 'zh';
    setLanguage(savedLanguage, false);
    configureAppDestination();
    const validInput = form.elements.Valid;
    const today = new Date();
    validInput.min = localIsoDate(today);
    validInput.value = defaultPermitExpiry(today).input;
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get('step');
    permitParams = urlParams;

    const hasUrlPermitData = permitFieldNames.some((name) => permitParams.has(name));
    if (hasUrlPermitData) {
        validDateChanged = permitParams.has('Valid');
        populateForm(permitParams);
    } else {
        validDateChanged = storedDraft?.validDateChanged === true;
        populateForm(savedDraftParams(storedDraft));
    }
    if (requestedView === 'preview' && permitParams.get('Name')) {
        generatedSignature = paramsSignature(permitParams);
        await openPreview('none');
    } else if (requestedView === 'creating' && permitParams.get('Name')) {
        await openCreating('none', true);
    } else {
        await openForm('replace');
    }
    appInitialized = true;
    await dismissAppLoader();
}

registerServiceWorker();
initialize();
