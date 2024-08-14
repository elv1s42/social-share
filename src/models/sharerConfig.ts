import { SharerKey } from "./sharerKey";

export class SharerConfig {
  baseShareUrl: string;
  params: Record<string, string | boolean | number>;
  width: number;
  height: number;
  isLink: boolean;
  isBlank: boolean;
  key: SharerKey;

  constructor(
    key: SharerKey,
    shareUrl: string,
    params: Record<string, string | boolean | number>,
    width: number,
    height: number,
    isLink: boolean,
    isBlank: boolean) {
    this.key = key;
    this.baseShareUrl = shareUrl;
    this.params = params || {};
    this.width = width;
    this.height = height;
    this.isLink = isLink;
    this.isBlank = isBlank;
  }

  getFullShareUrl(): string {
    const keys = Object.keys(this.params);
    let str = keys.length > 0 ? '?' : '';
    let ind = 0;
    keys.forEach((key) => {
      const val = encodeURIComponent(String(this.params[key]))
      if (val !== "") {
        str += `${ind > 0 ? '&' : ''}${key}=${val}`;
        ind++;
      }
    });
    const url = this.baseShareUrl + str;
    return url;
  }
}