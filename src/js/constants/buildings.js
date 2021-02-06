/**
 * All the buildings for a city.
 * 
 * @constant
 * @type {Array}
 */
game.BUILDINGS_ALL = [
	'marketplace', 'lumberjack', 'barracks', 'warehouse', 'mill', 'castle',
	'stonequarry', 'claymine', 'ironmine', 'trapper', 'almondsfarm',
	'almondsfield', 'tavern', 'shipyard', 'pigfarm', 'cattlefarm',
	'pigfield', 'cattlefield', 'house1', 'house2', 'house3', 'house4',
	'house5', 'house6', 'house7', 'datesfarm', 'datesfield', 'house8',
	'house9', 'house10', 'house11', 'church', 'bakery', 'butcher',
	'grainfarm', 'grainfield', 'ironsmelter', 'tannery', 'furrier',
	'coppermine', 'goldmine', 'goldsmelter', 'coppersmelter', 'armory',
	'coffeefarm', 'coffeefield', 'cottonfarm', 'cottonfield', 'sugarfarm',
	'spicefarm', 'spicefield', 'sugarfield', 'silkfarm', 'silkfield',
	'coffeeroaster', 'quartzmine', 'grapesfarm', 'grapesfield', 'winery',
	'carpenter', 'pottery', 'jeweler', 'toolmaker', 'saltprocessor',
	'charcoalburnerhut', 'opticiansworkshop', 'papermill',
	'printingpress', 'redsmithsworkshop', 'ropeyard', 'glassworks',
	'provisions', 'silkweaver', 'gunpowdermill', 'goatfarm', 'goatfield',
	'coalmine', 'carpetmanufacturer', 'apiary', 'beehive', 'barrelcooperage',
	'brewery', 'candlemakersworkshop', 'indigofarm', 'indigofield',
	'sugarmill', 'rosenursery', 'rosefield', 'fisherman',
	'catapultworkshop', 'cannonfoundry', 'cosmetics', 'tradingpost',
	'clothingfactory', 'weaver', 'embassy',  'academy', 'marzipanworkshop',
	'brickworks', 'tobaccofarm', 'tobaccofield', 'cookhouse'
];

/**
 * Buildings' categories.
 * 
 * @constant
 * @type {Object}
 */
game.BUILDINGS_CATEGORIES = {
	'Municipal': [
		'academy',
		'church',
		'embassy',
		'marketplace',
		'shipyard',
		'tavern',
		'tradingpost',
		'warehouse'
	],
	'Housing': [
		'house1',
		'house2',
		'house3',
		'house4',
		'house5',
		'house6',
		'house7',
		'house8',
		'house9',
		'house10',
		'house11'
	],
	'Food': [
		'bakery',
		'butcher',
		'cookhouse',
		'fisherman',
		'mill'
	],
	'Mines': [
		'claymine',
		'coalmine',
		'coppermine',
		'goldmine',
		'ironmine',
		'quartzmine',
		'stonequarry'
	],
	'Farms': [
		'almondsfarm',
		'almondsfield',
		'apiary',
		'beehive',
		'cattlefarm',
		'cattlefield',
		'coffeefarm',
		'coffeefield',
		'cottonfarm',
		'cottonfield',
		'datesfarm',
		'datesfield',
		'goatfarm',
		'goatfield',
		'grainfarm',
		'grainfield',
		'grapesfarm',
		'grapesfield',
		'indigofarm',
		'indigofield',
		'pigfarm',
		'pigfield',
		'rosenursery',
		'rosefield',
		'silkfarm',
		'silkfield',
		'spicefarm',
		'spicefield',
		'sugarfarm',
		'sugarfield',
		'tobaccofarm',
		'tobaccofield'
	],
	'Industry': [
		'barrelcooperage',
		'brewery',
		'brickworks',
		'candlemakersworkshop',
		'carpenter',
		'charcoalburnerhut',
		'clothingfactory',
		'coppersmelter',
		'furrier',
		'glassworks',
		'goldsmelter',
		'gunpowdermill',
		'ironsmelter',
		'lumberjack',
		'pottery',
		'ropeyard',
		'saltprocessor',
		'trapper',
		'tannery',
		'toolmaker',
		'weaver'
	],
	'Luxury': [
		'carpetmanufacturer',
		'coffeeroaster',
		'jeweler',
		'marzipanworkshop',
		'opticiansworkshop',
		'papermill',
		'cosmetics',
		'printingpress',
		'redsmithsworkshop',
		'silkweaver',
		'sugarmill',
		'winery'
	],
	'Military': [
		'armory',
		'cannonfoundry',
		'castle',
		'catapultworkshop',
		'barracks',
		'provisions'
	]
};

/**
 * List of all game buildings.
 * 
 * @constant
 * @type {Array}
 */
