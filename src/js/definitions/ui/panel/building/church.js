/**
 * Church panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_church
 * @extends ui_panel
 * @returns {ui_panel_church}
 */
class ui_panel_church extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_church}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'church';
		params.template = ui.building_panel_template();
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Faith',
				'Religion'
			]));
			$(this.handle).on('click', '.religion', function() {
				let id = parseInt($(this).data('id'), 10);
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							settlement.change_religion(id);
						}
					},
					'Are you sure you want to switch religions? You will ' +
					'lose all your city`s faith!'
				);
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let building = core.get_settlement().get_building(this.params_data.handle);
			let _t = '';
			if (building) {
				$(this.handle + ' #tab-info').empty()
					.append(core.ui().building_panel(this.params_data, building.level));
				_t = '<h2>Faith</h2>' + 
					'<div class="section">' + 
						core.ui().progress((settlement.faith() * 100) /
						game.MAX_FAITH_VALUE, 'large', settlement.faith() +
						' / ' + game.MAX_FAITH_VALUE) +
					'</div>';
				$(this.handle + ' #tab-faith').empty().append(_t);
				_t = '<p>Changing your settlement`s religion requires <strong>' +
					game.MAX_FAITH_VALUE + '</strong> faith, each religion gives ' +
					'you access to different heroes in your Tavern and gives ' +
					'you a boost to the influence with the cities sharing the ' +
					'same religion.</p>' +
					'<div class="religion-list">';
				for (let i = 0; i < game.RELIGIONS.length; i++) {
					_t += '<div data-handle="' + game.RELIGIONS[i] + '" data-id="' +
						i + '" class="religion' + (settlement.religion().id === i ?
						' selected' : '') + '"><span>' +
						game.RELIGIONS[i].capitalize() + '</span></div>';
				}
				_t += '</div>';
				$(this.handle + ' #tab-religion').empty().append(_t);
			} else {
				this.destroy();
			}
		};
		super(params);
	}
}
