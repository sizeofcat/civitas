/**
 * Warrior class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_WARRIOR = 1;

/**
 * Mage class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_MAGE = 2;

/**
 * Druid class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_DRUID = 3;

/**
 * Priest class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_PRIEST = 4;

/**
 * Rogue class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_ROGUE = 5;

/**
 * Shaman class
 *
 * @constant
 * @default
 * @type {Number}
 */
game.HERO_CLASS_SHAMAN = 6;

/**
 * List of names for hero classes
 *
 * @constant
 * @default
 * @type {Array}
 */
game.HERO_CLASS_LIST = [
	'',
	'Warrior',
	'Mage',
	'Druid',
	'Priest',
	'Rogue',
	'Shaman'
];

/**
 * List of in-game heroes.
 *
 * @constant
 * @type {Object}
 */
game.HEROES = [
	{
		name: 'Achilles',
		handle: 'achilles',
		description: 'Achilles is a Greek hero of the Trojan War and the central ' +
			'character and greatest warrior of Homer`s Iliad. His mother is ' +
			'the immortal nymph Thetis, and his father, the mortal Peleus, is ' +
			'the king of the Myrmidons.',
		price: 5000000,
		link: 'https://en.wikipedia.org/wiki/Achilles',
		stats: {
			strength: 10,
			stamina: 10,
			agility: 10,
			spirit: 5,
			intellect: 7
		},
		class: game.HERO_CLASS_WARRIOR,
		items: [
			game.ITEM_TROJAN_BASTARD_SWORD
		],
		backpack: [
		]
	}, {
		name: 'Hector',
		handle: 'hector',
		description: 'In Greek mythology and Roman Mythology, Hector is a Trojan ' +
			'prince and the greatest fighter for Troy in the Trojan War. As the ' +
			'first-born son of King Priam and Queen Hecuba, who was a descendant ' +
			'of Dardanus and Tros, the founder of Troy, he is a prince of the royal ' +
			'house and the heir apparent to his father`s throne.',
		price: 4000000,
		link: 'https://en.wikipedia.org/wiki/Hector',
		stats: {
			strength: 8,
			stamina: 10,
			agility: 6,
			spirit: 4,
			intellect: 6
		},
		class: game.HERO_CLASS_WARRIOR,
		items: [
			game.ITEM_EXCALIBUR,
			game.ITEM_GOLDEN_KATANA
		],
		backpack: [
		]
	}, {
		name: 'Hannibal',
		handle: 'hannibal',
		description: 'Hannibal Barca is a Carthaginian general, considered one ' +
			'of the greatest military commanders in history.',
		price: 3000000,
		link: 'https://en.wikipedia.org/wiki/Hannibal',
		stats: {
			strength: 7,
			stamina: 7,
			agility: 4,
			spirit: 2,
			intellect: 9
		},
		class: game.HERO_CLASS_WARRIOR,
		items: [
		],
		backpack: [
		]
	}, {
		name: 'Heracles',
		handle: 'heracles',
		description: 'Heracles is a divine hero in Greek mythology, the son of Zeus ' +
			'and Alcmene, foster son of Amphitryon and great-grandson and half-brother ' +
			'(as they are both sired by the god Zeus) of Perseus.<br /><br />He is ' +
			'the greatest of the Greek heroes, a paragon of masculinity, the ancestor ' +
			'of royal clans who claim to be Heracleidae, and a champion of the ' +
			'Olympian order against chthonic monsters.',
		price: 5000000,
		link: 'https://en.wikipedia.org/wiki/Heracles',
		stats: {
			strength: 9,
			stamina: 9,
			agility: 6,
			spirit: 7,
			intellect: 9
		},
		class: game.HERO_CLASS_WARRIOR,
		items: [
			game.ITEM_SPEAR_OF_DESTINY,
			game.ITEM_CROWN_OF_KINGS,
			game.ITEM_BULWARK_OF_GODS,
			game.ITEM_CHESTPIECE_OF_ZEUS,
			game.ITEM_ARCHAIC_WAIST_BAND,
			game.ITEM_ALCMENE_BAND,
			game.ITEM_SUN_NECKLACE,
			game.ITEM_ETHEREAL_BOOTS,
			game.ITEM_SHOULDERPADS_OF_VALOR,
			game.ITEM_MOUNTAIN_TROLLS,
			game.ITEM_GAUNTLETS_OF_GHASTLY_GLARE
		],
		backpack: [
		]
	}, {
		name: 'Akhenaten',
		handle: 'akhenaten',
		description: 'Akhenaten, known before the fifth year of his reign as ' +
			'Amenhotep IV (sometimes given its Greek form, Amenophis IV, and meaning ' +
			'"Amun Is Satisfied"), is an Ancient Egyptian pharaoh of the 18th ' +
			'Dynasty who ruled for 17 years.',
		price: 1000000,
		link: 'https://en.wikipedia.org/wiki/Akhenaten',
		stats: {
			strength: 4,
			stamina: 4,
			agility: 8,
			spirit: 9,
			intellect: 9
		},
		class: game.HERO_CLASS_PRIEST,
		items: [
			game.ITEM_ANKH_OF_RA,
			game.ITEM_TUTANKHAMUN_KOPESH,
			game.ITEM_WEAPON_BUCKLER_SMALL,
			game.ITEM_SAND_SLIPPERS,
			game.ITEM_BAND_IT,
			game.ITEM_VALORANT_SHOULDERPADS
		],
		backpack: [
		]
	}
];
