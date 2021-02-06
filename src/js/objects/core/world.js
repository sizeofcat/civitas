/**
 * World object.
 * 
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class world
 * @returns {world}
 */
class world {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {world}
	 * @param {Object} params
	 */
	constructor (params) {
		this._core = params.core;
		this.seeds = {};
		this.colors = {
			background: '#64B4E1',
			ocean: '#64B5E1',
			grass: '#E6F59A',
			subtropical_desert: '#F2CD63',
			temperate_desert: '#F2CD63',
			taiga: '#E1C85A',
			shrubland: '#E1C859',
			beach: '#FFF899',
			scorched: '#E5F59A',
			bare: '#D1BE79',
			tundra: '#E5F59A',
			snow: '#DCDCE6',
			temperate_deciduous_forest: '#78AA46',
			temperate_rain_forest: '#78AA46',
			tropical_rain_forest: '#549D65',
			tropical_seasonal_forest: '#549D65',
			hills: '#E1C859',
			mountains: '#B37D1A',
			mountains_ice: '#DCDCE6'
		};
		this.seeds.moisture = typeof params.moisture !== 'undefined' &&
			params.moisture !== null ? params.moisture : this.seed();
		this.seeds.elevation = typeof params.elevation !== 'undefined' &&
			params.elevation !== null ? params.elevation : this.seed();
		this.data = typeof params.data !== 'undefined' ? params.data : [];
		if (this.data.length === 0) {
			this._create_array();
			this._generate();
		}
		return this;
	}

	/**
	 * Get a random number to seed the generator.
	 *
	 * @public
	 * @returns {Number}
	 */
	seed () {
		return Math.random() * (2147483646 - 1) + 1;
	}

	/**
	 * Get the terrain data as a string based on the elevation.
	 * 
	 * @public
	 * @param {Object} hex
	 * @returns {String}
	 */
	get_hex_terrain (hex) {
		let elevation = this.data[hex.y][hex.x].e;
		let moisture = this.data[hex.y][hex.x].m;
		if (elevation <= 0.1) {
			return 'ocean';
		} else if (elevation > 0.1 && elevation <= 0.15) {
			return 'beach';
		} else if (elevation > 0.15 && elevation <= 0.35) {
			if (moisture <= 0.30) {
				return 'subtropical_desert';
			} else if (moisture > 0.30 && moisture <= 0.45) {
				return 'grass';
			} else if (moisture > 0.45 && moisture <= 0.66) {
				return 'tropical_seasonal_forest';
			} else {
				return 'tropical_rain_forest';
			}
		} else if (elevation > 0.35 && elevation <= 0.75) {
			if (moisture <= 0.20) {
				return 'temperate_desert';
			} else if (moisture > 0.20 && moisture <= 0.50) {
				return 'grass';
			} else if (moisture > 0.50 && moisture <= 0.83) {
				return 'temperate_deciduous_forest';
			} else {
				return 'temperate_rain_forest';
			}
		} else if (elevation > 0.75 && elevation <= 0.8) {
			if (moisture <= 0.33) {
				return 'temperate_desert';
			} else if (moisture > 0.33 && moisture <= 0.66) {
				return 'shrubland';
			} else {
				return 'taiga';
			}
		} else if (elevation > 0.8 && elevation <= 0.85) {
			return 'hills';
		} else {
			if (moisture >= 0.8) {
				return 'mountains_ice';
			} else {
				return 'mountains';
			}
		}
	}

