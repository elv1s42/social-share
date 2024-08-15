export function getAttrValueAsStr(elem: Element, attr: string): string {
  let val = elem.getAttribute(`data-${attr}`);

  // handle hashtag by adding '#' if it doesn't start with it
  if (attr === 'hashtag' && val && !val.startsWith('#')) {
    val = `#${val}`;
  }

  // fallback to current URL if the 'url' attribute is missing
  if (attr === 'url' && !val) {
    val = window.location.href;
  }

  // handle empty or missing values for 'title', 'subject', or 'text'
  if ((attr === 'title' || attr === 'subject' || attr === 'text') && (!val || val.trim() === '')) {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    const h3 = document.querySelector('h3');

    val = h1?.textContent || h2?.textContent || h3?.textContent || '';
  }

  return val !== null ? val : '';
}