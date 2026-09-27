/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  ENCOUNTER DATA FORMAT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  This file has no runtime code. It documents the shape of the story data
 *  so you can write new encounters without touching the engine. Scene files
 *  start with   / ** @type {import('../schema.js').Scene} * /   which makes
 *  editors like VS Code autocomplete these fields and flag typos.
 *
 *  The big picture
 *  ───────────────
 *  A SCENE is one location or encounter (the farmer, the city gate…).
 *  A scene contains NODES. A node is one "beat": someone says a line, you
 *  read some narration, and then you pick a response. Each CHOICE points to
 *  the next node, to another scene, or to a node with an ENDING.
 *
 *      scene "farmer"
 *        node "arrive"   Farmer: "Salve! Quis es?"
 *          choice  say "Canis sum."  → node "dog"
 *          choice  say "Salve!"      → node "greeted"
 *        node "dog"      Farmer: "Bonus canis! Ecce, os!"  (+ bone item)
 *          next → "dog_2"            (a single Continue button)
 *
 *  Adding a new encounter
 *  ──────────────────────
 *   1. Copy scenes/_template.js to e.g. scenes/03-city-gate.js
 *   2. Register it in scenes/index.js
 *   3. Add any new characters (characters.js) and items (items.js)
 *   4. Point a choice at it:  next: { scene: 'city-gate' }
 *   5. Reload with ?debug in the URL. The panel lists broken links and typos.
 *      Jump straight to a scene with ?scene=city-gate&node=start
 *
 *  Referring to nodes
 *  ──────────────────
 *   next: 'some_node'                        a node in the same scene
 *   next: { scene: 'city-gate' }             another scene's start node
 *   next: { scene: 'city-gate', node: 'x' }  a specific node in another scene
 *   visited: 'farmer.arrive'                 conditions use 'sceneId.nodeId'
 */

/**
 * @typedef {Object} Scene
 * @property {string} id            Unique id; must match its key in scenes/index.js.
 * @property {string} [chapter]     Chapter id from chapters.js (shown in the top bar).
 * @property {string} [background]  Background art, e.g. 'assets/backgrounds/forum.webp'.
 * @property {string} [character]   Character id standing on stage for the whole scene.
 * @property {Prop[]} [props]       Objects drawn over the background (e.g. the time machine).
 * @property {string} start         Id of the first node.
 * @property {Effects} [onEnter]    Effects applied whenever the scene begins.
 * @property {boolean} [checkpoint=true]  "Try again" after a failure ending restarts here.
 * @property {Patience[]} [patience]  Patience meters for this scene's characters (see below).
 * @property {Object<string, Node>} nodes
 */

/**
 * @typedef {Object} Prop
 * @property {string} id            Used by a node's `highlight` to make the prop glow.
 * @property {string} image         e.g. 'assets/objects/time-machine-broken.webp'
 * @property {string} [label]       Shown on the placeholder until art exists.
 * @property {{left?: string, right?: string, bottom?: string, top?: string, width?: string}} position
 *                                  CSS positions as percentages of the background painting
 *                                  (so the prop stays on the same spot on any screen shape).
 * @property {Condition} [if]       Only draw the prop when this holds.
 */

/**
 * One beat of an encounter. Every field is optional except that a node needs
 * a way forward: `choices`, `choicesFrom`, `next`, or `ending`.
 *
 * @typedef {Object} Node
 * @property {string} [speaker]      Character id who speaks `latin`. Omit for pure narration.
 * @property {string|string[]} [narration]  English narration; an array makes paragraphs.
 * @property {string} [latin]        The Latin line, shown large.
 * @property {'inscription'} [latinStyle]  Show the Latin as carved stone (signs, milestones).
 * @property {string} [translation]  English meaning, hidden behind the Hint button.
 * @property {Array<[string, string]>} [vocab]  Word glosses shown with the hint: [['quis', 'who?']].
 *
 * @property {string|null} [character]  Override the scene's on-stage character; null hides it.
 * @property {string} [pose]         Key into the character's `images` (e.g. 'pointing').
 * @property {string} [background]   Override the scene background for this node.
 * @property {string|string[]} [highlight]  Prop id(s) to make glow.
 *
 * @property {Effects} [onEnter]     Effects applied every time this node is entered.
 * @property {Condition} [skipIf]    When this holds on entry, the node is skipped entirely
 *                                   (no text, no effects) and the game goes straight to
 *                                   `next`. Useful for steps that only apply sometimes,
 *                                   e.g. { lacksItems: 'bone' }.
 *
 * @property {Choice[]} [choices]    The player's responses.
 * @property {string} [choicesFrom]  Reuse another node's choices (in the same scene).
 *                                   Handy for "the NPC asks again" loops.
 * @property {Target} [next]         With no available choices, show a single Continue button.
 * @property {string} [continueText] Label for that button (default "Continue").
 * @property {Ending} [ending]       Entering this node ends the game or chapter.
 *
 * @property {Variant[]} [variants]  Alternate versions of this node. When the node is
 *                                   entered, the FIRST variant whose `if` holds is merged
 *                                   over the node's fields (fields it doesn't list stay).
 */

