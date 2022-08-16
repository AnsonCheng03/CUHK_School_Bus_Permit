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
window.addEventListener('resize', resizecard);

document.querySelector('.studatas .Name .value span').innerText = getParameterByName("Name") ? getParameterByName("Name") : 'CHAN Siu-ming （陳小明）'
document.querySelector('.studatas .SID .value span').innerText = getParameterByName("SID") ? getParameterByName("SID") : '1155125528'
document.querySelector('.studatas .Major .value span').innerText = getParameterByName("Major") ? getParameterByName("Major") : 'B.A. in Fine Arts'
document.querySelector('.studatas .Valid .value span').innerText = getParameterByName("Valid") ? getParameterByName("Valid") : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()

document.querySelector('.share .sharebtn').addEventListener('click', () => {
    if (navigator.canShare) {
        navigator.share({
            title: "校巴證",
            text: "中大校巴證",
            url: window.location.href,
        });
    } else {
        navigator.clipboard.writeText(window.location.href.toString()).then(function () {
            document.querySelector('.share button').innerText = "已複製到剪貼板"
        }, function (err) {
            document.querySelector('.share button').innerText = "分享失敗，請自行複製網址分享。"
        });
    }
});

document.querySelector('.share .hidebtn').addEventListener('click', () => {
    document.querySelector('.share').style.display = "none";
});