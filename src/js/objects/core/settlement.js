/**
 * Main Game settlement object.
 * 
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class settlement
 * @returns {settlement}
 */
class settlement {
	
	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {settlement}
	 * @param {Object} params
	 */
	constructor (params) {
		this._core = params.core;
		this._properties = {};
		this._status = {};
		this._buildings = [];
		this._army = {};
		this._navy = {};
		this._mercenary = [];
		this.resources = {};
		this._ruins = {};
		this._heroes = [];
		this._properties.id = params.properties.id;
		this._properties.name = (typeof params.properties.name !== 'undefined') ?
			params.properties.name: game.get_random_unique(game.SETTLEMENT_NAMES);
		this._properties.player = (typeof params.properties.player !== 'undefined') ?
			params.properties.player : false;
		this._properties.level = (typeof params.properties.level !== 'undefined') ?
			params.properties.level : 1;
		this._properties.religion = (typeof params.properties.religion !==
			'undefined') ? params.properties.religion : game.RELIGION_NONE;
		this._properties.nationality = (typeof params.properties.nationality !==
			'undefined') ? params.properties.nationality : this.core().get_random_nationality();
		this._properties.type = (typeof params.properties.type !== 'undefined') ?
			params.properties.type : game.CITY;
		this._properties.ruler = (typeof params.properties.ruler !== 'undefined') ?
			params.properties.ruler : {
				title: (this._properties.type === game.CAMP) ? 'Warlord' : 'Mayor',
				avatar: game.get_random(1, game.AVATARS),
				personality: (this._properties.type === game.CAMP) ? game.PERSONALITY_WARLORD :
					this.core().get_random_personality(),
				name: game.get_random_unique(game.NAMES)
			};
		if (typeof params.ruins !== 'undefined') {
			this._ruins.sid = (typeof params.ruins.sid !== 'undefined') ? params.ruins.sid : null;
			this._ruins.scouted = (typeof params.ruins.scouted !== 'undefined') ?
				params.ruins.scouted : false;
			this._ruins.resources = (typeof params.ruins.resources !== 'undefined') ?
				params.ruins.resources : {};
		}
		this._properties.storage = 0;
		this._properties.icon = (typeof params.properties.icon !== 'undefined') ?
			params.properties.icon : 1;
		this._properties.waterside = (typeof params.properties.waterside !== 'undefined') ?
			params.properties.waterside : false;
		this._army = this.load_army(params.army);
		this._mercenary = (typeof params.mercenary !== 'undefined') ? params.mercenary : [];
		this._status = (typeof params.status !== 'undefined') ? params.status : {};
		this._heroes = (typeof params.heroes !== 'undefined') ? params.heroes : [];
		this.resources = (typeof params.resources !== 'undefined') ? params.resources : {};
		this._fill_resources();
		this._location = params.location;
		this._properties.color = (typeof params.properties.color !== 'undefined') ?
			params.properties.color : this.core().ui().get_random_color();
		this.core().world().add_settlement(this);
		if (this.waterside() === true) {
			this._navy = this.load_navy(params.navy);
		}
		this.trades = (typeof params.trades !== 'undefined') ? params.trades : {
				'imports': {},
				'exports': {}
			};
		if (!this.is_player()) {
			this.resources.fame = this.core().level_to_fame(this.level());
			this.ai = new ai({
				core: this,
				type: this._properties.ruler.personality
			});
		}
		if (!this.is_player()) {
			const terrain = this.core().world().get_hex_terrain({
				x: this._location.x,
				y: this._location.y
			});
			const climate = this.core().world().get_climate_from_terrain(terrain);
			this._properties.climate = game['CLIMATE_' + climate.name.toUpperCase()];
			if (this.is_urban()) {
				this.setup_initial_buildings(this.core().get_buildings_for_settlement(this), true);
			}
		} else {
			this._properties.climate = params.properties.climate;
		}
		this._properties.population = (typeof params.properties.population !== 'undefined') ?
			params.properties.population : this.level() * game.POPULATION_PER_LEVEL;
		return this;
	}

	/**
	 * Get the ruins data if the settlement is in ruins.
	 *
	 * @public
	 * @returns {Object}
	 */
	ruins () {
		return this._ruins;
	}

	/**
	 * Check if the ruins have been claimed by a settlement.
	 *
	 * @public
	 * @returns {Number|Boolean}
	 */
	is_claimed () {
		if (this._ruins.sid === null) {
			return false;
		} else {
			return this._ruins.sid;
		}
	}

	/**
	 * Check if the ruins have been scouted by the player's settlement.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_scouted () {
		return this._ruins.scouted;
	}

	/**
	 * Scout the ruins
	 *
	 * @public
	 * @returns {settlement}
	 */
	scout () {
		this._ruins.scouted = true;
		return this;
	}

	/**
	 * Claim the ruins.
	 *
	 * @public
	 * @param {settlement} settlement
	 * @returns {Boolean}
	 */
	claim (settlement) {
		if (this._ruins.sid === null) {
			this._ruins.sid = settlement.id();
			this.core().world().lock_hex(this.location(), settlement.id());
			return true;
		}
		return false;
	}

	/**
	 * Unclaim the ruins.
	 *
	 * @public
	 * @param {settlement} settlement
	 * @returns {Boolean}
	 */
	unclaim (settlement) {
		if (settlement.id() === this._ruins.sid) {
			this._ruins.sid = null;
			this.core().world().unlock_hex(this.location());
			return true;
		}
		return false;
	}

	/**
	 * Export settlement data.
	 *
	 * @returns {Object}
	 * @public
	 */
	export () {
		const data = {
			properties: this.properties(),
			trades: this.get_trades(),
			resources: this.get_resources(),
			army: this.army(),
			navy: this.navy(),
			buildings: this.export_buildings(),
			mercenary: this.mercenary(),
			heroes: this.heroes(),
			location: this.location(),
			ruins: this.ruins()
		};
		if (this.is_player()) {
			data.status = this.status();
		}
		return data;
	}

	/**
	 * Get the settlement properties.
	 *
	 * @public
	 * @returns {Object}
	 */
	properties () {
		return this._properties;
	}

	/**
	 * Get/set if the settlement is waterside (can build ships).
	 * 
	 * @public
	 * @returns {Boolean}
	 */
	waterside (value) {
		if (typeof value !== 'undefined') {
			this._properties.waterside = value;
		}
		return this._properties.waterside;
	}

	/**
	 * Get/set the name of this settlement.
	 * 
	 * @public
	 * @param {String} value
	 * @returns {String}
	 */
	name (value) {
		if (typeof value !== 'undefined') {
			this._properties.name = value;
		}
		return this._properties.name;
	}

	/**
	 * Return a pointer to the game core.
	 * 
	 * @public
	 * @returns {game}
	 */
	core () {
		return this._core;
	}

