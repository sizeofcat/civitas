/**
 * Autostart music or not.
 * 
 * @constant
 * @default
 * @type {Boolean}
 */
game.AUTOSTART_MUSIC = false;

/**
 * Enable encryption or not.
 * 
 * @constant
 * @default
 * @type {Boolean}
 */
game.ENCRYPTION = false;

/**
 * URL to the game assets
 * 
 * @constant
 * @default
 * @type {String}
 */
game.ASSETS_URL = './';

/**
 * How many real seconds has a game day.
 *
 * constant
 * @default
 * @type {Number}
 */
game.SECONDS_TO_DAY = 10;

/**
 * Number of city ruler avatars available to choose.
 * 
 * @constant
 * @default
 * @type {Number}
 */
game.AVATARS = 99;

/**
 * Application version.
 * 
 * @constant
 * @type {String}
 */
game.VERSION = '0.3.0.' +
	((new Date()).getMonth() + 1) + '' +
	(new Date()).getDate() + '' +
	(new Date()).getFullYear();

/**
 * Whether the application is in debug mode.
 * 
 * @default
 * @constant
 * @type {Boolean}
 */
game.DEBUG = true;

/**
 * Browser localStorage key to store game data into.
 *
 * @constant
 * @default
 * @type {String}
 */
game.STORAGE_KEY = 'civitas';

/**
 * Difficulty level of the game is easy.
 * 
 * @constant
 * @default
 * @type {Number}
 */
game.DIFFICULTY_EASY = 1;

/**
 * Difficulty level of the game is medium.
 * 
 * @constant
 * @default
 * @type {Number}
 */
game.DIFFICULTY_MEDIUM = 2;

/**
 * Difficulty level of the game is hard.
 * 
 * @constant
 * @default
 * @type {Number}
 */
game.DIFFICULTY_HARD = 3;

/**
 * Difficulty level of the game is hardcore.
 * 
 * @constant
 * @default
 * @type {Number}
 */
game.DIFFICULTY_HARDCORE = 4;

/**
 * When a building is notifying the player it's out of resources (the
 * building, not the player).
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFICATION_MISSING_RES = 1;

/**
 * When a building is notifying the player its production is paused
 * manually by the player.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFICATION_PAUSED = 2;

/**
 * When a building is notifying the player it is missing its requirements.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFICATION_MISSING_REQ = 3;

/**
 * When a building is notifying the player the level of the city is too low.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFICATION_SETTLEMENT_LOW_LEVEL = 4;

/**
 * Game type as single player (campaign, local).
 *
 * @constant
 * @default
 * @type {Number}
 */
game.MODE_SINGLEPLAYER = 1;

/**
 * Game type as multi player (sandbox, networked).
 *
 * @constant
 * @default
 * @type {Number}
 */
game.MODE_MULTIPLAYER = 2;

/**
 * Error notification
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_ERROR = 0;

/**
 * Achievement notification
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_ACHIEVEMENT = 1;

/**
 * Normal notification
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_NORMAL = 2;

/**
 * Event notification.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_EVENT = 3;

/**
 * Research notification.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_RESEARCH = 4;

/**
 * Religion notification.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_RELIGION = 5;

/**
 * War notification.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.NOTIFY_WAR = 6;

/**
 * Max numbers of lines to show in the console. Too many will overload the DOM.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.MAX_CONSOLE_LINES = 5000;
