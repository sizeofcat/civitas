/**
 * Academy panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_academy
 * @extends ui_panel
 * @returns {ui_panel_academy}
 */
class ui_panel_academy extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_academy}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'academy';
		params.template = ui.building_panel_template();
		params.on_show = function(params) {
			let _t = '';
			let self = this;
			let core = this.core();
			let my_settlement = core.get_settlement();
			$(this.handle + ' section').append(core.ui().tabs([
				'Info',
				'Research',
				'Technologies',
				'Projects'
			]));
			_t += '<div class="column-left">' +
				'</div>' +
				'<div class="column-right">' +
					'<h2>Technology Tree</h2>' +
					'<p>Select a technology from the left panel to view information about it.</p>' +
				'</div>';
			$(this.handle + ' #tab-technologies').empty().append(_t);
			_t = '';
			for (let i = 0; i < game.TECHNOLOGIES.length; i++) {
				_t += '<div data-technology="' + game.TECHNOLOGIES[i].handle +
					'" class="technology"><img src="' + game.ASSETS_URL +
					'images/assets/research/' + game.TECHNOLOGIES[i].handle +
					'.png" /></div>';
			}
			$(this.handle + ' .column-left').empty().append(_t);
			$(self.handle + ' #tab-projects').empty().append('<p>Not implemented yet.</p>');
			$(this.handle).on('click', '.technology', function() {
				$(self.handle + ' .technology').removeClass('selected');
				$(this).addClass('selected');
				let technology_name = $(this).data('technology');
				let technology = core.get_research_config_data(technology_name);
				if (technology) {
					_t = '<h2>' + technology.name + '</h2>' +
					'<p>' + technology.description + '</p>' +
					'<dl>' +
						'<dt>Duration</dt>' +
						'<dd>' + technology.duration + ' days</dd>' +
						'<dt>Cost</dt>';
					for (let y in technology.cost) {
						_t += '<dd>' + game.nice_numbers(technology.cost[y]) +
							' <img class="small tips" title="' + game.get_resource_name(y) +
							'" src="' + game.ASSETS_URL + 'images/assets/resources/' +
							y + '.png" /></dd>';
					}
					_t += '<dt>Effect</dt>';
					for (let y in technology.effect) {
						if (y === 'buildings') {
							for (let b in technology.effect[y]) {
								let _z = core.get_building_config_data(b);
								_t += '<dd>' + _z.name + ' +' + technology.effect[y][b] + '</dd>';
							}
						} else if (y === 'tax') {
							_t += '<dd>+' + technology.effect[y] +
								core.ui().resource_small_img('coins') + ' each house</dd>';
						} else if (y === 'distance') {
							_t += '<dd>Faster world map travel</dd>';
						} else if (y === 'ruins') {
							_t += '<dd>Show ruins on world map</dd>';
						}
					}
					_t += '<div class="toolbar"></div>';
					$(self.handle + ' .column-right').empty().append(_t);
					if (core.has_research(technology.handle)) {
						$(self.handle + ' .toolbar').empty().append('You already ' +
							'researched this technology.');
					} else if (core.in_queue(technology.handle) !== false) {
						$(self.handle + ' .toolbar').empty().append('You are currently ' +
							'researching this technology.');
					} else {
						$(self.handle + ' .toolbar').empty().append('<a href="#" ' +
							'class="btn do-research" data-technology="' +
							technology.handle + '">Research</a>');
					}
				}
				return false;
			}).on('click', '.do-research', function() {
				let technology_name = $(this).data('technology');
				let technology = core.get_research_config_data(technology_name);
				if (technology) {
					if (core.has_research_in_queue() === false) {
						if (core.get_settlement().has_resources(technology.cost)) {
							if (core.queue_add(my_settlement, null, game.ACTION_RESEARCH, null, {
								handle: technology.handle,
								name: technology.name,
								duration: technology.duration
							})) {
								my_settlement.remove_resources(technology.cost);
								$(self.handle + ' .toolbar').empty();
								core.save_and_refresh();
							}
						} else {
							core.ui().error('You don`t have enough resources ' +
								'to research this technology.');
						}
					} else {
						core.ui().error('You can research only one technology at a ' +
							'time. Wait for the current research to finish.');
					}
				}
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let research = settlement.research();
			let technologies = core.research();
			let _t = '';
			let building = core.get_settlement().get_building(this.params_data.handle);
			if (building) {
				$(this.handle + ' #tab-info').empty()
					.append(core.ui().building_panel(this.params_data, building.level));
				_t = '<h2>Research points</h2>' +
					'<div class="section">' +
						core.ui().progress((research * 100) /
						game.MAX_RESEARCH_VALUE, 'large', research + ' / ' +
						game.MAX_RESEARCH_VALUE) +
					'</div>';
				let queue_action = core.has_research_in_queue();
				if (queue_action !== false) {
					_t += '<h2>Currently researching `' + queue_action.data.name + '`</h2>' +
					'<div class="section">' +
						core.ui().progress((queue_action.passed * 100) /
						queue_action.duration, 'large', queue_action.passed +
						' / ' + queue_action.duration + ' days') +
					'</div>';
				}
				$(this.handle + ' #tab-research').empty().append(_t);
			} else {
				this.destroy();
			}
			for (let f = 0; f < technologies.length; f++) {
				if (typeof technologies[f] !== 'undefined') {
					$(this.handle + ' .technology[data-technology=' +
						technologies[f].handle + ']').addClass('has');
				}
			}
		};
		super(params);
	}
}
