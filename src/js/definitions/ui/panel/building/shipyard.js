/**
 * Shipyard panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_shipyard
 * @extends ui_panel
 * @returns {ui_panel_shipyard}
 */
class ui_panel_shipyard extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_shipyard}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'shipyard';
		params.template = ui.building_panel_template();
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Navy'
			]));
			let _t = '<div class="navy-list"></div>' +
					'<div class="navy-recruiter">';
			for (let item in game.SHIPS) {
				_t += '<fieldset>' +
						'<legend>' + game.SHIPS[item].name + '</legend>' +
						'<div class="cost">' +
							'<dl class="nomg">';
				for (let res in game.SHIPS[item].cost) {
					_t += '<dt>' + game.nice_numbers(game.SHIPS[item].cost[res]) + 
						'</dt><dd>' + core.ui().resource_small_img(res) + '</dd>';
				}
				_t += '</dl>' +
						'</div>' +
						'<div class="info">' +
							'<dl class="nomg">' +
								'<dt>Attack</dt><dd>' + game.SHIPS[item].attack + '</dd>' +
								'<dt>Defense</dt><dd>' + game.SHIPS[item].defense + '</dd>' +
							'</dl>' +
						'</div>' +
						'<img data-handle="' + item + '" title="Recruit ' +
						game.SHIPS[item].name + '" class="tips recruit-ship" src="' +
						game.ASSETS_URL + 'images/assets/navy/' +
						item.toLowerCase().replace(/ /g,"_") + '.png" />' +
					'</fieldset>';
			}
			_t += '</div>';
			$(this.handle + ' #tab-navy').empty().append(_t);
			$(this.handle).on('click', '.recruit-ship', function () {
				let ship = $(this).data('handle');
				let costs = game.SHIPS[ship].cost;
				if (settlement.has_resources(costs)) {
					if (settlement.remove_resources(costs)) {
						if (settlement.recruit_ship(ship)) {
							core.ui().notify('A new ' + game.SHIPS[ship].name + ' has been recruited.');
							self.on_refresh();
							return false;
						}
					}
				}
				core.ui().error('You don`t have enough resources to recruit a ' +
					game.SHIPS[ship].name + '.');
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let building = settlement.get_building(this.params_data.handle);
			if (building) {
				$(this.handle + ' #tab-info').empty()
					.append(core.ui().building_panel(this.params_data, building.level));
				$(this.handle + ' .navy-list').empty().append('<fieldset>' +
						'<legend>Current Navy</legend>' + core.ui().navy_list(settlement.navy(), true) +
					'</fieldset>');
			} else {
				this.destroy();
			}
		};
		super(params);
	}
}
