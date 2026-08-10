const assetVersion = new URL(document.currentScript.src).searchParams.get('v') || 'dev';
const form = document.querySelector('.permit-form');
const permitTypeRadios = [...form.querySelectorAll('input[name="Type"]')];
const pageShell = document.querySelector('.page-shell');
const pageTitle = document.querySelector('#page-title');
const stepPill = document.querySelector('.step-pill');
const appStatus = document.querySelector('#app-status');
const views = new Map([...document.querySelectorAll('.spa-view')].map((view) => [view.dataset.view, view]));
const currentStep = document.querySelector('.current-step');
const editButton = document.querySelector('.edit-link');
const unofficialBadge = document.querySelector('.unofficial-badge');
const brandHome = document.querySelector('.brand-home');
const creationMount = document.querySelector('.creation-card-mount');
const creationMain = document.querySelector('.creation-layout');
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
const fullscreenCloseButton = document.querySelector('.fullscreen-close');
const editPermitButton = document.querySelector('.edit-permit-button');
const shareImageButton = document.querySelector('.share-image-button');
const shareButtonLabel = shareImageButton.querySelector('.button-label');
const languageToggles = [...document.querySelectorAll('.language-toggle')];
const networkUpdateButton = document.querySelector('.network-update-button');
const networkStatusLabel = document.querySelector('.network-status-label');
const updateDialog = document.querySelector('.update-dialog');
const updateDialogTitle = document.querySelector('#update-dialog-title');
const updateDialogMessage = document.querySelector('#update-dialog-message');
const updateDialogReload = document.querySelector('.update-dialog-reload');
const updateDialogClose = document.querySelector('.update-dialog-close');
const updateDialogActions = document.querySelector('.update-dialog-actions');
const updateProgress = document.querySelector('.update-progress');
const updateProgressFill = document.querySelector('.update-progress-fill');
const platformDestinations = [...document.querySelectorAll('[data-platform]')];
const siteHeader = document.querySelector('.site-header');
const siteFooter = document.querySelector('.site-footer');
const appLoader = document.querySelector('.app-loader');
const appLoaderStatusText = document.querySelector('.app-loader-status-text');
const cardAccessibleDescription = document.querySelector('#card-accessible-description');
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
        skipLink: '跳至主要內容', loadingLabel: '正在載入 CU Bus', loadingText: '正在載入', loadingAppFiles: '正在載入應用程式檔案…', loadingSavedAndImages: '正在還原資料及載入校巴證圖片…', loadingSaved: '正在還原已儲存資料…', loadingImages: '正在載入校巴證圖片…', loadingPreparing: '正在準備校巴證製作工具…', homeLabel: '返回校巴證製作首頁', brandName: '中大校巴資訊站', brandSub: '校巴證製作',
        rebuild: '重新製作', unofficial: '非官方工具', formTitle: '校巴證資料', busTypeLegend: '想乘搭哪種校巴？',
        transitTitle: '穿梭校巴', transitSub: '1、2、3、4、8、N、H', lessonTitle: '轉堂校巴', lessonSub: '5、6A、6B、7',
        nameLabel: '姓名', required: '必填', namePlaceholder: '例如：CHAN Siu-ming（陳小明）',
        sidLabel: '學生編號', sidPlaceholder: '例如：1155125528', majorLabel: '主修科目', majorPlaceholder: '例如：Fine Arts',
        validLabel: '有效期', validSub: '截止日期', privacy: '只輸入你願意顯示於校巴證上的資料', generate: '開始繪製',
        generateEntering: '進入繪製室…', creatingLabel: '正在繪製校巴證', theatreLabel: '校巴證繪製舞台', progressLabel: '校巴證製作進度',
        previewLabel: '校巴證及操作', appLabel: '開啟或下載 CU Bus 應用程式', openApp: '在已安裝的裝置開啟 CU Bus', openAppText: '開啟 App', downloadIos: '在 App Store 下載 CU Bus', downloadAndroid: '在 Google Play 下載 CU Bus', visitWebsite: '前往 CU Bus 網站', visitWebsiteText: '探索 CU Bus', qrLabel: 'CU Bus 網站 QR code',
        qrAlt: '前往 cu-bus.online 的 QR code', scanWebsite: '掃描瀏覽網站', actionsLabel: '校巴證操作',
        previewButton: '預覽', editButton: '編輯', shareButton: '分享圖片', printButton: '列印',
        previewActionLabel: '開啟校巴證全螢幕預覽', editActionLabel: '編輯校巴證資料', shareActionLabel: '分享或下載校巴證圖片', printActionLabel: '列印校巴證',
        developerProfiles: '開發者社交平台', developerInstagram: '在 Instagram 查看開發者 Anson Cheng', developerGithub: '在 GitHub 查看開發者 Anson Cheng', fullscreenLabel: '校巴證全螢幕預覽', closeFullscreen: '關閉全螢幕預覽',
        stepForm: '第 1 步，共 3 步：輸入校巴證資料', stepCreating: '第 2 步，共 3 步：正在繪製校巴證', stepPreview: '第 3 步，共 3 步：預覽校巴證',
        creatingStatus: '正在繪製校巴證，完成後會自動前往預覽。', previewStatus: '校巴證已完成。你可以翻轉校巴證、預覽、編輯、分享或列印。',
        showBack: '查看校巴證乘車須知', showFront: '翻回校巴證正面', shareWorking: '正在製作分享圖片', shareSaved: '圖片已儲存', shareFailed: '未能分享圖片', shareTitle: '中大校巴證',
        online: '在線', offline: '離線', onlineUpdateLabel: '目前在線，檢查是否有更新', offlineUpdateLabel: '目前離線，連線後可檢查更新',
        checkingTitle: '正在檢查更新', checkingMessage: '正在確認是否為最新版本。', updatingTitle: '正在更新', updatingMessage: '正在更新離線檔案，完成後會自動重新載入。',
        latestTitle: '已是最新版本', latestMessage: '你正在使用最新版本。', offlineTitle: '目前離線', offlineMessage: '連線後再檢查更新。', updateErrorTitle: '未能更新', updateErrorMessage: '請檢查網絡連線後再試。', refreshingTitle: '正在重新載入', refreshingMessage: '正在重新下載最新內容，完成後會自動開啟。', updateProgressLabel: '更新進度', reloadLatest: '重新載入最新內容', closeUpdate: '關閉'
    },
    en: {
        skipLink: 'Skip to main content', loadingLabel: 'Loading CU Bus', loadingText: 'Loading', loadingAppFiles: 'Loading application files…', loadingSavedAndImages: 'Restoring details and loading permit images…', loadingSaved: 'Restoring saved details…', loadingImages: 'Loading permit images…', loadingPreparing: 'Preparing the permit maker…', homeLabel: 'Return to the permit generator', brandName: 'CU Bus Infopage', brandSub: 'School Bus Permit',
        rebuild: 'Start again', unofficial: 'Unofficial tool', formTitle: 'Permit details', busTypeLegend: 'Which bus would you like to take?',
        transitTitle: 'Shuttle Bus', transitSub: '1, 2, 3, 4, 8, N, H', lessonTitle: 'Meet-Class Bus', lessonSub: '5, 6A, 6B, 7',
        nameLabel: 'Name', required: 'Required', namePlaceholder: 'e.g. CHAN Siu-ming',
        sidLabel: 'Student ID', sidPlaceholder: 'e.g. 1155125528', majorLabel: 'Major', majorPlaceholder: 'e.g. Fine Arts',
        validLabel: 'Valid until', validSub: 'Expiry date', privacy: 'Only enter information you want shown on the permit', generate: 'Create permit',
        generateEntering: 'Opening studio…', creatingLabel: 'Creating school bus permit', theatreLabel: 'Permit creation stage', progressLabel: 'Permit creation progress',
        previewLabel: 'Permit and actions', appLabel: 'Open or download the CU Bus app', openApp: 'Open CU Bus if it is installed', openAppText: 'Open app', downloadIos: 'Download CU Bus on the App Store', downloadAndroid: 'Get CU Bus on Google Play', visitWebsite: 'Visit the CU Bus website', visitWebsiteText: 'Explore CU Bus', qrLabel: 'CU Bus website QR code',
        qrAlt: 'QR code for cu-bus.online', scanWebsite: 'Scan to visit', actionsLabel: 'Permit actions',
        previewButton: 'Preview', editButton: 'Edit', shareButton: 'Share image', printButton: 'Print',
        previewActionLabel: 'Open full-screen permit preview', editActionLabel: 'Edit permit details', shareActionLabel: 'Share or download permit image', printActionLabel: 'Print permit',
        developerProfiles: 'Developer social profiles', developerInstagram: 'View developer Anson Cheng on Instagram', developerGithub: 'View developer Anson Cheng on GitHub', fullscreenLabel: 'Full-screen permit preview', closeFullscreen: 'Close full-screen preview',
        stepForm: 'Step 1 of 3: Enter permit details', stepCreating: 'Step 2 of 3: Creating permit', stepPreview: 'Step 3 of 3: Preview permit',
        creatingStatus: 'Creating your permit. The preview will open automatically when it is ready.', previewStatus: 'Your permit is ready. You can flip, preview, edit, share, or print it.',
        showBack: 'View passenger notice', showFront: 'Return to the permit front', shareWorking: 'Creating share image', shareSaved: 'Image saved', shareFailed: 'Unable to share image', shareTitle: 'CUHK School Bus Permit',
        online: 'Online', offline: 'Offline', onlineUpdateLabel: 'Online. Check for updates', offlineUpdateLabel: 'Offline. Connect to check for updates',
        checkingTitle: 'Checking for updates', checkingMessage: 'Confirming that this is the latest version.', updatingTitle: 'Updating', updatingMessage: 'Refreshing offline files. The app will reload when ready.',
        latestTitle: 'Latest version', latestMessage: 'You are using the latest version.', offlineTitle: 'You are offline', offlineMessage: 'Connect to the internet and try again.', updateErrorTitle: 'Update failed', updateErrorMessage: 'Check your connection and try again.', refreshingTitle: 'Reloading', refreshingMessage: 'Downloading the latest content. The app will reopen automatically.', updateProgressLabel: 'Update progress', reloadLatest: 'Reload latest content', closeUpdate: 'Close'
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
let serviceWorkerRegistration;
let updateInProgress = false;
let updateDialogCloseTimer;
let updateDialogReturnFocus;
let startupLanguage = 'zh';
const startupLoadState = { language: false, draft: false, images: false };

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
    stepPill.setAttribute('aria-label', t(viewName === 'form' ? 'stepForm' : viewName === 'creating' ? 'stepCreating' : 'stepPreview'));
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

function announce(message) {
    if (!appStatus) return;
    appStatus.textContent = '';
    window.requestAnimationFrame(() => { appStatus.textContent = message; });
}

function updateNetworkStatus() {
    if (!networkUpdateButton || !networkStatusLabel) return;
    const online = navigator.onLine;
    networkUpdateButton.dataset.state = online ? 'online' : 'offline';
    networkStatusLabel.textContent = t(online ? 'online' : 'offline');
    networkUpdateButton.setAttribute('aria-label', t(online ? 'onlineUpdateLabel' : 'offlineUpdateLabel'));
}

function updateCardAccessibleDescription(params = permitParams, showBack = cardObject.classList.contains('is-back')) {
    if (!cardAccessibleDescription) return;
    if (showBack) {
        const noticeLanguage = currentLanguage === 'en' ? 'en' : 'zh-HK';
        const noticeItems = [...document.querySelectorAll(`.terms-list li > span[lang="${noticeLanguage}"]`)]
            .map((item, index) => `${index + 1}. ${item.textContent.trim()}`);
        cardAccessibleDescription.textContent = noticeItems.join(' ');
        return;
    }
    const type = params.get('Type') === 'Lesson'
        ? (currentLanguage === 'en' ? 'Meet-Class Bus Permit' : '轉堂校巴證')
        : (currentLanguage === 'en' ? 'Shuttle Bus Permit' : '穿梭校巴證');
    const name = params.get('Name') || (currentLanguage === 'en' ? 'Not provided' : '未提供');
    const sid = params.get('SID') || '1155125528';
    const major = params.get('Major') || 'B.A. in Fine Arts';
    const valid = formatPermitDate(params.get('Valid')) || defaultPermitExpiry().display;
    cardAccessibleDescription.textContent = currentLanguage === 'en'
        ? `${type}. Name: ${name}. Student ID: ${sid}. Major: ${major}. Valid until: ${valid}.`
        : `${type}。姓名：${name}。學生編號：${sid}。主修科目：${major}。有效期至：${valid}。`;
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
    updateHeader(activeView);
    updateSeo(activeView);
    setCardSide(cardObject.classList.contains('is-back'));
    updateCardAccessibleDescription();
    updateNetworkStatus();
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
    document.querySelector('.app-promo')?.setAttribute('data-platform', destination);
}

function commitView(viewName, skipFallbackEntry = false, forceEntry = false) {
    if (viewName !== 'preview' && isFullscreen) {
        isFullscreen = false;
        isClosingFullscreen = false;
        fullscreenPreview.hidden = true;
        document.body.classList.remove('fullscreen-open');
        pageShell.inert = false;
        pageShell.removeAttribute('inert');
        pageShell.removeAttribute('aria-hidden');
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
    const cardIsAvailable = viewName === 'preview';
    cardScaler.setAttribute('aria-hidden', String(!cardIsAvailable));
    cardObject.setAttribute('tabindex', cardIsAvailable && !isFullscreen ? '0' : '-1');
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

function animateCardBackToPreview() {
    if (reducedMotion) return Promise.resolve();

    const fromRect = cardScaler.getBoundingClientRect();
    const originRect = fullscreenMount.getBoundingClientRect();
    const targetRect = previewMount.getBoundingClientRect();
    if (!fromRect.width || !originRect.width || !targetRect.width) return Promise.resolve();

    const availableWidth = Math.max(1, previewMount.clientWidth - 24);
    const availableHeight = Math.max(1, previewMount.clientHeight - 24);
    const targetScale = Math.min(1, availableWidth / 560, availableHeight / 356);
    const originCenterX = originRect.left + originRect.width / 2;
    const originCenterY = originRect.top + originRect.height / 2;
    const startCenterX = fromRect.left + fromRect.width / 2;
    const startCenterY = fromRect.top + fromRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const runId = ++cardMoveRun;

    window.clearTimeout(cardMoveTimer);
    cardScaler.classList.remove('is-relocating');
    cardScaler.style.setProperty('--card-move-x', `${startCenterX - originCenterX}px`);
    cardScaler.style.setProperty('--card-move-y', `${startCenterY - originCenterY}px`);
    cardScaler.style.setProperty('--card-move-scale', String(fromRect.width / 560));
    cardScaler.getBoundingClientRect();
    cardScaler.classList.add('is-relocating');

    requestAnimationFrame(() => {
        if (runId !== cardMoveRun) return;
        cardScaler.style.setProperty('--card-move-x', `${targetCenterX - originCenterX}px`);
        cardScaler.style.setProperty('--card-move-y', `${targetCenterY - originCenterY}px`);
        cardScaler.style.setProperty('--card-move-scale', String(targetScale));
    });

    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled || runId !== cardMoveRun) return;
            settled = true;
            window.clearTimeout(cardMoveTimer);
            cardScaler.removeEventListener('transitionend', onTransitionEnd);
            resolve();
        };
        const onTransitionEnd = (event) => {
            if (event.target === cardScaler && event.propertyName === 'transform') finish();
        };
        cardMoveTimer = window.setTimeout(finish, 760);
        cardScaler.addEventListener('transitionend', onTransitionEnd);
    });
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
    updateCardAccessibleDescription(params);
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

