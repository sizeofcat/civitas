/**
 * Storage panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_storage
 * @extends ui_panel
 * @returns {ui_panel_storage}
 */
class ui_panel_storage extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_storage}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'storage';
		params.template = ui.generic_panel_template('City Storage');
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			let storage_space = settlement.storage();
			let resources = settlement.get_resources();
			$(this.handle + ' section').append(core.ui().tabs(game.RESOURCE_CATEGORIES));
			$(this.handle + ' section').append('<p>Total storage space: <span class="total-storage">' +
				storage_space.all + '</span>, used: <span class="used-storage">' +
				storage_space.occupied + '</span></p>');
			for (let i = 0; i < game.RESOURCE_CATEGORIES.length; i++) {
				$(this.handle + ' #tab-' + game.RESOURCE_CATEGORIES[i])
					.append('<div class="storage-board"></div>');
			}
			for (let resource in resources) {
				if (!game.is_virtual_resource(resource)) {
					$(this.handle + ' #tab-' + game.RESOURCES[resource].category +
						' .storage-board')
						.append(core.ui().resource_storage_el(resource, resources[resource]));
				}
			}
		};
		params.on_refresh = function() {
			let settlement = this.core().get_settlement();
			let resources = settlement.get_resources();
			let storage_space = settlement.storage();
			for (let resource in resources) {
				if (!game.is_virtual_resource(resource)) {
					$(this.handle + ' #tab-' + game.RESOURCES[resource].category +
						' .storage-board > .storage-item[data-resource="' +
						resource + '"] > .amount').empty().html(resources[resource]);
				}
			}
			$(this.handle + ' .total-storage').empty().append(storage_space.all);
			$(this.handle + ' .used-storage').empty().append(storage_space.occupied);
		};
		super(params);
	}
}
