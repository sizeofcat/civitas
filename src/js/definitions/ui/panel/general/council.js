/**
 * City Council panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_council
 * @extends ui_panel
 * @returns {ui_panel_council}
 */
class ui_panel_council extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_council}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'council';
		params.template = ui.generic_panel_template('City Council');
		params.on_show = function(params) {
			let core = this.core();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Tips',
				'Production',
				'Housing',
				'Municipal',
				'Mercenary',
				'Achievements'
			]));
			let _t = '<div class="achievements-list">';
			for (let i = 0; i < game.ACHIEVEMENTS.length; i++) {
				_t += '<div data-handle="' + game.ACHIEVEMENTS[i].handle + '" class="achievement">' +
					'<div class="left">' +
						'<div class="ach img"></div>' +
						'<div class="ach points">' + game.ACHIEVEMENTS[i].points + '</div>' +
					'</div>' +
					'<div class="right">' +
						'<div class="inner">' +
							'<h2>' + game.ACHIEVEMENTS[i].name + '</h2>' +
							game.ACHIEVEMENTS[i].description +
						'</div>' +
						'<div class="time-ago"></div>' +
					'</div>' +
				'</div>';
			}
			_t += '</div>';
			$(this.handle + ' #tab-achievements').empty().append(_t);
			$(this.handle).on('click', '.view-merc', function () {
				let _army = parseInt($(this).data('id'), 10);
				let data = game.MERCENARIES[_army];
				core.ui().open_panel('army', data);
				return false;
			}).on('click', '.raid-merc', function () {
				core.ui().error('Not implemented yet.');
				return false;
			}).on('click', '.disband-merc', function () {
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							let _army = parseInt($(this).data('id'), 10);
							core.get_settlement().release_mercenary(_army);
							core.save_and_refresh();
						}
					},
					'Are you sure you want to release this mercenary army? You won`t be able to use them anymore!'
				);
				return false;
			}).on('click', '.building-info', function() {
				let handle = $(this).data('handle');
				let panel = core.ui().panel_class_names[handle];
				let building_data = core.get_building_config_data(handle);
				if (handle && building_data) {
					if (typeof panel !== 'undefined') {
						core.ui().open_panel(handle, building_data);
					} else {
						core.ui().open_panel('building', building_data, true);
					}
				}
				return false;
			}).on('click', '.pause', function () {
				let handle = $(this).data('handle');
				let building = core.get_settlement().get_building(handle);
				if (building && building.stop_production()) {
					$(this).removeClass('pause').addClass('start');
					$(this).attr('title', 'Start production');
				}
				return false;
			}).on('click', '.start', function () {
				let handle = $(this).data('handle');
				let building = core.get_settlement().get_building(handle);
				if (building && building.start_production()) {
					$(this).removeClass('start').addClass('pause');
					$(this).attr('title', 'Stop production');
				}
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let buildings = settlement.get_buildings();
			let achievements = core.achievements();
			let advices = core.advice();
			let total_costs = 0;
			let total_tax = 0;
			let army_data;
			let building_data;
			let _z = '';
			let total_benefits = {
				fame: 0,
				espionage: 0,
				research: 0,
				faith: 0
			};
			let mercenary = settlement.mercenary();
			let _t = '<p>Mercenary armies are available to hire for a fixed price, they do not cost additional resources but they are only available for raiding and campaign missions, they do not participate in the defense of your city.</p>' +
				'<p>Also, keep in mind that once a mercenary army is hired, they are at your disposal until the end of the current year.</p>' +
				'<div class="hired-mercenaries-list">';
			if (mercenary.length > 0) {
				_t += '<table class="normal">';
				for (let i = 0; i < mercenary.length; i++) {
					army_data = game.MERCENARIES[mercenary[i].id];
					_t += '<tr>' +
							'<td class="icon">' +
								'<img src="' + game.ASSETS_URL + 'images/assets/emblems/' + 
									army_data.icon + '.png" />' +
							'</td>' +
							'<td>' +
								'<p class="title">' + army_data.name + '</p>' +
								'<p class="description">' + army_data.description + '</p>' +
							'</td>' +
							'<td class="large">' +
								'<a title="View info on this mercenary army." data-id="' + mercenary[i].id + '" class="tips view-merc" href="#">view</a> ' +
								'<a title="Send this mercenary army on a raiding mission towards a specific settlement." data-id="' + i + '" class="tips raid-merc" href="#">raid</a> ' +
								'<a title="Disband this mercenary army? They will be available for hire later when you need them." data-id="' + i + '" class="tips disband-merc" href="#">release</a>' +
							'</td>' +
						'</tr>';

				}
				_t += '</table>';
			} else {
				_t += '<p>You have no mercenary armies hired for your city. Go to the World Market Trades and hire one.</p>';
			}
			_t += '</div>';
			$(this.handle + ' #tab-mercenary').empty().append(_t);
			for (let f = 0; f < achievements.length; f++) {
				if (typeof achievements[f] !== 'undefined') {
					$(this.handle + ' .achievement[data-handle=' + achievements[f].handle + ']').addClass('has');
					$(this.handle + ' .achievement[data-handle=' + achievements[f].handle + '] .time-ago')
						/*.attr("title", achievements[f].date)*/
						.html(game.time_since(achievements[f].date) + ' ago');
				}
			}
			_t = '<img class="avatar right" src="' + game.ASSETS_URL + 'images/assets/avatars/avatar' + settlement.ruler().avatar + '.png" />' +
				'<dl>' +
					'<dt>Current date</dt>' +
					'<dd class="citydate">' + core.format_date() + '</dd>' +
					'<dt>Ruler</dt>' +
					'<dd>' + settlement.ruler().name + '</dd>' +
					'<dt>Climate</dt>' +
					'<dd>' + settlement.climate().name + '</dd>' +
					'<dt>Season</dt>' +
					'<dd>' + core.season().name + '</dd>' +
					'<dt>Personality</dt>' +
					'<dd>' + settlement.personality().name + '</dd>' +
					'<dt>Nationality</dt>' +
					'<dd>' + settlement.nationality().name + '</dd>' +
					'<dt>Population</dt>' +
					'<dd>' + game.nice_numbers(settlement.population()) + '</dd>' +
					'<dt>Achievement Points</dt>' +
					'<dd>' + core.achievement_points() + '</dd>' +
					'<dt>Religion</dt>' +
					'<dd>' + settlement.religion().name + '</dd>' +
					'<dt>Level</dt>' +
					'<dd>' + settlement.level() + '</dd>' +
					'<dt>Fame</dt>' +
					'<dd>' + core.ui().progress(settlement.fame() * 100 / core.level_to_fame(settlement.level()), 'small', game.nice_numbers(settlement.fame()) + ' / ' + game.nice_numbers(core.level_to_fame(settlement.level()))) + '</dd>' +
					'<dt>Prestige</dt>' +
					'<dd>' + core.ui().progress((settlement.prestige() * 100) / game.MAX_PRESTIGE_VALUE, 'small', settlement.prestige() + ' / ' + game.MAX_PRESTIGE_VALUE) + '</dd>' +
					'<dt>Espionage</dt>' +
					'<dd>' + core.ui().progress((settlement.espionage() * 100) / game.MAX_ESPIONAGE_VALUE, 'small', settlement.espionage() + ' / ' + game.MAX_ESPIONAGE_VALUE) + '</dd>' +
					'<dt>Faith</dt>' +
					'<dd>' + core.ui().progress((settlement.faith() * 100) / game.MAX_FAITH_VALUE, 'small', settlement.faith() + ' / ' + game.MAX_FAITH_VALUE) + '</dd>' +
					'<dt>Research</dt>' +
					'<dd>' + core.ui().progress((settlement.research() * 100) / game.MAX_RESEARCH_VALUE, 'small', settlement.research() + ' / ' + game.MAX_RESEARCH_VALUE) + '</dd>' +
				'</dl>';
			$(this.handle + ' #tab-info').empty().append(_t);
			_t = '';
			if (advices.length > 0) {
				_t += '<ul class="advices">';
				for (let z = 0; z < advices.length; z++) {
					_t += '<li>' + advices[z] + '</li>';
				}
				_t += '</ul>';
			}
			$(this.handle + ' #tab-tips').empty().append(_t);
			_t = '<table class="normal">' +
				'<thead>' +
					'<tr>' +
						'<td></td>' +
						'<td class="tips center" title="Current level / Maximum level">Level</td>' +
						'<td>Raises</td>' +
						'<td>Research</td>' +
						'<td>Uses</td>' +
					'</tr>' +
				'</thead>';
			for (let l = 0; l < buildings.length; l++) {
				if (buildings[l].is_municipal_building()) {
					building_data = buildings[l].get_building_data();
					_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
						'<td><a href="#" class="building-info" data-handle="' + buildings[l].handle + '">' + buildings[l].name + '</a></td>' +
						'<td class="center">' + buildings[l].level + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
						'<td>';
						if (building_data.production) {
							for (let item in building_data.production) {
								total_benefits[item] += (buildings[l].has_problems() === false) ? (buildings[l].level * building_data.production[item] + core.get_prod_modifier(building_data)) : 0;
								_t += ' +' + buildings[l].level * building_data.production[item] + ' ' + core.ui().resource_small_img(item);
							}
						}
					_t += '</td>' +
						'<td>';
						if (building_data.production) {
							for (let item in building_data.production) {
								if (core.get_prod_modifier(building_data) > 0) {
									_t += ' +' + core.get_prod_modifier(building_data) + ' ' + core.ui().resource_small_img(item);
								}
							}
						}
					_t += '</td>' +
						'<td>';
						if (building_data.materials) {
							if (Array.isArray(building_data.materials)) {
								for (let i = 0; i < building_data.materials.length; i++) {
									for (let y in building_data.materials[i]) {
										total_costs += (buildings[l].has_problems() === false) ? building_data.materials[i][y] : 0;
										_t += ' -' + building_data.materials[i][y] + ' ' + core.ui().resource_small_img(y);
									}
								}
							} else {
								for (let item in building_data.materials) {
									total_costs += (buildings[l].has_problems() === false) ? building_data.materials[item] : 0;
									_t += ' -' + building_data.materials[item] + ' ' + core.ui().resource_small_img(item);
								}
							}
						}
					_t += '</td>' +
					'</tr>';
				}
			}
			for (let item in total_benefits) {
				if (total_benefits[item] > 0) {
					_z += ' +' + total_benefits[item] + ' ' + core.ui().resource_small_img(item);
				}
			}
			_t += '<tfoot>' +
						'<tr>' +
							'<td>Total</td>' +
							'<td></td>' +
							'<td colspan="2">' + _z + '</td>' +
							'<td>' + (total_costs > 0 ? '-' : '') + total_costs + ' ' + core.ui().resource_small_img('coins') + '</td>' +
						'</tr>' +
					'</tfoot>' +
				'</table>';
			$(this.handle + ' #tab-municipal').empty().append(_t);
			_t = '<table class="normal">' +
				'<thead>' +
					'<tr>' +
						'<td></td>' +
						'<td class="tips center" title="Current level / Maximum level">Level</td>' +
						'<td>Tax</td>' +
						'<td>Research</td>' +
						'<td>Materials</td>' +
					'</tr>' +
				'</thead>';
			for (let l = 0; l < buildings.length; l++) {
				if (buildings[l].is_housing_building()) {
					building_data = buildings[l].get_building_data();
					_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
						'<td><a href="#" class="building-info" data-handle="' + buildings[l].handle + '">' + buildings[l].name + '</a></td>' +
						'<td class="center">' + buildings[l].level + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
						'<td>';
						if (building_data.tax) {
							total_tax += (buildings[l].has_problems() === false) ? buildings[l].get_tax_amount(building_data.tax) : 0;
							_t += ' +' + buildings[l].level * building_data.tax + ' ' + core.ui().resource_small_img('coins');
						}
					_t += '</td>' +
						'<td>';
						if (building_data.tax) {
							if (core.get_tax_modifier(building_data) > 0) {
								_t += ' +' + core.get_tax_modifier(building_data) + ' ' + core.ui().resource_small_img('coins');
							}
						}
					_t += '</td>' +
						'<td>';
						if (typeof building_data.materials !== 'undefined') {
							if (Array.isArray(building_data.materials)) {
								for (let i = 0; i < building_data.materials.length; i++) {
									for (let y in building_data.materials[i]) {
										_t += ' -' + building_data.materials[i][y] + ' ' + core.ui().resource_small_img(y);
									}
								}
							} else {
								for (let item in building_data.materials) {
									_t += ' -' + building_data.materials[item] + ' ' + core.ui().resource_small_img(item);
								}
							}
						}
					_t += '</td>' +
					'</tr>';
				}
			}
			_t += '<tfoot>' +
						'<tr>' +
							'<td>Income</td>' +
							'<td></td>' +
							'<td colspan="2">+' + total_tax + ' ' + core.ui().resource_small_img('coins') + '</td>' +
							'<td></td>' +
						'</tr>' +
					'</tfoot>' +
				'</table>';
			$(this.handle + ' #tab-housing').empty().append(_t);
			_t = '<table class="normal">' +
				'<thead>' +
					'<tr>' +
						'<td></td>' +
						'<td class="tips center" title="Current level / Maximum level">Level</td>' +
						'<td>Production</td>' +
						'<td>Research</td>' +
						'<td>Materials</td>' +
						'<td></td>' +
					'</tr>' +
				'</thead>';
			for (let l = 0; l < buildings.length; l++) {
				if (buildings[l].is_production_building() && buildings[l].is_municipal_building() === false) {
					building_data = buildings[l].get_building_data();
					_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
						'<td><a href="#" class="building-info" data-handle="' + buildings[l].handle + '">' + buildings[l].name + '</a></td>' +
						'<td class="center">' + buildings[l].level + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
						'<td>';
						if (building_data.production) {
							for (let item in building_data.production) {
								_t += ' +' + (buildings[l].level * building_data.production[item]) + ' ' + core.ui().resource_small_img(item);
							}
						}
					_t += '</td>' +
						'<td>';
						if (building_data.production) {
							for (let item in building_data.production) {
								if (core.get_prod_modifier(building_data) > 0) {
									_t += ' +' + core.get_prod_modifier(building_data) + ' ' + core.ui().resource_small_img(item);
								}
							}
						}
					_t += '</td>' +
						'<td>';
						if (building_data.materials) {
							if (Array.isArray(building_data.materials)) {
								for (let i = 0; i < building_data.materials.length; i++) {
									for (let y in building_data.materials[i]) {
										_t += ' -' + building_data.materials[i][y] + ' ' + core.ui().resource_small_img(y);
									}
								}
							} else {
								for (let item in building_data.materials) {
									_t += ' -' + building_data.materials[item] + ' ' + core.ui().resource_small_img(item);
								}
							}
						}
					_t += '</td>' +
						'<td class="center">' + 
							'<a title="' + (!buildings[l].is_stopped() ? 'Stop production' : 'Start production') + '" data-handle="' + buildings[l].handle + '" class="tips ' + (!buildings[l].is_stopped() ? 'pause' : 'start') + ' sbtn" href="#"></a>' +
						'</td>' +
					'</tr>';
				}
			}
			_t += '<tfoot>' +
						'<tr>' +
							'<td></td>' +
							'<td class="center">Level</td>' +
							'<td>Production</td>' +
							'<td>Research</td>' +
							'<td>Materials</td>' +
							'<td></td>' +
						'</tr>' +
					'</tfoot>' +
				'</table>';
			$(this.handle + ' #tab-production').empty().append(_t);
		};
		super(params);
	}
}
