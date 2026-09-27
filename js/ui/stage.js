// The painted scene: background, props (e.g. the time machine), and the NPC.

import { setBackground, imageOrPlaceholder } from './images.js';

export function createStage(root) {
  const bg = root.querySelector('.stage__bg');
  const propsLayer = root.querySelector('.stage__props');
  const characterLayer = root.querySelector('.stage__character');

  let lastBackground;
  let lastPropsKey;
  let lastCharacterKey = '';
  const propNodes = new Map();

  function renderProps(props) {
    const key = props.map((p) => `${p.id}:${p.image}`).join('|');
    if (key !== lastPropsKey) {
      lastPropsKey = key;
      propNodes.clear();
      propsLayer.replaceChildren(
        ...props.map((p) => {
          const node = imageOrPlaceholder(p.image, { alt: p.label, label: p.label, className: 'prop' });
          Object.assign(node.style, p.position);
          propNodes.set(p.id, node);
          return node;
        }),
      );
    }
    for (const p of props) propNodes.get(p.id)?.classList.toggle('is-highlighted', p.highlighted);
  }

  function renderCharacter(character) {
    const key = character ? `${character.id}:${character.image}` : '';
    if (key === lastCharacterKey) return;
    const previousId = lastCharacterKey.split(':')[0];
    lastCharacterKey = key;

    if (!character) {
      characterLayer.replaceChildren();
      return;
    }
    const node = imageOrPlaceholder(character.image, {
      alt: character.name,
      label: `${character.name} (${character.role})`,
      className: 'character',
    });
    // Only animate the entrance when a new character arrives, not on a pose change.
    if (character.id !== previousId) node.classList.add('is-arriving');
    characterLayer.replaceChildren(node);
  }

  return {
    render(view) {
      if (view.background !== lastBackground) {
        lastBackground = view.background;
        setBackground(bg, view.background);
      }
      renderProps(view.props);
      renderCharacter(view.character);
    },
  };
}