function setStartupStatus(key) {
    if (!appLoaderStatusText) return;
    appLoaderStatusText.dataset.i18n = key;
    appLoaderStatusText.textContent = translations[startupLanguage][key];
}

function updateStartupStatus() {
    const savedDetailsReady = startupLoadState.language && startupLoadState.draft;
    if (!savedDetailsReady && !startupLoadState.images) setStartupStatus('loadingSavedAndImages');
    else if (!savedDetailsReady) setStartupStatus('loadingSaved');
    else if (!startupLoadState.images) setStartupStatus('loadingImages');
    else setStartupStatus('loadingPreparing');
}

function trackStartupTask(name, promise, onValue) {
    return Promise.resolve(promise)
        .then((value) => {
            onValue?.(value);
            return value;
        })
        .finally(() => {
            startupLoadState[name] = true;
            updateStartupStatus();
        });
}

function dismissAppLoader() {
    if (!appLoader) {
        document.body.classList.remove('is-booting');
        document.body.setAttribute('aria-busy', 'false');
        return Promise.resolve();
    }
    if (reducedMotion) {
        appLoader.hidden = true;
        document.body.classList.remove('is-booting');
        document.body.setAttribute('aria-busy', 'false');
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
            document.body.setAttribute('aria-busy', 'false');
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
    if (reducedMotion) {
        setProgress(to);
        return Promise.resolve(runId === generationRun);
    }
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
    paintCanvas.classList.remove('is-fading');
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
    if (reducedMotion) {
        context.clearRect(0, 0, 560, 356);
        paintCanvas.hidden = true;
        setEdgeReveal(1);
        setProgress(84);
        return Promise.resolve(runId === generationRun);
    }
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
                brushHead.classList.remove('visible');
                paintCanvas.classList.add('is-fading');

                let settled = false;
                const finishFade = () => {
                    if (settled) return;
                    settled = true;
                    window.clearTimeout(fadeTimer);
                    paintCanvas.removeEventListener('transitionend', onFadeEnd);
                    const isCurrentRun = runId === generationRun;
                    if (isCurrentRun) {
                        context.clearRect(0, 0, 560, 356);
                        paintCanvas.hidden = true;
                        paintCanvas.classList.remove('is-fading');
                    }
                    resolve(isCurrentRun);
                };
                const onFadeEnd = (event) => {
                    if (event.target === paintCanvas && event.propertyName === 'opacity') finishFade();
                };
                const fadeTimer = window.setTimeout(finishFade, 720);
                paintCanvas.addEventListener('transitionend', onFadeEnd);
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
        await playExitAnimation(cardObject, 'is-presenting', 'new-card-spin', 1180);
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
    updateCardAccessibleDescription(permitParams, showBack);
    if (currentlyBack === showBack) return;

    window.clearTimeout(flipTimer);
    cardObject.classList.add('is-flipping');
    cardObject.classList.toggle('is-back', showBack);
    flipTimer = window.setTimeout(() => cardObject.classList.remove('is-flipping'), reducedMotion ? 20 : 1120);
}

function flipCard() {
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

let viewportSyncFrame;

function syncAppViewport() {
    const viewport = window.visualViewport;
    const viewportHeight = Math.max(1, Math.min(
        window.innerHeight || Number.POSITIVE_INFINITY,
        viewport?.height || window.innerHeight || document.documentElement.clientHeight
    ));
    const viewportWidth = Math.max(1, Math.min(
        window.innerWidth || Number.POSITIVE_INFINITY,
        viewport?.width || window.innerWidth || document.documentElement.clientWidth
    ));
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--app-viewport-height', `${viewportHeight}px`);
    rootStyle.setProperty('--app-viewport-width', `${viewportWidth}px`);
    rootStyle.setProperty('--app-viewport-top', `${Math.max(0, viewport?.offsetTop || 0)}px`);
    rootStyle.setProperty('--app-viewport-left', `${Math.max(0, viewport?.offsetLeft || 0)}px`);
    resizeCard();
}

function scheduleAppViewportSync() {
    window.cancelAnimationFrame(viewportSyncFrame);
    viewportSyncFrame = window.requestAnimationFrame(syncAppViewport);
}

function populateForm(params) {
    ['Name', 'SID', 'Major'].forEach((name) => {
        const input = form.elements.namedItem(name);
        if (input && params.has(name)) input.value = params.get(name);
    });
    if (params.has('Valid')) form.elements.Valid.value = dateInputValue(params.get('Valid'));
    const type = params.get('Type');
    if (type && form.elements.Type) form.elements.Type.value = type;
    updatePermitTypeTabStops();
}

function updatePermitTypeTabStops() {
    permitTypeRadios.forEach((radio) => {
        radio.tabIndex = radio.checked ? 0 : -1;
    });
}

async function openForm(historyMode = 'push') {
    await switchView('form', historyMode);
    if (appInitialized) pageTitle?.focus({ preventScroll: true });
}

async function discardCardAndOpenForm(historyMode = 'push') {
    if (activeView !== 'preview' || reducedMotion) {
        await openForm(historyMode);
        return;
    }
    if (isDiscarding) return;

    isDiscarding = true;
    editPermitButton.disabled = true;
    cardObject.setAttribute('tabindex', '0');
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
    creationMain?.focus({ preventScroll: true });
    announce(t('creatingStatus'));
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
    cardObject.focus({ preventScroll: true });
    announce(t('previewStatus'));
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
    const cardStartRect = cardScaler.getBoundingClientRect();
    isFullscreen = true;
    isClosingFullscreen = false;
    setCardSide(false);
    fullscreenPreview.hidden = false;
    fullscreenMount.append(cardScaler);
    document.body.classList.add('fullscreen-open');
    pageShell.inert = true;
    pageShell.setAttribute('inert', '');
    pageShell.setAttribute('aria-hidden', 'true');
    cardObject.setAttribute('tabindex', '0');
    resizeCard();
    animateCardMove(cardStartRect);
    requestAnimationFrame(() => {
        fullscreenCloseButton.focus({ preventScroll: true });
    });
}

async function closeFullscreenPreview() {
    if (!isFullscreen || isClosingFullscreen) return;
    isClosingFullscreen = true;
    if (!reducedMotion) fullscreenPreview.classList.add('is-closing');
    await animateCardBackToPreview();
    isFullscreen = false;
    previewMount.append(cardScaler);
    document.body.classList.remove('fullscreen-open');
    pageShell.inert = false;
    pageShell.removeAttribute('inert');
    pageShell.removeAttribute('aria-hidden');
    resizeCard();
    window.clearTimeout(cardMoveTimer);
    cardMoveRun++;
    cardScaler.classList.remove('is-relocating');
    cardScaler.style.removeProperty('--card-move-x');
    cardScaler.style.removeProperty('--card-move-y');
    cardScaler.style.removeProperty('--card-move-scale');
    fullscreenPreview.hidden = true;
    fullscreenPreview.classList.remove('is-closing');
    cardObject.setAttribute('tabindex', '0');
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

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('Could not embed permit asset'));
        reader.readAsDataURL(blob);
    });
}