	/**
	 * Raise the level of this settlement.
	 * 
	 * @public
	 * @returns {settlement}
	 */
	level_up () {
		const level = this.level();
		this.fame(this.core().level_to_fame(level));
		this._properties.level++;
		this._properties.population = this.level() * game.POPULATION_PER_LEVEL;
		this.core().ui().log('The city of ' + this.name() + ' is now level ' + this.level() + '.');
		return this;
	}

	/**
	 * Rename this settlement.
	 * 
	 * @public
	 * @param {String} value
	 * @returns {String}
	 */
	rename (value) {
		return this.name(value);
	}

	/**
	 * Get the rank of this settlement
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_rank () {
		const half_level = Math.round(this.level() / 2);
		const rank = {
			fame: this.fame(),
			prestige: this.prestige(),
			espionage: this.espionage(),
			score: Math.floor((
				(this.fame() / half_level) + (this.prestige() / half_level) +
				(this.espionage() / half_level)
			) / half_level)
		};
		return rank;
	}
	
	/**
	 * Get/set the ruler object of this settlement.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {Object}
	 */
	ruler (value) {
		if (typeof value !== 'undefined') {
			this._properties.ruler = value;
		}
		return this._properties.ruler;
	}

	/**
	 * Get/set the level of this settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	level (value) {
		if (typeof value !== 'undefined') {
			this._properties.level = value;
		}
		return this._properties.level;
	}

	/**
	 * Get/set the personality of the ruler of this settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Object}
	 */
	personality (value) {
		if (typeof value !== 'undefined') {
			this._properties.ruler.personality = value;
		}
		return {
			id: this._properties.ruler.personality,
			name: game.PERSONALITIES[this._properties.ruler.personality].capitalize()
		};
	}

	/**
	 * Get/set the climate of the area of this settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Object}
	 */
	climate (value) {
		if (typeof value !== 'undefined') {
			this._properties.climate = value;
		}
		return {
			id: this._properties.climate,
			name: game.CLIMATES[this._properties.climate].capitalize()
		};
	}
	
	/**
	 * Get/set the nationality of this settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Object}
	 */
	nationality (value) {
		if (typeof value !== 'undefined') {
			this._properties.nationality = value;
		}
		return {
			id: this._properties.nationality,
			name: game.NATIONS[this._properties.nationality].capitalize()
		};
	}

	/**
	 * Get/set the icon of this settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	icon (value) {
		if (typeof value !== 'undefined') {
			this._properties.icon = value;
		}
		return this._properties.icon;
	}

	/**
	 * Get/set the id of this settlement.
	 *
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	id (value) {
		if (typeof value !== 'undefined') {
			this._properties.id = id;
		}
		return this._properties.id;
	}

	/**
	 * Check if this settlement is a player settlement.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_player () {
		return this._properties.player;
	}

	/**
	 * Return the type of this settlement.
	 *
	 * @public
	 * @returns {Number}
	 */
	get_type () {
		return this._properties.type;
	}

	/**
	 * Return the population of this settlement.
	 *
	 * @public
	 * @returns {Number}
	 */
	population (value) {
		if (typeof value !== 'undefined') {
			this._properties.population = value;
		}
		return this._properties.population;
	}

	/**
	 * Check if this settlement is a city.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_city () {
		return this._properties.type === game.CITY;
	}

	/**
	 * Check if this settlement is a metropolis.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_metropolis () {
		return this._properties.type === game.METROPOLIS;
	}

	/**
	 * Check if this settlement is a camp.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_camp () {
		return this._properties.type === game.CAMP;
	}

	/**
	 * Check if this settlement is a village.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_village () {
		return this._properties.type === game.VILLAGE;
	}

	/**
	 * Check if this settlement is a ruin.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_ruins () {
		return this._properties.type === game.RUINS;
	}

	/**
	 * Refresh the heroes in the Tavern.
	 *
	 * @public
	 * @returns {settlement}
	 */
	refresh_heroes () {
		if (this.is_building_built('tavern')) {
			// TODO
		}
	}

