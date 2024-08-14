import { SharerConfig } from "./sharerConfig";

export class Sharer {
  config: SharerConfig

  constructor(config: SharerConfig) {
    this.config = config;
  }

  openShareWindow(): void {
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

    const url = this.config.getFullShareUrl()

    if (this.config.isLink) {
      if (this.config.isBlank) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    } else {
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