async function imageSourceAsDataUrl(src) {
    if (src.startsWith('data:')) return src;
    const response = await fetch(src, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Could not embed ${src}`);
    return blobToDataUrl(await response.blob());
}

function copyRenderedStyles(source, clone) {
    const rendered = getComputedStyle(source);
    for (let index = 0; index < rendered.length; index += 1) {
        const property = rendered[index];
        clone.style.setProperty(property, rendered.getPropertyValue(property), rendered.getPropertyPriority(property));
    }
    [...source.children].forEach((child, index) => {
        copyRenderedStyles(child, clone.children[index]);
    });
}

async function clonePermitForImage() {
    const permit = card.cloneNode(true);
    copyRenderedStyles(card, permit);
    permit.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    permit.style.setProperty('box-shadow', 'none', 'important');
    permit.style.setProperty('cursor', 'default', 'important');
    permit.style.setProperty('overflow', 'hidden', 'important');

    const sourceImages = [...card.querySelectorAll('img')];
    const clonedImages = [...permit.querySelectorAll('img')];
    const embeddedSources = await Promise.all(sourceImages.map((source) => (
        imageSourceAsDataUrl(source.currentSrc || source.src)
    )));
    embeddedSources.forEach((source, index) => {
        const clone = clonedImages[index];
        clone.removeAttribute('srcset');
        clone.removeAttribute('loading');
        clone.src = source;
    });

    const artworkIndex = sourceImages.indexOf(cardArtwork);
    const artworkSource = embeddedSources[artworkIndex];
    if (artworkSource) {
        permit.style.setProperty('background-image', `url("${artworkSource}")`, 'important');
        permit.style.setProperty('background-position', 'center', 'important');
        permit.style.setProperty('background-repeat', 'no-repeat', 'important');
        permit.style.setProperty('background-size', 'cover', 'important');
    }
    return permit;
}

async function renderPermitImage() {
    await document.fonts?.ready;
    const permit = await clonePermitForImage();
    const serializedPermit = new XMLSerializer().serializeToString(permit);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="356" viewBox="0 0 560 356"><foreignObject width="560" height="356">${serializedPermit}</foreignObject></svg>`;
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 1120;
    canvas.height = 712;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create permit image')), 'image/png');
    });
}