/**
 * @typedef {Partial<Node> & {if: Condition}} Variant
 */

/**
 * A response the player can pick. Give it EITHER `say` (Latin the player speaks,
 * shown in quotes and echoed back as "You: …") OR `action` (English, something
 * the player does).
 *
 * @typedef {Object} Choice
 * @property {string} [say]
 * @property {string} [meaning]    English for a `say` line; shown in the game-over review when it was a wrong answer.
 * @property {{latin?: string, translation?: string, vocab?: Array<[string, string]>}} [review]
 *   What the game-over review shows for this mistake, instead of the current node's line.
 *   Useful for a bad `action` (e.g. cutting the line) whose lesson comes on the next node.
 * @property {string} [action]
 * @property {Target} next           Where the choice leads.
 * @property {Condition} [if]        Only offer the choice when this holds.
 * @property {boolean} [once]        Hide the choice after it has been picked once.
 * @property {Effects} [effects]     Applied when picked (before moving on).
 * @property {string} [strike]       A bad answer: uses up one strike of that patience meter
 *                                   (e.g. 'guard') and is added to the review list. When the
 *                                   meter runs out, the game goes to the meter's `fail` target
 *                                   instead of this choice's `next`.
 * @property {string} [id]           Stable id for `once` tracking (defaults to the text).
 */

/**
 * @typedef {string | {scene: string, node?: string}} Target
 */

/**
 * Changes to the game state. All keys are optional; single values or arrays both work.
 *
 * @typedef {Object} Effects
 * @property {string|string[]} [addItems]      Item ids from items.js.
 * @property {string|string[]} [removeItems]
 * @property {string|string[]|Object<string, any>} [setFlags]  'a', ['a','b'], or { a: true }
 * @property {string|string[]} [clearFlags]
 * @property {Object<string, number>} [trust]  Change per NPC: { farmer: 1 } or { guard: -2 }
 * @property {number} [reputation]             Change general reputation.
 * @property {string|string[]} [helped]        Mark NPCs as helped by the player.
 * @property {string|string[]} [grantAuthorizations]  Letters, seals, passes: 'senator-letter'
 * @property {Object<string, any>} [recordChoice]    Remember an important answer:
 *                                                   { introducedAs: 'dog' }
 */

/**
 * A test on the game state. Every key listed must hold (they are ANDed).
 *
 * @typedef {Object} Condition
 * @property {string|string[]} [hasItems]
 * @property {string|string[]} [lacksItems]
 * @property {string|string[]} [flags]          All of these flags are set.
 * @property {string|string[]} [notFlags]       None of these flags are set.
 * @property {Object<string, number>} [minTrust]  { farmer: 3 }
 * @property {Object<string, number>} [maxTrust]
 * @property {number} [minReputation]
 * @property {number} [maxReputation]
 * @property {string|string[]} [helped]
 * @property {string|string[]} [authorizations]
 * @property {Object<string, any>} [choice]     Matches recordChoice: { introducedAs: 'roman' }
 * @property {string|string[]} [visited]        'sceneId.nodeId'
 * @property {string|string[]} [notVisited]
 * @property {Condition[]} [all]
 * @property {Condition[]} [any]                At least one holds.
 * @property {Condition} [not]
 */

/**
 * A patience meter, shown as seals beside the speaker's name. Strikes reset at the
 * start of each chapter.
 *
 * @typedef {Object} Patience
 * @property {string} npc            Meter id used by choices' `strike`, e.g. 'guard'.
 * @property {number} max            How many bad answers before patience runs out.
 * @property {Target} fail           Where to go when it runs out (an arrest, the lions…).
 * @property {string[]} [speakers]   Characters who show this meter (default: [npc]).
 */

/**
 * @typedef {Object} Ending
 * @property {string} id
 * @property {'failure'|'comic'|'success'|'chapter'|'defeat'} type
 *           failure/comic offer "Try again" from the scene's checkpoint.
 *           defeat is "game over for today": no retry; the card lists the Latin to review,
 *           and "Perge" on the title screen restarts that chapter next class.
 * @property {boolean} [final]       A story-ending comic ending: offer "Play again", not "Try again".
 * @property {string} title          Latin title, e.g. 'Perditus!'
 * @property {string} [subtitle]     English, e.g. 'Lost!'
 * @property {string|string[]} text
 * @property {string} [teaser]       Small line at the bottom ("Coming soon: …").
 * @property {Target} [next]         Chapter endings only: show a "Perge" button that
 *                                   continues into the next chapter, e.g. { scene: 'city-gate' }.
 */

export {};
