import { SharerConfig } from "./sharerConfig";
import { SharerKey } from "./sharerKey";
import { getValue } from './utils';

export function getConfiguration(e: Element): SharerConfig {
  const sharerKeyString = getValue(e, 'share-to').toLowerCase();
  const sharerKey = Object.values(SharerKey).includes(sharerKeyString as SharerKey) ? (sharerKeyString as SharerKey) : undefined;
  const sharer = getSharerConfig(e, sharerKey);
  return sharer;
}

function createSharerConfig(
  key: SharerKey,
  e: Element,
  shareUrl: string,
  params: Record<string, string>
): SharerConfig {
  return new SharerConfig(
    key,
    shareUrl,
    params,
    parseInt(e.getAttribute('data-width') || '600'),
    parseInt(e.getAttribute('data-height') || '480'),
    e.getAttribute('data-link') === 'true',
    e.getAttribute('data-blank') === 'true',
  );
}

function getSharerConfig(e: Element, key: SharerKey): SharerConfig {
  switch (key) {
    case SharerKey.Facebook:
      return createSharerConfig(key, e, 'https://www.facebook.com/sharer/sharer.php', {
        u: getValue(e, 'url'),
        hashtag: getValue(e, 'hashtag'),
        quote: getValue(e, 'text'),
      });
      
    case SharerKey.LinkedIn:
      return createSharerConfig(key, e, 'https://www.linkedin.com/shareArticle', {
        url: getValue(e, 'url'),
      });

    case SharerKey.X:
      return createSharerConfig(key, e, 'https://x.com/intent/tweet', {
        text: getValue(e, 'text'),
        url: getValue(e, 'url'),
        hashtags: getValue(e, 'hashtags'),
        via: getValue(e, 'via'),
        related: getValue(e, 'related'),
        in_reply_to: getValue(e, 'in_reply_to'),
      });

    case SharerKey.Threads:
      return createSharerConfig(key, e, 'https://threads.net/intent/post', {
        text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
      });

    case SharerKey.Email:
      return createSharerConfig(key, e, 'mailto:' + getValue(e, 'to'), {
        subject: getValue(e, 'title'),
        body: getValue(e, 'text') + '\n' + getValue(e, 'url'),
      });

    case SharerKey.WhatsApp:
      return createSharerConfig(key, e,
        getValue(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/',
        {
          phone: getValue(e, 'to'),
          text: getValue(e, 'text') + ' ' + getValue(e, 'url'),
        }
      );

    case SharerKey.Telegram:
      return createSharerConfig(key, e, 'https://t.me/share', {
        text: getValue(e, 'text'),
        url: getValue(e, 'url'),
      });

    case SharerKey.Reddit:
      return createSharerConfig(key, e, 'https://www.reddit.com/submit', {
        url: getValue(e, 'url'),
        title: getValue(e, 'text'),
      });

    default:
      throw new Error(`Unrecognized SharerKey: ${key}`);
  }
}
