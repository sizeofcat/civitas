/**
 * Create a new caravan panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_new_caravan
 * @extends ui_panel
 * @returns {ui_panel_new_caravan}
 */
class ui_panel_new_caravan extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_new_caravan}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = ui.campaign_panel_template('New caravan');
		params.id = 'new-caravan';
		params.on_show = function(params) {
			this.resources = {};
			let self = this;
			let core = this.core();
			let my_settlement = core.get_settlement();
			let settlement = params.data;
			let settlements = core.get_settlements();
			let location = my_settlement.location();
			let distance = core.world().get_distance_in_days(location, settlement.location());
			let _t = '<fieldset>' +
				'<legend>Initial costs</legend>' +
				'<dl>';
			for (let item in game.CARAVAN_COSTS) {
				let _cost = 0;
				if (item === 'coins') {
					_cost = game.CARAVAN_COSTS[item] * distance;
				} else if (item === 'provisions') {
					_cost = Math.ceil((game.CARAVAN_COSTS[item] * distance) / 4);
				} else {
					_cost = game.CARAVAN_COSTS[item];
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
				if (settlements[i].is_ruins() || settlements[i].is_urban() || settlements[i].is_village()) {
					if ((!settlements[i].is_ruins()) || (core.has_research('archeology') && settlements[i].is_ruins())) {
						_t += '<option ' + (settlement && (settlements[i].id() === settlement.id()) ? 'selected ' : '') + 'value="' + settlements[i].id() + '">' + settlements[i].nice_name() + '</option>';
					}
				}
			}
			_t += '</select>' +
			'</fieldset>' +
			'<fieldset class="select-combo">' +
				'<legend>Resources</legend>' +
				'<select class="caravan-resources-select">' +
					'<option value="0">-- select --</option>' +
					'<option value="coins">Coins</option>';
			let resources = my_settlement.get_resources();
			for (let item in resources) {
				if (!game.is_virtual_resource(item)) {
					_t += '<option value="' + item + '"> ' + game.get_resource_name(item) + '</option>';
				}
			}
			_t += '</select>' +
				'<input title="Add the resources to the list." type="button" class="tips caravan-resources-add" value="+" />' +
				'<input title="Amount of selected resource to add to the caravan." type="number" value="1" class="tips caravan-resources-amount" min="1" max="999" />' +
				'<div class="caravan-resources clearfix"></div>' +
			'</fieldset>';
			$(this.handle + ' section').empty().append(_t);
			this.generate_table_data = function() {
				let _t = '<table class="caravan-resources clearfix">' +
					'<thead>' +
					'<tr>' +
						'<td>Amount</td>' +
						'<td>Resource</td>' +
						'<td></td>' +
					'</tr>' +
					'</thead>' +
					'<tbody>';
				for (let item in this.resources) {
					_t += '<tr>' +
						'<td>' + this.resources[item] + '</td>' +
						'<td>' + core.ui().resource_small_img(item) + '</td>' +
						'<td>' +
							'<a title="Remove this resource from the caravan." href="#" data-id="' + item + '" class="tips caravan-resources-delete">-</a>' +
						'</td>' +
					'</tr>';
				}
				_t += '</tbody>' +
				'</table>';
				$(this.handle + ' .caravan-resources').empty().append(_t);
			};
			$(this.handle).on('click', '.caravan-resources-add', function() {
				let amount = parseInt($(self.handle + ' .caravan-resources-amount').val(), 10);
				let resource = $(self.handle + ' .caravan-resources-select').val();
				if (resource !== '0') {
					if (typeof self.resources[resource] !== 'undefined' && !my_settlement.has_resource(resource, self.resources[resource] + amount)) {
						core.ui().error(my_settlement.name() + ' doesn`t have enough ' + game.get_resource_name(resource) + '.');
						return false;
					} else if (typeof self.resources[resource] === 'undefined' && !my_settlement.has_resource(resource, amount)) {
						core.ui().error(my_settlement.name() + ' doesn`t have enough ' + game.get_resource_name(resource) + '.');
						return false;
					}
					if (typeof self.resources[resource] !== 'undefined') {
						self.resources[resource] = self.resources[resource] + amount;
					} else {
						self.resources[resource] = amount;
					}
					self.generate_table_data();
				}
				return false;
			}).on('click', '.caravan-resources-delete', function() {
				let resource = $(this).data('id');
				delete self.resources[resource];
				self.generate_table_data();
				return false;
			}).on('click', '.dispatch', function() {
				if (!my_settlement.can_trade()) {
					core.ui().error('You will need to construct a Trading Post before being able to trade resources with other settlements.');
					return false;
				}
				let destination = parseInt($(self.handle + ' .caravan-destination').val(), 10);
				if ((settlement && settlement.id() !== destination) || !settlement) {
					settlement = core.get_settlement(destination);
				}
				if (destination === 0 || !settlement || $.isEmptyObject(self.resources)) {
					core.ui().error('There was an error creating and dispatching the caravan, check the data you entered and try again.');
					return false;
				}
				if (core.queue_add(my_settlement, settlement, game.ACTION_CAMPAIGN, game.CAMPAIGN_CARAVAN, {
					resources: self.resources
				})) {
					core.do_achievement('donkeylord');
					self.destroy();
				} else {
					core.ui().error('There was an error creating and dispatching the caravan, check the data you entered and try again.');
				}
				return false;
			});
		};
		super(params);
	}
}
