import { SharerConfig } from "./sharerConfig";
import { SharerKey } from "./sharerKey";
import { getAttrValueAsStr } from './utils';

export function getConfiguration(e: Element): SharerConfig {
  const sharerKeyString = getAttrValueAsStr(e, 'share-to').toLowerCase();
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
        u: getAttrValueAsStr(e, 'url'),
        hashtag: getAttrValueAsStr(e, 'hashtag'),
        quote: getAttrValueAsStr(e, 'text'),
      });
      
    case SharerKey.LinkedIn:
      return createSharerConfig(key, e, 'https://www.linkedin.com/shareArticle', {
        url: getAttrValueAsStr(e, 'url'),
      });

    case SharerKey.X:
      return createSharerConfig(key, e, 'https://x.com/intent/tweet', {
        text: getAttrValueAsStr(e, 'text'),
        url: getAttrValueAsStr(e, 'url'),
        hashtags: getAttrValueAsStr(e, 'hashtags'),
        via: getAttrValueAsStr(e, 'via'),
        related: getAttrValueAsStr(e, 'related'),
        in_reply_to: getAttrValueAsStr(e, 'in_reply_to'),
      });

    case SharerKey.Threads:
      return createSharerConfig(key, e, 'https://threads.net/intent/post', {
        text: getAttrValueAsStr(e, 'text') + ' ' + getAttrValueAsStr(e, 'url'),
      });

    case SharerKey.Email:
      return createSharerConfig(key, e, 'mailto:' + getAttrValueAsStr(e, 'to'), {
        subject: getAttrValueAsStr(e, 'title'),
        body: getAttrValueAsStr(e, 'text') + '\n' + getAttrValueAsStr(e, 'url'),
      });

    case SharerKey.WhatsApp:
      return createSharerConfig(key, e,
        getAttrValueAsStr(e, 'web') === 'true' ? 'https://web.whatsapp.com/send' : 'https://wa.me/',
        {
          phone: getAttrValueAsStr(e, 'to'),
          text: getAttrValueAsStr(e, 'text') + ' ' + getAttrValueAsStr(e, 'url'),
        }
      );

    case SharerKey.Telegram:
      return createSharerConfig(key, e, 'https://t.me/share', {
        text: getAttrValueAsStr(e, 'text'),
        url: getAttrValueAsStr(e, 'url'),
      });

    case SharerKey.Reddit:
      return createSharerConfig(key, e, 'https://www.reddit.com/submit', {
        url: getAttrValueAsStr(e, 'url'),
        title: getAttrValueAsStr(e, 'text'),
      });

    default:
      throw new Error(`Unrecognized SharerKey: ${key}`);
  }
}
