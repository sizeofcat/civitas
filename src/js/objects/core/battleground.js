/**
 * Battleground object.
 * 
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class battleground
 * @returns {battleground}
 */
class battleground {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {battleground}
	 * @param {Object} params
	 */
	constructor (params) {
		this._core = params.core;
		this._properties = {};
		this._elements = {};
		this._grid = [];
		this.done = false;
		this._stats = {
			attacking: {},
			defending: {}
		};
		this._current_turn = 1;
		this._properties.width = params.width;
		this._properties.height = params.height;
		this._elements.container = params.elements.container;
		this._elements.console = params.elements.console;
		this._elements.attack = params.elements.attack;
		this._elements.defense = params.elements.defense;
		this._attack = params.attack;
		this._defense = params.defense;
		if (params.on_win instanceof Function) {
			this.on_win = params.on_win;
		}
		if (params.on_lose instanceof Function) {
			this.on_lose = params.on_lose;
		}
		if (params.on_select instanceof Function) {
			this.on_select = params.on_select;
		}
		if (params.on_move instanceof Function) {
			this.on_move = params.on_move;
		}
		if (params.on_attack instanceof Function) {
			this.on_attack = params.on_attack;
		}
		if (params.on_end_turn instanceof Function) {
			this.on_end_turn = params.on_end_turn;
		}
		if (this._attack.city === this.core().get_settlement().id()) {
			this._player = 1;
			this._computer = 2;
		} else {
			this._player = 2;
			this._computer = 1;
		}
		this._setup();
		this.show_stats();
		return this;
	}