game.BUILDINGS = [
	{
		name: 'Marketplace',
		handle: 'marketplace',
		description: 'The Marketplace is the main building of your settlement and ' +
			'provides a place for the settlers to gather. It cannot be demolished.',
		storage: 50000,
		is_municipal: true,
		levels: 5,
		large: true,
		visible_upgrades: true,
		position: {
			x: 1600,
			y: 500
		},
		production: {
			fame: 3
		},
		cost: {
			coins: 100000
		},
		requires: {
			settlement_level: 1
		}
	}, {
		name: 'Warehouse',
		handle: 'warehouse',
		description: 'The Warehouse is a trade building that provides market ' +
			'carts that pick up goods from production buildings. A Warehouse also ' +
			'adds extra storage space for the materials in your city.',
		storage: 100000,
		levels: 10,
		visible_upgrades: true,
		position: {
			x: 670,
			y: 970
		},
		cost: {
			coins: 150000,
			wood: 500,
			bricks: 30,
			woodplanks: 200,
			stones: 500,
			tools: 50
		},
		requires: {
			settlement_level: 16
		}
	}, {
		name: 'Church',
		handle: 'church',
		description: 'A Church provides a massive fame boost to your ' +
			'settlement by using coins and converting them to fame, as well ' +
			'as providing faith for free. Faith allows you to choose a ' +
			'religion for your settlement.',
		is_municipal: true,
		levels: 3,
		large: true,
		position: {
			x: 1600,
			y: 820
		},
		production: {
			fame: 5,
			faith: 1
		},
		materials: {
			coins: 50
		},
		cost: {
			coins: 10000,
			wood: 20,
			woodplanks: 20,
			stones: 20,
			tools: 10
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Trading Post',
		handle: 'tradingpost',
		description: 'The Trading Post is a merchant building that allows ' +
			'you to trade resources with the other settlements in the world. ' +
			'Also allows you to use the powerful Auctioneer.',
		is_municipal: true,
		storage: 10000,
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 2300,
			y: 1370
		},
		cost: {
			coins: 15000,
			wood: 40,
			woodplanks: 40,
			stones: 40
		},
		requires: {
			settlement_level: 4
		}
	}, {
		name: 'Academy',
		handle: 'academy',
		description: 'The Academy provides a minor amount of fame each day as ' +
			'well as research for this settlement at the expense of coins. ' +
			'All technologies will be researched here by your ' +
			'settlement`s scholars.',
		is_municipal: true,
		visible_upgrades: true,
		large: true,
		levels: 5,
		position: {
			x: 1320,
			y: 640
		},
		production: {
			fame: 5,
			research: 1
		},
		materials: {
			coins: 100
		},
		cost: {
			coins: 100000,
			woodplanks: 500,
			stones: 500,
			tools: 20
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Embassy',
		handle: 'embassy',
		description: 'An Embassy is required to propose pacts, declare war, ' +
			'send spies to other settlements, basically any diplomacy.',
		is_municipal: true,
		large: true,
		levels: 3,
		position: {
			x: 1840,
			y: 740
		},
		production: {
			fame: 5,
			espionage: 1
		},
		materials: {
			coins: 50
		},
		cost: {
			coins: 100000,
			woodplanks: 100,
			stones: 100,
			tools: 10
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Provision House',
		handle: 'provisions',
		description: 'The Provision House requires various goods to produce ' +
			'provisions for military units and expeditions.',
		levels: 3,
		position: {
			x: 290,
			y: 780
		},
		production: {
			provisions: 2
		},
		materials: {
			meals: 1,
			clothes: 1,
			leather: 1,
			pottery: 1,
			ropes: 1
		},
		cost: {
			coins: 100000,
			wood: 200,
			stones: 200,
			woodplanks: 100
		},
		requires: {
			settlement_level: 8
		}
	}, {
		name: 'Tavern',
		handle: 'tavern',
		description: 'The Tavern is the place where heroes of the known (and ' +
			'unknown) world hang around. If you are looking to recruit ' +
			'Achilles, build a Tavern and he might show up.',
		is_municipal: true,
		levels: 3,
		position: {
			x: 1920,
			y: 550
		},
		materials: {
			coins: 20,
			meals: 1,
		},
		cost: {
			coins: 100000,
			woodplanks: 200,
			stones: 200,
			wood: 200,
			wine: 100,
			bricks: 10,
			meat: 100,
			tools: 50
		},
		requires: {
			settlement_level: 16,
			buildings: {
				academy: 2
			}
		}
	}, {
		name: 'Shipyard',
		handle: 'shipyard',
		description: 'The Shipyard helps you expand your settlement overseas by ' +
			'housing your ships and providing you with fish, oil and an ' +
			'ultra-small chance to gather pearls.',
		large: true,
		levels: 5,
		position: {
			x: 2430,
			y: 900
		},
		chance: {
			pearls: 0.005
		},
		cost: {
			coins: 200000,
			wood: 200,
			woodplanks: 200,
			stones: 100,
			ropes: 10,
			barrels: 10,
			tools: 20
		},
		production: {
			fish: 3,
			oil: 1
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Barracks',
		handle: 'barracks',
		description: 'The Barracks is your main base of defense and attack. ' +
			'If you plan on going to war, you will need one. It also raises ' +
			'your settlement`s prestige.',
		levels: 5,
		visible_upgrades: true,
		large: true,
		position: {
			x: 1970,
			y: 950
		},
		production: {
			prestige: 1
		},
		cost: {
			coins: 50000,
			wood: 200,
			woodplanks: 200,
			stones: 160,
			tools: 10
		},
		requires: {
			settlement_level: 8,
			buildings: {
				provisions: 1
			}
		}
	}, {
		name: 'Castle',
		handle: 'castle',
		description: 'The Castle is your main base of operations. It houses ' +
			'your settlement`s soldiers and provides you with prestige and ' +
			'some extra fame.',
		is_municipal: true,
		large: true,
		levels: 2,
		position: {
			x: 700,
			y: 1200
		},
		production: {
			fame: 100,
			prestige: 1
		},
		materials: {
			coins: 200
		},
		cost: {
			coins: 1000000,
			wood: 500,
			iron: 500,
			woodplanks: 500,
			stones: 500,
			bricks: 500,
			steel: 50,
			tools: 100
		},
		requires: {
			settlement_level: 20,
			buildings: {
				barracks: 1,
				provisions: 2
			}
		}
	}, {
		name: 'Lumberjack',
		handle: 'lumberjack',
		description: 'A Lumberjack provides you with wood which you can ' +
			'use for creating additional buildings, resources or sell to ' +
			'other settlements.',
		levels: 5,
		position: {
			x: 1840,
			y: 340
		},
		production: {
			wood: 4
		},
		cost: {
			coins: 2000,
			stones: 20
		},
		requires: {
			settlement_level: 1
		}
	}, {
		name: 'Carpenter',
		handle: 'carpenter',
		description: 'The Carpenter processes the wood from the Lumberjack ' +
			'into wood planks that are required for more advanced buildings.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 2060,
			y: 460
		},
		materials: {
			wood: 2
		},
		production: {
			woodplanks: 2
		},
		cost: {
			coins: 5000,
			wood: 10,
			stones: 10
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Stone Quarry',
		handle: 'stonequarry',
		description: 'A Stone Quarry produces stone blocks that are essential ' +
			'for the construction of any settlement`s buildings.',
		visible_upgrades: true,
		levels: 6,
		position: {
			x: 930,
			y: 290
		},
		production: {
			stones: 1
		},
		cost: {
			coins: 2000,
			wood: 20
		},
		chance: {
			mosaic: 0.001,
			limestone: 0.01,
			sand: 0.05
		},
		requires: {
			settlement_level: 1
		}
	}, {
		name: 'Gold Mine',
		handle: 'goldmine',
		description: 'The Gold Mine extracts gold ore, that can be smelted ' +
			'later into gold bars.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1010,
			y: 200
		},
		production: {
			goldore: 3
		},
		chance: {
			gems: 0.0004,
			diamonds: 0.0004
		},
		cost: {
			coins: 10000,
			woodplanks: 20,
			stones: 20
		},
		requires: {
			settlement_level: 6
		}
	}, {
		name: 'Coal Mine',
		handle: 'coalmine',
		description: 'The Coal Mine extracts coal from the mountains you ' +
			'own (provided you own some).',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1180,
			y: 240
		},
		production: {
			coal: 4
		},
		chance: {
			gems: 0.0001,
			diamonds: 0.0001
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 7
		}
	}, {
		name: 'Iron Mine',
		handle: 'ironmine',
		description: 'The Iron Mine extracts iron ore, that can be smelted ' +
			'later into iron bars.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 380,
			y: 620
		},
		production: {
			ironore: 3
		},
		chance: {
			gems: 0.0002,
			diamonds: 0.0002
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Salt Processor',
		handle: 'saltprocessor',
		description: 'A Salt Processor processes seawater and retrieves salt.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 500,
			y: 540
		},
		production: {
			salt: 3
		},
		cost: {
			coins: 8000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 5
		}
	}, {
		name: 'Clay Mine',
		handle: 'claymine',
		description: 'The Clay Mine produces clay which is required later ' +
			'for bricks and pottery.',
		levels: 5,
		position: {
			x: 2900,
			y: 800
		},
		production: {
			clay: 2
		},
		cost: {
			coins: 5000,
			wood: 20,
			stones: 20
		},
		chance: {
			limestone: 0.01,
			sand: 0.1
		},
		requires: {
			settlement_level: 2
		}
	}, {
		name: 'Copper Mine',
		handle: 'coppermine',
		description: 'The copper mine extracts copper ore, that can be ' +
			'smelted later into copper bars.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1310,
			y: 110
		},
		production: {
			copperore: 3
		},
		chance: {
			gems: 0.0001,
			diamonds: 0.0002
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 5
		}
	}, {
		name: 'Flour Mill',
		handle: 'mill',
		description: 'The Flour Mill produces flour from the wheat ' +
			'cultivated by your Grain Farm.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1360,
			y: 1180
		},
		production: {
			flour: 2
		},
		materials: {
			wheat: 2
		},
		cost: {
			coins: 10000,
			woodplanks: 20,
			stones: 20
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Bakery',
		handle: 'bakery',
		description: 'The Bakery creates bread from flour, therefore providing ' +
			'your settlers with basic food.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 550,
			y: 910
		},
		production: {
			bread: 3
		},
		materials: {
			flour: 2
		},
		cost: {
			coins: 15000,
			woodplanks: 30,
			stones: 30
		},
		requires: {
			settlement_level: 4
		}
	}, {
		name: 'Pottery Workshop',
		handle: 'pottery',
		description: 'The Pottery Workshop uses a high-temperature kiln and clay ' +
			'to create pottery for the inhabitants of your settlement.',
		levels: 3,
		position: {
			x: 1740,
			y: 1240
		},
		production: {
			pottery: 4
		},
		materials: {
			clay: 3
		},
		cost: {
			coins: 20000,
			woodplanks: 30,
			stones: 30,
			clay: 100
		},
		requires: {
			settlement_level: 8
		}
	}, {
		name: 'Gunpowder Mill',
		handle: 'gunpowdermill',
		description: 'A Gunpowder Mill is creating highly useful (and unstable) ' +
			'gunpowder from the sulphur found in your Charcoal Burner`s Hut.',
		levels: 3,
		position: {
			x: 500,
			y: 1370
		},
		production: {
			gunpowder: 1
		},
		materials: {
			sulphur: 10
		},
		cost: {
			coins: 30000,
			woodplanks: 30,
			stones: 30,
			bricks: 50,
			clay: 50,
			tools: 20
		},
		requires: {
			settlement_level: 26
		}
	}, {
		name: 'Armory',
		handle: 'armory',
		description: 'The Armory is a major building that produces weapons ' +
			'and armor for your soldiers. If you want to conquer other ' +
			'settlements, you will need to build one and keep it stocked ' +
			'with materials.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1820,
			y: 180
		},
		production: {
			weapons: 1,
			armor: 1
		},
		materials: {
			iron: 10,
			wood: 2,
			leather: 8,
			copper: 4
		},
		cost: {
			coins: 50000,
			woodplanks: 100,
			stones: 100,
			tools: 20
		},
		requires: {
			settlement_level: 9
		}
	}, {
		name: 'Butcher',
		handle: 'butcher',
		description: 'The Butcher slaughters cattle, pigs or goats for meat, ' +
			'providing meat, a food type that is more nutritious. Hides will be ' +
			'processed further at the Tannery.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 420,
			y: 850
		},
		production: {
			meat: 3,
			hides: 2,
			tallow: 1
		},
		materials: [
			{
				pig: 1,
				cattle: 1,
				goat: 1
			}, {
				salt: 1
			}
		],
		cost: {
			coins: 20000,
			woodplanks: 40,
			stones: 40
		},
		requires: {
			settlement_level: 5
		}
	}, {
		name: 'Iron smelter',
		handle: 'ironsmelter',
		description: 'The Iron Smelter (or foundry) smelts iron ore into iron ' +
			'bars using coal.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1140,
			y: 100
		},
		production: {
			iron: 4
		},
		materials: {
			ironore: 4,
			coal: 2
		},
		chance: {
			steel: 0.05
		},
		cost: {
			coins: 30000,
			woodplanks: 40,
			stones: 50
		},
		requires: {
			settlement_level: 7
		}
	}, {
		name: 'Copper smelter',
		handle: 'coppersmelter',
		description: 'The Copper Smelter smelts copper ore into copper ' +
			'bars using coal.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1480,
			y: 150
		},
		production: {
			copper: 2
		},
		materials: {
			copperore: 4,
			coal: 1
		},
		cost: {
			coins: 40000,
			woodplanks: 50,
			stones: 50
		},
		requires: {
			settlement_level: 8
		}
	}, {
		name: 'Gold smelter',
		handle: 'goldsmelter',
		description: 'The Gold Smelter smelts gold ore into gold bars using coal.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1680,
			y: 230
		},
		production: {
			gold: 1
		},
		materials: {
			goldore: 4,
			coal: 1
		},
		cost: {
			coins: 40000,
			woodplanks: 55,
			bricks: 5,
			stones: 55
		},
		requires: {
			settlement_level: 12
		}
	}, {
		name: 'Trapper`s Lodge',
		handle: 'trapper',
		description: 'The trapper captures wild animals and slaughters them, ' +
			'gathering their furs and some meat.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 790,
			y: 410
		},
		production: {
			furs: 2,
			meat: 1
		},
		cost: {
			coins: 15000,
			wood: 40,
			stones: 40
		},
		requires: {
			settlement_level: 6
		}
	}, {
		name: 'Furrier`s Workshop',
		handle: 'furrier',
		description: 'The furrier uses furs from the Trapper`s Lodge mixed with ' +
			'salt and processes them into fur coats that will help your settlers ' +
			'during the cold winters.',
		levels: 3,
		position: {
			x: 2510,
			y: 1560
		},
		production: {
			furcoats: 1
		},
		materials: {
			furs: 2,
			salt: 2
		},
		cost: {
			coins: 15000,
			woodplanks: 30,
			stones: 40
		},
		requires: {
			settlement_level: 9
		}
	}, {
		name: 'Clothing Factory',
		handle: 'clothingfactory',
		description: 'The Clothing Factory produces clothes for your settlement. ' +
			'You don`t want naked citizens, do you?',
		levels: 3,
		position: {
			x: 1580,
			y: 1280
		},
		production: {
			clothes: 1
		},
		materials: {
			cottonfabric: 2
		},
		cost: {
			coins: 15000,
			wood: 40,
			bricks: 10,
			stones: 40
		},
		requires: {
			settlement_level: 15
		}
	}, {
		name: 'Weaver`s Hut',
		handle: 'weaver',
		description: 'The weaver uses a hefty amount of cotton to produce ' +
			'cotton fabric for your settlers` clothes.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1230,
			y: 1250
		},
		production: {
			cottonfabric: 2
		},
		materials: {
			cotton: 4
		},
		cost: {
			coins: 10000,
			wood: 30,
			stones: 30
		},
		requires: {
			settlement_level: 12
		}
	}, {
		name: 'Tannery',
		handle: 'tannery',
		description: 'The Tannery produces leather from processed animal hides.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 930,
			y: 1110
		},
		production: {
			leather: 2
		},
		materials: {
			hides: 4,
			salt: 1
		},
		cost: {
			coins: 20000,
			wood: 35,
			stones: 40
		},
		requires: {
			settlement_level: 8
		}
	}, {
		name: 'Coffee roaster',
		handle: 'coffeeroaster',
		description: 'The Coffee Roaster uses the coffee beans from your Coffee ' +
			'Farm and processes them into coffee.',
		levels: 3,
		position: {
			x: 2150,
			y: 1430
		},
		production: {
			coffee: 1
		},
		materials: {
			coffeebeans: 4
		},
		cost: {
			coins: 70000,
			woodplanks: 80,
			stones: 60,
			bricks: 30,
			tools: 20
		},
		requires: {
			settlement_level: 28,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Sugar Mill',
		handle: 'sugarmill',
		description: 'The Sugar Mill processes any sugar cane you have in ' +
			'storage into sugar.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 2700,
			y: 880
		},
		production: {
			sugar: 1
		},
		materials: {
			sugarcane: 4
		},
		cost: {
			coins: 70000,
			woodplanks: 80,
			stones: 60,
			bricks: 30,
			tools: 10
		},
		requires: {
			settlement_level: 26,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Winery',
		handle: 'winery',
		description: 'The Winery uses the grapes from your Grapes Farm and ' +
			'processes them into wine. It uses either barrels or bottles, ' +
			'depending on what you have in storage.',
		levels: 5,
		position: {
			x: 2520,
			y: 510
		},
		production: {
			wine: 2
		},
		materials: [
			{
				barrels: 1,
				bottles: 1
			}, {
				grapes: 4
			}
		],
		chance: {
			alcohol: 0.01
		},
		cost: {
			coins: 50000,
			wood: 50,
			bricks: 10,
			stones: 40,
			tools: 10
		},
		requires: {
			settlement_level: 14
		}
	}, {
		name: 'Optician`s Shop',
		handle: 'opticiansworkshop',
		description: 'The optician uses copper and glass to create glasses ' +
			'for your settlers.',
		levels: 3,
		position: {
			x: 1280,
			y: 330
		},
		production: {
			glasses: 1
		},
		materials: {
			copper: 2,
			glass: 2
		},
		cost: {
			coins: 81000,
			woodplanks: 70,
			stones: 70,
			bricks: 30,
			tools: 10
		},
		requires: {
			settlement_level: 24
		}
	}, {
		name: 'Paper Mill',
		handle: 'papermill',
		description: 'The Paper Mill uses wood to produce paper, which is used ' +
			'together with indigo to produce books at the Printing House.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1080,
			y: 340
		},
		production: {
			paper: 2
		},
		materials: {
			wood: 1
		},
		cost: {
			coins: 83000,
			woodplanks: 60,
			stones: 50,
			bricks: 30,
			tools: 10
		},
		requires: {
			settlement_level: 22
		}
	}, {
		name: 'Printing Press',
		handle: 'printingpress',
		description: 'The Printing Press produces books from paper using indigo ink.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1540,
			y: 430
		},
		production: {
			books: 1
		},
		materials: {
			paper: 4,
			indigo: 1
		},
		cost: {
			coins: 84000,
			woodplanks: 100,
			stones: 100,
			bricks: 30,
			tools: 10
		},
		requires: {
			settlement_level: 28
		}
	}, {
		name: 'Cosmetics',
		handle: 'cosmetics',
		description: 'The Cosmetics manufacturer produces soap and perfume.',
		levels: 3,
		position: {
			x: 2720,
			y: 1360
		},
		production: {
			perfume: 1,
			soap: 1
		},
		materials: {
			roses: 8,
			tallow: 8,
			honey: 1,
			cocoa: 1,
			alcohol: 1
		},
		cost: {
			coins: 90000,
			woodplanks: 80,
			stones: 40,
			bricks: 20,
			tools: 10
		},
		requires: {
			settlement_level: 30,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Redsmith`s Workshop',
		handle: 'redsmithsworkshop',
		description: 'The Redsmith`s Workshop processes copper and candles into candlesticks.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 520,
			y: 720
		},
		production: {
			candlesticks: 1
		},
		materials: {
			copper: 3,
			candles: 2
		},
		cost: {
			coins: 75000,
			wood: 70,
			bricks: 30,
			stones: 50,
			tools: 10
		},
		requires: {
			settlement_level: 22
		}
	}, {
		name: 'Ropeyard',
		handle: 'ropeyard',
		description: 'The Ropeyard produces ropes that are needed for your city`s ships.',
		levels: 3,
		position: {
			x: 3000,
			y: 1030
		},
		production: {
			ropes: 1
		},
		materials: {
			cotton: 2
		},
		cost: {
			coins: 15000,
			wood: 70,
			stones: 60,
			tools: 10
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Glassworks',
		handle: 'glassworks',
		description: 'The Glassworks processes quartz, sand and coal into glass.',
		levels: 3,
		position: {
			x: 1400,
			y: 1320
		},
		production: {
			glass: 1
		},
		materials: {
			quartz: 2,
			sand: 3,
			coal: 1
		},
		chance: {
			bottles: 0.2
		},
		cost: {
			coins: 50000,
			wood: 50,
			bricks: 10,
			stones: 80
		},
		requires: {
			settlement_level: 22
		}
	}, {
		name: 'Carpet Mill',
		handle: 'carpetmanufacturer',
		description: 'The Carpet Mill produces carpets.',
		levels: 3,
		position: {
			x: 2020,
			y: 1370
		},
		production: {
			carpets: 1
		},
		materials: {
			cottonfabric: 4,
			indigo: 2
		},
		cost: {
			coins: 50000,
			wood: 50,
			bricks: 30,
			stones: 80,
			tools: 10
		},
		requires: {
			settlement_level: 26,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Marzipan Workshop',
		handle: 'marzipanworkshop',
		description: 'The Marzipan Workshop uses milk, almonds and sugar from ' +
			'city storage to create delicious marzipan. Your settlers will ' +
			'definitely appreciate it.',
		levels: 3,
		position: {
			x: 1090,
			y: 850
		},
		production: {
			marzipan: 1
		},
		materials: {
			almonds: 2,
			sugar: 2,
			milk: 4
		},
		cost: {
			coins: 50000,
			wood: 50,
			bricks: 40,
			stones: 80,
			tools: 10
		},
		requires: {
			settlement_level: 26,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Silk Weaver',
		handle: 'silkweaver',
		description: 'The Silk Weaver requires cotton, gold and silk and produces ' +
			'brocade robes.',
		levels: 3,
		position: {
			x: 1220,
			y: 970
		},
		production: {
			robes: 1
		},
		materials: {
			silk: 2,
			cotton: 1,
			gold: 2
		},
		cost: {
			coins: 50000,
			wood: 50,
			bricks: 30,
			stones: 80,
			tools: 10
		},
		requires: {
			settlement_level: 23,
			buildings: {
				tradingpost: 1
			}
		}
	}, {
		name: 'Quartz Mine',
		handle: 'quartzmine',
		description: 'The Quartz Mine provides your city with quartz.',
		levels: 3,
		position: {
			x: 700,
			y: 710
		},
		production: {
			quartz: 2
		},
		cost: {
			coins: 40000,
			wood: 50,
			bricks: 30,
			stones: 90
		},
		requires: {
			settlement_level: 16,
			climate: [
				game.CLIMATE_ARID
			]
		}
	}, {
		name: 'Apiary',
		handle: 'apiary',
		description: 'The Apiary produces honey and bees wax for use in candles.',
		levels: 3,
		position: {
			x: 1140,
			y: 1150
		},
		production: {
			wax: 2,
			honey: 1
		},
		cost: {
			coins: 40000,
			wood: 50,
			bricks: 30,
			stones: 40
		},
		requires: {
			settlement_level: 16,
			buildings: {
				beehive: 1
			},
			climate: [
				game.CLIMATE_TROPICAL,
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Bee Hive',
		handle: 'beehive',
		description: 'The Bee Hive is required for an Apiary to produce bees wax and honey.',
		position: {
			x: 1260,
			y: 1100
		},
		cost: {
			coins: 2000,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 16,
			climate: [
				game.CLIMATE_TROPICAL,
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Barrel Cooperage',
		handle: 'barrelcooperage',
		description: 'The Barrel Cooperage creates barrels from wood and iron.',
		levels: 3,
		position: {
			x: 910,
			y: 430
		},
		production: {
			barrels: 2
		},
		materials: {
			wood: 3,
			iron: 1
		},
		cost: {
			coins: 25000,
			wood: 80,
			stones: 70,
			tools: 10
		},
		requires: {
			settlement_level: 9
		}
	}, {
		name: 'Brewery',
		handle: 'brewery',
		description: 'The Brewery brews beer from wheat. Beer is needed for ' +
			'higher-level houses or your city`s navy.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 650,
			y: 1120
		},
		production: {
			beer: 2
		},
		materials: {
			barrels: 1,
			wheat: 2
		},
		chance: {
			alcohol: 0.01
		},
		cost: {
			coins: 25000,
			wood: 60,
			stones: 70
		},
		requires: {
			settlement_level: 9
		}
	}, {
		name: 'Candlemaker`s Hut',
		handle: 'candlemakersworkshop',
		description: 'The Candlemaker Hut produces candles for your settlers` houses.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 640,
			y: 480
		},
		production: {
			candles: 1
		},
		materials: {
			wax: 2,
			cotton: 1
		},
		cost: {
			coins: 45000,
			woodplanks: 80,
			stones: 60,
			bricks: 20,
			tools: 10
		},
		requires: {
			settlement_level: 20
		}
	}, {
		name: 'Catapult Workshop',
		handle: 'catapultworkshop',
		description: 'The Catapult Workshop builds catapults, the ultimate siege weapon.',
		levels: 3,
		position: {
			x: 2800,
			y: 1450
		},
		production: {
			catapults: 1
		},
		materials: {
			wood: 100,
			steel: 12,
			iron: 20,
			stones: 30,
			coal: 5,
			woodplanks: 40,
			ropes: 10
		},
		cost: {
			coins: 250000,
			woodplanks: 200,
			stones: 300,
			bricks: 30,
			tools: 20
		},
		requires: {
			settlement_level: 20
		}
	}, {
		name: 'Cannon Foundry',
		handle: 'cannonfoundry',
		description: 'The Cannon Foundry is responsable with the manufacture of the city cannons.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 760,
			y: 560
		},
		production: {
			cannons: 1
		},
		materials: {
			wood: 70,
			copper: 30,
			iron: 10,
			coal: 20,
			steel: 15,
			woodplanks: 10,
			ropes: 2,
			gunpowder: 6
		},
		cost: {
			coins: 200000,
			woodplanks: 200,
			stones: 300,
			bricks: 30,
			tools: 20
		},
		requires: {
			settlement_level: 18
		}
	}, {
		name: 'Charcoal Burner`s Hut',
		handle: 'charcoalburnerhut',
		description: 'The Charcoal Burner`s Hut burns wood into coal and sulphur, ' +
			'which is needed by all your smelters.',
		levels: 3,
		position: {
			x: 1370,
			y: 230
		},
		production: {
			coal: 4,
			sulphur: 1
		},
		materials: {
			wood: 2
		},
		cost: {
			coins: 25000,
			wood: 50,
			stones: 50,
			bricks: 50
		},
		requires: {
			settlement_level: 15
		}
	}, {
		name: 'House',
		handle: 'house1',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 5,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1200,
			y: 770
		},
		cost: {
			wood: 10,
			coins: 1000
		},
		materials: {
			bread: 1
		},
		requires: {
			settlement_level: 1
		}
	}, {
		name: 'House',
		handle: 'house2',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 10,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1080,
			y: 680
		},
		cost: {
			wood: 10,
			coins: 2000
		},
		materials: {
			bread: 1
		},
		requires: {
			settlement_level: 1
		}
	}, {
		name: 'House',
		handle: 'house3',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 15,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 960,
			y: 590
		},
		cost: {
			woodplanks: 10,
			stones: 20,
			coins: 3000
		},
		materials: {
			bread: 1,
			meat: 1
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'House',
		handle: 'house4',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 20,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1200,
			y: 580
		},
		cost: {
			woodplanks: 10,
			stones: 20,
			coins: 4000
		},
		materials: {
			bread: 1,
			meat: 1,
			pottery: 1
		},
		requires: {
			settlement_level: 6,
			buildings: {
				church: 1
			}
		}
	}, {
		name: 'House',
		handle: 'house5',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 25,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1080,
			y: 500
		},
		cost: {
			woodplanks: 25,
			stones: 35,
			coins: 5000
		},
		materials: {
			fish: 1,
			meat: 2,
			pottery: 1,
			beer: 1
		},
		requires: {
			settlement_level: 10,
			buildings: {
				church: 1
			}
		}
	}, {
		name: 'House',
		handle: 'house6',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 30,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1300,
			y: 840
		},
		cost: {
			woodplanks: 30,
			stones: 45,
			bricks: 10,
			coins: 6000
		},
		materials: {
			meals: 1,
			pottery: 1
		},
		requires: {
			settlement_level: 16,
			buildings: {
				church: 2
			}
		}
	}, {
		name: 'House',
		handle: 'house7',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 35,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1470,
			y: 780
		},
		cost: {
			woodplanks: 40,
			stones: 80,
			bricks: 15,
			coins: 7000
		},
		materials: {
			meals: 1,
			pottery: 1,
			candlesticks: 1
		},
		requires: {
			settlement_level: 20,
			buildings: {
				academy: 1
			}
		}
	}, {
		name: 'House',
		handle: 'house8',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 40,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1700,
			y: 390
		},
		cost: {
			woodplanks: 50,
			stones: 100,
			bricks: 20,
			coins: 8000
		},
		materials: {
			meals: 1,
			milk: 1,
			pottery: 1,
			candlesticks: 1,
			furcoats: 1
		},
		requires: {
			settlement_level: 25,
			buildings: {
				academy: 2
			}
		}
	}, {
		name: 'House',
		handle: 'house9',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 50,
		levels: 6,
		visible_upgrades: true,
		position: {
			x: 1840,
			y: 480
		},
		cost: {
			woodplanks: 100,
			stones: 200,
			bricks: 25,
			coins: 10000
		},
		materials: {
			meals: 1,
			milk: 1,
			pottery: 1,
			candlesticks: 1,
			furcoats: 1,
			perfume: 1,
			soap: 1
		},
		requires: {
			settlement_level: 30,
			buildings: {
				academy: 2
			}
		}
	}, {
		name: 'House',
		handle: 'house10',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 60,
		cost: {
			woodplanks: 100,
			stones: 200,
			bricks: 30,
			coins: 10000
		},
		materials: {
			meals: 2,
			milk: 1,
			pottery: 1,
			candlesticks: 1,
			furcoats: 1,
			perfume: 1,
			soap: 1,
			robes: 1
		},
		position: {
			x: 1390,
			y: 550
		},
		levels: 6,
		visible_upgrades: true,
		requires: {
			settlement_level: 32,
			buildings: {
				church: 2,
				academy: 2
			}
		}
	}, {
		name: 'House',
		handle: 'house11',
		description: 'Houses provide coins through taxes and space for your settlers.',
		tax: 80,
		cost: {
			woodplanks: 100,
			stones: 200,
			bricks: 35,
			coins: 10000
		},
		materials: {
			meals: 2,
			milk: 1,
			pottery: 1,
			candlesticks: 1,
			furcoats: 1,
			perfume: 1,
			robes: 1,
			soap: 1,
			marzipan: 1
		},
		position: {
			x: 1400,
			y: 910
		},
		levels: 6,
		visible_upgrades: true,
		requires: {
			settlement_level: 36,
			buildings: {
				church: 2,
				academy: 2
			}
		}
	}, {
		name: 'Dates farm',
		handle: 'datesfarm',
		description: 'The Dates Farm cultivates dates.',
		production: {
			dates: 1
		},
		levels: 3,
		position: {
			x: 2480,
			y: 770
		},
		cost: {
			coins: 40000,
			wood: 30,
			stones: 30
		},
		requires: {
			settlement_level: 36,
			buildings: {
				datesfield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Dates field',
		handle: 'datesfield',
		description: 'An Dates Field is required for the Dates Farm to operate.',
		position: {
			x: 2380,
			y: 660
		},
		cost: {
			coins: 5000,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 36,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Almonds farm',
		handle: 'almondsfarm',
		description: 'The Almonds Farm cultivates almonds for marzipan manufacture ' +
			'or export.',
		production: {
			almonds: 1
		},
		levels: 3,
		position: {
			x: 2050,
			y: 1610
		},
		cost: {
			coins: 40000,
			wood: 30,
			stones: 30
		},
		requires: {
			settlement_level: 36,
			buildings: {
				almondsfield: 1
			},
			climate: [
				game.CLIMATE_ARID,
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Almonds field',
		handle: 'almondsfield',
		description: 'An Almonds Field is required for the Almonds Farm to operate.',
		position: {
			x: 2190,
			y: 1570
		},
		cost: {
			coins: 5000,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 36,
			climate: [
				game.CLIMATE_ARID,
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Cattle Farm',
		handle: 'cattlefarm',
		description: 'A Cattle Farm grows cattle so your settlers can eat food that ' +
			'is more nutritious than bread. Also produces milk and has a low chance ' +
			'for producing cheese.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1510,
			y: 1470
		},
		production: {
			cattle: 1,
			milk: 1
		},
		chance: {
			cheese: 0.01
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 3,
			buildings: {
				cattlefield: 1
			}
		}
	}, {
		name: 'Cattle field',
		handle: 'cattlefield',
		description: 'A Cattle Field is required for the Cattle Farm to operate.',
		position: {
			x: 1630,
			y: 1420
		},
		cost: {
			coins: 1000,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Pig Farm',
		handle: 'pigfarm',
		description: 'A Pig Farm grows pigs so your settlers can eat food that ' +
			'is more nutritious than bread.',
		visible_upgrades: true,
		production: {
			pig: 1
		},
		levels: 5,
		position: {
			x: 1900,
			y: 1150
		},
		cost: {
			coins: 15000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 3,
			buildings: {
				pigfield: 1
			}
		}
	}, {
		name: 'Pig field',
		handle: 'pigfield',
		description: 'A Pig Field is required for the Pig Farm to operate.',
		position: {
			x: 1900,
			y: 1270
		},
		cost: {
			coins: 1500,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 3
		}
	}, {
		name: 'Goat Farm',
		handle: 'goatfarm',
		description: 'A Goat Farm grows cattle so your settlers can eat food ' +
			'that is more nutritious than bread. Also produces milk and has a ' +
			'low chance for producing cheese.',
		visible_upgrades: true,
		production: {
			goat: 1,
			milk: 1
		},
		chance: {
			cheese: 0.01
		},
		levels: 5,
		position: {
			x: 2300,
			y: 900
		},
		cost: {
			coins: 15000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 10,
			buildings: {
				goatfield: 1
			}
		}
	}, {
		name: 'Goat field',
		handle: 'goatfield',
		description: 'A Goat Field is required for the Goat Farm to operate.',
		position: {
			x: 2150,
			y: 900
		},
		cost: {
			coins: 1500,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Grain farm',
		handle: 'grainfarm',
		description: 'A Grain Farm cultivates wheat that will be later transformed ' +
			'into bread, and your settlers will live happily ever after.',
		visible_upgrades: true,
		production: {
			wheat: 2
		},
		levels: 6,
		position: {
			x: 2660,
			y: 590
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 2,
			buildings: {
				grainfield: 1
			}
		}
	}, {
		name: 'Grain field',
		handle: 'grainfield',
		description: 'A Grain Field is required for the Grain Farm to operate.',
		position: {
			x: 2550,
			y: 670
		},
		cost: {
			coins: 1000,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 2
		}
	}, {
		name: 'Grapes farm',
		handle: 'grapesfarm',
		description: 'A Grapes Farm provides your city with grapes for wine processing.',
		levels: 3,
		position: {
			x: 2380,
			y: 460
		},
		production: {
			grapes: 2
		},
		cost: {
			coins: 15000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 16,
			buildings: {
				grapesfield: 1
			},
			climate: [
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Grapes field',
		handle: 'grapesfield',
		description: 'A Grapes Field is required for the Grapes Farm to operate.',
		position: {
			x: 2290,
			y: 530
		},
		cost: {
			coins: 1500,
			wood: 10,
			clay: 20
		},
		requires: {
			settlement_level: 16,
			climate: [
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Coffee farm',
		handle: 'coffeefarm',
		description: 'A Coffee Farm cultivates coffee beans in your city, ready ' +
			'to be processed into coffee.',
		levels: 3,
		position: {
			x: 1840,
			y: 1000
		},
		production: {
			coffeebeans: 2
		},
		cost: {
			coins: 60000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 36,
			buildings: {
				coffeefield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Coffee field',
		handle: 'coffeefield',
		description: 'A Coffee Field is required for the Coffee Farm to operate.',
		position: {
			x: 1740,
			y: 1080
		},
		cost: {
			coins: 6000,
			wood: 10,
			clay: 40
		},
		requires: {
			settlement_level: 36,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Cotton farm',
		handle: 'cottonfarm',
		description: 'A Cotton Farm provides your city with cotton.',
		levels: 3,
		position: {
			x: 1870,
			y: 1590
		},
		production: {
			cotton: 3
		},
		cost: {
			coins: 20000,
			wood: 20,
			stones: 20
		},
		requires: {
			research: 'agriculture',
			settlement_level: 10,
			buildings: {
				cottonfield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Cotton field',
		handle: 'cottonfield',
		description: 'A Cotton Field is required for the Cotton Farm to operate.',
		position: {
			x: 1970,
			y: 1530
		},
		cost: {
			coins: 2000,
			wood: 10,
			clay: 20
		},
		requires: {
			research: 'agriculture',
			settlement_level: 10,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Silk farm',
		handle: 'silkfarm',
		description: 'A Silk Farm provides your city with silk.',
		levels: 3,
		position: {
			x: 1450,
			y: 340
		},
		production: {
			silk: 1
		},
		cost: {
			coins: 80000,
			wood: 20,
			stones: 20
		},
		requires: {
			research: 'agriculture',
			settlement_level: 28,
			buildings: {
				silkfield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Silk field',
		handle: 'silkfield',
		description: 'A Silk Field is required for the Silk Farm to operate.',
		position: {
			x: 1600,
			y: 320
		},
		cost: {
			coins: 8000,
			wood: 10,
			clay: 100
		},
		requires: {
			research: 'agriculture',
			settlement_level: 28,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Sugar Cane Farm',
		handle: 'sugarfarm',
		description: 'A Sugar Cane Farm provides your city with sugar cane.',
		levels: 3,
		position: {
			x: 2280,
			y: 780
		},
		production: {
			sugarcane: 2
		},
		cost: {
			coins: 100000,
			wood: 20,
			stones: 20
		},
		requires: {
			settlement_level: 24,
			buildings: {
				academy: 1,
				sugarfield: 1
			},
			climate: [
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Sugar field',
		handle: 'sugarfield',
		description: 'A Sugar Field is required for the Sugar Farm to operate.',
		position: {
			x: 2100,
			y: 720
		},
		cost: {
			coins: 10000,
			wood: 10,
			clay: 100
		},
		requires: {
			settlement_level: 24,
			climate: [
				game.CLIMATE_TEMPERATE
			]
		}
	}, {
		name: 'Indigo farm',
		handle: 'indigofarm',
		description: 'The Indigo Farm produces indigo that can be turned to ink ' +
			'and used to create books.',
		levels: 5,
		visible_upgrades: true,
		position: {
			x: 2440,
			y: 1440
		},
		production: {
			indigo: 1
		},
		cost: {
			coins: 200000,
			wood: 30,
			stones: 30,
			clay: 30
		},
		requires: {
			settlement_level: 20,
			buildings: {
				indigofield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Indigo field',
		handle: 'indigofield',
		description: 'An Indigo Field is required for the Indigo Farm to operate.',
		position: {
			x: 2320,
			y: 1500
		},
		cost: {
			coins: 10000,
			wood: 10,
			clay: 100
		},
		requires: {
			settlement_level: 20,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Tobacco farm',
		handle: 'tobaccofarm',
		description: 'A Tobacco Farm produces cigars from tobacco.',
		levels: 3,
		position: {
			x: 1750,
			y: 1500
		},
		production: {
			cigars: 1
		},
		materials: {
			tobacco: 2
		},
		cost: {
			coins: 200000,
			wood: 30,
			stones: 30,
			bricks: 30
		},
		requires: {
			settlement_level: 25,
			buildings: {
				tobaccofield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Tobacco field',
		handle: 'tobaccofield',
		description: 'The Tobacco Field produces tobacco that will be further ' +
			'processed by the Tobacco Farm',
		position: {
			x: 1870,
			y: 1460
		},
		production: {
			tobacco: 1
		},
		cost: {
			coins: 10000,
			wood: 10,
			clay: 100
		},
		requires: {
			settlement_level: 20,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Rose Farm',
		handle: 'rosenursery',
		description: 'The Rose Farm produces roses which are needed to manufacture perfume.',
		levels: 3,
		position: {
			x: 2780,
			y: 670
		},
		production: {
			roses: 1
		},
		cost: {
			coins: 20000,
			wood: 50,
			stones: 50,
			clay: 50
		},
		requires: {
			research: 'agriculture',
			settlement_level: 26,
			buildings: {
				academy: 1,
				rosefield: 1
			},
			climate: [
				game.CLIMATE_ARID,
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Roses field',
		handle: 'rosefield',
		description: 'A Roses Field is required for the Rose Farm to operate.',
		position: {
			x: 2650,
			y: 740
		},
		cost: {
			coins: 10000,
			wood: 10,
			clay: 100
		},
		requires: {
			research: 'agriculture',
			settlement_level: 26,
			climate: [
				game.CLIMATE_ARID,
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Spice Farm',
		handle: 'spicefarm',
		description: 'The Spice Farm is responsable for the production of spices.',
		levels: 3,
		position: {
			x: 1500,
			y: 970
		},
		production: {
			spices: 1
		},
		cost: {
			coins: 200000,
			wood: 60,
			stones: 60,
			clay: 60
		},
		requires: {
			settlement_level: 32,
			buildings: {
				academy: 1,
				spicefield: 1
			},
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Spice field',
		handle: 'spicefield',
		description: 'A Spice Field is required for the Spice Farm to operate.',
		position: {
			x: 1600,
			y: 1030
		},
		cost: {
			coins: 20000,
			wood: 40,
			clay: 300
		},
		requires: {
			settlement_level: 32,
			climate: [
				game.CLIMATE_TROPICAL
			]
		}
	}, {
		name: 'Toolmaker Workshop',
		handle: 'toolmaker',
		description: 'Tools are needed to construct higher-level buildings, and a ' +
			'Toolmaker Workshop will create those for your settlement.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 1640,
			y: 110
		},
		production: {
			tools: 2
		},
		materials: {
			wood: 1,
			iron: 1,
			coal: 1,
			copper: 1
		},
		cost: {
			coins: 30000,
			wood: 80,
			stones: 80,
			clay: 60
		},
		requires: {
			settlement_level: 8
		}
	}, {
		name: 'Jeweler',
		handle: 'jeweler',
		description: 'The Jeweler processes pearls into jewelery for your settlers (and traders).',
		levels: 3,
		position: {
			x: 1780,
			y: 1350
		},
		production: {
			jewelery: 1
		},
		materials: {
			pearls: 10
		},
		cost: {
			coins: 55000,
			wood: 60,
			stones: 60,
			bricks: 60,
			tools: 10
		},
		requires: {
			settlement_level: 20
		}
	}, {
		name: 'Brickworks',
		handle: 'brickworks',
		description: 'The Brickworks uses coal and clay to manufacture bricks, ' +
			'needed for higher-level buildings in your settlement.',
		levels: 5,
		position: {
			x: 620,
			y: 640
		},
		production: {
			bricks: 2
		},
		materials: {
			clay: 3,
			coal: 1
		},
		cost: {
			coins: 10000,
			wood: 20,
			stones: 20,
			clay: 20
		},
		requires: {
			settlement_level: 12,
			buildings: {
				claymine: 1
			}
		}
	}, {
		name: 'Cookhouse',
		handle: 'cookhouse',
		description: 'The Cookhouse makes meals for your houses, army, navy and expeditions.',
		levels: 3,
		position: {
			x: 1020,
			y: 970
		},
		production: {
			meals: 2
		},
		materials: {
			bread: 2,
			meat: 2,
			fish: 2,
			wine: 1
		},
		cost: {
			coins: 20000,
			wood: 100,
			stones: 20,
			bricks: 20,
			woodplanks: 10
		},
		requires: {
			settlement_level: 10
		}
	}, {
		name: 'Fisherman',
		handle: 'fisherman',
		description: 'The fisherman reels in fish from the waters surrounding your settlement.',
		visible_upgrades: true,
		levels: 5,
		position: {
			x: 2830,
			y: 970
		},
		chance: {
			pearls: 0.003
		},
		production: {
			fish: 1
		},
		cost: {
			coins: 15000,
			wood: 100,
			stones: 20,
			bricks: 20,
			woodplanks: 10
		},
		requires: {
			settlement_level: 8
		}
	}
];
