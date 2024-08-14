(function () {
    'use strict';

    class Sharer {
        constructor(config) {
            this.config = config;
        }
        openShareWindow() {
            const params = this.config.params || {};
            const keys = Object.keys(params);
            let str = keys.length > 0 ? '?' : '';
            keys.forEach((key, index) => {
                if (index > 0) {
                    str += '&';
                }
                if (params[key]) {
                    str += `${key}=${encodeURIComponent(String(params[key]))}`;
                }
            });
            this.config.baseShareUrl += str;
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
        constructor(shareUrl, params, width, height, isLink, isBlank) {
            this.baseShareUrl = shareUrl;
            this.params = params;
            this.width = width;
            this.height = height;
            this.isLink = isLink;
            this.isBlank = isBlank;
        }
        getFullShareUrl() {
            const p = this.params || {};
            const keys = Object.keys(p);
            let str = keys.length > 0 ? '?' : '';
            keys.forEach((key, index) => {
                if (index > 0) {
                    str += '&';
                }
                if (p[key]) {
                    str += `${key}=${encodeURIComponent(String(p[key]))}`;
                }
            });
            return this.baseShareUrl + str;
        }
    }

    function getValue(elem, attr) {
        let val = elem.getAttribute(`data-${attr}`);
        if (val && attr === 'hashtag' && !val.startsWith('#')) {
            val = `#${val}`;
        }
        return val !== null ? val : '';
    }

    function getConfiguration(e) {
        const sharerKey = getValue(e, 'share-to').toLowerCase();
        const sharerConfigFn = SharerConfigs[sharerKey];
        return sharerConfigFn(e);
    }
    function createSharerConfig(e, shareUrl, params) {
        return new SharerConfig(shareUrl, params, parseInt(e.getAttribute('data-width') || '600'), parseInt(e.getAttribute('data-height') || '480'), e.getAttribute('data-link') === 'true', e.getAttribute('data-blank') === 'true');
    }
    const SharerConfigs = {
        [SharerKey.Facebook]: (e) => createSharerConfig(e, 'https://www.facebook.com/sharer/sharer.php', {
            u: getValue(e, 'url'),
            hashtag: getValue(e, 'hashtag'),
            quote: getValue(e, 'text'),
        }),
        [SharerKey.LinkedIn]: (e) => createSharerConfig(e, 'https://www.linkedin.com/shareArticle', {
            url: getValue(e, 'url'),
        }),
        [SharerKey.X]: (e) => createSharerConfig(e, 'https://x.com/intent/tweet', {
            text: getValue(e, 'text'),
            url: getValue(e, 'url'),
            hashtags: getValue(e, 'hashtags'),
            via: getValue(e, 'via'),
            related: getValue(e, 'related'),
            in_reply_to: getValue(e, 'in_reply_to'),
        }),
        [SharerKey.Threads]: (e) => createSharerConfig(e, 'https://threads.net/intent/post', {
            text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
        }),
        [SharerKey.Email]: (e) => createSharerConfig(e, 'mailto:' + getValue(e, 'to'), {
            subject: getValue(e, 'title'),
            body: getValue(e, 'text') + '\n' + getValue(e, 'url'),
        }),
        [SharerKey.WhatsApp]: (e) => createSharerConfig(e, getValue(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/', {
            phone: getValue(e, 'to'),
            text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
        }),
        [SharerKey.Telegram]: (e) => createSharerConfig(e, 'https://t.me/share', {
            text: getValue(e, 'text'),
            url: getValue(e, 'url'),
        }),
        [SharerKey.Reddit]: (e) => createSharerConfig(e, 'https://www.reddit.com/submit', {
            url: getValue(e, 'url'),
            title: getValue(e, 'text'),
        }),
    };

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
