/**
 * Main Game UI object.
 * 
 * @param {Object} core
 * @license GPL-3.0-or-later
 * @class ui
 * @returns {ui}
 */
class ui {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui}
	 * @param {Object} core
	 */
	constructor (core) {
		this._core = core;
		this.panels = [];
		this.panel_class_names = {
			'academy': ui_panel_academy,
			'barracks': ui_panel_barracks,
			'church': ui_panel_church,
			'embassy': ui_panel_embassy,
			'shipyard': ui_panel_shipyard,
			'tavern': ui_panel_tavern,
			'army': ui_panel_army,
			'building': ui_panel_building,
			'buildings': ui_panel_buildings,
			'campaign': ui_panel_campaign,
			'council': ui_panel_council,
			'debug': ui_panel_debug,
			'help': ui_panel_help,
			'new_army': ui_panel_new_army,
			'new_caravan': ui_panel_new_caravan,
			'new_scout': ui_panel_new_scout,
			'new_spy': ui_panel_new_spy,
			'place': ui_panel_place,
			'ranks': ui_panel_ranks,
			'settlement': ui_panel_settlement,
			'storage': ui_panel_storage,
			'trades': ui_panel_trades,
			'world': ui_panel_world
		};
		this.window_class_names = {
			'options': ui_window_options,
			'battle': ui_window_battle,
			'signin': ui_window_signin,
			'signup': ui_window_signup,
			'error': ui_window_error
		};
		return this;
	}

	/**
	 * Show the application loading indicator.
	 *
	 * @public
	 * @returns {ui}
	 */
	show_loader () {
		$('.loading').show().tipsy({
			gravity: 'e'
		});
	}

	/**
	 * Hide the application loading indicator.
	 *
	 * @public
	 * @returns {ui}
	 */
	hide_loader () {
		$('.loading').hide();
	}

	/**
	 * Build the main DOM UI of the game.
	 *
	 * @public
	 * @returns {ui}
	 */
	build_main () {
		let clicked = false;
		let clickY, clickX;
		let out = '<section class="ui">' +
					'<header>' +
						'<div class="resource-panel"></div>' +
						'<div class="top-panel"></div>' +
					'</header>' +
					'<div class="character-info">' +
						'<span class="avatar-banner"><span class="cityavatar"></span></span>' +
						'<span class="cityname"></span>' +
						'<small>Level <span class="citylevel"></span></small>' +
					'</div>' +
					'<aside></aside>' +
					'<div class="viewport">' +
						'<section class="game"></section>' +
					'</div>' +
					'<footer>' +
						'<a href="#" data-action="panel" data-panel="buildings" class="tips" title="Buildings"></a>' +
						'<a href="#" data-action="panel" data-panel="storage" class="tips" title="Storage Space"></a>' +
						'<a href="#" data-action="panel" data-panel="trades" class="tips" title="Trades"></a>' +
						'<a href="#" data-action="panel" data-panel="council" class="tips" title="City Council"></a>' +
						'<a href="#" data-action="panel" data-panel="ranks" class="tips" title="Ranks"></a>' +
						'<a href="#" data-action="panel" data-panel="world" class="tips" title="World Map"></a>' +
						'<a href="#" data-action="panel" data-panel="debug" class="tips" title="Debug"></a>' +
						'<a href="#" data-action="panel" data-panel="help" class="tips" title="Help"></a>' +
					'</footer>' +
				'</section>' +
				'<audio id="music" loop>' +
					'<source src="music/track1.mp3" type="audio/mpeg">' +
				'</audio>' +
				'<div title="Game is doing stuff in the background." class="loading"></div>';
		$('body').empty().append(out);
		let _t = '';
		let __t = '';
		for (let item in game.RESOURCES) {
			if (game.RESOURCES[item].toolbar === true) {
				if (game.is_virtual_resource(item)) {
					__t += '<div class="resource ' + item + '">' +
						'<span class="amount">0</span>' +
						'<img title="' + game.RESOURCES[item].name + '" class="tips small" src="' + game.ASSETS_URL + 'images/assets/resources/' + item + '.png" />' +
					'</div>';
				} else {
					_t += '<div class="resource ' + item + '">' +
						'<span class="amount">0</span>' +
						'<img title="' + game.RESOURCES[item].name + '" class="tips small" src="' + game.ASSETS_URL + 'images/assets/resources/' + item + '.png" />' +
					'</div>';
				}
			}
		}
		$('.resource-panel').append(_t);
		$('.top-panel').append(__t);
		let update_scroll_pos = function (event) {
			$('.viewport').scrollTop($('.viewport').scrollTop() + (clickY - event.pageY));
			$('.viewport').scrollLeft($('.viewport').scrollLeft() + (clickX - event.pageX));
			clickY = event.pageY;
			clickX = event.pageX;
		};
		$('.game').on({
			mousemove (event) {
				clicked && update_scroll_pos(event);
			},
			mousedown (event) {
				clicked = true;
				clickY = event.pageY;
				clickX = event.pageX;
				$('html').css('cursor', 'grab');
			},
			mouseup () {
				clicked = false;
				$('html').css('cursor', 'auto');
			}
		});
		return this;
	}

	/**
	 * Create an item tooltip.
	 *
	 * @public
	 * @param {Object} item
	 * @returns {String}
	 */
	item_tooltip (item) {
		let out = '<h4 style="color: ' + game.ITEM_QUALITY_COLORS[item.quality] + '">' + item.name + '</h4>';
		if (item.flavour) {
			out += '<span class="flavour">"' + item.flavour + '"</span>' + ' <br />';
		}
		out += 'Slot: ' + game.ITEM_SLOTS_LIST[item.slot] + ' <br />';
		if (item.type === game.ITEM_TYPE_WEAPON) {
			out += 'Damage: <span class="red">' + item.stats.damageMin + '-' + item.stats.damageMax + '</span><br />Speed: ' + item.stats.speed + '<br />';
		} else {
			out += 'Armor: ' + item.stats.armor + '<br />';
		}
		if (item.stats.strength) {
			out += 'Strength: <span class="green">+' + item.stats.strength + '</span><br />';
		}
		if (item.stats.stamina) {
			out += 'Stamina: <span class="green">+' + item.stats.stamina + '</span><br />';
		}
		if (item.stats.agility) {
			out += 'Agility: <span class="green">+' + item.stats.agility + '</span><br />';
		}
		if (item.stats.intellect) {
			out += 'Intellect: <span class="green">+' + item.stats.intellect + '</span><br />';
		}
		if (item.stats.spirit) {
			out += 'Spirit: <span class="green">+' + item.stats.spirit + '</span><br />';
		}
		out += 'Type: <span style="color: ' + game.ITEM_QUALITY_COLORS[item.quality] + '">' + game.ITEM_QUALITY_LIST[item.quality] + '</span>';
		return out;
	}

	/**
	 * Build the About section of the UI.
	 *
	 * @public
	 * @returns {String}
	 */
	static window_about_section () {
		let out = '<a href="#" class="do-about button button-blue">About</a>' +
			'<div class="about-game">' +
				'<a class="github" target="_blank" href="https://github.com/sizeofcat/civitas"></a>' +
				'<p>Civitas is written by <a target="_blank" href="https://sizeof.cat">sizeof(cat)</a>.</p>' +
				'<p>Big thanks to:</p>' +
				'<ul>' +
					'<li><a target="_blank" href="https://soundcloud.com/shantifax">Shantifax</a> for the music (Glandula Pinealis).</li>' +
					'<li><a target="_blank" href="http://bluebyte.com">Blue Byte</a> for Anno 1404.</li>' +
				'</ul>' +
			'</div>';
		return out;
	}

	/**
	 * Generate a generic panel template.
	 *
	 * @public
	 * @param {String} title
	 * @returns {String}
	 */
	static generic_panel_template (title) {
		if (typeof title === 'undefined') {
			title = '';
		}
		let out = '<div id="panel-{ID}" class="panel">' +
					'<header>' + title +
						'<a class="tips close" title="Close"></a>' +
					'</header>' +
					'<section></section>' +
				'</div>';
		return out;
	}

	/**
	 * Generate a campaign panel template.
	 *
	 * @public
	 * @param {String} title
	 * @returns {String}
	 */
	static campaign_panel_template (title) {
		if (typeof title === 'undefined') {
			title = '';
		}
		let out = '<div id="panel-{ID}" class="panel">' +
				'<header>' + title +
					'<a class="tips close" title="Close"></a>' +
				'</header>' +
				'<section></section>' +
				'<div class="toolbar">' +
					'<a class="btn blue dispatch" href="#">Dispatch</a>' +
				'</div>' +
			'</div>';
		return out;
	}

	/**
	 * Generate a building panel template.
	 *
	 * @public
	 * @param {String} title
	 * @returns {String}
	 */
	static building_panel_template (title) {
		if (typeof title === 'undefined') {
			title = '';
		}
		let out = '<div id="panel-{ID}" class="panel">' +
					'<header>' + title +
						'<a class="tips close" title="Close"></a>' +
					'</header>' +
					'<section></section>' +
					'<footer>' +
						'<a class="tips red-link demolish" title="Demolish this building" href="#"><span></span></a>' +
						'<a class="tips blue-link pause start" href="#"><span></span></a>' +
						'<a class="tips green-link upgrade" title="Upgrade building" href="#"><span></span></a>' +
						'<a class="tips red-link downgrade" title="Downgrade building" href="#"><span></span></a>' +
					'</footer>' +
				'</div>';
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} params
	 * @param {Number} level
	 * @returns {String}
	 */
	building_panel (params, level) {
		if (typeof params.levels === 'undefined') {
			params.levels = 1;
		}
		let building_image = params.handle;
		if (params.handle.slice(0, 5) === 'house') {
			building_image = params.handle.slice(0, 5);
		}
		let image = (typeof params.visible_upgrades === 'undefined' || params.visible_upgrades === false) ? building_image: building_image + params.level;
		let out = '<div class="column preview-image">' +
					'<img class="image" src="' + game.ASSETS_URL + 'images/assets/buildings/' + image + '.png" />' +
				'</div>' +
				'<div class="column">' +
					'<p>' + params.description + '</p>' +
					'<dl>' +
						this.level_panel(params.level, level, params.levels) +
						this.cost_panel(params.cost, level, params.levels) +
						this.materials_panel(params.materials) +
						this.production_panel(params.production, level) +
						this.requires_panel(params.requires) +
						this.chance_panel(params.chance, level) +
						this.tax_panel(params.tax, level) +
						this.storage_panel(params.storage, level) +
					'</dl>' +
				'</div>'; 
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} section
	 * @param {String} contents
	 * @returns {String}
	 */
	normal_panel (section, contents) {
		let out = '<fieldset>' +
					'<legend>' + section + '</legend>' +
					contents +
				'</fieldset>';
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Number} level
	 * @param {Number} new_level
	 * @param {Number} max_level
	 * @returns {String}
	 */
	level_panel (level, new_level, max_level) {
		let out = '<dt>Level</dt>' +
				'<dd>' +
					'<span title="Current building level" class="tips">' + new_level + '</span> / <span title="Maximum building level achievable through upgrades" class="tips">' + max_level + '</span>' +
				'</dd>';
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} conts
	 * @param {Number} level
	 * @param {Number} levels
	 * @returns {String}
	 */
	cost_panel (costs, level, levels) {
		let out = '';
		if (typeof costs !== 'undefined') {
			out += '<dt>Cost</dt>';
			for (let item in costs) {
				out += '<dd>' + game.nice_numbers(costs[item]) + this.resource_small_img(item) + (typeof levels !== 'undefined' && level < levels ? ' / ' + game.nice_numbers(costs[item] * (level + 1)) + this.resource_small_img(item) : '') + '</dd>';
			}
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Number} value
	 * @param {String} progress_type
	 * @param {Boolean} show_value
	 * @returns {String}
	 */
	progress (value, progress_type, show_value) {
		if (typeof progress_type === 'undefined') {
			progress_type = 'small';
		}
		let _e = '';
		if (value < 10) {
			_e = ' ubad';
		} else if (value >= 10 && value < 30) {
			_e = ' vbad';
		} else if (value >= 30 && value < 40) {
			_e = ' bad';
		} else if (value >= 40 && value < 60) {
			_e = ' good';
		} else if (value >= 60 && value < 90) {
			_e = ' vgood';
		} else if (value >= 90) {
			_e = ' ugood';
		}
		return '<div class="progress ' + progress_type + '">' +
				'<div class="bar' + _e + '" style="width:' + value + '%">' +
					'<p>' + (typeof show_value !== 'undefined' ? show_value : value) + '</p>' +
				'</div>' +
			'</div>';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} name
	 * @returns {String}
	 */
	navy_img (name) {
		return '<img class="tips small" title="' + game.SHIPS[name].name + '" src="' + game.ASSETS_URL + 'images/assets/navy/' + name.toLowerCase().replace(/ /g,"_") + '.png" />';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} name
	 * @returns {String}
	 */
	army_img (name) {
		return '<img class="tips small" title="' + game.SOLDIERS[name].name + '" src="' + game.ASSETS_URL + 'images/assets/army/' + name.toLowerCase().replace(/ /g,"_") + '.png" />';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} heroes
	 * @returns {String}
	 */
	heroes_list (heroes) {
		let out2 = '<p>There are no heroes in this settlement.</p>';
		let out = '';
		let total = 0;
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} army
	 * @param {Boolean} no_margin
	 * @returns {String}
	 */
	army_list (army, no_margin) {
		let out2 = '<p>There are no soldiers in this army.</p>';
		let out = '<dl' + ((typeof no_margin !== 'undefined' && no_margin === true) ? ' class="nomg"' : '') + '>';
		let total = 0;
		for (let soldier in army) {
			if (army[soldier] > 0) {
				out += '<dt>' + army[soldier] + '</dt>' + '<dd>' + this.army_img(soldier) + '</dd>';
				total += army[soldier];
			}
		}
		out += '<dt>' + total + '</dt>' +
				'<dd>Total</dd>' +
			'</dl>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} navy
	 * @param {Boolean} no_margin
	 * @returns {String}
	 */
	navy_horizontal_list (navy) {
		let out2 = '<p>There are no ships in this navy.</p>';
		let out = '<p>This settlement has the following navy:</p>';
		let total = 0;
		let total_attack = 0;
		let total_defense = 0;
		for (let ship in navy) {
			if (navy[ship] > 0) {
				out += '<span class="tips storage-item small" title="' + game.SHIPS[ship].name + '"><img class="small" src="' + game.ASSETS_URL + 'images/assets/navy/' + ship.toLowerCase().replace(/ /g,"_") + '.png" /><span class="amount">' + navy[ship] + '</span></span>';
				total += navy[ship];
				total_attack += (game.SHIPS[ship].attack * navy[ship]);
				total_defense += (game.SHIPS[ship].defense * navy[ship]);
			}
		}
		out += '<p>Total ships: ' + total + '</p>' +
			'<p>Total attack: <span class="red">' + total_attack + '</span></p>' +
			'<p>Total defense: <span class="blue">' + total_defense + '</span></p>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} army
	 * @param {Boolean} no_margin
	 * @returns {String}
	 */
	army_horizontal_list (army) {
		let out2 = '<p>There are no soldiers in this army.</p>';
		let out = '<p>This settlement has the following army:</p>';
		let total_attack = 0;
		let total_defense = 0;
		let total = 0;
		for (let soldier in army) {
			if (army[soldier] > 0) {
				out += '<span class="tips storage-item small" title="' + game.SOLDIERS[soldier].name + '"><img class="small" src="' + game.ASSETS_URL + 'images/assets/army/' + soldier.toLowerCase().replace(/ /g,"_") + '.png" /><span class="amount">' + army[soldier] + '</span></span>';
				total += army[soldier];
				total_attack += (game.SOLDIERS[soldier].attack * army[soldier]);
				total_defense += (game.SOLDIERS[soldier].defense * army[soldier]);
			}
		}
		out += '<p>Total soldiers: ' + total + '</p>' +
			'<p>Total attack: <span class="red">' + total_attack + '</span></p>' +
			'<p>Total defense: <span class="blue">' + total_defense + '</span></p>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	}

	/**
	 * Check if a window exists and is opened.
	 * 
	 * @param {String} id
	 * @returns {Boolean}
	 */
	window_exists (id) {
		if ($(id).length === 0) {
			return false;
		}
		return true;
	}

	/**
	 * Check if a panel exists and is opened.
	 * 
	 * @param {String} id
	 * @returns {Boolean}
	 */
	panel_exists (id) {
		if ($(id).length === 0) {
			return false;
		}
		return true;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} text
	 * @param {String} title
	 * @param {String} handle
	 * @param {String} class_name
	 * @param {Boolean} disabled
	 * @returns {String}
	 */
	panel_btn (text, title, handle, class_name, disabled) {
		return '<a title="' + title + '" data-handle="' + handle + '" class="tips ' + class_name + (disabled === true ? ' disabled' : '') + '" href="#">' + text + '</a></td>';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} trades
	 * @param {String} mode
	 * @returns {String}
	 */
	trades_list (trades, mode) {
		mode = (typeof mode === 'undefined' || mode === 'imports') ? 'imports' : 'exports';
		let out = '';
		if (trades !== null) {
			let trade = trades[mode];
			for (let item in trade) {
				if (trade[item] > 0) {
					out += this.resource_storage_small_el(item, trade[item]);
				}
			}
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} army
	 * @param {Boolean} no_margin
	 * @returns {String}
	 */
	navy_list (army, no_margin) {
		let out2 = '<p>There are no ships in this navy.</p>';
		let out = '<dl' + ((typeof no_margin !== 'undefined' && no_margin === true) ? ' class="nomg"' : '') + '>';
		let total = 0;
		for (let ship in army) {
			if (army[ship] > 0) {
				out += '<dt>' + army[ship] + '</dt>' + '<dd>' + this.navy_img(ship) + '</dd>';
				total += army[ship];
			}
		}
		out += '<dt>' + total + '</dt>' +
				'<dd>Total</dd>' +
			'</dl>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} params
	 * @returns {String}
	 */
	building_element (params) {
		let building_image = params.type;
		if (params.type.slice(0, 5) === 'house') {
			building_image = params.type.slice(0, 5);
		}
		let image = (typeof params.data.visible_upgrades === 'undefined' || params.data.visible_upgrades === false) ? building_image : building_image + params.data.level;
		return '<div data-type="' + params.type + '" data-level="' + params.data.level + '" ' + 'style="background-image:url(' + game.ASSETS_URL + 'images/assets/buildings/' + image + '.png);left:' + params.data.position.x + 'px;top:' + params.data.position.y + 'px" title=\'' + params.data.name + '\' ' + 'id="building-' + params.data.handle + '"' + 'class="tips building' + (params.data.large === true ? ' large' : '') + '"></div>';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} resource
	 * @param {Number} amount
	 * @returns {String}
	 */
	resource_storage_small_el (resource, amount) {
		return '<span class="tips storage-item small" title="' + game.get_resource_name(resource) + '"><img class="small" src="' + game.ASSETS_URL + 'images/assets/resources/' + resource + '.png" /><span class="amount">' + amount + '</span></span>';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} resource
	 * @param {Number} amount
	 * @returns {String}
	 */
	resource_storage_el (resource, amount) {
		return '<div class="storage-item" data-resource="' + resource + '"><span class="title">' + game.get_resource_name(resource) + '</span><img src="' + game.ASSETS_URL + 'images/assets/resources/' + resource + '.png" /><span class="amount">' + amount + '</span></div>';
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Array} data
	 * @returns {String}
	 */
	tabs (data) {
		let out = '<div class="tabs">' +
				'<ul>';
		for (let i = 0; i < data.length; i++) {
			out += '<li><a href="#tab-' + data[i].toLowerCase().replace(/ /g, "-") + '">' + data[i].capitalize() + '</a></li>';
		}
		out += '</ul>';
		for (let i = 0; i < data.length; i++) {
			out += '<div id="tab-' + data[i].toLowerCase().replace(/ /g, "-") + '"></div>';
		}
		out += '</div>';
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object| Array} materials
	 * @returns {String}
	 */
	materials_panel (materials) {
		let out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>Uses</dt>';
			if (Array.isArray(materials)) {
				for (let i = 0; i < materials.length; i++) {
					for (let y in materials[i]) {
						out += '<dd>' + materials[i][y] + this.resource_small_img(y) + '</dd>';
					}
				}
			} else {
				for (let item in materials) {
					out += '<dd>' + materials[item] + this.resource_small_img(item) + '</dd>';
				}
			}
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} materials
	 * @param {Number} level
	 * @returns {String}
	 */
	chance_panel (materials, level) {
		let out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>Extra materials</dt>';
			for (let item in materials) {
				out += '<dd>' + (level * materials[item]).toFixed(4) * 100 + '%' + this.resource_small_img(item) + '</dd>';
			}
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} materials
	 * @param {Number} level
	 * @returns {String}
	 */
	production_panel (materials, level) {
		let out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>Produces</dt>';
			for (let item in materials) {
				out += '<dd>' + (level * materials[item]) + this.resource_small_img(item) + '</dd>';
			}
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Object} requires
	 * @returns {String}
	 */
	requires_panel (requires) {
		let out = '';
		if (typeof requires.buildings !== 'undefined' || typeof requires.settlement_level !== 'undefined') {
			out += '<dt>Requires</dt>';
			out += '<dd>';
			if (typeof requires.buildings !== 'undefined') {
				for (let item in requires.buildings) {
					let b = this.core().get_building_config_data(item);
					out += b.name + ' level ' + requires.buildings[item] + '<br />';
				}
			}
			if (typeof requires.research !== 'undefined') {
				let r = game.TECHNOLOGIES[game.TECHNOLOGIES.findIndexByHandle(requires.research)];
				out += 'Research: ' + r.name + '<br />';
			}
			if (typeof requires.settlement_level !== 'undefined') {
				out += 'Setlement: level ' + requires.settlement_level;
			}
			out += '</dd>';
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Number} tax
	 * @param {Number} level
	 * @returns {String}
	 */
	tax_panel (tax, level) {
		let out = '';
		if (typeof tax !== 'undefined') {
			out += '<dt>Tax</dt>';
			out += '<dd>' + (level * tax) + this.resource_small_img('coins') + '</dd>';
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {Number} storage
	 * @param {Number} level
	 * @returns {String}
	 */
	storage_panel (storage, level) {
		let out = '';
		if (typeof storage !== 'undefined') {
			out += '<dt>Storage</dt>' +
				'<dd>' +
					(level * storage) + '<img alt="Storage space" class="tips small" title="Storage Space" src="' + game.ASSETS_URL + 'images/assets/resources/storage.png" />' +
				'</dd>';
		}
		return out;
	}

	/**
	 * 
	 *
	 * @public
	 * @param {String} resource
	 * @returns {String}
	 */
	resource_small_img (resource) {
		return '<img alt="' + game.get_resource_name(resource) + '" class="tips small" title="' + game.get_resource_name(resource) + '" src="' + game.ASSETS_URL + 'images/assets/resources/' + resource + '.png" />';
	}

	/**
	 * Return a pointer to the game core.
	 * 
	 * @public
	 * @returns {game}
	 */
	core () {
		return this._core;
	}

	/**
	 * Perform a normal notification in the game.
	 * 
	 * @public
	 * @param {String} message
	 * @param {String} title
	 * @param {Number} timeout
	 * @returns {ui}
	 */
	notify (message, title, timeout, mode) {
		this._notify({
			title: (typeof title !== 'undefined') ? title : 'City Council',
			content: message,
			timeout: typeof timeout !== 'undefined' ? timeout : 15000,
			mode: typeof mode !== 'undefined' ? mode : game.NOTIFY_NORMAL
		});
		this.log('game', message);
		return this;
	}

	/**
	 * Internal function for performing an UI notification.
	 * 
	 * @param {Object} settings
	 * @returns {ui}
	 * @private
	 */
	_notify (settings) {
		let container, notty, hide, image, right, left, inner, _container;
		let notty_type = 'normal';
		settings = $.extend({
			title: null,
			content: null,
			timeout: 15000,
			img: null,
			mode: game.NOTIFY_NORMAL
		}, settings);
		if (settings.mode === game.NOTIFY_ACHIEVEMENT) {
			_container = 'achievements-notifications';
		} else {
			_container = 'notifications';
		}
		container = $('.' + _container);
		if (!container.length) {
			container = $("<div>", {
				'class': _container
			}).appendTo(document.body);
		}
		$('.achievements-notifications').css({
			left: ($(window).width() / 2) - (container.width() / 2)
		});
		notty = $('<div>');
		notty.addClass('notty');
		hide = $("<div>", {
			click () {
				$(this).parent().delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			},
			touchstart () {
				$(this).parent().delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			}
		});
		hide.addClass('hide');
		if (settings.mode === game.NOTIFY_ERROR) {
			notty_type = 'error';
		} else if (settings.mode === game.NOTIFY_RESEARCH) {
			notty_type = 'research';
		} else if (settings.mode === game.NOTIFY_EVENT) {
			notty_type = 'event';
		} else if (settings.mode === game.NOTIFY_ACHIEVEMENT) {
			notty_type = 'achievement';
		} else if (settings.mode === game.NOTIFY_RELIGION) {
			notty_type = 'religion';
		} else if (settings.mode === game.NOTIFY_WAR) {
			notty_type = 'war';
		}
		notty.addClass(notty_type);
		settings.img = game.ASSETS_URL + 'images/assets/ui/icon_' + notty_type + '.png';
		image = $('<div>', {
			style: "background: url('" + settings.img + "')"
		});
		image.addClass('img');
		left = $("<div class='left'>");
		right = $("<div class='right'>");
		inner = $('<div>', {
			html: '<h2>' + settings.title + '</h2>' + settings.content
		});
		inner.addClass("inner");
		inner.appendTo(right);
		image.appendTo(left);
		left.appendTo(notty);
		right.appendTo(notty);
		hide.appendTo(notty);
		if (settings.mode !== game.NOTIFY_ACHIEVEMENT) {
			let timestamp = Number(new Date());
			let timeHTML = $('<div>', {
				html: game.time_since(timestamp) + ' ago'
			});
			timeHTML.addClass('time-ago').attr('title', timestamp);
			timeHTML.appendTo(right);
			setInterval(function () {
				$('.time-ago').each(function () {
					let timing = $(this).attr('title');
					if (timing) {
						$(this).html(game.time_since(timing) + ' ago');
					}
				});
			}, 4000);
		}
		notty.hover(function () {
			hide.show();
		}, function () {
			hide.hide();
		});
		notty.prependTo(container);
		notty.show();
		if (settings.timeout) {
			setTimeout(function () {
				notty.delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			}, settings.timeout);
		}
		return this;
	}

	/**
	 * Perform an error notification in the game.
	 * 
	 * @public
	 * @param {String} message
	 * @param {String} title
	 * @param {Boolean} no_console
	 * @returns {ui}
	 */
	error (message, title, no_console) {
		this._notify({
			title: (typeof title !== 'undefined') ? title : 'City Council',
			mode: game.NOTIFY_ERROR,
			content: message
		});
		if (typeof no_console === 'undefined' || no_console === false) {
			this.log('game', message, true);
		}
		return this;
	}

	/**
	 * Resize the UI.
	 *
	 * @public
	 * @returns {ui}
	 */
	resize () {
		const window_width = parseInt($(window).width(), 10);
		const window_height = parseInt($(window).height(), 10);
		const header_height = parseInt($('.ui > header').height(), 10);
		const sidebar_width = parseInt($('.ui > aside').width(), 10);
		const footer_width = parseInt($('.ui > footer').width(), 10);
		$('.ui > footer').css({
			left: (window_width / 2) - (footer_width / 2)
		});
		$('.ui > aside').css({
			height: window_height - header_height
		});
		$('.ui > .viewport').width(window_width - sidebar_width);
		$('.ui > .viewport').height(window_height - header_height);
		return this;
	}

	/**
	 * Log data to the console.
	 * 
	 * @public
	 * @param {String} namespace
	 * @param {String} message
	 * @param {Boolean} error
	 * @returns {ui}
	 */
	log (namespace, message, error) {
		if ($('#panel-debug .console p').length > game.MAX_CONSOLE_LINES) {
			$('#panel-debug .console').empty();
		}
		$('#panel-debug .console').prepend('<p><span class="date">' + game.get_now() + '</span><span class="namespace game-' + namespace + '">' + namespace.toUpperCase() + '</span>' + (error === true ? '<span class="error">ERROR</span>' : '') + '<span' + (error === true ? ' class="error-message"' : ' class="log-message"') + '>' + message + '</span></p>');
		return this;
	}

	/**
	 * Open a UI panel.
	 *
	 * @public
	 * @param {Object} name
	 * @param {Object} extra_data
	 * @param {Boolean} sidebar
	 * @returns {ui_panel}
	 */
	open_panel (name, extra_data, sidebar) {
		let _data = {};
		_data.core = this.core();
		if (typeof extra_data !== 'undefined') {
			_data.data = extra_data;
		}
		if (typeof sidebar !== 'undefined') {
			_data.data.sidebar = sidebar;
		}
		const panel = new this.panel_class_names[name](_data);
		this.panels.push(panel);
		return panel;
	}

	/**
	 * Open a UI window.
	 *
	 * @public
	 * @param {Object} name
	 * @param {Object} extra_data
	 * @returns {ui_window}
	 */
	open_window (name, extra_data) {
		let _data = {};
		_data.core = this.core();
		if (typeof extra_data !== 'undefined') {
			_data.data = extra_data;
		}
		
		return new this.window_class_names[name](_data);
	}

	/**
	 * Open a modal window (usually to ask for confirmations).
	 *
	 * @public
	 * @param {Function} callback
	 * @param {String} text
	 * @param {String} title
	 * @returns {ui}
	 */
	open_modal (callback, text, title) {
		const modal = new ui_modal({
			core: this.core()
		});
		modal.alert({
			title: typeof title !== 'undefined' ? title : 'City Council',
			text,
			on_click: callback
		});
		return this;
	}

	/**
	 * Refresh all the UI information after a property change.
	 * 
	 * @public
	 * @returns {ui}
	 */
	refresh_ui () {
		const settlement = this.core().get_settlement();
		if (typeof settlement !== 'undefined') {
			$('.citylevel').html(settlement.level());
			if (settlement.fame() >= this.core().level_to_fame(settlement.level())) {
				this.core().level_up();
			}
		}
		return this;
	}

	/**
	 * Calculate and return the total and free storage space in the main settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	check_storage () {
		const storage = this.core().get_settlement().storage();
		if (storage.occupied >= storage.all) {
			this.error('You ran out of storage space and all goods produced will be lost. Upgrade your warehouse or marketplace.', 'No storage space');
		} else if ((storage.all - storage.occupied) < 100) {
			this.error('You will soon run out of storage space and all goods produced will be lost. Upgrade your warehouse or marketplace.', 'Storage nearly full');
		}
		return storage;
	}

	/**
	 * Refresh the UI and panels.
	 *
	 * @public
	 * @returns {ui}
	 */
	refresh () {
		this.refresh_panels();
		this.refresh_toolbar();
		this.refresh_ui();
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		return this;
	}

	/**
	 * Get the panels open in the game.
	 * 
	 * @public
	 * @returns {Array}
	 */
	get_panels () {
		return this.panels;
	}

	/**
	 * Refresh the resources toolbar.
	 *
	 * @public
	 * @returns {ui}
	 */
	refresh_toolbar () {
		const settlement = this.core().get_settlement();
		let pos;
		if (typeof settlement !== 'undefined') {
			const resources = settlement.get_resources();
			for (let item in game.RESOURCES) {
				if (game.RESOURCES[item].toolbar === true) {
					if (game.is_virtual_resource(item)) {
						pos = '.top-panel';
					} else {
						pos = '.resource-panel';
					}
					if (typeof resources[item] !== 'undefined') {
						if (resources[item] === 0) {
							$(pos + ' .resource.' + item).hide();
						} else {
							$(pos + ' .resource.' + item).show();
						}
						$(pos + ' .resource.' + item + ' span').html(resources[item]);
					}
				}
			}
		}
		return this;
	}

	/**
	 * Return the UI panel specified by its id.
	 *
	 * @public
	 * @param {String} id
	 * @returns {ui_panel|Boolean}
	 */
	get_panel (id) {
		const panels = this.get_panels();
		for (let i = 0; i < panels.length; i++) {
			if (typeof panels[i] !== 'undefined') {
				if (panels[i].id === id) {
					return panels[i];
				}
			}
		}
		return false;
	}

	/**
	 * Close the UI panel specified by its id.
	 *
	 * @public
	 * @param {String} id
	 * @returns {Boolean}
	 */
	close_panel (id) {
		const panels = this.get_panels();
		for (let i = 0; i < panels.length; i++) {
			if (typeof panels[i] !== 'undefined') {
				if (panels[i].id === id) {
					panels.splice(i, 1);
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Force refresh of the UI panels open.
	 *
	 * @public
	 * @returns {ui}
	 */
	refresh_panels () {
		const panels = this.get_panels();
		for (let i = 0; i < panels.length; i++) {
			if (typeof panels[i] !== 'undefined') {
				panels[i].on_refresh();
			}
		}
		return this;
	}

	/**
	 * Get the middle of a hex cell.
	 *
	 * @public
	 * @param {Number} row
	 * @param {Number} column
	 * @returns {Number}
	 */
	get_cell_middle (row, column) {
		let height = Math.sqrt(3) / 2 * game.WORLD_HEX_SIZE;
		let center = {
			x: Math.round(game.WORLD_HEX_SIZE), 
			y: Math.round(height)
		};
		return center;
	}

	/**
	 * Scroll the world map to the specified location.
	 *
	 * @param {Object} location
	 * @public
	 * @returns {ui}
	 */
	worldmap_scrollto (location) {
		const coords = this.get_cell_middle_coords(location.y, location.x);
		$('.worldmap').scrollTop(coords.y - (700 / 2));
		$('.worldmap').scrollLeft(coords.x - (1164 / 2));
		return this;
	}

	/**
	 * Scroll the city map to the specified building location.
	 *
	 * @param {Object} building
	 * @public
	 * @returns {ui}
	 */
	citymap_scrollto_building (building) {
		const location = building.position;
		const view_width = parseInt($('.ui > .viewport').width(), 10);
		const view_height = parseInt($('.ui > .viewport').height(), 10);
		$('.viewport').scrollTop(location.y - ((view_height - 260) / 2));
		$('.viewport').scrollLeft(location.x - ((view_width - 260) / 2));
		return this;
	}

	/**
	 * Get the middle coordonates of a hex cell.
	 *
	 * @public
	 * @param {Number} row
	 * @param {Number} column
	 * @returns {Object}
	 */
	get_cell_middle_coords (row, column) {
		const height = Math.sqrt(3) / 2 * game.WORLD_HEX_SIZE;
		return {
			x: Math.round((1.5 * column) * game.WORLD_HEX_SIZE),
			y: Math.round(height * (row * 2 + (column % 2)))
		};
	}

	/**
	 * Get a random HSL color.
	 *
	 * @public
	 * @returns {String}
	 */
	get_random_color () {
		let color = (Math.random() * 250) + 1;
		let colors = Math.random() * 255;
		return "hsl(" + (color * (360 / colors) % 360) + ", 50%, 50%)";
	}
}
