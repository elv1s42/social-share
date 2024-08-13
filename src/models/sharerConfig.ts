export interface SharerConfig {
  shareUrl: string;
  params?: Record<string, string | boolean | number>;
  width: number;
  height: number;
  isLink: boolean;
  isBlank: boolean;
}