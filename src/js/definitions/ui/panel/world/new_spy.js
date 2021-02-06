/**
 * Create a new spy panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_new_spy
 * @extends ui_panel
 * @returns {ui_panel_new_spy}
 */
class ui_panel_new_spy extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_new_spy}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = ui.campaign_panel_template('New spy');
		params.id = 'new-spy';
		params.on_show = function(params) {
			let self = this;
			let core = this.core();
			let my_settlement = core.get_settlement();
			let settlement = params.data;
			let settlements = core.get_settlements();
			let espionage = my_settlement.espionage();
			let location = my_settlement.location();
			let distance = core.world().get_distance_in_days(location, settlement.location());
			let _t = '<fieldset>' +
				'<legend>Initial costs</legend>' +
				'<dl>';
			for (let item in game.SPY_COSTS) {
				let _cost = 0;
				if (item === 'coins') {
					_cost = game.SPY_COSTS[item] * distance;
				} else if (item === 'provisions') {
					_cost = Math.ceil((game.SPY_COSTS[item] * distance) / 4);
				} else {
					_cost = game.SPY_COSTS[item];
				}
				_t += '<dt>' + game.nice_numbers(_cost) + '</dt>' +
					'<dd>' + core.ui().resource_small_img(item) + '</dd>';
			}
			_t += '</dl>' +
			'</fieldset>' +
			'<fieldset>' +
				'<legend>Destination</legend>' +
				'<select class="espionage-destination">' +
					'<option value="0">-- select --</option>';
			for (let i = 1; i < settlements.length; i++) {
				if (!settlements[i].is_ruins()) {
					_t += '<option ' + (settlement && (settlements[i].id() === settlement.id()) ? 'selected ' : '') + 'value="' + settlements[i].id() + '">' + settlements[i].nice_name() + '</option>';
				}
			}
			_t += '</select>' +
			'</fieldset>' +
			'<fieldset class="range-combo">' +
				'<legend>Espionage</legend>' +
				'<input type="range" value="' + espionage + '" min="1" max="' + espionage + '" class="espionage-range" />' +
				'<input type="text" readonly value="' + espionage + '" class="espionage-value tips" title="Total espionage points assigned to this spy." />' +
				'<input type="text" readonly value="' + Math.ceil(espionage / 100) + '%" class="espionage-chance tips" title="Chance of mission success." />' +
			'</fieldset>' +
			'<fieldset>' +
				'<legend>Mission</legend>' +
				'<select class="espionage-mission">' +
					'<option value="0">-- select --</option>';
			for (let i = 1; i < game.SPY_MISSIONS.length; i++) {
				_t += '<option value="' + i + '">' + game.SPY_MISSIONS[i].capitalize() + '</option>';
			}
			_t += '</select>' +
			'</fieldset>' +
			'<fieldset class="espionage-rel">' +
				'<legend>Religion' + (settlement ? ' (currently ' + settlement.religion().name + ')': '') + '</legend>' +
				'<select class="espionage-religion">';
			for (let i = 0; i < game.RELIGIONS.length; i++) {
				_t += '<option value="' + i + '">' + game.RELIGIONS[i].capitalize() + (i === my_settlement.religion().id ? ' (your religion)' : '') + '</option>';
			}
			_t += '</select>' +
				'<p><strong>Note!</strong> Attempting to change a settlement`s religion uses up all your accumulated faith.</p>' +
			'</fieldset>';
			$(this.handle + ' section').empty().append(_t);
			$(this.handle).on('change', '.espionage-range', function() {
				let value = parseInt($(this).val(), 10);
				$(self.handle + ' .espionage-value').val(value);
				$(self.handle + ' .espionage-chance').val(Math.ceil(value / 100) + '%');
			}).on('change', '.espionage-mission', function() {
				let value = parseInt($(this).val(), 10);
				if (value === game.SPY_MISSION_RELIGION) {
					$(self.handle + ' .espionage-rel').show();
				} else {
					$(self.handle + ' .espionage-rel').hide();
				}
			}).on('click', '.dispatch', function() {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to send spies to other settlements.');
					return false;
				}
				let _espionage = parseInt($(self.handle + ' .espionage-value').val(), 10);
				let destination = parseInt($(self.handle + ' .espionage-destination').val(), 10);
				let mission = parseInt($(self.handle + ' .espionage-mission').val(), 10);
				if ((settlement && settlement.id() !== destination) || !settlement) {
					settlement = core.get_settlement(destination);
				}
				if (destination === 0 || _espionage > espionage || !settlement || mission <= 0) {
					core.ui().error('There was an error creating and dispatching the spy, check the data you entered and try again.');
					return false;
				}
				let data = {
					espionage: _espionage,
					mission
				};
				if (mission === game.SPY_MISSION_RELIGION) {
					data.religion = parseInt($(self.handle + ' .espionage-religion').val(), 10);
				}
				if (core.queue_add(my_settlement, settlement, game.ACTION_CAMPAIGN, game.CAMPAIGN_SPY, data)) {
					core.do_achievement('jamesbond');
					self.destroy();
				} else {
					core.ui().error('There was an error creating and dispatching the spy, check the data you entered and try again.');
				}
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let my_settlement = core.get_settlement();
			let espionage = my_settlement.espionage();
			$(this.handle + ' .espionage-range').attr('max', espionage);
		};
		super(params);
	}
}
