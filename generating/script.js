const params = new URLSearchParams(window.location.search);

if (!params.get('Name')) {
    window.location.replace('../');
}

const type = params.get('Type') === 'Lesson' ? 'Lesson' : 'Transit';
const today = new Date();
const defaultValid = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 1}`;
const card = document.querySelector('.card');
const cardObject = document.querySelector('.card-object');
const paintCanvas = document.querySelector('.paint-canvas');
const brushHead = document.querySelector('.brush-head');
const progressDial = document.querySelector('.progress-dial');
const progressValue = document.querySelector('.progress-value');
const statusTitle = document.querySelector('.status-title');
const statusCopy = document.querySelector('.status-copy');
const completeActions = document.querySelector('.complete-actions');
const previewButton = document.querySelector('.preview-button');
const flipButton = document.querySelector('.flip-button');
const stages = [...document.querySelectorAll('.process-list li')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setCardData() {
    const isTransit = type === 'Transit';
    document.querySelector('.cardname h1').textContent = isTransit ? '穿梭校巴證' : '轉堂校巴證';
    document.querySelector('.cardname h2').textContent = isTransit ? 'Shuttle Bus Permit' : 'Meet-Class Bus Permit';
    card.style.background = `url("../getcard/images/${isTransit ? 'schbus_d.png' : 'schbus_l.png'}")`;
    document.querySelectorAll(isTransit ? '.routes .lesson' : '.routes .transit').forEach((route) => {
        route.style.display = 'none';
    });
    document.querySelector('.studatas .Name .value span').textContent = params.get('Name');
    document.querySelector('.studatas .SID .value span').textContent = params.get('SID') || '1155125528';
    document.querySelector('.studatas .Major .value span').textContent = params.get('Major') || 'B.A. in Fine Arts';
    document.querySelector('.studatas .Valid .value span').textContent = params.get('Valid') || defaultValid;
    previewButton.href = `../savecard/?${params.toString()}`;
}

function setStage(name) {
    const activeIndex = stages.findIndex((stage) => stage.dataset.stage === name);
    stages.forEach((stage, index) => {
        stage.classList.toggle('active', index === activeIndex);
        stage.classList.toggle('done', index < activeIndex);
    });
}

function setProgress(value) {
    const rounded = Math.max(0, Math.min(100, Math.round(value)));
    progressValue.textContent = rounded;
    progressDial.style.setProperty('--progress', `${rounded * 3.6}deg`);
    progressDial.setAttribute('aria-valuenow', String(rounded));
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = src;
    });
}

function animateProgress(from, to, duration) {
    return new Promise((resolve) => {
        const start = performance.now();
        function frame(now) {
            const elapsed = Math.min(1, (now - start) / duration);
            setProgress(from + (to - from) * elapsed);
            if (elapsed < 1) requestAnimationFrame(frame);
            else resolve();
        }
        requestAnimationFrame(frame);
    });
}

function preparePaintCanvas() {
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

function paintPermit() {
    const context = preparePaintCanvas();
    const rows = 9;
    const duration = 3600;
    const start = performance.now();
    brushHead.classList.add('visible');

    return new Promise((resolve) => {
        function frame(now) {
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
            const middleX = (startX + endX) / 2;
            context.quadraticCurveTo(middleX, y + Math.sin(progress * 28) * 5, endX, y);
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
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}

function flipCard() {
    cardObject.classList.toggle('is-back');
}

function resizeCard() {
    const theatre = document.querySelector('.permit-theatre');
    const availableWidth = Math.max(280, theatre.clientWidth - 52);
    const scale = Math.min(1, availableWidth / 560);
    document.documentElement.style.setProperty('--card-scale', scale.toFixed(3));
}

function drawAmbient() {
    const canvas = document.querySelector('.ambient-canvas');
    const context = canvas.getContext('2d');
    const dots = Array.from({ length: 34 }, (_, index) => ({
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

    function draw(time) {
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

async function createPermit() {
    setCardData();
    preparePaintCanvas();
    resizeCard();
    drawAmbient();

    const targetImage = type === 'Transit' ? 'schbus_d.png' : 'schbus_l.png';
    await Promise.all([
        preloadImage('../getcard/images/CUHK.png'),
        preloadImage(`../getcard/images/${targetImage}`),
        animateProgress(0, 22, 950)
    ]);

    setStage('paint');
    statusTitle.textContent = '正在逐筆繪製';
    statusCopy.textContent = '每一道筆觸都在還原你的專屬校巴證。';
    await paintPermit();

    setStage('finish');
    statusTitle.textContent = '正在立體校對';
    statusCopy.textContent = '翻到背面，再確認一次旅程資料。';
    await animateProgress(84, 94, 420);
    cardObject.classList.add('is-back');
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 60 : 1200));
    cardObject.classList.remove('is-back');
    await animateProgress(94, 100, 650);

    stages.forEach((stage) => {
        stage.classList.remove('active');
        stage.classList.add('done');
    });
    cardObject.classList.add('is-ready');
    cardObject.setAttribute('aria-disabled', 'false');
    statusTitle.textContent = '你的校巴證已完成';
    statusCopy.textContent = '點按校巴證可立體翻轉，或前往完整預覽。';
    completeActions.hidden = false;
}

cardObject.addEventListener('click', () => {
    if (cardObject.classList.contains('is-ready')) flipCard();
});

cardObject.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && cardObject.classList.contains('is-ready')) {
        event.preventDefault();
        flipCard();
    }
});

flipButton.addEventListener('click', flipCard);
window.addEventListener('resize', resizeCard, { passive: true });

createPermit();
