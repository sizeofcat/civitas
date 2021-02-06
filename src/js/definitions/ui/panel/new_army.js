/**
 * Create a new army panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_new_army
 * @extends ui_panel
 * @returns {ui_panel_new_army}
 */
class ui_panel_new_army extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_new_army}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = ui.campaign_panel_template('New army');
		params.id = 'new-army';
		params.on_show = function(params) {
			let self = this;
			let core = this.core();
			let my_settlement = core.get_settlement();
			let settlement = params.data;
			let settlements = core.get_settlements();
			let army = my_settlement.army();
			let location = my_settlement.location();
			let distance = core.world().get_distance_in_days(location, settlement.location());
			this.assigned_army = {};
			this.assigned_navy = {};
			for (let item in army) {
				this.assigned_army[item] = army[item];
			}
			if (my_settlement.can_build_ships()) {
				let navy = my_settlement.navy();
				for (let item in navy) {
					this.assigned_navy[item] = navy[item];
				}
			}
			let _t = '<div class="column">' +
				'<fieldset>' +
					'<legend>Initial costs</legend>' +
					'<dl>';
			for (let item in game.ARMY_COSTS) {
				let _cost = 0;
				if (item === 'coins') {
					_cost = game.ARMY_COSTS[item] * distance;
				} else if (item === 'provisions') {
					_cost = Math.ceil((game.ARMY_COSTS[item] * distance) / 4);
				} else {
					_cost = game.ARMY_COSTS[item];
				}
				_t += '<dt>' + game.nice_numbers(_cost) + '</dt>' +
					'<dd>' + core.ui().resource_small_img(item) + '</dd>';
			}
			_t += '</dl>' +
				'</fieldset>';
			if (typeof army !== 'undefined') {
				_t += '<fieldset>' +
					'<legend>Soldiers</legend>';
				for (let item in army) {
					_t += '<div class="army-item">' +
						'<a href="#" data-max="' + army[item] +
						'" data-soldier="' + item + '" class="army-item-inc">+</a>' +
						'<a href="#" data-max="' + army[item] +
						'" data-soldier="' + item + '" class="army-item-dec">-</a>' +
						'<img class="tips" title="' +
						game.SOLDIERS[item].name + '" src="' +
						game.ASSETS_URL + 'images/assets/army/' +
						item.toLowerCase().replace(/ /g,"_") + '.png" />' +
						'<span class="amount">' + army[item] + '</span>' +
					'</div>';
				}
				_t += '</fieldset>';
			}
			_t += '<fieldset>' +
				'<legend>Destination</legend>' +
				'<select class="army-destination">' +
					'<option value="0">-- select --</option>';
			for (let i = 1; i < settlements.length; i++) {
				if ((!settlements[i].is_ruins()) ||
					(core.has_research('archeology') && settlements[i].is_ruins())) {
					_t += '<option ' + (settlement && (settlements[i].id()
						=== settlement.id()) ? 'selected ' : '') + 'value="' +
						settlements[i].id() + '">' + settlements[i].nice_name() + '</option>';
				}
			}
			_t += '</select>' +
				'</fieldset>' +
			'</div>' +
			'<div class="column">';
			if (my_settlement.can_build_ships()) {
				if (typeof navy !== 'undefined') {
					_t += '<fieldset>' +
						'<legend>Ships</legend>';
					for (let item in navy) {
						_t += '<div class="navy-item">' +
								'<a href="#" data-max="' + navy[item] +
								'" data-ship="' + item + '" class="navy-item-inc">+</a>' +
								'<a href="#" data-max="' + navy[item] +
								'" data-ship="' + item + '" class="navy-item-dec">-</a>' +
								'<img class="tips" title="' +
								item + '" src="' + game.ASSETS_URL +
								'images/assets/army/' +
								item.toLowerCase().replace(/ /g,"_") + '.png" />' +
								'<span class="amount">' + navy[item] +
								'</span>' +
							'</div>';
					}
					_t += '</fieldset>';
				}
			}
			if (my_settlement.can_recruit_heroes()) {
				let heroes = my_settlement.heroes();
				_t += '<fieldset>' +
					'<legend>Hero</legend>' +
					'<select class="army-hero">';
				if ($.isEmptyObject(heroes)) {
					_t += '<option value="0">-- no heroes available --</option>';
				} else {
					_t += '<option value="0">-- select --</option>';
					for (let i = 0; i < heroes.length; i++) {
						_t += '<option value="' + i + '">' + heroes[i] + '</option>';
					}
				}
				_t += '</select>' +
				'</fieldset>';
			} else {
				_t += '<p><strong>Note!</strong> Build a Tavern to be able to ' +
					'recruit powerful heroes and assign them to your armies.</p>';		
			}
			_t += '</div>' +
				'<div class="clearfix"></div>';
			$(this.handle + ' section').empty().append(_t);
			$(this.handle).on('click', '.navy-item-inc', function() {
				let max = parseInt($(this).data('max'), 10);
				let ship = $(this).data('ship');
				let current = parseInt($(this).parent().children('.amount').html(), 10);
				if (current + 1 <= max) {
					self.assigned_navy[ship] = current + 1;
					$(this).parent().children('.amount').html(current + 1);
				}
				return false;
			}).on('click', '.navy-item-dec', function() {
				let ship = $(this).data('ship');
				let current = parseInt($(this).parent().children('.amount').html(), 10);
				if (current - 1 >= 0) {
					self.assigned_navy[ship] = current - 1;
					$(this).parent().children('.amount').html(current - 1);
				}
				return false;
			}).on('click', '.army-item-inc', function() {
				let max = parseInt($(this).data('max'), 10);
				let soldier = $(this).data('soldier');
				let current = parseInt($(this).parent().children('.amount').html(), 10);
				if (current + 1 <= max) {
					self.assigned_army[soldier] = current + 1;
					$(this).parent().children('.amount').html(current + 1);
				}
				return false;
			}).on('click', '.army-item-dec', function() {
				let soldier = $(this).data('soldier');
				let current = parseInt($(this).parent().children('.amount').html(), 10);
				if (current - 1 >= 0) {
					self.assigned_army[soldier] = current - 1;
					$(this).parent().children('.amount').html(current - 1);
				}
				return false;
			}).on('click', '.dispatch', function() {
				if (!my_settlement.can_recruit_soldiers()) {
					core.ui().error('You will need to construct a Military Camp ' +
						'before being able to attack other settlements.');
					return false;
				}
				let destination = parseInt($(self.handle + ' .army-destination').val(), 10);
				if ((settlement && settlement.id() !== destination) || !settlement) {
					settlement = core.get_settlement(destination);
				}
				// TODO there is an error here when there is no shipyard to send navy.
				if (destination === 0 || !settlement ||
					(my_settlement.num_soldiers(self.assigned_army) === 0 &&
					my_settlement.num_ships(self.assigned_navy) === 0)) {
					core.ui().error('There was an error creating and dispatching ' +
						'the army, check the data you entered and try again.');
					return false;
				}
				if (core.queue_add(my_settlement, settlement,
					game.ACTION_CAMPAIGN, game.CAMPAIGN_ARMY, {
					army: self.assigned_army,
					navy: self.assigned_navy
				})) {
					core.do_achievement('sendarmy');
					self.destroy();
				} else {
					core.ui().error('There was an error creating and dispatching ' +
						'the army, check the data you entered and try again.');
				}
				return false;
			});
		};
		super(params);
	}
}
