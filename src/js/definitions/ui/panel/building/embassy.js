/**
 * Embassy panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_embassy
 * @extends ui_panel
 * @returns {ui_panel_embassy}
 */
class ui_panel_embassy extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_embassy}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'embassy';
		params.template = ui.building_panel_template();
		params.on_show = function(params) {
			let core = this.core();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Espionage',
				'Diplomacy'
			]));
			$(this.handle + ' #tab-diplomacy').empty().append('<div class="settlements-list"></div>');
			$(this.handle).on('click', '.view', function () {
				let _settlement_id = parseInt($(this).data('id'), 10);
				let _settlement = core.get_settlement(_settlement_id);
				if (_settlement) {
					core.ui().open_panel('settlement', _settlement);
				}
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let settlements = core.get_settlements();
			let status = settlement.status();
			let building = core.get_settlement().get_building(this.params_data.handle);
			if (building) {
				$(this.handle + ' #tab-info').empty().append(core.ui().building_panel(this.params_data, building.level));
				$(this.handle + ' #tab-espionage').empty().append(
					'<h2>Espionage points</h2>' +
					'<div class="section">' + 
						core.ui().progress((settlement.espionage() * 100) / game.MAX_ESPIONAGE_VALUE, 'large', settlement.espionage() + ' / ' + game.MAX_ESPIONAGE_VALUE) + 
					'</div>'
				);
				let _t = '<table class="normal">' +
					'<thead>' +
					'<tr>' +
						'<td>Settlement</td>' +
						'<td>Ruler</td>' +
						'<td>Influence</td>' +
						'<td>Religion</td>' +
						'<td>Status</td>' +
						'<td>Personality</td>' +
					'</tr>' +
					'</thead>';
				for (let i = 1; i < settlements.length; i++) {
					if (!settlements[i].is_ruins()) {
						_t += '<tr>' +
							'<td>' +
								'<a data-id="' + settlements[i].id() + '" title="View info about this settlement." class="tips view" href="#">' + settlements[i].name() + '</a> ' +
							'</td>' +
							'<td class="icon">' +
								'<img class="avatar small" src="' + game.ASSETS_URL + 'images/assets/avatars/avatar' + settlements[i].ruler().avatar + '.png" />' +
							'</td>' +
							'<td>' +
								'<div data-id="' + settlements[i].id() + '" >' + core.ui().progress(status[settlements[i].id()].influence, 'small') + '</div>' +
							'</td>' +
							'<td>' +
								'<p>' + settlements[i].religion().name + '</p>' +
							'</td>' +
							'<td>' +
								'<p>' + settlement.get_diplomacy_status(settlements[i].id()).name + '</p>' +
							'</td>' +
							'<td>' +
								'<p>' + settlements[i].personality().name + '</p>' +
							'</td>' +
						'</tr>';
					}
				}
				_t += '<tfoot>' +
					'<tr>' +
						'<td>Settlement</td>' +
						'<td>Ruler</td>' +
						'<td>Influence</td>' +
						'<td>Religion</td>' +
						'<td>Status</td>' +
						'<td>Personality</td>' +
					'</tr>' +
					'</tfoot>' +
					'</table>';
				$(this.handle + ' .settlements-list').empty().append(_t);
			} else {
				this.destroy();
			}
		};
		super(params);
	}
}
