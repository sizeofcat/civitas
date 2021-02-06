/**
 * World panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_world
 * @extends ui_panel
 * @returns {ui_panel_world}
 */
class ui_panel_world extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_world}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'world';
		params.template = ui.generic_panel_template('World Map');
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			$(this.handle + ' section').append('<div class="worldmap"></div>');
			core.world().draw();
			let clicked = false;
			let clickY, clickX;
			let update_scroll_pos = function (event) {
				$('.worldmap').scrollTop($('.worldmap').scrollTop() + (clickY - event.pageY));
				$('.worldmap').scrollLeft($('.worldmap').scrollLeft() + (clickX - event.pageX));
				clickY = event.pageY;
				clickX = event.pageX;
			};
			$('.worldmap').on({
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
			$(this.handle).on('click', '.settlement', function () {
				let _settlement_name = $(this).data('name');
				if (_settlement_name === settlement.name()) {
					core.ui().open_panel('council');
				} else {
					core.ui().open_panel('settlement', core.get_settlement(_settlement_name));
				}
				return false;
			}).on('click', '.ruins', function () {
				let id = parseInt($(this).data('id'), 10);
				core.ui().open_panel('place', core.get_settlement(id));
				return false;
			}).on('click', '.troop', function () {
				let id = parseInt($(this).data('id'), 10);
				if (core._queue[id].mode === game.ACTION_CAMPAIGN ||
					core._queue[id].mode === game.ACTION_DIPLOMACY) {
					core.ui().open_panel('campaign', core._queue[id]);
				}
				return false;
			}).on('click', '.canvas-map', function() {
				// Todo
				return false;
			});
			core.ui().worldmap_scrollto(settlement.location());
		};
		params.on_refresh = function() {
			let core = this.core();
			let settlement = core.get_settlement();
			let settlements = core.get_settlements();
			let world = core.world();
			let queue_actions = core.queue();
			$('.troop, .settlement, .ruins').remove();
			for (let i = 0; i < settlements.length; i++) {
				let image = 'village';
				let class_name = 'settlement';
				let name = settlements[i].name();
				let location = settlements[i].location();
				let coords = core.ui().get_cell_middle_coords(location.y, location.x);
				let _name = settlements[i].nice_name();
				if (typeof settlement !== 'undefined' && name === settlement.name()) {
					image = 'settlement';
				} else {
					if (settlements[i].is_metropolis()) {
						image = 'metropolis' + settlements[i].icon();
					} else if (settlements[i].is_city()) {
						image = 'city' + settlements[i].icon();
					} else if (settlements[i].is_village()) {
						image = 'village' + settlements[i].icon();
					} else if (settlements[i].is_camp()) {
						image = 'camp';
					} else if (settlements[i].is_ruins()) {
						image = 'ruins';
						class_name = 'ruins';
						if (!settlements[i].is_scouted()) {
							_name = 'Some distant ruins';
						}
					}
				}
				if ((!settlements[i].is_ruins()) ||
					(core.has_research('archeology') && settlements[i].is_ruins())) {
					$('.worldmap').append('<img data-x="' + location.x +
						'" data-y="' + location.y + '" title="' + _name +
						'" style="left:' + (coords.x + 3) + 'px;top:' + coords.y +
						'px" data-id="' + settlements[i].id() + '" data-name="' +
						name + '" src="' + game.ASSETS_URL + 'images/assets/ui/world/' +
						image + '.png' + '" class="tips ' + class_name + '" />');
				}
			}
			for (let i = 0; i < queue_actions.length; i++) {
				let action = queue_actions[i];
				if (action.mode !== game.ACTION_RESEARCH) {
					let source = action.source;
					let destination = action.destination;
					console.log(destination);
					let distance_in_days = core.world().get_distance_in_days(source, destination);
					if (action.mode === game.ACTION_DIPLOMACY) {
						distance_in_days = distance_in_days / 2;
					}
					let title = '';
					let troop_type = 'troop';
					let _source = core.get_settlement(source.id);
					let _destination = core.get_settlement(destination.id);
					let x = source.x + Math.floor(((destination.x - source.x) /
						distance_in_days) * action.passed);
					let y = source.y - Math.floor(((source.y - destination.y) /
						distance_in_days) * action.passed);
					if (action.mode === game.ACTION_CAMPAIGN) {
						if (action.type === game.CAMPAIGN_CARAVAN) {
							troop_type = 'troop_caravan';
							title = 'Caravan from ' + _source.name() + ' sent to ' +
								_destination.name() + '.';
						} else if (action.type === game.CAMPAIGN_SCOUT) {
							troop_type = 'troop_scout';
							title = 'Scout from ' + _source.name() +
								' going to a specific place.';
						} else if (action.type === game.CAMPAIGN_SPY) {
							troop_type = 'troop_spy';
							title = 'Spy from ' + _source.name() +
								' sneaking into ' + _destination.name() + '.';
						} else if (action.type === game.CAMPAIGN_ARMY_RETURN) {
							troop_type = 'troop_return';
							title = _destination.name() + ' army returning from ' +
								_source.name() + '.';
						} else {
							troop_type = 'troop_attack';
							title = _source.name() + ' army marching to ' +
								_destination.name() + '.';
						}
					} else if (action.mode === game.ACTION_DIPLOMACY) {
						troop_type = 'troop_diplomatic';
						title = 'Diplomatic mission from ' + _source.name() +
							' to ' + _destination.name() + '.';
					}
					let coords = core.ui().get_cell_middle_coords(y, x);
					$('.worldmap').append('<img data-name="' + troop_type +
						'" data-x="' + x + '" data-y="' + y + '" title="' + title +
						'" style="left:' + (coords.x + 3) + 'px;top:' +
						coords.y + 'px" data-id="' + i + '" src="' +
						game.ASSETS_URL + 'images/assets/ui/world/' + troop_type +
						'.png' + '" class="tips troop" />');
				}
			}
		};
		super(params);
	}
}
