import { SharerConfig } from './models/sharerConfig';

(function (window: Window, document: Document) {
  'use strict';

  class socialShare {
    private elem: Element;

    constructor(elem: Element) {
      this.elem = elem;
    }

    static init(): void {
      const elems = document.querySelectorAll('[data-share-to]');
      elems.forEach(elem => {
        elem.addEventListener('click', socialShare.add);
      });
    }

    static add(event: Event): void {
      const target = event.currentTarget as Element;
      const sharer = new socialShare(target);
      sharer.share();
    }

    private getValue(attr: string): string {
      let val = this.elem.getAttribute(`data-${attr}`);
      if (val && attr === 'hashtag' && !val.startsWith('#')) {
        val = `#${val}`;
      }
      return val !== null ? val : '';
    }

    private share(): void {
      const sharer = this.getValue('share-to').toLowerCase();
      const sharers: Record<string, SharerConfig> = {
        fb: {
          shareUrl: 'https://www.facebook.com/sharer/sharer.php',
          params: {
            u: this.getValue('url'),
            hashtag: this.getValue('hashtag'),
            quote: this.getValue('text'),
          },
        },
        li: {
          shareUrl: 'https://www.linkedin.com/shareArticle',
          params: {
            url: this.getValue('url'),
          },
        },
        x: {
          shareUrl: 'https://x.com/intent/tweet',
          params: {
            text: this.getValue('text'),
            url: this.getValue('url'),
            hashtags: this.getValue('hashtags'),
            via: this.getValue('via'),
            related: this.getValue('related'),
            in_reply_to: this.getValue('in_reply_to'),
          },
        },
        th: {
          shareUrl: 'https://threads.net/intent/post',
          params: {
            text: this.getValue('text') + ' ' + this.getValue('url'),
          },
        },
        em: {
          shareUrl: 'mailto:' + this.getValue('to'),
          params: {
            subject: this.getValue('title'),
            body: this.getValue('text') + '\n' + this.getValue('url'),
          },
        },
        wa: {
          shareUrl: this.getValue('web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/',
          params: {
            phone: this.getValue('to'),
            text: this.getValue('text') + ' ' + this.getValue('url'),
          },
        },
        tg: {
          shareUrl: 'https://t.me/share',
          params: {
            text: this.getValue('text'),
            url: this.getValue('url'),
          },
        },
        re: {
          shareUrl: 'https://www.reddit.com/submit',
          params: { 
            url: this.getValue('url'),
            title: this.getValue('text') },
        },
      };

      const s = sharers[sharer];
      if (s !== undefined) {
        s.width = this.getValue('width');
        s.height = this.getValue('height');
        this.urlSharer(s);
      }
    }

    private urlSharer(sharer: SharerConfig): void {
      const p = sharer.params || {};
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

      sharer.shareUrl += str;

      const isLink = this.getValue('link') === 'true';
      const isBlank = this.getValue('blank') === 'true';

      if (isLink) {
        if (isBlank) {
          window.open(sharer.shareUrl, '_blank');
        } else {
          window.location.href = sharer.shareUrl;
        }
      } else {
        const popWidth = parseInt(sharer.width || '600');
        const popHeight = parseInt(sharer.height || '480');
        const left = window.innerWidth / 2 - popWidth / 2 + window.screenX;
        const top = window.innerHeight / 2 - popHeight / 2 + window.screenY;
        const popParams = `scrollbars=no, width=${popWidth}, height=${popHeight}, top=${top}, left=${left}`;
        const newWindow = window.open(sharer.shareUrl, '', popParams);

        if (window.focus && newWindow) {
          newWindow.focus();
        }
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState !== 'loading') {
    socialShare.init();
  } else {
    document.addEventListener('DOMContentLoaded', socialShare.init);
  }

  (window as any).socialShare = socialShare;

})(window, document);
