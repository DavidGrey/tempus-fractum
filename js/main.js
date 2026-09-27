import { config } from './config.js';
import { content } from './data/index.js';
import { Game } from './engine/game.js';
import { validateContent } from './engine/validate.js';
import { createApp } from './ui/app.js';

const problems = validateContent(content);
for (const problem of problems) console.warn('[content]', problem);

const game = new Game(content, { startScene: config.startScene });
createApp(game, { config, problems });
