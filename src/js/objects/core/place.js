/**
 * Main Game place object.
 * 
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class place
 * @returns {place}
 */
class place {
	
	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {place}
	 * @param {Object} params
	 */
	constructor (params) {
		this._core = params.core;
		this.resources = {
			current: {},
			required: {}
		};
		this.properties = {};
		this.properties.id = params.properties.id;
		this.properties.sid = params.properties.sid;
		this.properties.scouted = params.properties.scouted;
		this.properties.name = (typeof params.properties.name !== 'undefined') ?
			params.properties.name: game.get_random_unique(game.PLACES_NAMES);
		this.location = params.location;
		this.resources = params.resources;
		this.core().world().add_place(this);
		return this;
	}

	is_claimed () {
		if (this.properties.sid === null) {
			return false;
		} else {
			return this.properties.sid;
		}
	}

	is_scouted () {
		return this.properties.scouted;
	}

	id () {
		return this.properties.id;
	}

	name () {
		return this.properties.name;
	}

	scout () {
		this.properties.scouted = true;
	}

	claim (settlement) {
		if (this.properties.sid === null) {
			this.properties.sid = settlement.id();
			this.core().world().lock_hex(this.location, settlement.id());
			return true;
		}
		return false;
	}

	unclaim (settlement) {
		if (settlement.id() === this.properties.sid) {
			this.properties.sid = null;
			this.core().world().unlock_hex(this.location);
			return true;
		}
		return false;
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
	 * Export place data.
	 *
	 * @returns {Object}
	 * @public
	 */
	export () {
		const data = {
			properties: this.properties,
			location: this.location,
			resources: this.resources
		};
		return data;
	}
}