	/**
	 * Convert a terrain type into climate type.
	 *
	 * @param {String} terrain
	 * @public
	 * @returns {Boolean|Object}
	 */
	get_climate_from_terrain (terrain) {
		if (terrain === 'tropical_rain_forest' || terrain === 'tropical_seasonal_forest') {
			return {
				id: game.CLIMATE_TROPICAL,
				name: game.CLIMATES[game.CLIMATE_TROPICAL]
			};
		} else if (terrain === 'subtropical_desert' || terrain === 'temperate_desert') {
			return {
				id: game.CLIMATE_ARID,
				name: game.CLIMATES[game.CLIMATE_ARID]
			};
		} else if (terrain === 'mountains_ice' || terrain === 'snow') {
			return {
				id: game.CLIMATE_POLAR,
				name: game.CLIMATES[game.CLIMATE_POLAR]
			};
		} else if (terrain === 'grass' || terrain === 'temperate_deciduous_forest' ||
			terrain === 'temperate_rain_forest' || terrain === 'hills' ||
			terrain === 'mountains' || terrain === 'taiga' || terrain === 'shrubland' ||
			terrain === 'beach' || terrain === 'scorched' || terrain === 'tundra' ||
			terrain === 'bare') {
			return {
				id: game.CLIMATE_TEMPERATE,
				name: game.CLIMATES[game.CLIMATE_TEMPERATE]
			};
		} else {
			return false;
		}
	}

	/**
	 * Convert a climate type into terrain type.
	 *
	 * @param {Number} climate
	 * @public
	 * @returns {Boolean|Array}
	 */
	get_terrain_from_climate (climate) {
		if (climate === game.CLIMATE_TROPICAL) {
			return [
				'tropical_rain_forest',
				'tropical_seasonal_forest'
			];
		} else if (climate === game.CLIMATE_ARID) {
			return [
				'subtropical_desert',
				'temperate_desert'
			];
		} else if (climate === game.CLIMATE_POLAR) {
			return [
				'mountains_ice',
				'snow'
			];
		} else if (climate === game.CLIMATE_TEMPERATE) {
			return [
				'grass',
				'temperate_deciduous_forest',
				'temperate_rain_forest',
				'hills',
				'mountains',
				'taiga',
				'shrubland',
				'beach',
				'scorched',
				'tundra',
				'bare'
			];
		} else {
			return false;
		}
	}

	/**
	 * Get a random world location
	 * 
	 * @public
	 * @param {String} terrain
	 * @returns {Object}
	 */
	get_random_location (terrain) {
		const hex = {
			x: game.get_random(0, game.WORLD_SIZE_WIDTH - 1),
			y: game.get_random(0, game.WORLD_SIZE_HEIGHT - 1)
		};
		if (typeof terrain !== 'undefined') {
			if (!this.hex_is_water(hex) && !this.hex_is_locked(hex)) {
				//if ($.inArray(data[hex.y][hex.x].t, terrain) !== -1) {
					return hex;
				//}
			}
			return this.get_random_location(terrain);
		} else {
			if (!this.hex_is_water(hex) && !this.hex_is_locked(hex)) {
				return hex;
			}
			return this.get_random_location(terrain);
		}
	}

