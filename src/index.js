import './index.css';

const PAGE = {
    data: {
        duration: 300,
        itemHeight: 0,
        translateY: 0,        //每一次记录，必须有
        index: 0,
        islock: false,
        len: 5,
        startY: 0,
        endY: 0,
        distance: 0,
    },
    init: function () {
        this.bind();
        this.goIndex(0);
    },

    bind: function () {
        window.addEventListener('resize', this.resizeRem.bind(this));
        window.addEventListener('pageshow', this.resizeRem.bind(this));
        let banner = document.querySelector('.swiper-banner');
        banner.addEventListener('touchstart', this.touchStart.bind(this));
        banner.addEventListener('touchmove', this.touchMove.bind(this));
        banner.addEventListener('touchend', this.touchEnd.bind(this));
    },
    resizeRem: function () {
        let docElement = document.documentElement;
        let width = docElement.getBoundingClientRect().width;
        let rem = width / 7.5;
        docElement.style.fontSize = rem + 'px';
        PAGE.data.itemHeight = parseInt(getComputedStyle(document.querySelector('.swiper-item')).height)
        this.goIndex(PAGE.data.index);
    },
    touchStart: function (e) {
        this.data.startY = e.touches[0].clientY;
    },
    touchMove: function (e) {
        this.data.endY = e.touches[0].clientY;
        PAGE.data.distance = this.data.endY - this.data.startY;//往上拖+1，distance是负的
    },
    touchEnd: function (e) {
        let distance = PAGE.data.distance
        let index = PAGE.data.index;
        if (distance < 0 && index < 4) {
            PAGE.goIndex(index + 1)
            PAGE.data.islock = true;
        }
        if (distance > 0 && index > 0) {
            PAGE.goIndex(index - 1)
            PAGE.data.islock = true;
        }
    },
    goIndex: function (index) {
        if (PAGE.data.islock == true) {
            return
        }
        console.log(index, 88)
        let swiperDuration = PAGE.data.duration;
        let swiperitemHeight = PAGE.data.itemHeight;
        let beginTranslateY = PAGE.data.translateY;
        let endTranslateY = - (swiperitemHeight * index);
        let banner = document.querySelector('.swiper-banner');
        PAGE.animateTo(beginTranslateY, endTranslateY, swiperDuration, function (value) {
            banner.style.transform = `translateY(${value}px)`;
        }, function (value) {
            banner.style.transform = `translateY(${value}px)`;
            PAGE.data.index = index;
            PAGE.data.translateY = value;
            PAGE.data.islock = false;
            console.log(index, 999)
        })
    },
    animateTo: function (begin, end, duration, changeCallback, finishCallback) {
        let startTime = Date.now();
        requestAnimationFrame(function update() {
            let dataNow = Date.now();
            let time = dataNow - startTime;
            let value = PAGE.linear(time, begin, end, duration);
            typeof changeCallback === 'function' && changeCallback(value)
            if (startTime + duration > dataNow) {
                requestAnimationFrame(update)
            } else {
                typeof finishCallback === 'function' && finishCallback(end)
            }
        })
    },
    linear: function (time, begin, end, duration) {
        return (end - begin) * time / duration + begin;
    },
}

PAGE.init();