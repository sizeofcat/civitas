/**
 * Army panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_army
 * @extends ui_panel
 * @returns {ui_panel_army}
 */
class ui_panel_army extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_army}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'army';
		params.template = ui.generic_panel_template('Army');
		params.on_show = function(params) {
			let core = this.core();
			let my_settlement = core.get_settlement();
			let army = params.data;
			$(this.handle + ' header').append(army.name);
			let tabs = ['Info'];
			if (my_settlement.num_soldiers(army.army) > 0) {
				tabs.push('Soldiers');
			}
			if (my_settlement.num_ships(army.navy) > 0) {
				tabs.push('Ships');
			}
			$(this.handle + ' section').append(core.ui().tabs(tabs));
			$(this.handle + ' #tab-info').append('<img class="avatar right" src="' + 
				game.ASSETS_URL + 'images/assets/emblems/' +
				((typeof army.icon !== 'undefined') ? army.icon : '22') +
				'.png" />' + '<p>' + army.description + '</p>');
			if (my_settlement.num_soldiers(army.army) > 0) {
				$(this.handle + ' #tab-soldiers').append(core.ui().army_list(army.army));
			}
			if (my_settlement.num_ships(army.navy) > 0) {
				$(this.handle + ' #tab-ships').append(core.ui().navy_list(army.navy));
			}
		};
		super(params);
	}
}