function downloadPermitImage(blob) {
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = 'cuhk-bus-permit.png';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

async function sharePermitImage() {
    const originalLabel = t('shareButton');
    shareImageButton.disabled = true;
    shareImageButton.setAttribute('aria-busy', 'true');
    shareButtonLabel.textContent = t('shareWorking');
    announce(t('shareWorking'));
    try {
        const blob = await renderPermitImage();
        const file = new File([blob], 'cuhk-bus-permit.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({ title: t('shareTitle'), files: [file] });
                shareButtonLabel.textContent = originalLabel;
            } catch (error) {
                if (error?.name === 'AbortError') throw error;
                downloadPermitImage(blob);
                shareButtonLabel.textContent = t('shareSaved');
                announce(t('shareSaved'));
            }
        } else {
            downloadPermitImage(blob);
            shareButtonLabel.textContent = t('shareSaved');
            announce(t('shareSaved'));
        }
    } catch (error) {
        if (error?.name !== 'AbortError') {
            console.error('Permit image export failed', error);
            shareButtonLabel.textContent = t('shareFailed');
            announce(t('shareFailed'));
        }
        else shareButtonLabel.textContent = originalLabel;
    } finally {
        shareImageButton.disabled = false;
        shareImageButton.removeAttribute('aria-busy');
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    permitParams = new URLSearchParams(new FormData(form));
    window.clearTimeout(draftSaveTimer);
    void saveFormDraft();
    const generateButton = form.querySelector('.generate-button');
    const buttonLabel = generateButton.querySelector('span');
    generateButton.disabled = true;
    generateButton.setAttribute('aria-busy', 'true');
    buttonLabel.textContent = t('generateEntering');
    await openCreating('push', true);
    buttonLabel.textContent = t('generate');
    generateButton.disabled = false;
    generateButton.removeAttribute('aria-busy');
});

