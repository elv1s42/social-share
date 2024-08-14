import { Sharer } from "./models/sharer";
import { getConfiguration } from './models/sharerConfigs';

(function (window: Window, document: Document) {
  'use strict';

  class socialShare {

    static init(): void {
      const elements = document.querySelectorAll('[data-share-to]');
      elements.forEach(elem => {
        elem.addEventListener('click', socialShare.add);
      });
    }

    static add(event: Event): void {
      const target = event.currentTarget as Element;
      const sharerConfig = getConfiguration(target);
      const sharer = new Sharer(sharerConfig);
      sharer.openShareWindow();
    }
  }

  if (document.readyState === 'complete' || document.readyState !== 'loading') {
    socialShare.init();
  } else {
    document.addEventListener('DOMContentLoaded', socialShare.init);
  }

  (window as any).socialShare = socialShare;

})(window, document);
