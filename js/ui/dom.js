// Tiny DOM helpers shared by the UI modules.

/** el('button', { class: 'btn', onClick: fn }, 'Label', childNode) */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Collect every [data-ref] element under root into an object keyed by ref name. */
export function refs(root) {
  const out = {};
  for (const node of root.querySelectorAll('[data-ref]')) out[node.dataset.ref] = node;
  return out;
}

const NUMERALS = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export function toRoman(n) {
  let out = '';
  for (const [value, symbol] of NUMERALS) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

/** Restart a CSS entrance animation on an element. */
export function replayAnimation(node, className) {
  node.classList.remove(className);
  void node.offsetWidth; // force reflow so the animation restarts
  node.classList.add(className);
}
