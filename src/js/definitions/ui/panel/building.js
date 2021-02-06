/**
 * Building panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_building
 * @extends ui_panel
 * @returns {ui_panel_building}
 */
class ui_panel_building extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_building}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'building';
		params.template = ui.building_panel_template();
		params.on_refresh = function() {
			let core = this.core();
			let building = core.get_settlement().get_building(this.params_data.handle);
			if (building) {
				$(this.handle + ' section').empty()
					.append(core.ui().building_panel(this.params_data, building.level));
			} else {
				this.destroy();
			}
		};
		super(params);
	}
}
