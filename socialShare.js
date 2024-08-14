(function () {
    'use strict';

    class Sharer {
        constructor(config) {
            this.config = config;
        }
        openShareWindow() {
            const url = this.config.getFullShareUrl();
            if (this.config.isLink) {
                if (this.config.isBlank) {
                    window.open(url, '_blank');
                }
                else {
                    window.location.href = url;
                }
            }
            else {
                const left = window.innerWidth / 2 - this.config.width / 2 + window.screenX;
                const top = window.innerHeight / 2 - this.config.height / 2 + window.screenY;
                const popParams = `scrollbars=no, width=${this.config.width}, height=${this.config.height}, top=${top}, left=${left}`;
                const newWindow = window.open(url, '', popParams);
                if (window.focus && newWindow) {
                    newWindow.focus();
                }
            }
        }
    }

    class SharerConfig {
        constructor(key, shareUrl, params, width, height, isLink, isBlank) {
            this.key = key;
            this.baseShareUrl = shareUrl;
            this.params = params || {};
            this.width = width;
            this.height = height;
            this.isLink = isLink;
            this.isBlank = isBlank;
        }
        getFullShareUrl() {
            const keys = Object.keys(this.params);
            let str = keys.length > 0 ? '?' : '';
            let ind = 0;
            keys.forEach((key) => {
                const val = encodeURIComponent(String(this.params[key]));
                if (val !== "") {
                    str += `${ind > 0 ? '&' : ''}${key}=${val}`;
                    ind++;
                }
            });
            const url = this.baseShareUrl + str;
            return url;
        }
    }

    var SharerKey;
    (function (SharerKey) {
        SharerKey["Facebook"] = "fb";
        SharerKey["LinkedIn"] = "li";
        SharerKey["X"] = "x";
        SharerKey["Threads"] = "th";
        SharerKey["Email"] = "em";
        SharerKey["WhatsApp"] = "wa";
        SharerKey["Telegram"] = "tg";
        SharerKey["Reddit"] = "re";
    })(SharerKey || (SharerKey = {}));

    function getValue(elem, attr) {
        let val = elem.getAttribute(`data-${attr}`);
        if (val && attr === 'hashtag' && !val.startsWith('#')) {
            val = `#${val}`;
        }
        return val !== null ? val : '';
    }

    function getConfiguration(e) {
        const sharerKeyString = getValue(e, 'share-to').toLowerCase();
        const sharerKey = Object.values(SharerKey).includes(sharerKeyString) ? sharerKeyString : undefined;
        const sharer = getSharerConfig(e, sharerKey);
        return sharer;
    }
    function createSharerConfig(key, e, shareUrl, params) {
        return new SharerConfig(key, shareUrl, params, parseInt(e.getAttribute('data-width') || '600'), parseInt(e.getAttribute('data-height') || '480'), e.getAttribute('data-link') === 'true', e.getAttribute('data-blank') === 'true');
    }
    function getSharerConfig(e, key) {
        switch (key) {
            case SharerKey.Facebook:
                return createSharerConfig(key, e, 'https://www.facebook.com/sharer/sharer.php', {
                    u: getValue(e, 'url'),
                    hashtag: getValue(e, 'hashtag'),
                    quote: getValue(e, 'text'),
                });
            case SharerKey.LinkedIn:
                return createSharerConfig(key, e, 'https://www.linkedin.com/shareArticle', {
                    url: getValue(e, 'url'),
                });
            case SharerKey.X:
                return createSharerConfig(key, e, 'https://x.com/intent/tweet', {
                    text: getValue(e, 'text'),
                    url: getValue(e, 'url'),
                    hashtags: getValue(e, 'hashtags'),
                    via: getValue(e, 'via'),
                    related: getValue(e, 'related'),
                    in_reply_to: getValue(e, 'in_reply_to'),
                });
            case SharerKey.Threads:
                return createSharerConfig(key, e, 'https://threads.net/intent/post', {
                    text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
                });
            case SharerKey.Email:
                return createSharerConfig(key, e, 'mailto:' + getValue(e, 'to'), {
                    subject: getValue(e, 'title'),
                    body: getValue(e, 'text') + '\n' + getValue(e, 'url'),
                });
            case SharerKey.WhatsApp:
                return createSharerConfig(key, e, getValue(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/', {
                    phone: getValue(e, 'to'),
                    text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
                });
            case SharerKey.Telegram:
                return createSharerConfig(key, e, 'https://t.me/share', {
                    text: getValue(e, 'text'),
                    url: getValue(e, 'url'),
                });
            case SharerKey.Reddit:
                return createSharerConfig(key, e, 'https://www.reddit.com/submit', {
                    url: getValue(e, 'url'),
                    title: getValue(e, 'text'),
                });
            default:
                throw new Error(`Unrecognized SharerKey: ${key}`);
        }
    }

    (function (window, document) {
        class socialShare {
            static init() {
                const elements = document.querySelectorAll('[data-share-to]');
                elements.forEach(elem => {
                    elem.addEventListener('click', socialShare.add);
                });
            }
            static add(event) {
                const target = event.currentTarget;
                const sharerConfig = getConfiguration(target);
                const sharer = new Sharer(sharerConfig);
                sharer.openShareWindow();
            }
        }
        if (document.readyState === 'complete' || document.readyState !== 'loading') {
            socialShare.init();
        }
        else {
            document.addEventListener('DOMContentLoaded', socialShare.init);
        }
        window.socialShare = socialShare;
    })(window, document);

})();
