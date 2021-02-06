/**
 * Buildings panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_buildings
 * @extends ui_panel
 * @returns {ui_panel_buildings}
 */
class ui_panel_buildings extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_buildings}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'buildings';
		params.template = ui.generic_panel_template('City Buildings');
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			let el = this.handle;
			let building;
			let building_data;
			let building_image;
			let _t = '<div class="left buildings">';
			_t += '<div class="tabs">' +
					'<ul>';
			for (let category in game.BUILDINGS_CATEGORIES) {
				_t += '<li><a href="#tab-' + category.toLowerCase() + '">' +
					category + '</a></li>';
			}
			_t += '</ul>';
			for (let category in game.BUILDINGS_CATEGORIES) {
				_t += '<div id="tab-' + category.toLowerCase() + '" class="bldg-tabs">';
				for (let i = 0; i < game.BUILDINGS_CATEGORIES[category].length; i++) {
					building = game.BUILDINGS_CATEGORIES[category][i];
					if ($.inArray(building, game['BUILDINGS_ALL']) !== -1) {
						building_data = core.get_building_config_data(building);
						if (building_data) {
							let _i = settlement.is_building_built(building_data.handle);
							building_image = building_data.handle;
							if (typeof building_data.tax !== 'undefined') {
								building_image = building_data.handle.slice(0, 5);
							}
							let _image = (typeof building_data.visible_upgrades ===
								'undefined' || building_data.visible_upgrades === false) ?
								building_image : building_image + '1';
							_t += '<div data-handle="' + building_data.handle +
								'" class="building-item' + ((_i === true) ?
									' disabled' : '') + '">' +
									'<span class="title">' + building_data.name + '</span>' +
									'<img class="building" src="' + game.ASSETS_URL +
									'images/assets/buildings/' + _image + '.png" />' +
								'</div>';
						}
					}
				}
				_t += '</div>';
			}
			_t += '</div>' +
				'</div>' +
				'<div class="buildings-info right">' +
					'<div class="b-name"></div>' +
					'<div class="b-desc"></div>' +
					'<div class="column-small">' +
						'<fieldset class="levels">' +
							'<legend>Levels</legend>' +
							'<div class="b-levels"></div>' +
						'</fieldset>' +
						'<fieldset>' +
							'<legend>Cost</legend>' +
							'<div class="b-cost"></div>' +
						'</fieldset>' +
					'</div>' +
					'<div class="column-small">' +
						'<fieldset class="materials">' +
							'<legend>Materials</legend>' +
							'<div class="b-mats"></div>' +
						'</fieldset>' +
						'<fieldset class="production">' +
							'<legend>Production</legend>' +
							'<div class="b-prod"></div>' +
						'</fieldset>' +
						'<fieldset class="extra">' +
							'<legend>Extra materials</legend>' +
							'<div class="b-chance"></div>' +
						'</fieldset>' +
						'<fieldset class="storage">' +
							'<legend>Storage</legend>' +
							'<div class="b-store"></div>' +
						'</fieldset>' +
						'<fieldset class="taxes">' +
							'<legend>Taxes</legend>' +
							'<div class="b-tax"></div>' +
						'</fieldset>' +
					'</div>' +
					'<div class="column-full">' +
						'<fieldset>' +
							'<legend>Requirements</legend>' +
							'<div class="b-req"></div>' +
						'</fieldset>' +
					'</div>' +
					'<div class="toolbar"></div>' +
				'</div>' +
				'<div class="clearfix"></div>';
			$(el + ' section').append(_t);
			$(el).on('click', '.building-item', function () {
				$(el).addClass('expanded');
				$(el + ' .building-item').removeClass('active');
				$(this).addClass('active');
				$(el + ' .b-chance, ' + el + ' .b-tax, ' + el + ' .b-store, ' +
					el + ' .b-req, ' + el + ' .b-cost, ' + el + ' .b-name, ' +
					el + ' .b-name, ' + el + ' .b-desc, ' + el + ' .b-mats, ' +
					el + ' .b-prod, ' + el + ' .toolbar').empty();
				let handle = $(this).data('handle');
				let building = core.get_building_config_data(handle);
				if (building) {
					$(el + ' .b-desc').html(building.description);
					$(el + ' .b-name').html(building.name);
					let _z = '<dl class="nomg">';
					for (let y in building.cost) {
						_z += '<dt>' + game.nice_numbers(building.cost[y]) + '</dt>' +
							'<dd><img class="small tips" title="' +
							game.get_resource_name(y) + '" src="' + game.ASSETS_URL +
							'images/assets/resources/' + y + '.png" /></dd>';
					}
					_z += '</dl>';
					$(el + ' .b-cost').append(_z);
					if (typeof building.levels !== 'undefined') {
						$(el + ' .b-levels').empty().append('<dl class="nomg">' +
							'<dt>Upgrades</dt>' +
								'<dd>' + building.levels + '</dd>' +
						'</dl>');
						$('fieldset.levels').show();
					} else {
						$('fieldset.levels').hide();
					}
					if (typeof building.requires !== 'undefined') {
						_z = '<dl class="nomg">';
						if (typeof building.requires.buildings !== 'undefined') {
							for (let item in building.requires.buildings) {
								_z += '<dt>Building</dt>' +
									'<dd>' + core.get_building_config_data(item).name +
									' (level ' + building.requires.buildings[item] + ')</dd>';
							}
						}
						if (typeof building.requires.research !== 'undefined') {
							_z += '<dt>Research</dt>' +
								'<dd>' +
								core.get_research_config_data(building.requires.research).name +
								'</dd>';
						}
						if (typeof building.requires.climate !== 'undefined') {
							let climates = [];
							for (let i = 0; i < building.requires.climate.length; i++) {
								climates.push(game.CLIMATES[building.requires.climate[i]].capitalize());
							}
							_z += '<dt>Climate</dt>' +
								'<dd>' + climates.join(', ') + '</dd>';
						}
						_z += '<dt>City level</dt>' +
							'<dd>' + building.requires.settlement_level + '</dd>' +
						'</dl>';
						$(el + ' .b-req').append(_z);
					}
					if (typeof building.chance !== 'undefined') {
						_z = '<dl class="nomg">';
						for (let chance in building.chance) {
							_z += '<dt>' + building.chance[chance] * 100 + '%</dt>' +
								'<dd><img class="small tips" title="' +
								game.get_resource_name(chance) + '" src="' +
								game.ASSETS_URL + 'images/assets/resources/' +
								chance + '.png" /></dd>';
						}
						_z += '</dl>';
						$(el + ' .b-chance').append(_z);
						$('fieldset.extra').show();
					} else {
						$('fieldset.extra').hide();
					}
					if (typeof building.production !== 'undefined') {
						_z = '<dl class="nomg">';
						for (let y in building.production) {
							_z += '<dt>' + building.production[y] + '</dt>' +
								'<dd><img class="small tips" title="' +
								game.get_resource_name(y) + '" src="' +
								game.ASSETS_URL + 'images/assets/resources/' + y
								+ '.png" /></dd>';
						}
						_z += '</dl>';
						$(el + ' .b-prod').append(_z);
						$('fieldset.production').show();
					} else {
						$('fieldset.production').hide();
					}
					if (typeof building.materials !== 'undefined') {
						_z = '<dl class="nomg">';
						if (Array.isArray(building.materials)) {
							for (let i = 0; i < building.materials.length; i++) {
								for (let y in building.materials[i]) {
									_z += '<dt>' + building.materials[i][y] + '</dt>' +
										'<dd><img class="small tips" title="' +
										game.get_resource_name(y) + '" src="' +
										game.ASSETS_URL + 'images/assets/resources/' +
										y + '.png" /></dd>';
								}
							}
						} else {
							for (let y in building.materials) {
								_z += '<dt>' + building.materials[y] + '</dt>' +
									'<dd><img class="small tips" title="' +
									game.get_resource_name(y) + '" src="' +
									game.ASSETS_URL + 'images/assets/resources/' +
									y + '.png" /></dd>';
							}
						}
						_z += '</dl>';
						$(el + ' .b-mats').append(_z);
						$('fieldset.materials').show();
					} else {
						$('fieldset.materials').hide();
					}
					if (typeof building.tax !== 'undefined') {
						_z = '<dl class="nomg">' +
								'<dt>Tax</dt>' +
								'<dd>' + building.tax +
								'<img class="small tips" title="Coins" src="' +
								game.ASSETS_URL +
								'images/assets/resources/coins.png" /></dd>' +
							'</dl>';
						$(el + ' .b-tax').append(_z);
						$('fieldset.taxes').show();
					} else {
						$('fieldset.taxes').hide();
					}
					if (typeof building.storage !== 'undefined') {
						$('fieldset.taxes, fieldset.materials').hide();
						_z = '<dl class="nomg">' +
								'<dt>' + building.storage + '</dt>' +
								'<dd><img class="small tips" ' +
								'title="Storage Space" src="' +
								game.ASSETS_URL +
								'images/assets/resources/storage.png" /></dd>' +
							'</dl>';
						$(el + ' .b-store').append(_z);
						$('fieldset.storage').show();
					} else {
						$('fieldset.storage').hide();
					}
					let _i = settlement.is_building_built(building.handle);
					if (_i !== true) {
						$(el + ' .toolbar').append('<a href="#" ' +
							'class="btn green build" data-handle="' +
							building.handle + '">Build</a>');
					} else {
						//$(el + ' .toolbar').append('You already constructed this building.');
					}
					$(el + ' .right').show();
				}
				return false;
			}).on('click', '.btn.build', function () {
				let handle = $(this).data('handle');
				if (settlement.build(handle) !== false) {
					$(el + ' .building-item[data-handle=' +
						handle + ']').addClass('disabled');
					$(el + ' .toolbar').empty();//.append('You already constructed this building.');
				}
				return false;
			});
		};
		super(params);
	}
}
