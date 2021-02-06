/**
 * List of all available in-game events.
 * 
 * @constant
 * @type {Array}
 */
game.EVENTS = [
	{
		name: 'Great earthquake',
		description: 'A great earthquake sweeps across your city destroying the ' +
			'settlement`s BUILDING in the process.',
		chance: 0.00001,
		destroy: true
	}, {
		name: 'Royal marriage',
		description: 'A marriage was arranged between a member of your family ' +
			'and the royal family of SETTLEMENT. This raises your influence on ' +
			'SETTLEMENT by INFLUENCE. Good job!',
		chance: 0.0001,
		raise: {
			influence: 10
		}
	}, {
		name: 'Raiders attack',
		description: 'A band of raiders attacked the outskirts of your ' +
			'settlement. Repairing the affected buildings costs your settlement ' +
			'COINS coins.',
		chance: 0.0002,
		lower: {
			coins: 1000
		}
	}, {
		name: 'Discovery',
		description: 'The engineers in your settlement made a great discovery ' +
			'which made you more famous, thus gaining FAME fame and RESEARCH ' +
			'research.',
		chance: 0.0004,
		raise: {
			fame: 100,
			research: 10
		}
	}, {
		name: 'Foreign spy discovered',
		description: 'A spy from SETTLEMENT was found hiding in your ' +
			'settlement, as a reward for finding him you gain ESPIONAGE ' +
			'espionage.',
		chance: 0.002,
		raise: {
			espionage: 10
		}
	}, {
		name: 'Your spy uncovered',
		description: 'One of your spies in SETTLEMENT was discovered, ' +
			'SETTLEMENT`s ruler is angry so you lose PRESTIGE prestige.',
		chance: 0.003,
		lower: {
			prestige: 10
		}
	}
];
