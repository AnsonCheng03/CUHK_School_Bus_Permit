function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

if (getParameterByName("Type") == "Transit") {
    document.querySelector('.cardname h1').innerText = '穿梭校巴證'
    document.querySelector('.cardname h2').innerText = 'Shuttle Bus Permit'
    document.querySelector('.card').style.background = 'url("../getcard/images/schbus_d.png")'
    for (const box of document.querySelectorAll('.routes .lesson')) {
        box.style.display = 'none';
    }
} else {
    document.querySelector('.cardname h1').innerText = '轉堂校巴證'
    document.querySelector('.cardname h2').innerText = 'Meet-Class Bus Permit'
    document.querySelector('.card').style.background = 'url("../getcard/images/schbus_l.png")';
    for (const box of document.querySelectorAll('.routes .transit')) {
        box.style.display = 'none';
    }
}

function resizecard() {
    let size = window.innerWidth * 0.8 / 560;
    document.querySelector('.card').style.transform = "scale(" + size + ")"
}

window.addEventListener('load', resizecard);
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    window.addEventListener('resize', resizecard);

if (!getParameterByName("Name")) window.location.replace("../");
document.querySelector('.studatas .Name .value span').innerText = getParameterByName("Name");
document.querySelector('.studatas .SID .value span').innerText = getParameterByName("SID") ? getParameterByName("SID") : '1155125528'
document.querySelector('.studatas .Major .value span').innerText = getParameterByName("Major") ? getParameterByName("Major") : 'B.A. in Fine Arts'
const today = new Date();
document.querySelector('.studatas .Valid .value span').innerText = getParameterByName("Valid") ? getParameterByName("Valid") : today.getDate() + "/" + (today.getMonth() + 1) + "/" + (today.getFullYear() + 1)


document.querySelector('.share .sharebtn').addEventListener('click', () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('hideshare', 'true');
    const shareButtonLabel = document.querySelector('.sharebtn .button-label');

    if (navigator.canShare) {
        navigator.share({
            title: "校巴證",
            text: "中大校巴證",
            url: shareUrl.toString(),
        });
    } else {
        navigator.clipboard.writeText(shareUrl.toString()).then(function () {
            shareButtonLabel.innerText = "已複製"
        }, function (err) {
            shareButtonLabel.innerText = "分享失敗"
        });
    }
});

document.querySelector('.share .printbtn').addEventListener('click', () => {
    window.print();
});


document.querySelector('.share .hidebtn').addEventListener('click', () => {
    document.querySelector('.share').style.display = "none";
    document.querySelector('.canvas-hint').style.display = "none";
});

if (getParameterByName("hideshare") == "true") {
    document.querySelector('.share').style.display = "none";
    document.querySelector('.canvas-hint').style.display = "none";
}

const previewObject = document.querySelector('.preview-object');
const previewCanvas = document.querySelector('.preview-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

previewCanvas.addEventListener('pointermove', (event) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const bounds = previewCanvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    previewObject.style.transform = `rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(8px)`;
});

previewCanvas.addEventListener('pointerleave', () => {
    previewObject.style.transform = '';
});
