export interface SharerConfig {
  shareUrl: string;
  params?: Record<string, string | boolean | number>;
  width?: string;
  height?: string;
}