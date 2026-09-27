// Register every scene here. Order doesn't matter; ids must be unique.
import awakening from './01-awakening.js';
import farmer from './02-farmer.js';
import cityGate from './03-city-gate.js';
import forum from './04-forum.js';
import forge from './05-forge.js';
import domusDoor from './06-domus-door.js';
import domusAtrium from './07-domus-atrium.js';
import domusGarden from './08-domus-garden.js';
import curia from './09-curia.js';
import palatium from './10-palatium.js';
import aula from './11-aula.js';
import finale from './12-finale.js';
import carcer from './13-carcer.js';
import arena from './14-arena.js';

const all = [awakening, farmer, cityGate, forum, forge, domusDoor, domusAtrium, domusGarden, curia, palatium, aula, finale, carcer, arena];

export const scenes = Object.fromEntries(all.map((scene) => [scene.id, scene]));