	/**
	 * Check if the player settlement's nationality and the one passed as parameter
	 * nationality are the same.
	 *
	 * @param {String|settlement|Number} settlement
	 * @returns {Boolean}
	 * @public
	 */
	has_same_nationality (settlement) {
		if (typeof settlement === 'object' && this.nationality().id ===
			settlement.nationality().id) {
			return true;
		} else if (typeof settlement === 'number' || typeof settlement === 'string') {
			const _settlement = this.core().get_settlement(settlement);
			if (typeof _settlement !== 'undefined') {
				if (this.nationality().id === _settlement.nationality().id) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Get/set the heroes of the settlement.
	 *
	 * @public
	 * @returns {Object}
	 */
	heroes (value) {
		if (typeof value !== 'undefined') {
			this._heroes = value;
		}
		return this._heroes;
	}

	/**
	 * Get/set the location of the settlement.
	 *
	 * @public
	 * @param {Object} value
	 * @returns {Object}
	 */
	location (value) {
		if (typeof value !== 'undefined') {
			this._location = value;
		}
		return this._location;
	}

	/**
	 * Change this settlement's type to city.
	 *
	 * @public
	 * @returns {settlement}
	 */
	to_city () {
		this._properties.type = game.CITY;
	}

	/**
	 * Change this settlement's type to village.
	 *
	 * @public
	 * @returns {settlement}
	 */
	to_village () {
		this._properties.type = game.VILLAGE;
	}

	/**
	 * Change this settlement's type to camp.
	 *
	 * @public
	 * @returns {settlement}
	 */
	to_camp () {
		this._properties.type = game.CAMP;
	}

	/**
	 * Change this settlement's type to metropolis.
	 *
	 * @public
	 * @returns {settlement}
	 */
	to_metropolis () {
		this._properties.type = game.METROPOLIS;
	}

	/**
	 * Change this settlement's type to ruins.
	 *
	 * @public
	 * @returns {settlement}
	 */
	to_ruins () {
		this._properties.type = game.RUINS;
	}

	/**
	 * Check if the settlement has soldiers in its army.
	 *
	 * @public
	 * @param {Object} data
	 * @returns {Boolean}
	 */
	has_soldiers (data) {
		const army = this.army();
		for (let item in army) {
			if (army[item] - data[item] < 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Adjust costs for the campaign.
	 *
	 * @public
	 * @param {Object} cost
	 * @param {Number} duration
	 * @param {Object} resources
	 * @returns {Object}
	 */
	adjust_campaign_cost (cost, duration, resources) {
		let mission_costs = cost;
		for (let item in mission_costs) {
			if (item === 'coins') {
				mission_costs[item] = Math.ceil(cost[item] * duration);
			} else if (item === 'provisions') {
				mission_costs[item] = Math.ceil((cost[item] * duration) / 4);
			}
		}
		if (typeof resources !== 'undefined') {
			let merged_costs = $.extend({}, resources);
			for (let item in mission_costs) {
				if (merged_costs[item]) {
					merged_costs[item] += mission_costs[item];
				} else {
					merged_costs[item] = mission_costs[item];
				}
			}
			return merged_costs;
		}
		return mission_costs;
	}

	/**
	 * Remove soldiers from the settlement's army (to create another army).
	 *
	 * @public
	 * @param {Object} data
	 * @returns {Boolean}
	 */
	split_army (data) {
		let army = this.army();
		if (this.has_soldiers(data)) {
			for (let item in army) {
				if (army[item] - data[item] >= 0) {
					army[item] = army[item] - data[item];
				} else {
					army[item] = 0;
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * Get the color of the settlement.
	 *
	 * @public
	 * @returns {String}
	 */
	color () {
		return this._properties.color;
	}

	/**
	 * Check if the settlement has ships in its navy.
	 *
	 * @public
	 * @param {Object} data
	 * @returns {Boolean}
	 */
	has_ships (data) {
		let navy = this.navy();
		for (let item in navy) {
			if (navy[item] - data[item] < 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Remove ships from the settlement's navy (to create another navy).
	 *
	 * @public
	 * @param {Object} data
	 * @returns {Boolean}
	 */
	split_navy (data) {
		let navy = this.navy();
		if (this.has_ships(data)) {
			for (let item in navy) {
				if (navy[item] - data[item] >= 0) {
					navy[item] = navy[item] - data[item];
				} else {
					navy[item] = 0;
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * Return the number of the ships in this settlement's navy.
	 * 
	 * @public
	 * @param {Object} navy
	 * @returns {Object}
	 */
	num_ships (navy) {
		let total = 0;
		if (typeof navy === 'undefined') {
			navy = this._navy;
		}
		for (let item in navy) {
			if (typeof navy[item] !== 'undefined') {
				total = total + navy[item];
			}
		}
		return total;
	}

	/**
	 * Return the number of the soldiers in this settlement's army.
	 * 
	 * @public
	 * @param {Object} army
	 * @returns {Object}
	 */
	num_soldiers (army) {
		let total = 0;
		if (typeof army === 'undefined') {
			army = this._army;
		}
		for (let item in army) {
			if (typeof army[item] !== 'undefined') {
				total += army[item];
			}
		}
		return total;
	}

	/**
	 * Merge two armies.
	 *
	 * @public
	 * @param {Object} army
	 */
	merge_army (army) {
		const _army = this.army();
		let merged_army = $.extend({}, _army);
		for (let item in army) {
			if (merged_army[item]) {
				merged_army[item] += army[item];
			} else {
				merged_army[item] = army[item];
			}
		}
		this._army = merged_army;
	}

	/**
	 * Merge two navies.
	 *
	 * @public
	 * @param {Object} navy
	 */
	merge_navy (navy) {
		const _navy = this.navy();
		let merged_navy = $.extend({}, _navy);
		for (let item in navy) {
			if (merged_navy[item]) {
				merged_navy[item] += navy[item];
			} else {
				merged_navy[item] = navy[item];
			}
		}
		this._navy = merged_navy;
	}

	/**
	 * Method for the setup of the settlement's army.
	 *
	 * @public
	 * @param {Object} params
	 * @returns {Object}
	 */
	load_army (params) {
		let army = {};
		for (let item in game.SOLDIERS) {
			if (typeof params !== 'undefined' && typeof params[item] !== 'undefined') {
				army[item] = params[item];
			} else {
				army[item] = 0;
			}
		}
		return army;
	}

	/**
	 * Internal method for the initial setup of the settlement's navy.
	 *
	 * @private
	 * @param {Object} params
	 * @returns {Object}
	 */
	load_navy (params) {
		let navy = {};
		for (let item in game.SHIPS) {
			if (typeof params !== 'undefined' && typeof params[item] !== 'undefined') {
				navy[item] = params[item];
			} else {
				navy[item] = 0;
			}
		}
		return navy;
	}

	/**
	 * Get the list of settlement mercenary armies.
	 *
	 * @public
	 * @param {Array} value
	 * @returns {Array}
	 */
	mercenary (value) {
		if (typeof value !== 'undefined') {
			this._mercenary = value;
		}
		return this._mercenary;
	}

	/**
	 * Check if this settlement can build ships.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_build_ships () {
		return this.is_building_built('shipyard');
	}

	/**
	 * Check if this settlement can recruit soldiers.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_recruit_soldiers () {
		return this.is_building_built('barracks');
	}

	/**
	 * Recruit a soldier for the settlement's army.
	 * 
	 * @public
	 * @param {String} name
	 * @returns {Boolean}
	 */
	recruit_mercenary_army (name) {
		for (let i = 0; i < game.MERCENARIES.length; i++) {
			if (name === game.MERCENARIES[i].handle) {
				const price = game.MERCENARIES[i].cost;
				if (this.dec_coins(price) === false) {
					return false;
				}
				const army = {
					id: i,
					handle: name,
					army: {}
				};
				for (let item in game.SOLDIERS) {
					if (typeof game.MERCENARIES[i].army[item] !== 'undefined') {
						army.army[item] = game.MERCENARIES[i].army[item];
					} else {
						army.army[item] = 0;
					}
				}
				this._mercenary.push(army);
				if (this.is_player()) {
					this.core().ui().notify('The mercenaries of the ' +
						game.MERCENARIES[i].name + ' are now available for skirmish missions ' +
						'for the duration of one year.', 'Mercenaries recruited.');
				}
				this.core().ui().log('game', 'The city of ' + this.name() + ' hired the ' +
					'mercenaries of ' + game.MERCENARIES[i].name + '.');
				this.core().save_and_refresh();
				return true;
			}
		}
		return false;
	}

	/**
	 * Construct a ship for the settlement's navy.
	 * 
	 * @public
	 * @param {String} ship_name
	 * @returns {Boolean}
	 */
	recruit_ship (ship_name) {
		if (typeof this._navy[ship_name] !== 'undefined' && this._navy[ship_name] !== null ) {
			this._navy[ship_name] = this._navy[ship_name] + 1;
		} else {
			this._navy[ship_name] = 1;
		}
		if (this.is_player()) {
			this.core().save_and_refresh();
		}
		return true;
	}

	/**
	 * Recruit a soldier for the settlement's army.
	 * 
	 * @public
	 * @param {String} soldier_name
	 * @returns {Boolean}
	 */
	recruit_soldier (soldier_name) {
		if (typeof this._army[soldier_name] !== 'undefined' && this._army[soldier_name] !== null ) {
			this._army[soldier_name] = this._army[soldier_name] + 1;
		} else {
			this._army[soldier_name] = 1;
		}
		if (this.is_player()) {
			this.core().save_and_refresh();
		}
		return true;
	}

	/**
	 * Disband a ship from the settlement's navy.
	 * 
	 * @public
	 * @param {String} ship_name
	 * @returns {Boolean}
	 */
	disband_ship (ship_name) {
		if (typeof this._navy[ship_name] === 'undefined') {
			return false;
		} else {
			if (this._navy[ship_name] - 1 >= 0) {
				this._navy[ship_name] = this._navy[ship_name] - 1;
			} else {
				this._navy[ship_name] = 0;
			}
		}
		return true;
	}

	/**
	 * Disband a soldier from the settlement's army.
	 * 
	 * @public
	 * @param {String} soldier_name
	 * @returns {Boolean}
	 */
	disband_soldier (soldier_name) {
		if (typeof this._army[soldier_name] === 'undefined') {
			return false;
		} else {
			if (this._army[soldier_name] - 1 >= 0) {
				this._army[soldier_name] = this._army[soldier_name] - 1;
			} else {
				this._army[soldier_name] = 0;
			}
		}
		return true;
	}

	/**
	 * Set the navy of the settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {settlement}
	 */
	set_navy (value) {
		this._navy = value;
		return this;
	}

	/**
	 * Set the soldiers of the settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {settlement}
	 */
	set_army (value) {
		this._army = value;
		return this;
	}

	/**
	 * Release all the mercenary armies.
	 * 
	 * @public
	 * @returns {settlement}
	 */
	release_mercenaries () {
		this._mercenary = [];
		return this;
	}

	/**
	 * Get the total number of soldiers available in this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 */
	army () {
		return this._army;
	}
		
	/**
	 * Get the total number of ships available in this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 */
	navy () {
		return this._navy;
	}

	/**
	 * Check if this mercenary army has already been recruited.
	 * 
	 * @public
	 * @param {String} handle
	 * @returns {Boolean}
	 */
	is_mercenary_recruited (handle) {
		for (let i = 0; i < this._mercenary.length; i++) {
			if (typeof this._mercenary[i] !== 'undefined') {
				if (this._mercenary[i].handle === handle) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Release a recruited mercenary army.
	 *
	 * @public
	 * @param {Number} id
	 * @returns {Boolean}
	 */
	release_mercenary (id) {
		if (typeof this._mercenary[id] !== 'undefined') {
			const mercenary_army_data = game.MERCENARIES[id];
			this._mercenary.splice(id, 1);
			if (this.is_player()) {
				this.core().ui().notify(mercenary_army_data.name + ' has been ' +
					'released from its duties.');
			}
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Get the list of settlement buildings, for export reasons.
	 *
	 * @public
	 * @returns {Array}
	 */
	export_buildings () {
		const buildings_list = [];
		for (let i = 0; i < this._buildings.length; i++) {
			if (typeof this._buildings[i] !== 'undefined') {
				buildings_list.push({
					handle: this._buildings[i].handle,
					level: this._buildings[i].level,
					stopped: this._buildings[i].is_stopped()
				});
			}
		}
		return buildings_list;
	}

	/**
	 * Return a pointer to the specified building in this settlement by the specified
	 * handle.
	 * 
	 * @public
	 * @param {String} handle
	 * @returns {building|Boolean}
	 */
	get_building (handle) {
		const buildings = this.get_buildings();
		if (typeof handle === 'string') {
			for (let i = 0; i < buildings.length; i++) {
				if (typeof buildings[i] !== 'undefined') {
					if (buildings[i].type === handle) {
						return buildings[i];
					}
				}
			}
		}
		return false;
	}

	/**
	 * Internal method for creating a building.
	 *
	 * @private
	 * @param {String|Object} building
	 * @param {Boolean} hidden
	 * returns {Boolean}
	 */
	_build (_building, hidden) {
		hidden = (typeof hidden !== 'undefined') && hidden === true ? true : false;
		const handle = typeof _building.handle !== 'undefined' ? _building.handle : _building;
		const level = typeof _building.level !== 'undefined' ? _building.level : 1;
		const stopped = typeof _building.stopped !== 'undefined' ? _building.stopped : false;
		const building_data = this.get_building_data(handle);
		if (building_data) {
			if (level > 1) {
				building_data.level = level;
			}
			let new_building = new building({
				settlement: this,
				type: handle,
				data: building_data,
				hidden,
				stopped
			});
			this._buildings.push(new_building);
			return true;
		}
		return false;
	}

	/**
	 * Internal function for building the specified buildings, bypassing
	 * the requirements.
	 * 
	 * @public
	 * @param {String|Object} building_type
	 * @param {Boolean} hidden
	 * @returns {Boolean}
	 */
	setup_initial_buildings (building_type, hidden) {
		if (typeof building_type === 'object') {
			for (let i = 0; i < building_type.length; i++) {
				this._build(building_type[i], hidden);
			}
			return true;
		} else {
			this._build(building_type, hidden);
			return true;
		}
	}

	/**
	 * Get the building data.
	 *
	 * @public
	 * @param {String} handle
	 * @returns {Object|Boolean}
	 */
	get_building_data (handle) {
		const id = game.BUILDINGS.findIndexByHandle(handle);
		if (id !== false) {
			return game.BUILDINGS[id];
		}
		return false;
	}

	/**
	 * Build the specified building.
	 * 
	 * @public
	 * @param {String} building_type
	 * @returns {building|Boolean}
	 */
	build (building_type) {
		const building_data = this.get_building_data(building_type);
		if (building_data) {
			if ((typeof building_data.requires.settlement_level !== 'undefined') &&
				(this._properties.level < building_data.requires.settlement_level)) {
				if (this.is_player()) {
					this.core().ui().error('Your city level is too low to construct this building.');
				}
				return false;
			}
			if ((typeof building_data.requires.climate !== 'undefined') &&
				($.inArray(this.climate().id, building_data.requires.climate) === -1)) {
				if (this.is_player()) {
					this.core().ui().error('Your city lacks the required fertility and ' +
						'climate to construct this building.');
				}
				return false;
			}
			if ((typeof building_data.requires.research !== 'undefined') &&
				(!this.core().has_research(building_data.requires.research))) {
				if (this.is_player()) {
					this.core().ui().error('Your city is missing the `' +
						this.core().get_research_config_data(building_data.requires.research).name +
						'` research needed to construct this building.');
				}
				return false;
			}
			if (typeof building_data.requires.buildings !== 'undefined') {
				const required = building_data.requires.buildings;
				for (let item in required) {
					if (!this.is_building_built(item, required[item])) {
						const _z = this.core().get_building_config_data(item);
						if (_z) {
							if (this.is_player()) {
								this.core().ui().error('You don`t have the required level ' +
									required[item] + ' ' + _z.name + '.');
							}
						}
						return false;
					}
				}
			}
			if (!this.has_resources(building_data.cost)) {
				if (this.is_player()) {
					this.core().ui().error('You don`t have enough resources to ' +
						'construct this building.');
				}
				return false;
			}
			if (!this.remove_resources(building_data.cost)) {
				return galse;
			}
			const _building = new building({
				settlement: this,
				type: building_type,
				data: building_data
			});
			this._buildings.push(_building);
			this.raise_prestige();
			if (this.is_player()) {
				this.core().save_and_refresh();
				this.core().ui().citymap_scrollto_building(_building);
				this.core().ui().notify('A new ' + _building.name + ' was just ' +
					'built in your city.');
				$('.tips').tipsy({
					gravity: $.fn.tipsy.autoNS,
					html: true
				});
			}
			return _building;
		}
		return false;
	}

	/**
	 * Check if the specified building is already built.
	 * 
	 * @public
	 * @param {String} handle
	 * @param {Number} level
	 * @returns {Boolean}
	 */
	is_building_built (handle, level) {
		if (typeof level === 'undefined') {
			level = 1;
		}
		const buildings = this.get_buildings();
		for (let i = 0; i < buildings.length; i++) {
			if (typeof buildings[i] !== 'undefined') {
				if (buildings[i].type === handle && buildings[i].level >= level) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Get the list of all the buildings in this settlement.
	 * 
	 * @public
	 * @returns {Array}
	 */
	get_buildings () {
		return this._buildings;
	}

	/**
	 * Perform diplomacy missions.
	 *
	 * @public
	 * @param {Number|settlement} settlement
	 * @param {Number} mode
	 * @returns {Boolean}
	 */
	diplomacy (settlement, mode) {
		if (typeof settlement === 'object') {
			settlement = settlement.id();
		}
		if (typeof settlement === 'number') {
			this._status[settlement].status = mode;
			if (mode === game.DIPLOMACY_WAR) {
				this.core().do_achievement('declarewar');
				this.reset_influence(settlement);
			} else if (mode === game.DIPLOMACY_ALLIANCE) {
				this.core().do_achievement('gotyourback');
				this.set_influence(settlement, game.MAX_INFLUENCE_VALUE);
			} else if (mode === game.DIPLOMACY_PACT) {
				this.core().do_achievement('pactish');
				this.set_influence(settlement, Math.ceil(game.MAX_INFLUENCE_VALUE / 2));
			} else if (mode === game.DIPLOMACY_CEASE_FIRE) {
				this.set_influence(settlement, Math.ceil(game.MAX_INFLUENCE_VALUE / 4));
			} else if (mode === game.DIPLOMACY_VASSAL) {
				this.core().do_achievement('youaremine');
				this.set_influence(settlement, game.MAX_INFLUENCE_VALUE);
			}
			this.core().save_and_refresh();
			return true;
		}
		return false;
	}

	/**
	 * Get/set the diplomatic status with another settlement.
	 *
	 * @public
	 * @param {Number} settlement
	 * @param {Number} value
	 * @returns {Number}
	 */
	status (settlement, value) {
		if (typeof value !== 'undefined') {
			this._status[settlement] = value;
		}
		if (typeof settlement !== 'undefined') {
			return this._status[settlement];
		} else {
			return this._status;
		}
	}

	/**
	 * Check if this settlement can recruit heroes.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_recruit_heroes () {
		return this.is_building_built('tavern');
	}

	/**
	 * Check if this settlement can conduct diplomatic missions.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_diplomacy () {
		return this.is_building_built('embassy');
	}

	/**
	 * Returns the influenceof this settlement with a specific settlement.
	 * 
	 * @public
	 * @param {String} settlement
	 * @returns {Number}
	 */
	get_influence_with_settlement (settlement) {
		if (typeof settlement === 'number') {
			return this._status[settlement].influence;
		} else if (typeof settlement === 'object') {
			return this._status[settlement.id()].influence;
		} else if (typeof settlement === 'string') {
			return this._status[this.core().get_settlement(settlement)].influence;
		}
	}

	/**
	 * Decrease the influence of this settlement.
	 * 
	 * @public
	 * @param {String} settlement
	 * @param {Number} value
	 * @returns {Number}
	 */
	lower_influence (settlement, value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.set_influence(settlement, this.get_influence_with_settlement(settlement) - value);
	}

	/**
	 * Set the influence with the specified settlement to this value.
	 *
	 * @public
	 * @param {settlement} settlement
	 * @param {Number} value
	 * @returns {Number}
	 */
	set_influence (settlement, value) {
		if (typeof settlement === 'object') {
			settlement = settlement.id();
		} else if (typeof settlement === 'string') {
			settlement = this.core().get_settlement(settlement);
		}
		if (value < game.MIN_INFLUENCE_VALUE || this._status[settlement].influence < game.MIN_INFLUENCE_VALUE) {
			this._status[settlement].influence = game.MIN_INFLUENCE_VALUE;
		} else {
			this._status[settlement].influence = value;
		}
		if (this._status[settlement].influence >= game.MAX_INFLUENCE_VALUE) {
			this._status[settlement].influence = game.MAX_INFLUENCE_VALUE;
		}
		return this.get_influence_with_settlement(settlement);
	}

	/**
	 * Increase the influence of this settlement.
	 * 
	 * @public
	 * @param {String} settlement
	 * @param {Number} value
	 * @returns {Number}
	 */
	raise_influence (settlement, value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.set_influence(settlement, this.get_influence_with_settlement(settlement) + value);
	}

	/**
	 * Reset the influence of this settlement.
	 * 
	 * @param {Number} s_id
	 * @returns {settlement}
	 * @public
	 */
	reset_influence (s_id) {
		this.set_influence(s_id, game.MIN_INFLUENCE_VALUE);
		return this;
	}
		
	/**
	 * Return the diplomacy status of this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_diplomacy_status (settlement) {
		return {
			id: this._status[settlement].status,
			name: game.DIPLOMACIES[this._status[settlement].status].capitalize()
		};
	}

	/**
	 * Raise the espionage of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	raise_espionage (value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.espionage(this.espionage() + value);
	}

	/**
	 * Lower the espionage of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	lower_espionage (value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.espionage(this.espionage() - value);
	}

	/**
	 * Reset the espionage of this settlement.
	 * 
	 * @returns {Number}
	 * @public
	 */
	reset_espionage () {
		return this.espionage(game.MIN_ESPIONAGE_VALUE);
	}

	/**
	 * Get/set the espionage of this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 * @param {Number} value
	 */
	espionage (value) {
		if (typeof value !== 'undefined') {
			if (value < game.MIN_ESPIONAGE_VALUE || this.resources.espionage < game.MIN_ESPIONAGE_VALUE) {
				this.resources.espionage = game.MIN_ESPIONAGE_VALUE;
			} else {
				this.resources.espionage = value;
			}
			if (this.resources.espionage >= game.MAX_ESPIONAGE_VALUE) {
				this.resources.espionage = game.MAX_ESPIONAGE_VALUE;
			}
		}
		return this.resources.espionage;
	}

	/**
	 * Increase this settlement's fame by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	raise_fame (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.fame(this.fame() + amount);
	}

	/**
	 * Decrease this settlement's fame by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	lower_fame (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.fame(this.fame() - amount);
	}

	/**
	 * Get/set this settlement's fame.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	fame (value) {
		if (typeof value !== 'undefined') {
			if (value < game.MIN_FAME_VALUE || this.resources.fame < game.MIN_FAME_VALUE) {
				this.resources.fame = game.MIN_FAME_VALUE;
			} else {
				this.resources.fame = value;
			}
			return value;
		} else {
			return this.resources.fame;
		}
	}

	/**
	 * Reset the fame of this settlement.
	 * 
	 * @returns {Number}
	 * @public
	 */
	reset_fame () {
		return this.fame(game.MIN_FAME_VALUE);
	}

	/**
	 * Raise the prestige of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	raise_prestige (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.prestige(this.prestige() + amount);
	}

	/**
	 * Lower the prestige of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	lower_prestige (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.prestige(this.prestige() - amount);
	}

	/**
	 * Reset the prestige of this settlement.
	 * 
	 * @returns {Number}
	 * @public
	 */
	reset_prestige () {
		return this.prestige(game.MIN_PRESTIGE_VALUE);
	}

	/**
	 * Get/set the prestige of this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 * @param {Number} value
	 */
	prestige (value) {
		if (typeof value !== 'undefined') {
			if (value < game.MIN_PRESTIGE_VALUE || this.resources.prestige < game.MIN_PRESTIGE_VALUE) {
				this.resources.prestige = game.MIN_PRESTIGE_VALUE;
			} else {
				this.resources.prestige = value;
			}
			if (this.resources.prestige >= game.MAX_PRESTIGE_VALUE) {
				this.resources.prestige = game.MAX_PRESTIGE_VALUE;
			}
		}
		return this.resources.prestige;
	}

	/**
	 * Change religion of your settlement.
	 *
	 * @public
	 * @param {Number|String} id
	 * @returns {Boolean}
	 */
	change_religion (id) {
		if (this.faith() !== game.MAX_FAITH_VALUE && id !== 0) {
			if (this.is_player()) {
				this.core().ui().error('You don`t have enough faith to switch religions.');
			}
			return false;
		}
		if ((typeof id === 'number' && this.religion().id === id) || (typeof id === 'string' && this.religion().name === id)) {
			if (this.is_player()) {
				this.core().ui().error('You cannot switch religion to your already existing one.');
			}
			return false;
		}
		if (!this.religion(id)) {
			if (this.is_player()) {
				this.core().ui().error('Unable to switch religion to the specified one.');
			}
			return false;
		}
		this.reset_faith();
		this.refresh_heroes();
		if (this.is_player()) {
			this.core().ui().notify('Your settlement`s new religion is <strong>' + this.religion().name + '</strong>', 'Religion Adopted', false, game.NOTIFY_RELIGION);
		}
		this.core().save_and_refresh();
		return true;
	}

	/**
	 * Get/set the religion of this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	religion (value) {
		if (typeof value !== 'undefined') {
			if (typeof value === 'number') {
				this._properties.religion = value;
				return true;
			} else if (typeof value === 'string') {
				const pos = $.inArray(value, game.RELIGIONS);
				if (pos !== -1) {
					this._properties.religion = pos;
					return true;
				}
			}
		}
		return {
			id: this._properties.religion,
			name: game.RELIGIONS[this._properties.religion].capitalize()
		};
	}

	/**
	 * Raise the faith of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	raise_faith (value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.faith(this.faith() + value);
	}

	/**
	 * Lower the faith of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	lower_faith (value) {
		if (typeof value === 'undefined') {
			value = 1;
		}
		return this.faith(this.faith() - value);
	}

	/**
	 * Reset the faith of this settlement.
	 * 
	 * @returns {Number}
	 * @public
	 */
	reset_faith () {
		return this.faith(game.MIN_FAITH_VALUE);
	}

	/**
	 * Get/set the faith of this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 * @param {Number} value
	 */
	faith (value) {
		if (typeof value !== 'undefined') {
			if (value < game.MIN_FAITH_VALUE || this.resources.faith < game.MIN_FAITH_VALUE) {
				this.resources.faith = game.MIN_FAITH_VALUE;
			} else {
				this.resources.faith = value;
			}
			if (this.resources.faith >= game.MAX_FAITH_VALUE) {
				this.resources.faith = game.MAX_FAITH_VALUE;
			}
		}
		return this.resources.faith;
	}

	/**
	 * Check if this settlement can recruit soldiers.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_research () {
		return this.is_building_built('academy');
	}

	/**
	 * Raise the research of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	raise_research (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.research(this.research() + amount);
	}

	/**
	 * Lower the research of this settlement by the specified amount.
	 * 
	 * @public
	 * @param {Number} amount
	 * @returns {Number}
	 */
	lower_research (amount) {
		if (typeof amount === 'undefined') {
			amount = 1;
		}
		return this.research(this.research() - amount);
	}

	/**
	 * Reset the research of this settlement.
	 * 
	 * @returns {Number}
	 * @public
	 */
	reset_research () {
		return this.research(game.MIN_RESEARCH_VALUE);
	}

	/**
	 * Get/set the research of this settlement.
	 * 
	 * @public
	 * @returns {Number}
	 * @param {Number} value
	 */
	research (value) {
		if (typeof value !== 'undefined') {
			if (value < game.MIN_RESEARCH_VALUE || this.resources.research < game.MIN_RESEARCH_VALUE) {
				this.resources.research = game.MIN_RESEARCH_VALUE;
			} else {
				this.resources.research = value;
			}
			if (this.resources.research >= game.MAX_RESEARCH_VALUE) {
				this.resources.research = game.MAX_RESEARCH_VALUE;
			}
		}
		return this.resources.research;
	}

	/**
	 * Merge resources from a source into settlement's storage.
	 *
	 * @public
	 * @param {Object} resources
	 * @returns {settlement}
	 */
	merge_resources (resources) {
		if (typeof resources !== 'undefined') {
			for (let item in resources) {
				if (!game.is_virtual_resource(item)) {
					this.add_to_storage(item, resources[item]);
				}
			}
		}
		return this;
	}

	/**
	 * Get resources from the settlement's storage as spoils of war.
	 *
	 * @public
	 * @returns {Object}
	 */
	get_spoils () {
		const resources = this.get_resources();
		let tmp_res = Object.keys(resources);
		const spoils = {};
		let resource;
		let random_resource;
		let count = 0;
		while (count < 3) {
			random_resource = tmp_res[Math.floor(Math.random() * tmp_res.length)];
			resource = resources[random_resource];
			if (!game.is_virtual_resource(random_resource)) {
				if (resource > 0) {
					if (this.remove_resource(random_resource, resource)) {
						spoils[random_resource] = resource;
						count++;
					}
				}
			}
		}
		return spoils;
	}

	/**
	 * Increase this settlement's coins by the specified amount.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	inc_coins (value) {
		return this.coins(this.coins() + value);
	}
		
	/**
	 * Decrease this settlement's coins by the specified amount.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	dec_coins (value) {
		if (!this.has_coins(value)) {
			return false;
		}
		this.coins(this.coins() - value);
		return true;
	}
		
	/**
	 * Get/set the coins of the settlement.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	coins (value) {
		if (typeof value !== 'undefined') {
			this.resources.coins = value;
		}
		return this.resources.coins;
	}

	/**
	 * Get/set the storage space of this settlement.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {Object}
	 */
	storage (value) {
		if (typeof value !== 'undefined') {
			this._properties.storage = value;
		}
		let storage = 0;
		for (let item in this.get_resources()) {
			if (!game.is_virtual_resource(item)) {
				storage += this.get_resources()[item];
			}
		}
		return {
			occupied: storage,
			all: this._properties.storage
		};
	}
		
	/**
	 * Adjust the resources according to the settlement owner.
	 *
	 * @private
	 * @returns {settlement}
	 */
	_fill_resources () {
		for (let item in game.RESOURCES) {
			if (typeof this.resources[item] === 'undefined') {
				this.resources[item] = 0;
			}
		}
		return this;
	}

	/**
	 * Add a specified amount of a resource to the storage of this settlement.
	 * 
	 * @public
	 * @param {String} item
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	add_to_storage (item, amount) {
		let res;
		if (!game.resource_exists(item)) {
			return false;
		}
		if (!this.is_ruins()) {
			if (!this.has_storage_space_for(item, amount)) {
				return false;
			}
		}
		res = this.get_resources();
		if (typeof res[item] !== 'undefined') {
			res[item] = res[item] + amount;
		} else {
			res[item] = amount;
		}
		return true;
	}
		
	/**
	 * Check if the settlement has the required coins to create this building.
	 * 
	 * @public
	 * @param {Number} coins
	 * @returns {Boolean}
	 */
	has_coins (coins) {
		if (this.coins() - coins < 0) {
			if (this.is_player()) {
				this.core().ui().error(this.name() + ' doesn`t have enough ' + game.get_resource_name('coins') + '.');
			}
			return false;
		}
		return true;
	}

	/**
	 * Remove the specified resources from the settlement's storage.
	 *
	 * @public
	 * @param {Object} resources
	 * @returns {Boolean}
	 */
	remove_resources (resources) {
		let good = true;
		for (let item in resources) {
			good = this.remove_resource(item, resources[item]);
			if (good === false) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Remove the amount of specified resource from the settlement's storage.
	 *
	 * @public
	 * @param {String} resource
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	remove_resource (resource, amount) {
		const resources = this.get_resources();
		resources[resource] = resources[resource] - amount;
		if (resources[resource] < 0) {
			resources[resource] = 0;
		}
		return true;
	}

	/**
	 * Check if the settlement has storage space for the amount of specified resource.
	 *
	 * @public
	 * @param {String|Object} resources
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	has_storage_space_for (resources, amount) {
		let total = 0;
		if (typeof amount === 'undefined') {
			for (let item in resources) {
				if (!game.is_virtual_resource(item)) {
					total += resources[item];
				}
			}
		} else {
			if (!game.is_virtual_resource(resources)) {
				total += amount;
			}
		}
		let storage = this.storage();
		if ((storage.occupied + total) > storage.all) {
			return false;
		}
		return true;
	}

	/**
	 * Check if the settlement is urban.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	is_urban () {
		if (this.is_city() || this.is_metropolis()) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Check if the settlement has any of the specified resources.
	 *
	 * @public
	 * @param {Object} resources
	 * @returns {Boolean}
	 */
	has_any_resources (resources) {
		let good = false;
		for (let item in resources) {
			good = this.has_resource(item, resources[item]);
			if (good === true) {
				return item;
			}
		}
		return false;
	}

	/**
	 * Check if the settlement has the specified resources.
	 *
	 * @public
	 * @param {Object} resources
	 * @returns {Boolean}
	 */
	has_resources (resources) {
		let good = true;
		for (let item in resources) {
			good = this.has_resource(item, resources[item]);
			if (good === false) {
				return false;
			}
		}
		return good;
	}

	/**
	 * Check if the settlement has the amount of specified resource.
	 *
	 * @public
	 * @param {String} resource
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	has_resource (resource, amount) {
		const resources = this.get_resources();
		if (!game.resource_exists(resource)) {
			return false;
		}
		if (resources[resource] - amount < 0) {
			return false;
		}
		return true;
	}

	/**
	 * Get the resources available in this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_resources () {
		return this.resources;
	}
		
	/**
	 * Set the resources of the settlement.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {settlement}
	 */
	set_resources (value) {
		this.resources = value;
		return this;
	}
	
	/**
	 * Check if this settlement can trade resources.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	can_trade () {
		return this.is_building_built('tradingpost');
	}

	/**
	 * Buy the specified goods from a settlement.
	 * 
	 * @public
	 * @param {settlement|String|Number} settlement
	 * @param {String} resource
	 * @param {Number} amount
	 * @param {Boolean} is_auctioneer
	 * @returns {Object|Boolean}
	 */
	buy_from_settlement (settlement, resource, amount, is_auctioneer) {
		if (!game.resource_exists(resource)) {
			if (this.is_player()) {
				this.core().ui().error('The resource you specified does not exist.');
			}
			return false;
		}
		if (this.can_trade()) {
			let _settlement;
			let discount;
			if (typeof settlement === 'string' || typeof settlement === 'number') {
				_settlement = this.core().get_settlement(settlement);
				if (settlement === false) {
					if (this.is_player()) {
						this.core().ui().error('The settlement of <strong>' + settlement + '</strong> does not exist.');
					}
					return false;
				}
			} else {
				_settlement = settlement;
				settlement = _settlement.name();
			}
			const is_double = this.religion().id === _settlement.religion().id ? true : false;
			const trades = _settlement.get_trades();
			if (trades === null) {
				if (this.is_player()) {
					this.core().ui().error('The settlement of <strong>' + settlement + '</strong> does not trade any goods.');
				}
				return false;
			}
			if (typeof trades.exports === 'undefined') {
				if (this.is_player()) {
					this.core().ui().error('The settlement of <strong>' + settlement + '</strong> does not export any goods.');
				}
				return false;
			}
			for (let item in trades.exports) {
				if (item === resource) {
					if (typeof amount === 'undefined') {
						amount = trades.exports[item];
					}
					discount = Math.ceil((game.RESOURCES[item].price * game.TRADES_ADDITION) / 100);
					if (typeof is_auctioneer !== 'undefined' && is_auctioneer === true) {
						discount = Math.ceil(discount + Math.ceil((game.RESOURCES[item].price * game.AUCTIONEER_DISCOUNT) / 100));
					}
					const price = game.calc_price_plus_discount(amount, item, discount);
					const s_price = game.calc_price(amount, item);
					const item_discount_price = Math.ceil(game.RESOURCES[item].price + discount);
					if (!this.has_storage_space_for(amount)) {
						this.core().ui().error(this.name() + ' does not have enough storage ' +
							'space for <strong>' + amount + '</strong> ' + game.get_resource_name(item) + '.');
						return false;
					}
					if (this.dec_coins(price) === false) {
						return false;
					}
					if (!_settlement.has_resource(item, amount)) {
						return false;
					}
					if (!_settlement.remove_resource(item, amount)) {
						return false;
					}
					_settlement.inc_coins(s_price);
					this.add_to_storage(item, amount);
					this.remove_from_exports(_settlement, item, amount);
					this.raise_influence(_settlement.id(), (is_double ? game.IMPORT_INFLUENCE * 2 :
						game.IMPORT_INFLUENCE));
					this.raise_prestige(is_double ? game.IMPORT_PRESTIGE * 2 : game.IMPORT_PRESTIGE);
					this.raise_fame(game.FAME_PER_TRADE);
					this.core().ui().refresh();
					if (this.is_player()) {
						this.core().ui().notify(this.name() + ' bought <strong>' + amount + 
							'</strong> ' + game.get_resource_name(item) + ' from ' + settlement + 
							' for <strong>' + item_discount_price + '</strong> ' + 
							game.get_resource_name('coins') + ' each, for a total of <strong>' + 
							price + '</strong> ' + game.get_resource_name('coins') + 
							'.', 'World Market');
					}
					return {
						buyer: this.name(),
						amount,
						goods: game.get_resource_name(item),
						seller: settlement,
						price: Math.round(game.RESOURCES[item].price + discount),
						totalPrice: price
					};
				}
			}
			if (this.is_player()) {
				this.core().ui().error('The settlement of <strong>' + settlement +
					'</strong> does not export the requested goods.');
			}
		}
		return false;
	}
		
	/**
	 * Perform a trades reset (resets all amounts of resources available
	 * for trade and randomize the amount.
	 * 
	 * @public
	 * @returns {Boolean}
	 */
	reset_trades () {
		const data = this.core().generate_random_resources(false, this.get_type());
		let new_resources = data.resources;
		new_resources.coins = this.resources.coins;
		new_resources.fame = this.resources.fame;
		new_resources.prestige = this.resources.prestige;
		new_resources.espionage = this.resources.espionage;
		new_resources.research = this.resources.research;
		new_resources.faith = this.resources.faith;
		this.resources = new_resources;
		if (this.is_urban()) {
			this.trades = data.trades;
		}
		return true;
	}

	/**
	 * Sell the specified goods to a settlement.
	 * 
	 * @public
	 * @param {settlement|String|Number} settlement
	 * @param {String} resource
	 * @param {Number} amount
	 * @returns {Object|Boolean}
	 */
	sell_to_settlement (settlement, resource, amount) {
		if (!game.resource_exists(resource)) {
			if (this.is_player()) {
				this.core().ui().error('The resource you specified does not exist.');
			}
			return false;
		}
		if (this.can_trade()) {
			let _settlement;
			if (typeof settlement === 'string' || typeof settlement === 'number') {
				_settlement = this.core().get_settlement(settlement);
				if (settlement === false) {
					if (this.is_player()) {
						this.core().ui().error(settlement + ' does not exist.');
					}
					return false;
				}
			} else {
				_settlement = settlement;
			}
			const is_double = this.religion().id === _settlement.religion().id ? true : false;
			const trades = _settlement.get_trades();
			if (trades === null) {
				if (this.is_player()) {
					this.core().ui().error(settlement + ' does not trade any goods.');
				}
				return false;
			}
			if (typeof trades.imports === 'undefined') {
				if (this.is_player()) {
					this.core().ui().error(settlement + ' does not import any goods.');
				}
				return false;
			}
			for (let item in trades.imports) {
				if (item === resource) {
					if (typeof amount === 'undefined') {
						amount = trades.imports[item];
					}
					const discount = Math.ceil((game.RESOURCES[item].price * game.TRADES_DISCOUNT) / 100);
					const price = game.calc_price_minus_discount(amount, item, discount);
					const s_price = game.calc_price(amount, item);
					const item_discount_price = Math.ceil(game.RESOURCES[item].price - discount);
					if (!this.has_resource(item, amount)) {
						this.core().ui().error(this.name() + ' does not have enough ' + game.get_resource_name(item) + ' to sell.');
						return false;
					}
					if (!this.remove_resource(item, amount)) {
						return false;
					}
					this.inc_coins(price);
					if (!_settlement.dec_coins(s_price)) {
						if (this.is_player()) {
							this.core().ui().error(settlement + ' does not have enough ' + game.get_resource_name('coins') + '.');
						}
						return false;
					}
					_settlement.add_to_storage(item, amount);
					this.remove_from_imports(_settlement, item, amount);
					this.raise_influence(_settlement.id(), (is_double ? game.EXPORT_INFLUENCE * 2 : game.EXPORT_INFLUENCE));
					this.raise_prestige(is_double ? game.EXPORT_PRESTIGE * 2 : game.EXPORT_PRESTIGE);
					this.raise_fame(game.FAME_PER_TRADE);
					this.core().ui().refresh();
					if (this.is_player()) {
						this.core().ui().notify(this.name() + ' sold <strong>' + amount +
							'</strong> ' + game.get_resource_name(item) + ' to ' + settlement +
							' for <strong>' + item_discount_price + '</strong> ' +
							game.get_resource_name('coins') + ' each, for a total of <strong>' +
							price + '</strong> ' + game.get_resource_name('coins') +
							'.', 'World Market');
					}
					return {
						seller: this.name(),
						amount,
						goods: game.get_resource_name(item),
						buyer: settlement,
						price: Math.round(game.RESOURCES[item].price - discount),
						totalPrice: price
					};
				}
			}
			if (this.is_player()) {
				this.core().ui().error(settlement + ' does not import the specified goods.');
			}
		}
		return false;
	}
		
	/**
	 * Remove a specified amount of a resource from the trade exports of a settlement.
	 * 
	 * @public
	 * @param {settlement} settlement
	 * @param {String} item
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	remove_from_exports (settlement, item, amount) {
		settlement.trades.exports[item] = settlement.trades.exports[item] - amount;
		return true;
	}

	/**
	 * Remove a specified amount of a resource from the trade imports of a settlement.
	 * 
	 * @public
	 * @param {settlement} settlement
	 * @param {String} item
	 * @param {Number} amount
	 * @returns {Boolean}
	 */
	remove_from_imports (settlement, item, amount) {
		settlement.trades.imports[item] = settlement.trades.imports[item] - amount;
		return true;
	}

	/**
	 * Get the imports and exports of this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_trades () {
		return this.trades;
	}

	/**
	 * Get the exports of this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_trades_exports () {
		return this.trades.exports;
	}

	/**
	 * Get the imports of this settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get_trades_imports () {
		return this.trades.imports;
	}

	/**
	 * Format settlement's name into something nicer.
	 *
	 * @public
	 * @returns {String}
	 */
	nice_name () {
		if (this.is_metropolis()) {
			return 'Metropolis of ' + this.name();
		} else if (this.is_city()) {
			return 'City of ' + this.name();
		} else if (this.is_village()) {
			return 'Village of ' + this.name();
		} else if (this.is_camp()) {
			return 'Raider Camp ' + this.name();
		} else if (this.is_ruins()) {
			return 'Ruins of ' + this.name();
		} else {
			return '';
		}
	}

	/**
	 * Set the imports and exports of this settlement.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {settlement}
	 */
	set_trades (value) {
		this.trades = value;
		return this;
	}
}
