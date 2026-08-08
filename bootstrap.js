(() => {
    const version = new URL(document.currentScript.src).searchParams.get('v') || 'dev';
    const styles = ['getcard/style.css', 'style.css', 'spa.css'];

    function loadStyle(href) {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${href}?v=${encodeURIComponent(version)}`;
            link.onload = resolve;
            link.onerror = resolve;
            document.head.append(link);
        });
    }

    async function loadApplication() {
        await Promise.all(styles.map(loadStyle));
        const script = document.createElement('script');
        script.src = `script.js?v=${encodeURIComponent(version)}`;
        document.head.append(script);
    }

    function startAfterFirstPaint() {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            void loadApplication();
        }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAfterFirstPaint, { once: true });
    } else {
        startAfterFirstPaint();
    }
})();
