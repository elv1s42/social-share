import { SharerConfig } from './models/sharerConfig';
import { getConfiguration } from './models/sharerConfigs';
import { getValue } from './models/utils';

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

    private share(): void {
      const sharerConfig = getConfiguration(this.elem);
      this.openShareWindow(sharerConfig);
    }

    private openShareWindow(config: SharerConfig): void {
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
        } else {
          window.location.href = config.shareUrl;
        }
      } else {
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
  } else {
    document.addEventListener('DOMContentLoaded', socialShare.init);
  }

  (window as any).socialShare = socialShare;

})(window, document);
