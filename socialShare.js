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

    function getAttrValueAsStr(elem, attr) {
        let val = elem.getAttribute(`data-${attr}`);
        // handle hashtag by adding '#' if it doesn't start with it
        if (attr === 'hashtag' && val && !val.startsWith('#')) {
            val = `#${val}`;
        }
        // fallback to current URL if the 'url' attribute is missing
        if (attr === 'url' && !val) {
            val = window.location.href;
        }
        // handle empty or missing values for 'title', 'subject', or 'text'
        if ((attr === 'title' || attr === 'subject' || attr === 'text') && (!val || val.trim() === '')) {
            const h1 = document.querySelector('h1');
            const h2 = document.querySelector('h2');
            const h3 = document.querySelector('h3');
            val = (h1 === null || h1 === void 0 ? void 0 : h1.textContent) || (h2 === null || h2 === void 0 ? void 0 : h2.textContent) || (h3 === null || h3 === void 0 ? void 0 : h3.textContent) || '';
        }
        return val !== null ? val : '';
    }

    function getConfiguration(e) {
        const sharerKeyString = getAttrValueAsStr(e, 'share-to').toLowerCase();
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
                    u: getAttrValueAsStr(e, 'url'),
                    hashtag: getAttrValueAsStr(e, 'hashtag'),
                    quote: getAttrValueAsStr(e, 'text'),
                });
            case SharerKey.LinkedIn:
                return createSharerConfig(key, e, 'https://www.linkedin.com/shareArticle', {
                    url: getAttrValueAsStr(e, 'url'),
                });
            case SharerKey.X:
                return createSharerConfig(key, e, 'https://x.com/intent/tweet', {
                    text: getAttrValueAsStr(e, 'text'),
                    url: getAttrValueAsStr(e, 'url'),
                    hashtags: getAttrValueAsStr(e, 'hashtags'),
                    via: getAttrValueAsStr(e, 'via'),
                    related: getAttrValueAsStr(e, 'related'),
                    in_reply_to: getAttrValueAsStr(e, 'in_reply_to'),
                });
            case SharerKey.Threads:
                return createSharerConfig(key, e, 'https://threads.net/intent/post', {
                    text: getAttrValueAsStr(e, 'text') + ' ' + getAttrValueAsStr(e, 'url'),
                });
            case SharerKey.Email:
                return createSharerConfig(key, e, 'mailto:' + getAttrValueAsStr(e, 'to'), {
                    subject: getAttrValueAsStr(e, 'title'),
                    body: getAttrValueAsStr(e, 'text') + '\n' + getAttrValueAsStr(e, 'url'),
                });
            case SharerKey.WhatsApp:
                return createSharerConfig(key, e, getAttrValueAsStr(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/', {
                    phone: getAttrValueAsStr(e, 'to'),
                    text: getAttrValueAsStr(e, 'text') + ' ' + getAttrValueAsStr(e, 'url'),
                });
            case SharerKey.Telegram:
                return createSharerConfig(key, e, 'https://t.me/share', {
                    text: getAttrValueAsStr(e, 'text'),
                    url: getAttrValueAsStr(e, 'url'),
                });
            case SharerKey.Reddit:
                return createSharerConfig(key, e, 'https://www.reddit.com/submit', {
                    url: getAttrValueAsStr(e, 'url'),
                    title: getAttrValueAsStr(e, 'text'),
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
