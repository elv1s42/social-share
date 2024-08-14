import { SharerConfig } from "./sharerConfig";
import { getValue } from './utils';

export function getConfiguration(e: Element): SharerConfig {
  const sharerKey = getValue(e, 'share-to').toLowerCase();
  const sharerConfigFn = SharerConfigs[sharerKey];
  return sharerConfigFn(e);
}

function createSharerConfig(
  e: Element,
  shareUrl: string,
  params: Record<string, string>
): SharerConfig {
  return new SharerConfig(
    shareUrl,
    params,
    parseInt(e.getAttribute('data-width') || '600'),
    parseInt(e.getAttribute('data-height') || '480'),
    e.getAttribute('data-link') === 'true',
    e.getAttribute('data-blank') === 'true',
  );
}

export const SharerConfigs: Record<string, (e: Element) => SharerConfig> = {
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
  [SharerKey.WhatsApp]: (e) => createSharerConfig(
    e,
    getValue(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/',
    {
      phone: getValue(e, 'to'),
      text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
    }
  ),
  [SharerKey.Telegram]: (e) => createSharerConfig(e, 'https://t.me/share', {
    text: getValue(e, 'text'),
    url: getValue(e, 'url'),
  }),
  [SharerKey.Reddit]: (e) => createSharerConfig(e, 'https://www.reddit.com/submit', {
    url: getValue(e, 'url'),
    title: getValue(e, 'text'),
  }),
};