form.addEventListener('input', scheduleFormDraftSave);
form.addEventListener('change', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.name === 'Type') {
        updatePermitTypeTabStops();
    }
    scheduleFormDraftSave();
});
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
fullscreenCloseButton.addEventListener('click', closeFullscreenPreview);
fullscreenPreview.addEventListener('click', (event) => {
    if (event.target.closest('.card-scaler, .fullscreen-close')) return;
    closeFullscreenPreview();
});
shareImageButton.addEventListener('click', sharePermitImage);
document.querySelector('.printbtn').addEventListener('click', () => window.print());

function setUpdateProgress(value) {
    const progress = Math.max(0, Math.min(100, Math.round(value)));
    updateProgressFill.style.width = `${progress}%`;
    updateProgress.setAttribute('aria-valuenow', String(progress));
}

function setUpdateDialogBackgroundInert(isInert) {
    pageShell.inert = isInert;
    if (isInert) {
        pageShell.setAttribute('inert', '');
        pageShell.setAttribute('aria-hidden', 'true');
    } else {
        pageShell.removeAttribute('inert');
        pageShell.removeAttribute('aria-hidden');
    }
}

function showUpdateDialog(titleKey, messageKey, { showProgress = false, closable = true, showReload = false } = {}) {
    window.clearTimeout(updateDialogCloseTimer);
    updateDialog.classList.remove('is-closing');
    updateDialogTitle.textContent = t(titleKey);
    updateDialogMessage.textContent = t(messageKey);
    updateProgress.classList.toggle('is-hidden', !showProgress);
    updateProgress.setAttribute('aria-hidden', String(!showProgress));
    updateDialogReload.hidden = !showReload;
    updateDialogReload.disabled = !showReload || updateInProgress;
    updateDialogClose.classList.toggle('is-placeholder', !closable);
    updateDialogClose.disabled = !closable;
    updateDialogActions.hidden = !closable && !showReload;
    if (!updateDialog.open) {
        const activeElement = document.activeElement;
        updateDialogReturnFocus = activeElement instanceof HTMLElement
            && activeElement !== document.body
            && !activeElement.matches(':disabled')
            ? activeElement
            : networkUpdateButton;
        updateDialog.showModal();
    }
    if (closable) updateDialogClose.focus({ preventScroll: true });
    else updateDialog.focus({ preventScroll: true });
    setUpdateDialogBackgroundInert(true);
}