	/**
	 * Attack a hex cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	attack (cell) {
		let sx = this._from.x;
		let sy = this._from.y;
		let source = this._grid[sy][sx];
		let destination = this._grid[cell.y][cell.x];
		let is_ranged = game.SOLDIERS[source.item].ranged;
		let city = this.core().get_settlement(source.city);
		let city2 = this.core().get_settlement(destination.city);
		let remaining = 0;
		let _a;
		if (city && source.moved) {
			this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
				'</strong> already used up its turn.');
			return false;
		}
		if (source !== null && destination !== null && city && city2) {
			if (destination.side === game.BATTLEGROUND_DEFENSE) {
				_a = '_defense';
			} else {
				_a = '_attack';
			}
			if (typeof is_ranged !== 'undefined') {
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) > is_ranged) {
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> is not close enough for a ranged attack.');
					return false;
				}
				let attack = Math.ceil(source.attack / 2);
				let defense = destination.defense;
				if (defense - attack < 0) {
					this[_a].army[destination.item] = 0;
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> attacked ' + city2.name() + '`s <strong>' +
						game.SOLDIERS[destination.item].name + '</strong> for ' + attack +
						' damage from range and killed its opponent.');
					this._cell_empty(cell);
				} else {
					remaining = Math.ceil((defense - attack) / game.SOLDIERS[destination.item].defense);
					destination.total = remaining;
					this[_a].army[destination.item] = remaining;
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> attacked ' + city2.name() + '`s <strong>' +
						game.SOLDIERS[destination.item].name + '</strong> for ' + attack +
						' damage from range.');
				}
				this._cell_under_attack(cell);
				source.moved = true;
				this.redraw();
			} else {
				let can_move = game.SOLDIERS[this._grid[sy][sx].item].moves;
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) > can_move) {
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> doesn`t have a ranged attack.');
					return false;
				}
				let attack = Math.ceil(source.attack / 2);
				let defense = destination.defense;
				if (defense - attack < 0) {
					this[_a].army[destination.item] = 0;
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> attacked ' + city2.name() + '`s <strong>' +
						game.SOLDIERS[destination.item].name + '</strong> for ' + attack +
						' damage in melee and killed its opponent.');
					this._cell_empty(cell);
				} else {
					remaining = Math.ceil((defense - attack) / game.SOLDIERS[destination.item].defense);
					destination.total = remaining;
					this[_a].army[destination.item] = remaining;
					this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
						'</strong> attacked ' + city2.name() + '`s <strong>' +
						game.SOLDIERS[destination.item].name + '</strong> for ' + attack +
						' damage in melee.');
				}
				this._cell_under_attack(cell);
				source.moved = true;
				this.redraw();
			}
		}
		this._from = null;
		return true;
	}

	/**
	 * End the current turn.
	 *
	 * @public
	 * @returns {battleground}
	 */
	end_turn () {
		this._from = null;
		this._do_computer();
		for (let y = 0; y < this._grid.length; y++) {
			for (let x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] !== null) {
					this._grid[y][x].moved = false;
				}
			}
		}
		this._current_turn++;
		this.on_end_turn.call(self, this.num_turns());
		this.redraw();
		if (!this._done) {
			this.log('Turn <strong>' + this._current_turn + '</strong> started now.');
		}
		return this;
	}

	/**
	* Check the status of the current game.
	*
	* @private
	* @returns {Boolean}
	*/
	_check_status () {
		let city;
		if (!this._done) {
			if (this._stats.attacking.attack <= 0 || this._stats.attacking.defense <= 0 ||
				this._stats.defending.attack <= 0 || this._stats.defending.defense <= 0) {
				this._done = true;
				this._reset();
			}
			if (this._stats.attacking.attack <= 0 || this._stats.attacking.defense <= 0) {
				if (this._defense.city === this.core().get_settlement().id()) {
					this._on_win.call(this, this._defense, this._attack);
					this.on_win.call(this, this._defense, this._attack);
				} else {
					this._on_lose.call(this, this._defense, this._attack);
					this.on_lose.call(this, this._defense, this._attack);
				}
				city = this.core().get_settlement(this._defense.city);
			} else if (this._stats.defending.attack <= 0 || this._stats.defending.defense <= 0) {
				if (this._attack.city === this.core().get_settlement().id()) {
					this._on_win.call(this, this._attack, this._defense);
					this.on_win.call(this, this._attack, this._defense);
				} else {
					this._on_lose.call(this, this._attack, this._defense);
					this.on_lose.call(this, this._attack, this._defense);
				}
				city = this.core().get_settlement(this._attack.city);
			}
			if (this._done) {
				this.log(city.name() + ' won this battle!');
				this.show_stats();
			}
		}
		return false;
	}

	/**
	 * Display the battleground stats.
	 *
	 * @public
	 * @returns {Object}
	 */
	show_stats () {
		$(this._elements.attack).empty().append(
			this.core().get_settlement(this._attack.city).name() + ' ' +
			this._stats.attacking.attack + ' / ' + this._stats.attacking.defense);
		$(this._elements.defense).empty().append(
			this.core().get_settlement(this._defense.city).name() + ' ' +
			this._stats.defending.attack + ' / ' + this._stats.defending.defense);
		return {
			attack: this._attack,
			defense: this._defense
		};
	}

	/**
	 * Log a message to the battleground status.
	 *
	 * @public
	 * @param {String} message
	 * @returns {battleground}
	 */
	log (message) {
		$(this._elements.console).prepend('<p>' + message + '</p>');
		return this;
	}

	/**
	 * Reset and rebuild the battleground hex cell grid.
	 *
	 * @private
	 * @returns {battleground}
	 */
	_reset () {
		let mode = 'even';
		let template = '';
		for (let y = 0; y <= this._properties.height - 1; y++) {
			this._grid[y] = [];
			template += '<ol class="' + mode + '">';
			for (let x = 0; x <= this._properties.width - 1; x++) {
				this._grid[y][x] = null;
				template += '<li data-pos="' + x + '-' + y + '" data-x="' + x +
					'" data-y="' + y + '" class="cell empty"></li>';
			}
			template += '</ol>';
			if (mode === 'even') {
				mode = 'odd';
			} else {
				mode = 'even';
			}
		}
		$(this._elements.container).empty().append(template);
		return this;
	}

	/**
	 * Return the current hex cell grid.
	 *
	 * @public
	 * @returns {Array}
	 */
	grid () {
		return this._grid;
	}

	/**
	 * Get the current turn.
	 *
	 * @public
	 * @returns {Number}
	 */
	num_turns () {
		return this._current_turn;
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
	* Get the properties of this battleground.
	*
	* @public
	* @returns {Object}
	*/
	properties () {
		return this._properties;
	}

	/**
	 * Move closer to the enemy.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	_move_to_enemy (cell) {
		/*
		let sx = cell.x;
		let sy = cell.y;
		let source = this._grid[sy][sx];
		let can_move = game.SOLDIERS[source.item].moves;
		if (this._computer === 2) {
			// TODO
		}
		*/
		return false;
	}

	_do_computer () {
		for (let y = 0; y < this._grid.length; y++) {
			for (let x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] !== null && this._grid[y][x].side === this._computer) {
					let source = this._grid[y][x];
					this._from = {
						x,
						y
					};
					this._cell_select(this._from);
					if (game.SOLDIERS[source.item].ranged) {
						this._check_for_ranged_target(this._player);
					} else {
						this._check_for_melee_target(this._player);
					}
					this._move_to_enemy(this._from);
					this._from = null;
				}
			}
		}
		return true;
	}

	/**
	 * Computer check if there are any targets in melee.
	 *
	 * @private
	 * @param {Number} type
	 * @returns {Boolean}
	 */
	_check_for_melee_target (type) {
		if (this._from !== null) {
			let source = this._grid[this._from.y][this._from.x];
			let can_move = game.SOLDIERS[source.item].moves;
			for (let y = 0; y < this._grid.length; y++) {
				for (let x = 0; x < this._grid[y].length; x++) {
					if (source !== null && !source.moved && can_move &&
						(Math.abs(y - this._from.y) + Math.abs(x - this._from.x)) <= can_move) {
						if (this._grid[y][x] !== null && this._grid[y][x].side === type) {
							this.attack({
								x,
								y
							});
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Check if there are any targets in range.
	 *
	 * @private
	 * @param {Number} type
	 * @returns {Boolean}
	 */
	_check_for_ranged_target (type) {
		if (this._from !== null) {
			for (let y = 0; y < this._grid.length; y++) {
				for (let x = 0; x < this._grid[y].length; x++) {
					if (this._grid[y][x] !== null && this._grid[y][x].side === type) {
						this.attack({
							x,
							y
						});
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Internal callback for when someone wins the battleground.
	 *
	 * @private
	 * @param {Object} winner
	 * @param {Object} winner
	 * @returns {battleground}
	 */
	_on_win (winner, loser) {
		let my_settlement = this.core().get_settlement(winner.city);
		let settlement = this.core().get_settlement(loser.city);
		if (this._attack.city === winner.city) {
			// player was attacking and won.
			settlement.army = settlement.load_army(loser.army);
			settlement.navy = settlement.load_navy(loser.navy);
			let spoils = settlement.get_spoils();
			this.core().queue_add(settlement, my_settlement, game.ACTION_CAMPAIGN,
				game.CAMPAIGN_ARMY_RETURN, {
				army: winner.army,
				navy: winner.navy,
				resources: spoils
			});
		} else if (this._defense.city === winner.city) {
			// player was defending and won.
			my_settlement.army = my_settlement.load_army(winner.army);
			my_settlement.navy = my_settlement.load_navy(winner.navy);
			let has_loser_army = settlement.num_soldiers(loser.army);
			let has_loser_navy = settlement.num_ships(loser.navy);
			if (has_loser_army > 0 || has_loser_navy > 0) {
				this.core().queue_add(my_settlement, settlement, game.ACTION_CAMPAIGN,
					game.CAMPAIGN_ARMY_RETURN, {
					army: loser.army,
					navy: loser.navy,
					resources: {}
				});
			}
		}
		return this;
	}

	/**
	 * Internal callback for when someone loses the battleground.
	 *
	 * @private
	 * @param {Object} winner
	 * @param {Object} winner
	 * @returns {battleground}
	 */
	_on_lose (winner, loser) {
		let settlement = this.core().get_settlement(winner.city);
		let my_settlement = this.core().get_settlement(loser.city);
		if (this._attack.city === loser.city) {
			// player was attacking and lost.
			settlement.army = settlement.load_army(winner.army);
			settlement.navy = settlement.load_navy(winner.navy);
			let has_loser_army = settlement.num_soldiers(loser.army);
			let has_loser_navy = settlement.num_ships(loser.navy);
			if (has_loser_army > 0 || has_loser_navy > 0) {
				this.core().queue_add(settlement, my_settlement, game.ACTION_CAMPAIGN,
					game.CAMPAIGN_ARMY_RETURN, {
					army: loser.army,
					navy: loser.navy,
					resources: {}
				});
			}
		} else if (this._defense.city === loser.city) {
			// player was defending and lost.
			my_settlement.army = my_settlement.load_army(loser.army);
			my_settlement.navy = my_settlement.load_navy(loser.navy);
			let spoils = my_settlement.get_spoils();
			this.core().queue_add(my_settlement, settlement, game.ACTION_CAMPAIGN,
				game.CAMPAIGN_ARMY_RETURN, {
				army: winner.army,
				navy: winner.navy,
				resources: spoils
			});
		}
		return this;
	}

	/**
	 * Get the distance between two cells.
	 *
	 * @public
	 * @param {Object} cell1
	 * @param {Object} cell2
	 * @returns {Number}
	 */
	distance (cell1, cell2) {
		let delta_x = cell1.x - cell2.x;
		let delta_y = cell1.y - cell2.y;
		return ((Math.abs(delta_x) + Math.abs(delta_y) + Math.abs(delta_x - delta_y)) / 2);
	}

	/**
	 * Move the contents of one cell to another cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	move (cell) {
		let sx = this._from.x;
		let sy = this._from.y;
		if (this._from !== null && cell !== null) {
			let source = this._grid[sy][sx];
			let destination = this._grid[cell.y][cell.x];
			let city = this.core().get_settlement(source.city);
			if (source !== null && source.moved) {
				this.log(city.name() + '`s <strong>' + game.SOLDIERS[source.item].name +
					'</strong> already used up its turn.');
				return false;
			}
			if (source !== null && destination === null && city) {
				let can_move = game.SOLDIERS[this._grid[sy][sx].item].moves;
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) <= can_move) {
					this._grid[cell.y][cell.x] = this._grid[sy][sx];
					this._cell_empty(this._from);
					this._from = null;
					this._grid[cell.y][cell.x].moved = true;
					this.log(city.name() + '`s <strong>' +
						game.SOLDIERS[source.item].name + '</strong> moved to ' + 
						(cell.x + 1) + 'x' + (cell.y + 1) + '.');
					this.redraw();
					return true;
				} else {
					this.log(city.name() + '`s <strong>' +
						game.SOLDIERS[source.item].name + '</strong> is unable to ' +
						'move to the specified location.');
					return false;
				}
			}
		}
	}

	/**
	 * Highlight the cells around the currently selected (or hovered) cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {battleground}
	 */
	highlight_cells (cell) {
		this._cells_empty();
		let sx = cell.x;
		let sy = cell.y;
		let source = this._grid[sy][sx];
		if (source !== null) {
			let can_move = game.SOLDIERS[source.item].moves;
			for (let y = 0; y < this._grid.length; y++) {
				for (let x = 0; x < this._grid[y].length; x++) {
					if (!source.moved && can_move && (Math.abs(y - sy) +
						Math.abs(x - sx)) <= can_move) {
						if (this._grid[y][x] === null) {
							$(this._elements.container + ' .cell[data-pos=' + x +
								'-' + y + ']').addClass('canmove');
						}
					}
				}
			}
			let is_ranged = game.SOLDIERS[source.item].ranged;
			for (let y = 0; y < this._grid.length; y++) {
				for (let x = 0; x < this._grid[y].length; x++) {
					if (!source.moved && (Math.abs(y - sy) + Math.abs(x - sx)) <= is_ranged) {
						if (this._grid[y][x] === null) {
							$(this._elements.container + ' .cell[data-pos=' + x +
								'-' + y + ']').addClass('canattack');
						}
					}
				}
			}
		}
		return this;
	}

	/**
	 * Do a nice effect when a cell is under attack.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {battleground}
	 */
	_cell_under_attack (cell) {
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' +
			cell.y + ']').addClass('scale').delay(1000).queue(function() {
			$(this).removeClass('scale').dequeue();
		});
		return this;
	}

	/**
	 * Empty all the cells that are already empty.
	 *
	 * @private
	 * @returns {battleground}
	 */
	_cells_empty () {
		for (let y = 0; y < this._grid.length; y++) {
			for (let x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] === null) {
					this._cell_empty({
						x,
						y
					});
				}
			}
		}
		return this;
	}

	/**
	 * Empty one cell.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {battleground}
	 */
	_cell_empty (cell) {
		this._grid[cell.y][cell.x] = null;
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' + cell.y + ']')
			.removeData('side')
			.removeData('amount')
			.removeData('soldier')
			.addClass('empty')
			.removeClass('canmove canattack selected')
			.empty();
		return this;
	}

	/**
	 * Select a cell.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {battleground}
	 */
	_cell_select (cell) {
		$(this._elements.container + ' .cell').removeClass('selected canmove canattack');
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' +
			cell.y + ']').addClass('selected');
		this._from = cell;
		this.highlight_cells(cell);
		return this;
	}

	/**
	 * Add a cell to the battleground grid.
	 *
	 * @private
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Object} army
	 * @returns {battleground}
	 */
	_cell_add (x, y, army) {
		this._grid[y][x] = army;
		$(this._elements.container + ' .cell[data-pos=' + x + '-' + y + ']')
			.removeData('side')
			.removeData('amount')
			.removeData('soldier')
			.attr('data-side', army.side)
			.attr('data-amount', army.total)
			.attr('data-soldier', army.item)
			.removeClass('empty canmove canattack selected')
			.empty()
			.append('<span class="moves' + (army.moved === false ? ' has' : '') +
				'"></span><img class="tips" title="' + game.SOLDIERS[army.item].name +
				'" src="' + game.ASSETS_URL + 'images/assets/army/' + army.item +
				'.png" />' + '<span class="amount">' + army.total + '</span>');
		return this;
	}

	/**
	 * Redraw the grid.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	redraw () {
		let a_attack = 0;
		let a_defense = 0;
		let d_attack = 0;
		let d_defense = 0;
		for (let y = 0; y < this._grid.length; y++) {
			for (let x = 0; x < this._grid[y].length; x++) {
				let army = this._grid[y][x];
				if (army !== null && army.total > 0) {
					army.attack = army.total * game.SOLDIERS[army.item].attack;
					army.defense = army.total * game.SOLDIERS[army.item].defense;
					if (army.side === game.BATTLEGROUND_ATTACK) {
						a_attack += army.attack;
						a_defense += army.defense;
					} else {
						d_attack += army.attack;
						d_defense += army.defense;
					}
					this._cell_add(x, y, army);
				} else {
					this._cell_empty({
						x,
						y
					});
				}
			}
		}
		this._stats.attacking.attack = a_attack;
		this._stats.attacking.defense = a_defense;
		this._stats.defending.attack = d_attack;
		this._stats.defending.defense = d_defense;
		this.show_stats();
		this._check_status();
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		return true;
	}

	/**
	 * Setup the battleground hex grid.
	 *
	 * @private
	 * @returns {battleground}
	 */
	_setup () {
		let self = this;
		this._reset();
		let xx = 0;
		let xxx = 3;
		let yy;
		for (let item in this._attack.army) {
			if (this._attack.army[item] > 0) {
				if (game.SOLDIERS[item].siege === true) {
					yy = 0;
					xx = xxx;
					xxx++;
				} else {
					yy = 2;
				}
				this.add(xx, yy, 1, item, this._attack);
				xx++;
			}
		}
		xxx = 3;
		xx = 0;
		for (let item in this._defense.army) {
			if (this._defense.army[item] > 0) {
				if (game.SOLDIERS[item].siege === true) {
					yy = this._properties.width - 1;
					xx = xxx;
					xxx++;
				} else {
					yy = this._properties.width - 3;
				}
				this.add(xx, yy, 2, item, this._defense);
				xx++;
			}
		}
		$(this._elements.container).on('mouseover', '.cell', function () {
			if (self._from === null) {
				let from = {
					x: parseInt($(this).data('x'), 10),
					y: parseInt($(this).data('y'), 10)
				};
				self.highlight_cells(from);
			}
			return false;
		}).on('click', '.cell', function () {
			if ($(this).hasClass('empty')) {
				if (self._from !== null) {
					let to = {
						x: parseInt($(this).data('x'), 10),
						y: parseInt($(this).data('y'), 10)
					};
					self.move(to);
					self.on_move.call(self, self._from, to);
				}
			} else {
				if (parseInt($(this).data('side'), 10) === self._player) {
					if (!$(this).hasClass('selected')) {
						let from = {
							x: parseInt($(this).data('x'), 10),
							y: parseInt($(this).data('y'), 10)
						};
						self._cell_select(from);
						self.on_select.call(self, from);
					} else {
						self._from = null;
						$(self._elements.container + ' .cell').removeClass('selected canmove canattack');
					}
				} else if (parseInt($(this).data('side'), 10) === self._computer) {
					if (self._from !== null) {
						let to = {
							x: parseInt($(this).data('x'), 10),
							y: parseInt($(this).data('y'), 10)
						};
						self.attack(to);
						self.on_attack.call(self, self._from, to);
					}
				}
			}
			return false;
		});
		return this;
	}

	/**
	 * Add a hex cell to the battleground grid.
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} side
	 * @param {String} soldier
	 * @param {Object} settlement
	 * @returns {battleground}
	 */
	add (x, y, side, soldier, settlement) {
		this._cell_add(y, x, {
			item: soldier,
			city: settlement.city,
			total: settlement.army[soldier],
			attack: game.SOLDIERS[soldier].attack * settlement.army[soldier],
			defense: game.SOLDIERS[soldier].defense * settlement.army[soldier],
			side,
			moved: false
		});
		return this;
	}
}
