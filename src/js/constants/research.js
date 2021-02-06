/**
 * The minimum value settlement research can have.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.MIN_RESEARCH_VALUE = 1;

/**
 * The maximum value settlement research can have.
 *
 * @constant
 * @default
 * @type {Number}
 */
game.MAX_RESEARCH_VALUE = 1000;

/**
 * List of all game research technologies.
 * 
 * @constant
 * @type {Array}
 */
game.TECHNOLOGIES = [
	{
		name: 'Agriculture',
		handle: 'agriculture',
		description: 'The development of agriculture enables the human population to ' +
			'grow many times larger than could be sustained by hunting and gathering.',
		duration: 80,
		cost: {
			research: 500,
			coins: 200000,
			woodplanks: 200,
			wheat: 100,
			tools: 10
		},
		effect: {
			buildings: {
				cottonfarm: 1,
				grainfarm: 1,
				grapesfarm: 1,
				rosenursery: 1,
				tobaccofarm: 1,
				almondsfarm: 1,
				coffeefarm: 1,
				datesfarm: 1,
				indigofarm: 1,
				sugarfarm: 1
			}
		}
	}, {
		name: 'Animal Enclosures',
		handle: 'animalenclosure',
		description: 'Animal enclosures will allow your animal farms to raise more livestock.',
		duration: 70,
		cost: {
			research: 400,
			coins: 300000,
			woodplanks: 100,
			iron: 100
		},
		effect: {
			buildings: {
				cattlefarm: 1,
				pigfarm: 1,
				goatfarm: 1,
				apiary: 1
			}
		}
	}, {
		name: 'Archeology',
		handle: 'archeology',
		description: 'Researching Archeology enables settlement ruins to show up on the world map.',
		duration: 96,
		cost: {
			research: game.MAX_RESEARCH_VALUE,
			coins: 200000,
			prestige: 100
		},
		effect: {
			ruins: true
		}
	}, {
		name: 'Canned Food',
		handle: 'cannedfood',
		description: 'Canning is a method of preserving food in which the food ' +
			'contents are processed and sealed in an airtight container (jars ' +
			'like Mason jars, and steel and tin cans).',
		duration: 50,
		cost: {
			research: 500,
			coins: 200000,
			meals: 100,
			bread: 50,
			meat: 50,
			iron: 20
		},
		effect: {
			buildings: {
				cookhouse: 1,
				butcher: 1,
				bakery: 1
			}
		}
	}, {
		name: 'Circular Saw',
		handle: 'circularsaw',
		description: 'The circular saw was invented around the end of the ' +
			'18th century as a rip-saw to convert logs into lumber in sawmills ' +
			'and various claims have been made as to who invented the circular saw.',
		duration: 120,
		cost: {
			research: 300,
			coins: 200000,
			wood: 200,
			woodplanks: 100
		},
		effect: {
			buildings: {
				carpenter: 2,
				lumberjack: 2
			}
		}
	}, {
		name: 'Diplomacy',
		handle: 'diplomacy',
		description: 'Researching diplomacy will give a boost to your Embassy`s ' +
			'production of fame and espionage.',
		duration: 320,
		cost: {
			research: game.MAX_RESEARCH_VALUE,
			coins: 500000,
			soap: 100,
			jewelery: 100,
			alcohol: 10,
			perfume: 10,
			donkeys: 50
		},
		effect: {
			buildings: {
				embassy: 10
			}
		}
	}, {
		name: 'Distillery',
		handle: 'distillery',
		description: 'If you need more beer or wine in your settlement, research ' +
			'this technology.',
		duration: 120,
		cost: {
			research: 500,
			coins: 500000,
			alcohol: 200,
			barrels: 100,
			bottles: 100,
			wine: 100,
			coal: 400,
			copper: 100
		},
		effect: {
			buildings: {
				winery: 1,
				brewery: 1
			}
		}
	}, {
		/* @todo */
		name: 'Militia',
		handle: 'militia',
		description: 'Allows you to freely recruit 10 militia men each year.',
		duration: 30,
		cost: {
			research: 500,
			coins: 100000,
			provisions: 100,
			weapons: 20
		},
		effect: {
			buildings: {
				tavern: 10
			}
		}
	}, {
		name: 'Minerals',
		handle: 'minerals',
		description: 'Digging deeper into the mountains, your settlers will find more ' +
			'minerals if you research this technology.',
		duration: 120,
		cost: {
			research: 700,
			coins: 500000,
			steel: 200,
			glass: 1000,
			iron: 100
		},
		effect: {
			buildings: {
				ironmine: 1,
				coppermine: 1,
				goldmine: 1
			}
		}
	}, {
		name: 'Projectiles',
		handle: 'projectiles',
		description: 'Researching heavy projectiles will give a production boost ' +
			'to your Cannon Foundry and Catapult Workshop.',
		duration: 200,
		cost: {
			research: game.MAX_RESEARCH_VALUE,
			coins: 800000,
			steel: 200,
			gunpowder: 100,
			coal: 300,
			copper: 50,
			sulphur: 100,
			glass: 1000
		},
		effect: {
			buildings: {
				cannonfoundry: 1,
				catapultworkshop: 1
			}
		}
	}, {
		name: 'Railway',
		handle: 'railway',
		description: 'Researching the railway will break in half the time required ' +
			'to travel from one city to another.',
		duration: 300,
		cost: {
			research: game.MAX_RESEARCH_VALUE,
			coins: 1000000,
			steel: 1000,
			glass: 1000,
			gunpowder: 500,
			iron: 1000,
			woodplanks: 100
		},
		effect: {
			distance: 2
		}
	}, {
		name: 'Sewing machine',
		handle: 'sewingmachine',
		description: 'Sewing machine technology will give a boost to your buildings ' +
			'responsible with manufacturing clothes and textile goods.',
		duration: 36,
		cost: {
			research: 500,
			coins: 100000,
			cottonfabric: 100,
			cotton: 100,
			leather: 100,
			steel: 100,
			copper: 20,
			glass: 100
		},
		effect: {
			buildings: {
				clothingfactory: 2,
				weaver: 2,
				furrier: 2
			}
		}
	}, {
		name: 'Taxation',
		handle: 'taxation',
		description: 'Researching taxation will provide an extra 100 coins from ' +
			'each of your houses, regardless of their level.',
		duration: 260,
		cost: {
			research: game.MAX_RESEARCH_VALUE,
			coins: 1000000,
			gold: 1000,
			silver: 1000
		},
		effect: {
			tax: 100
		}
	}, {
		name: 'Trawlers',
		handle: 'trawlers',
		description: 'Researching this technology will provide your ships with ' +
			'better trawl nets, therefore giving a boost to your settlement`s Shipyard.',
		duration: 36,
		cost: {
			research: 200,
			coins: 100000,
			cottonfabric: 100,
			cotton: 100
		},
		effect: {
			buildings: {
				shipyard: 1,
				fisherman: 1
			}
		}
	}
];
