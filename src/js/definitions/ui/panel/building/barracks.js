/**
 * Barracks panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_barracks
 * @extends ui_panel
 * @returns {ui_panel_barracks}
 */
class ui_panel_barracks extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_barracks}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'barracks';
		params.template = ui.building_panel_template();
		params.on_show = function(params) {
			let self = this;
			let core = this.core();
			let settlement = core.get_settlement();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Army'
			]));
			let _t = '<div class="army-list"></div>' +
					'<div class="army-recruiter">';
			for (let item in game.SOLDIERS) {
				_t += '<fieldset>' +
						'<legend>' + game.SOLDIERS[item].name + '</legend>' +
						'<div class="cost">' +
							'<dl class="nomg">';
				for (let res in game.SOLDIERS[item].cost) {
					_t += '<dt>' + game.nice_numbers(game.SOLDIERS[item].cost[res]) +
						'</dt><dd>' + core.ui().resource_small_img(res) + '</dd>';
				}
				_t += '</dl>' +
						'</div>' +
						'<div class="info">' +
							'<dl class="nomg">' +
								'<dt>Attack</dt><dd>' + game.SOLDIERS[item].attack + '</dd>' +
								'<dt>Defense</dt><dd>' + game.SOLDIERS[item].defense + '</dd>' +
							'</dl>' +
						'</div>' +
						'<img data-handle="' + item + '" title="Recruit ' +
						game.SOLDIERS[item].name + '" class="tips recruit-soldier" src="' +
						game.ASSETS_URL + 'images/assets/army/' +
						item.toLowerCase() + '.png" />' +
					'</fieldset>';
			}
			_t += '</div>';
			$(this.handle + ' #tab-army').empty().append(_t);
			$(this.handle).on('click', '.recruit-soldier', function () {
				let soldier = $(this).data('handle');
				let costs = game.SOLDIERS[soldier].cost;
				if (settlement.has_resources(costs)) {
					if (settlement.remove_resources(costs)) {
						if (settlement.recruit_soldier(soldier)) {
							core.ui().notify('A new ' + game.SOLDIERS[soldier].name +
								' has been recruited.');
							self.on_refresh();
							return false;
						}
					}
				}
				core.ui().error('You don`t have enough resources to recruit a ' +
					game.SOLDIERS[soldier].name + '.');
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let building = core.get_settlement().get_building(this.params_data.handle);
			if (building) {
				$(this.handle + ' #tab-info').empty()
					.append(core.ui().building_panel(this.params_data, building.level));
				$(this.handle + ' .army-list').empty().append('<fieldset>' +
						'<legend>Current Army</legend>' +
						core.ui().army_list(settlement.army(), true) +
					'</fieldset>');
			} else {
				this.destroy();
			}
		};
		super(params);
	}
}
