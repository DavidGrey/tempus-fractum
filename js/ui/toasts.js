// Short pop-up messages like "Received: panis (bread)".

import { el } from './dom.js';

export function createToasts(root) {
  return {
    show(...parts) {
      const toast = el('div', { class: 'toast', role: 'status' }, ...parts);
      root.append(toast);
      setTimeout(() => toast.remove(), 3600);
    },
  };
}
