(function () {
    'use strict';

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
        return {
            shareUrl,
            params,
            width: parseInt(e.getAttribute('data-width') || '600'),
            height: parseInt(e.getAttribute('data-height') || '480'),
            isLink: e.getAttribute('data-link') === 'true',
            isBlank: e.getAttribute('data-blank') === 'true',
        };
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
            constructor(elem) {
                this.elem = elem;
            }
            static init() {
                const elems = document.querySelectorAll('[data-share-to]');
                elems.forEach(elem => {
                    elem.addEventListener('click', socialShare.add);
                });
            }
            static add(event) {
                const target = event.currentTarget;
                const sharer = new socialShare(target);
                sharer.share();
            }
            share() {
                const sharerConfig = getConfiguration(this.elem);
                this.openShareWindow(sharerConfig);
            }
            openShareWindow(config) {
                const p = config.params || {};
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
                config.shareUrl += str;
                if (config.isLink) {
                    if (config.isBlank) {
                        window.open(config.shareUrl, '_blank');
                    }
                    else {
                        window.location.href = config.shareUrl;
                    }
                }
                else {
                    const left = window.innerWidth / 2 - config.width / 2 + window.screenX;
                    const top = window.innerHeight / 2 - config.height / 2 + window.screenY;
                    const popParams = `scrollbars=no, width=${config.width}, height=${config.height}, top=${top}, left=${left}`;
                    const newWindow = window.open(config.shareUrl, '', popParams);
                    if (window.focus && newWindow) {
                        newWindow.focus();
                    }
                }
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
