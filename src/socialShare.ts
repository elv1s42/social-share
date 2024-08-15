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

    static share(elementOrSelector: string | Element): void {
      const target = typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

      if (target) {
        const sharerConfig = getConfiguration(target);
        const sharer = new Sharer(sharerConfig);
        sharer.openShareWindow();
      } else {
        console.warn('Element not found for selector:', elementOrSelector);
      }
    }
  }

  (window as any).socialShare = socialShare;

})(window, document);