function closeUpdateDialog() {
    if (updateInProgress || !updateDialog.open || updateDialog.classList.contains('is-closing')) return;
    const finishClose = () => {
        window.clearTimeout(updateDialogCloseTimer);
        updateDialog.classList.remove('is-closing');
        if (updateDialog.open) updateDialog.close();
        setUpdateDialogBackgroundInert(false);
        const focusTarget = updateDialogReturnFocus;
        updateDialogReturnFocus = null;
        if (focusTarget?.isConnected && !focusTarget.disabled) focusTarget.focus({ preventScroll: true });
    };
    if (reducedMotion) {
        finishClose();
        return;
    }
    updateDialog.classList.add('is-closing');
    updateDialogCloseTimer = window.setTimeout(finishClose, 240);
}

async function fetchLatestAssetVersion() {
    const indexUrl = new URL('./index.html', document.baseURI);
    indexUrl.searchParams.set('update-check', String(Date.now()));
    const response = await fetch(indexUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Update check failed with ${response.status}`);
    const documentMarkup = await response.text();
    const latestDocument = new DOMParser().parseFromString(documentMarkup, 'text/html');
    const latestScript = latestDocument.querySelector('script[src*="bootstrap.js"]');
    if (!latestScript) throw new Error('Latest version marker is missing');
    const latestScriptUrl = new URL(latestScript.getAttribute('src'), indexUrl);
    const latestVersion = latestScriptUrl.searchParams.get('v');
    if (!latestVersion) throw new Error('Latest version is missing');
    return latestVersion;
}

async function clearPermitCaches() {
    if (!('caches' in window)) return;
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
        .filter((cacheName) => cacheName.startsWith('cu-bus-permit-'))
        .map((cacheName) => caches.delete(cacheName)));
}

async function reloadLatestContent() {
    if (updateInProgress || !navigator.onLine) return;
    updateInProgress = true;
    networkUpdateButton.disabled = true;
    showUpdateDialog('refreshingTitle', 'refreshingMessage', { showProgress: true, closable: false });
    setUpdateProgress(10);
    try {
        await clearPermitCaches();
        setUpdateProgress(55);
        const registration = serviceWorkerRegistration || await navigator.serviceWorker?.getRegistration('./');
        if (registration) await registration.unregister();
        setUpdateProgress(100);
        await new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : 350));
        window.location.reload();
    } catch {
        updateInProgress = false;
        networkUpdateButton.disabled = false;
        showUpdateDialog('updateErrorTitle', 'updateErrorMessage', { showReload: navigator.onLine });
        announce(t('updateErrorMessage'));
    }
}

function waitForWorkerActivation(worker) {
    if (!worker || worker.state === 'activated') return Promise.resolve();
    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            worker.removeEventListener('statechange', onStateChange);
            reject(new Error('Service worker activation timed out'));
        }, 30000);
        const onStateChange = () => {
            if (worker.state === 'activated') {
                window.clearTimeout(timeout);
                worker.removeEventListener('statechange', onStateChange);
                resolve();
            } else if (worker.state === 'redundant') {
                window.clearTimeout(timeout);
                worker.removeEventListener('statechange', onStateChange);
                reject(new Error('Service worker became redundant'));
            }
        };
        worker.addEventListener('statechange', onStateChange);
    });
}

async function installLatestVersion(latestVersion) {
    setUpdateProgress(8);
    await clearPermitCaches();
    setUpdateProgress(16);

    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
        setUpdateProgress(100);
        window.location.reload();
        return;
    }

    const onProgress = (event) => {
        const message = event.data;
        if (message?.type !== 'CACHE_PROGRESS' || message.version !== latestVersion) return;
        setUpdateProgress(16 + (message.completed / message.total) * 78);
    };
    navigator.serviceWorker.addEventListener('message', onProgress);
    try {
        serviceWorkerRegistration = await navigator.serviceWorker.register(
            `./service-worker.js?v=${encodeURIComponent(latestVersion)}`,
            { scope: './', updateViaCache: 'none' }
        );
        const worker = serviceWorkerRegistration.installing || serviceWorkerRegistration.waiting || serviceWorkerRegistration.active;
        await waitForWorkerActivation(worker);
        setUpdateProgress(100);
        await new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : 450));
        window.location.reload();
    } finally {
        navigator.serviceWorker.removeEventListener('message', onProgress);
    }
}

async function checkForUpdates() {
    if (updateInProgress) return;
    if (!navigator.onLine) {
        showUpdateDialog('offlineTitle', 'offlineMessage');
        return;
    }

    updateInProgress = true;
    networkUpdateButton.disabled = true;
    showUpdateDialog('checkingTitle', 'checkingMessage', { closable: false });
    try {
        const latestVersion = await fetchLatestAssetVersion();
        if (latestVersion === assetVersion) {
            await serviceWorkerRegistration?.update();
            updateInProgress = false;
            networkUpdateButton.disabled = false;
            showUpdateDialog('latestTitle', 'latestMessage', { showReload: true });
            announce(t('latestMessage'));
            return;
        }

        showUpdateDialog('updatingTitle', 'updatingMessage', { showProgress: true, closable: false });
        setUpdateProgress(0);
        await installLatestVersion(latestVersion);
    } catch {
        updateInProgress = false;
        networkUpdateButton.disabled = false;
        showUpdateDialog('updateErrorTitle', 'updateErrorMessage', { showReload: navigator.onLine });
        announce(t('updateErrorMessage'));
    }
}

networkUpdateButton.addEventListener('click', checkForUpdates);
updateDialogReload.addEventListener('click', reloadLatestContent);
updateDialogClose.addEventListener('click', closeUpdateDialog);
updateDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeUpdateDialog();
});
updateDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusTargets = [updateDialogReload, updateDialogClose]
        .filter((button) => !button.hidden && !button.disabled);
    if (!focusTargets.length) {
        event.preventDefault();
        updateDialog.focus({ preventScroll: true });
        return;
    }
    const currentIndex = focusTargets.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusTargets.length - 1 : currentIndex - 1)
        : (currentIndex < 0 || currentIndex === focusTargets.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusTargets[nextIndex].focus({ preventScroll: true });
});
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
document.addEventListener('keydown', (event) => {
    if (!isFullscreen) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        closeFullscreenPreview();
    } else if (event.key === 'Tab') {
        event.preventDefault();
        const focusTargets = [fullscreenCloseButton, cardObject];
        const currentIndex = focusTargets.indexOf(document.activeElement);
        const step = event.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + step + focusTargets.length) % focusTargets.length;
        focusTargets[nextIndex].focus({ preventScroll: true });
    }
});

window.addEventListener('resize', scheduleAppViewportSync, { passive: true });
window.addEventListener('orientationchange', scheduleAppViewportSync, { passive: true });
window.visualViewport?.addEventListener('resize', scheduleAppViewportSync, { passive: true });
window.visualViewport?.addEventListener('scroll', scheduleAppViewportSync, { passive: true });
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
            const registration = await navigator.serviceWorker.register(`./service-worker.js?v=${encodeURIComponent(assetVersion)}`, {
                scope: './',
                updateViaCache: 'none'
            });
            serviceWorkerRegistration = registration;
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
    syncAppViewport();
    drawAmbient();
    updateStartupStatus();
    const [storedLanguage, storedDraft] = await Promise.all([
        trackStartupTask('language', readSavedValue(languagePreferenceKey), (language) => {
            startupLanguage = language === 'en' ? 'en' : 'zh';
        }),
        trackStartupTask('draft', readSavedValue(formDraftKey)),
        trackStartupTask('images', preloadStartupImages()),
        minimumStartupTime()
    ]);
    setStartupStatus('loadingPreparing');
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
