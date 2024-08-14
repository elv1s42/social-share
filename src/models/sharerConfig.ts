export class SharerConfig {
  baseShareUrl: string;
  params: Record<string, string | boolean | number>;
  width: number;
  height: number;
  isLink: boolean;
  isBlank: boolean;

  constructor(
    shareUrl: string,
    params: Record<string, string | boolean | number>,
    width: number,
    height: number,
    isLink: boolean,
    isBlank: boolean) {
    this.baseShareUrl = shareUrl;
    this.params = params;
    this.width = width;
    this.height = height;
    this.isLink = isLink;
    this.isBlank = isBlank;
  }

  getFullShareUrl(): string {
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