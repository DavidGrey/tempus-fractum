// Authoring panel, enabled with ?debug in the URL (toggle with the ` key).
// Shows the current node, state, and any content problems found at load.

export function createDebug(root, { enabled, problems }) {
  if (!enabled) return { render() {}, toggle() {} };
  root.hidden = false;

  return {
    render(view, state) {
      const lines = [];
      if (problems.length) lines.push('⚠ CONTENT PROBLEMS', ...problems.map((p) => `• ${p}`), '');
      lines.push(`node: ${view.sceneId}.${view.nodeId}  (variant ${state.variant})`);
      const { inventory, flags, trust, reputation, helped, authorizations, choices } = state;
      lines.push(JSON.stringify({ inventory, flags, trust, reputation, helped, authorizations, choices }, null, 2));
      root.textContent = lines.join('\n');
    },
    toggle() {
      root.hidden = !root.hidden;
    },
  };
}