	/**
	 * Get the world properties.
	 *
	 * @public
	 * @returns {Object}
	 */
	properties () {
		return this._properties;
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
	 * Check if the specified hex is ocean.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {Boolean}
	 */
	hex_is_water (hex) {
		if (this.get_hex_terrain(hex) === 'ocean') {
			return true;
		}
		return false;
	}

	/**
	 * Lock the specified hex as being inside the borders of a settlement.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {String}
	 */
	lock_hex (hex, lid) {
		this.set_hex(hex, 'l', true);
		this.set_hex(hex, 'lid', lid);
	}

	/**
	 * Unlock the specified hex.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {String}
	 */
	unlock_hex (hex) {
		this.set_hex(hex, 'l', false);
		this.set_hex(hex, 'lid', null);
	}

	/**
	 * Check if the specified hex is locked.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {Boolean}
	 */
	hex_is_locked (hex) {
		return this.get_hex(hex.x, hex.y).l;
	}

	/**
	 * Lock the specified hex by the settlement id.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {Object}
	 */
	hex_locked_by (hex) {
		return this.get_hex(hex.x, hex.y).lid;
	}

	/**
	 * Return the moisture data for the specified hex.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {Number}
	 */
	get_hex_moisture (hex) {
		return this.get_hex(hex.x, hex.y).m;
	}

	/**
	 * Return the elevation data for the specified hex.
	 *
	 * @public
	 * @param {Object} hex
	 * @returns {Number}
	 */
	get_hex_elevation (hex) {
		return this.get_hex(hex.x, hex.y).e;
	}

	/**
	 * Return the specified hex raw data.
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Object}
	 */
	get_hex (x, y) {
		return this.data[y][x];
	}

	/**
	 * Set the specified hex data.
	 *
	 * @public
	 * @param {Object} hex
	 * @param {String} key
	 * @param {String|Number|Array|Object} value
	 * @returns {Object}
	 */
	set_hex (hex, key, value) {
		return this.data[hex.y][hex.x][key] = value;
	}

	/**
	 * Add a settlement into the world data.
	 *
	 * @public
	 * @param {settlement} settlement
	 * @returns {world}
	 */
	add_settlement (settlement) {
		const location = settlement.location();
		if (settlement.is_ruins()) {
			this.set_hex(location, 'p', settlement.id());
			if (settlement.is_claimed() === false) {
				this.lock_hex(location, settlement.id());
			} else {
				this.lock_hex(location, settlement.is_claimed());
			}
		} else {
			this.set_hex(location, 's', settlement.id());
			this.set_hex(location, 'n', settlement.name());
			this.lock_hex(location, settlement.id());
			this.calc_neighbours(settlement);
		}
		return this;
	}

	/**
	 * Remove a settlement from the world data.
	 *
	 * @public
	 * @param {settlement} settlement
	 * @returns {world}
	 */
	remove_city (settlement) {
		const location = settlement.location();
		const id = settlement.id();
		this.data[location.y][location.x].s = null;
		this.data[location.y][location.x].n = null;
		for (let x = 0; x < game.WORLD_SIZE_WIDTH; x++) {
			for (let y = 0; y < game.WORLD_SIZE_HEIGHT; y++) {
				if (this.data[y][x].lid === id) {
					this.data[y][x].lid = null;
					this.data[y][x].l = false;
				}
			}
		}
		//$('#worldmap-city-image' + location.y + '-' + location.x).remove();
		return this;
	}

	/**
	 * Create the raw multidimensional array.
	 *
	 * @private
	 * @returns {world}
	 */
	_create_array () {
		this.data = new Array(game.WORLD_SIZE_WIDTH);
		for (let i = 0; i < game.WORLD_SIZE_WIDTH; i += 1) {
			this.data[i] = new Array(game.WORLD_SIZE_HEIGHT);
		}
		for (let i = 0; i < game.WORLD_SIZE_WIDTH; i += 1) {
			for (let j = 0; j < game.WORLD_SIZE_HEIGHT; j += 1) {
				this.data[i][j] = {
					/* Elevation */
					e: 0,
					/* Moisture */
					m: 0,
					/* Place id */
					p: null,
					/* Settlement id */
					s: null,
					/* Settlement name */
					n: null,
					/* Locked */
					l: false,
					/* Locked to settlement id */
					lid: null
				};
			}
		}
		return this;
	}

	/**
	 * Generate the elevation and moisture maps.
	 *
	 * @private
	 * @returns {world}
	 */
	_generate () {
		function PMPRNG_create(seed) {
			var result = new PM_PRNG();
			result.seed = (typeof seed === "undefined") ? 1 : seed;
			return result;
		}
		let rng1 = PMPRNG_create(this.seeds.elevation);
		let rng2 = PMPRNG_create(this.seeds.moisture);
		let gen1 = new SimplexNoise(rng1.nextDouble.bind(rng1));
		let gen2 = new SimplexNoise(rng2.nextDouble.bind(rng2));
		function noise1(nx, ny) {
			return gen1.noise2D(nx, ny) / 2 + 0.5;
		}
		function noise2(nx, ny) {
			return gen2.noise2D(nx, ny) / 2 + 0.5;
		}
		for (let x = 0; x < game.WORLD_SIZE_HEIGHT; x++) {
			for (let y = 0; y < game.WORLD_SIZE_WIDTH; y++) {      
				let nx = x / game.WORLD_SIZE_HEIGHT - 0.5;
				let ny = y / game.WORLD_SIZE_WIDTH - 0.5;
				let e = (1.00 * noise1(1 * nx,  1 * ny)
					+ 0.77 * noise1(2 * nx,  2 * ny)
					+ 0.00 * noise1(4 * nx,  4 * ny)
					+ 0.00 * noise1(8 * nx,  8 * ny)
					+ 0.00 * noise1(16 * nx, 16 * ny)
					+ 0.00 * noise1(32 * nx, 32 * ny));
				e /= (1.00 + 0.77 + 0.00 + 0.00 + 0.00 + 0.00);
				e = Math.pow(e, game.WORLD_EROSION);
				this.data[y][x].e = e;
				let m = (1.00 * noise2(1 * nx,  1 * ny)
					+ 0.75 * noise2(2 * nx,  2 * ny)
					+ 0.33 * noise2(4 * nx,  4 * ny)
					+ 0.33 * noise2(8 * nx,  8 * ny)
					+ 0.33 * noise2(16 * nx, 16 * ny)
					+ 0.50 * noise2(32 * nx, 32 * ny));
				m /= (1.00 + 0.75 + 0.33 + 0.33 + 0.33 + 0.50);
				this.data[y][x].m = m;
			}
		}
		return this;
	}

	/**
	 * Get the list of all the neighbouring hexes to the specified settlement.
	 *
	 * @returns {Array}
	 * @public
	 */
	get_neighbours (settlement) {
		const hexes = [];
		const location = settlement.location();
		const neighbours = this.get_neighbouring_hexes(location.y, location.x);
		if (settlement.is_city()) {
			for (let z = 0; z < neighbours.length; z++) {
				hexes.push(neighbours[z]);
			}
		} else if (settlement.is_metropolis()) {
			for (let z = 0; z < neighbours.length; z++) {
				hexes.push(neighbours[z]);
				const new_neighbours = this.get_neighbouring_hexes(neighbours[z].y,
					neighbours[z].x);
				for (let u = 0; u < new_neighbours.length; u++) {
					hexes.push(new_neighbours[u]);
				}
			}
		}
		return hexes;
	}

	/**
	 * Lock neighbouring hexes.
	 *
	 * @public
	 * @returns {world}
	 */
	calc_neighbours (settlement) {
		let terrain;
		const neighbours = this.get_neighbours(settlement);
		for (let i = 0; i < neighbours.length; i++) {
			if ((neighbours[i].x >= 0 && neighbours[i].x < game.WORLD_SIZE_WIDTH) &&
				(neighbours[i].y >= 0 && neighbours[i].y < game.WORLD_SIZE_HEIGHT)) {
				terrain = this.get_hex_terrain(neighbours[i]);
				this.lock_hex(neighbours[i], settlement.id());
				if (terrain === 'ocean') {
					settlement.waterside(true);
				}
			}
		}
		return this;
	}

	get_neighbouring_hexes (y, x) {
		if (x % 2 === 0) {
			return [
				{
					x: x+1,
					y
				}, {
					x: x+1,
					y: y-1
				}, {
					x,
					y: y-1
				}, {
					x: x-1,
					y
				}, {
					x: x-1,
					y: y-1
				}, {
					x,
					y: y+1
				}
			];
		} else {
			return [
				{
					x: x+1,
					y
				}, {
					x: x+1,
					y: y+1
				}, {
					x,
					y: y-1
				}, {
					x: x-1,
					y
				}, {
					x: x-1,
					y: y+1
				}, {
					x,
					y: y+1
				}
			];
		}
	}

	/**
	 * Get the distance between two points.
	 *
	 * @param {Number} source
	 * @param {Number} destination
	 * @returns {Number}
	 */
	get_distance (source, destination) {
		return Math.floor(Math.sqrt(Math.pow(destination.x - source.x, 2) +
			Math.pow(destination.y - source.y, 2))) * 100;
	}

	/**
	 * Get the distance between two points in days
	 *
	 * @param {Number} source
	 * @param {Number} destination
	 * @returns {Number}
	 */
	get_distance_in_days (source, destination) {
		return Math.floor((Math.sqrt(Math.pow(destination.x - source.x, 2) +
			Math.pow(destination.y - source.y, 2)) * 100) / 15);
	}

	/**
	 * Draw the worldmap data to a HTML5 canvas.
	 *
	 * @public
	 * @returns {world}
	 */
	draw () {
		let settlements = this.core().get_settlements();
		let height = Math.sqrt(3) / 2 * game.WORLD_HEX_SIZE;
		let image_width = (1.5 * game.WORLD_SIZE_WIDTH +  0.5) * game.WORLD_HEX_SIZE;
		let image_height = (2 * game.WORLD_SIZE_HEIGHT  +  1) * height;
		$('.worldmap').empty().append('<canvas class="canvas-map"></canvas>');
		let canvas = $('.canvas-map').get(0);
		let currentHexX;
		let currentHexY;
		let offsetColumn = false;
		let __height = Math.sqrt(3) * game.WORLD_HEX_SIZE;
		let __width = 2 * game.WORLD_HEX_SIZE;
		let __side = (3 / 2) * game.WORLD_HEX_SIZE;
		canvas.width = image_width;
		canvas.height = image_height;
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = this.colors.background;
		ctx.fillRect(0, 0, image_width, image_height);
		for (let i = 0; i < game.WORLD_SIZE_WIDTH; ++i) {
			for (let j = 0; j < game.WORLD_SIZE_HEIGHT; ++j) {
				if (!offsetColumn) {
					currentHexX = i * __side;
					currentHexY = j * __height;
				} else {
					currentHexX = i * __side;
					currentHexY = (j * __height) + (__height * 0.5);
				}
				let terrain = this.get_hex_terrain({
					x: i,
					y: j
				});
				let color = this.colors[terrain];
				let opacity = 0.6;
				if (this.data[j][i].l === true) {
					let lid = this.data[j][i].lid;
					let pid = this.data[j][i].p;
					if (lid !== null && pid === null) {
						if (typeof settlements[lid] !== 'undefined') {
							color = settlements[lid].color();
						}
					} else if (lid !== null && pid !== null) {
						let ruin = this.core().get_settlement(pid);
						if (ruin) {
							if (ruin.is_claimed() !== false) {
								color = settlements[lid].color();
							}
						}
					}
					opacity = 0.2;
				}
				ctx.beginPath();
				ctx.moveTo(currentHexX + __width - __side, currentHexY);
				ctx.lineTo(currentHexX + __side, currentHexY);
				ctx.lineTo(currentHexX + __width, currentHexY + (__height / 2));
				ctx.lineTo(currentHexX + __side, currentHexY + __height);
				ctx.lineTo(currentHexX + __width - __side, currentHexY + __height);
				ctx.lineTo(currentHexX, currentHexY + (__height / 2));
				ctx.closePath();
				if (game.WORLD_GRID === true) {
					ctx.strokeStyle = "#666";
				} else {
					ctx.strokeStyle = color;
				}
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
				if (game.WORLD_BEAUTIFY === true) {
					this._apply_terrain(currentHexX, currentHexY, canvas, terrain, opacity);
				}
			}
			offsetColumn = !offsetColumn;
		}
		return this;
	}

	/**
	 * Apply the terrain features.
	 *
	 * @private
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Object} canvas
	 * @param {String} terrain
	 * @param {Number} opacity
	 * @returns {world}
	 */
	_apply_terrain (x, y, canvas, terrain, opacity) {
		let ctx = canvas.getContext('2d');
		let imageObject = new Image();
		let image_size = game.WORLD_HEX_SIZE * 36 / 24;
		imageObject.onload = function() {
			ctx.globalAlpha = opacity;
			ctx.drawImage(imageObject, x + 6, y + 2, image_size, image_size);
			ctx.globalAlpha = 1;
		};
		imageObject.src = game.ASSETS_URL + 'images/world/terrain/' + terrain + '.png';
		return this;
	}
}
