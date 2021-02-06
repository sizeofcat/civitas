/**
 * Create a new scout panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_new_scout
 * @extends ui_panel
 * @returns {ui_panel_new_scout}
 */
class ui_panel_new_scout extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_new_scout}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = ui.campaign_panel_template('New scout');
		params.id = 'new-scout';
		params.on_show = function(params) {
			let self = this;
			let core = this.core();
			let settlements = core.get_settlements();
			let my_settlement = core.get_settlement();
			let place = params.data;
			let location = my_settlement.location();
			let distance = core.world().get_distance_in_days(location, place.location());
			let _t = '<fieldset>' +
				'<legend>Initial costs</legend>' +
				'<dl>';
			for (let item in game.SCOUT_COSTS) {
				let _cost = 0;
				if (item === 'coins') {
					_cost = game.SCOUT_COSTS[item] * distance;
				} else if (item === 'provisions') {
					_cost = Math.ceil((game.SCOUT_COSTS[item] * distance) / 4);
				} else {
					_cost = game.SCOUT_COSTS[item];
				}
				_t += '<dt>' + game.nice_numbers(_cost) + '</dt>' +
					'<dd>' + core.ui().resource_small_img(item) + '</dd>';
			}
			_t += '</dl>' +
			'</fieldset>' +
			'<fieldset>' +
				'<legend>Destination</legend>' +
				'<select class="caravan-destination">' +
					'<option value="0">-- select --</option>';
			for (let i = 1; i < settlements.length; i++) {
				if (settlements[i].is_ruins()) {
					if ((!settlements[i].is_ruins()) || (core.has_research('archeology') && settlements[i].is_ruins())) {
						_t += '<option ' + (place && (settlements[i].id() === place.id()) ? 'selected ' : '') + 'value="' + settlements[i].id() + '">' + settlements[i].nice_name() + '</option>';
					}
				}
			}
			_t += '</select>' +
			'</fieldset>' +
			$(this.handle + ' section').empty().append(_t);
			$(this.handle).on('click', '.dispatch', function() {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to send scouts to other settlements.');
					return false;
				}
				//let destination = parseInt($(self.handle + ' .scout-destination').val(), 10);
				let data = {
					// Todo
				};
				if (core.queue_add(my_settlement, place, game.ACTION_CAMPAIGN, game.CAMPAIGN_SCOUT, data)) {
					self.destroy();
				} else {
					core.ui().error('There was an error creating and dispatching the scout, check the data you entered and try again.');
				}
				return false;
			});
		};
		params.on_refresh = function() {
			// Todo
		};
		super(params);
	}
}
