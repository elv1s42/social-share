export function getValue(elem: Element, attr: string): string {
  let val = elem.getAttribute(`data-${attr}`);
  if (val && attr === 'hashtag' && !val.startsWith('#')) {
    val = `#${val}`;
  }
  return val !== null ? val : '';
}