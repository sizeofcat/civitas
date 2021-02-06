/**
 * Settlement panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_settlement
 * @extends ui_panel
 * @returns {ui_panel_settlement}
 */
class ui_panel_settlement extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_settlement}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = '<div id="panel-{ID}" class="panel">' +
				'<header>' +
					'<a class="tips close" title="Close"></a>' +
				'</header>' +
				'<section></section>' +
				'<footer>' +
					'<a class="tips red-link attack" title="Attack this settlement." href="#"><span></span></a>' +
					'<a class="tips blue-link caravan" title="Send a caravan to this settlement." href="#"><span></span></a>' +
					'<a class="tips red-link spy" title="Send a spy to this settlement." href="#"><span></span></a>' +
					'<a class="tips green-link alliance" title="Propose an alliance to this settlement." href="#"><span></span></a>' +
					'<a class="tips green-link pact" title="Propose a pact to this settlement." href="#"><span></span></a>' +
					'<a class="tips blue-link ceasefire" title="Propose a cease fire to this settlement." href="#"><span></span></a>' +
					'<a class="tips green-link join" title="Ask this settlement to join your city." href="#"><span></span></a>' +
					'<a class="tips red-link war" title="Declare war to this settlement." href="#"><span></span></a>' +
				'</footer>' +
			'</div>';
		params.params_data = null;
		params.id = 'settlement';
		params.on_show = function(params) {
			let core = this.core();
			let my_settlement = core.get_settlement();
			let settlement = params.data;
			this.params_data = params;
			$(this.handle + ' header').append(settlement.name());
			let tabs = [];
			if (settlement.is_urban()) {
				tabs.push('Info');
				if (my_settlement.can_diplomacy()) {
					tabs.push('Army');
					if (settlement.waterside() === true) {
						tabs.push('Navy');
					}
				}
				tabs.push('Heroes', 'Resources', 'Imports', 'Exports');
			} else {
				tabs.push('Info');
				if (my_settlement.can_diplomacy() || settlement.is_camp()) {
					tabs.push('Army');
					if (settlement.waterside() === true) {
						tabs.push('Navy');
					}
				}
				tabs.push('Resources');
			}
			$(this.handle + ' section').append(core.ui().tabs(tabs));
			$(this.handle).on('click', '.alliance', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to propose an alliance to other settlements.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!core.queue_add(my_settlement, settlement, game.ACTION_DIPLOMACY, game.DIPLOMACY_PROPOSE_ALLIANCE, {})) {
								core.ui().error('There was an error proposing an alliance to this settlement, check the data you entered and try again.');
								return false;
							}
							core.do_achievement('pacifist');
						}
					},
					'Are you sure you want to propose an alliance to this settlement?'
				);
				return false;
			}).on('click', '.join', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to ask other settlements to join your city.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!core.queue_add(my_settlement, settlement, game.ACTION_DIPLOMACY, game.DIPLOMACY_PROPOSE_JOIN, {})) {
								core.ui().error('There was an error proposing this settlement to join your city, check the data you entered and try again.');
								return false;
							}
							core.do_achievement('rulethemall');
						}
					},
					'Are you sure you want to propose this this settlement to join you?'
				);
				return false;
			}).on('click', '.pact', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to propose a pact to other settlements.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!core.queue_add(my_settlement, settlement, game.ACTION_DIPLOMACY, game.DIPLOMACY_PROPOSE_PACT, {})) {
								core.ui().error('There was an error proposing a pact to this settlement, check the data you entered and try again.');
								return false;
							}
							core.do_achievement('friendly');
						}
					},
					'Are you sure you want to propose a pact to this settlement?'
				);
				return false;
			}).on('click', '.ceasefire', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to propose a cease fire to other settlements.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!core.queue_add(my_settlement, settlement, game.ACTION_DIPLOMACY, game.DIPLOMACY_PROPOSE_CEASE_FIRE, {})) {
								core.ui().error('There was an error proposing a cease fire to this settlement, check the data you entered and try again.');
								return false;
							}
						}
					},
					'Are you sure you want to propose a cease fire to this settlement?'
				);
				return false;
			}).on('click', '.war', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to declare war to other settlements.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							my_settlement.diplomacy(settlement.id(), game.DIPLOMACY_WAR);
						}
					},
					'Are you sure you want to declare war to this settlement?<br /><br />You will lose all influence over ' + settlement.name() + ' and the settlement might retaliate back!'
				);
				return false;
			}).on('click', '.caravan', function () {
				if (!my_settlement.can_trade()) {
					core.ui().error('You will need to construct a Trading Post before being able to trade resources with other settlements.');
					return false;
				}
				core.ui().open_panel('new_caravan', settlement);
				return false;
			}).on('click', '.spy', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to send spies to other settlements.');
					return false;
				}
				core.ui().open_panel('new_spy', settlement);
				return false;
			}).on('click', '.attack', function () {
				if (!my_settlement.can_recruit_soldiers()) {
					core.ui().error('You will need to construct a Military Camp before being able to attack other settlements.');
					return false;
				}
				core.ui().open_panel('new_army', settlement);
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let my_settlement = core.get_settlement();
			let settlement = this.params_data.data;
			let trades = settlement.get_trades();
			let _status = my_settlement.get_diplomacy_status(settlement.id());
			let sett_type_text = '';
			let location = my_settlement.location();
			if (settlement.is_city()) {
				sett_type_text = 'City';
			} else if (settlement.is_metropolis()) {
				sett_type_text = 'Metropolis';
			} else if (settlement.is_village()) {
				sett_type_text = 'Village';
			} else if (settlement.is_camp()) {
				sett_type_text = 'Raider Camp';
			} else if (settlement.is_ruins()) {
				sett_type_text = 'Ruins';
			}
			$(this.handle + ' #tab-info').empty().append('' +
				'<img class="avatar right" src="' + game.ASSETS_URL + 'images/assets/avatars/avatar' + settlement.ruler().avatar + '.png" />' +
				'<dl>' +
					'<dt>' + settlement.ruler().title + '</dt><dd>' + settlement.ruler().name + '</dd>' +
					'<dt>Settlement Type</dt>' +
					'<dd>' + sett_type_text + '</dd>' +
					'<dt>Climate</dt>' +
					'<dd>' + settlement.climate().name + '</dd>' +
					(my_settlement.can_diplomacy() ?
					'<dt>Personality</dt>' +
					'<dd>' + settlement.personality().name + '</dd>'
					: '') +
					'<dt>Nationality</dt>' +
					'<dd>' + settlement.nationality().name + '</dd>' +
					(my_settlement.can_diplomacy() && (settlement.is_urban()) ? 
					'<dt>Level</dt>' +
					'<dd>' + settlement.level() + '</dd>' +
					'<dt>Prestige</dt>' +
					'<dd>' + core.ui().progress((settlement.prestige() * 100) / game.MAX_PRESTIGE_VALUE, 'small', settlement.prestige()) + '</dd>'
					: '') + 
					'<dt>Population</dt>' +
					'<dd>' + game.nice_numbers(settlement.population()) + '</dd>' +
					(my_settlement.can_diplomacy() ?
					'<dt>Coins</dt>' +
					'<dd>' + game.nice_numbers(settlement.coins()) + '</dd>' +
					'<dt>Religion</dt>' +
					'<dd>' + settlement.religion().name + '</dd>' +
					'<dt>Influence</dt>' +
					'<dd>' + core.ui().progress(my_settlement.get_influence_with_settlement(settlement.id()), 'small') + '</dd>' +
					'<dt>Diplomatic Status</dt>' +
					'<dd>' + my_settlement.get_diplomacy_status(settlement.id()).name + '</dd>'
					: '') + 
					'<dt>Distance</dt>' +
					'<dd>' + core.world().get_distance(location, settlement.location()) + ' miles (' + core.world().get_distance_in_days(location, settlement.location()) + ' days)</dd>' +
				'</dl>');
			if (my_settlement.can_diplomacy() || settlement.is_camp()) {
				$(this.handle + ' #tab-army').empty().append(core.ui().army_horizontal_list(settlement.army()));
				if (settlement.waterside() === true) {
					$(this.handle + ' #tab-navy').empty().append(core.ui().navy_horizontal_list(settlement.navy()));
				}
			}
			if (settlement.is_urban()) {
				$(this.handle + ' #tab-heroes').empty().append('<p>Below are the heroes of this settlement.</p>' + core.ui().heroes_list(settlement.heroes()));
				$(this.handle + ' #tab-imports').empty().append('<p>Below are the goods this settlement will be buying this year.</p>' + core.ui().trades_list(trades, 'imports'));
				$(this.handle + ' #tab-exports').empty().append('<p>Below are the goods this settlement will be selling this year.</p>' + core.ui().trades_list(trades, 'exports'));
			}
			let out = '';
			let _out = '<p>This settlement has the the following resources:</p>';
			for (let item in settlement.get_resources()) {
				if (!game.is_virtual_resource(item)) {
					if (settlement.resources[item] > 0) {
						out += core.ui().resource_storage_small_el(item, settlement.resources[item]);
					}
				}
			}
			if (out !== '') {
				_out += out;
			} else {
				_out = '<p>This settlement has no resources.</p>';
			}
			$(this.handle + ' #tab-resources').empty().append(_out);
			if (_status.id === game.DIPLOMACY_VASSAL) {
				$(this.handle + ' footer .attack').css('display','none');
			} else {
				$(this.handle + ' footer .attack').css('display', 'inline-block');
			}
			if (my_settlement.can_diplomacy()) {
				if (settlement.is_camp()) {
					$(this.handle + ' footer .caravan, ' + this.handle + ' footer .spy').hide();
				} else {
					$(this.handle + ' footer .caravan, ' + this.handle + ' footer .spy').css('display', 'inline-block');
				}
				if (_status.id === game.DIPLOMACY_PACT && (settlement.is_urban())) {
					$(this.handle + ' footer .alliance').css('display', 'inline-block');
				} else if (!settlement.is_camp()) {
					$(this.handle + ' footer .alliance').css('display','none');
				}
				if ((_status.id === game.DIPLOMACY_TRUCE || _status.id === game.DIPLOMACY_CEASE_FIRE) && !settlement.is_camp()) {
					$(this.handle + ' footer .pact').css('display', 'inline-block');
				} else {
					$(this.handle + ' footer .pact').css('display','none');
				}
				if (_status.id === game.DIPLOMACY_WAR && !settlement.is_camp()) {
					$(this.handle + ' footer .ceasefire').css('display', 'inline-block');
				} else {
					$(this.handle + ' footer .ceasefire').css('display','none');
				}
				if ((_status.id !== game.DIPLOMACY_WAR && _status.id !== game.DIPLOMACY_VASSAL) && !settlement.is_camp()) {
					$(this.handle + ' footer .war').css('display', 'inline-block');
				} else {
					$(this.handle + ' footer .war').css('display','none');
				}
				if ((_status.id === game.DIPLOMACY_PACT && settlement.is_village()) && !settlement.is_camp()) {
					$(this.handle + ' footer .join').css('display', 'inline-block');
				} else {
					$(this.handle + ' footer .join').css('display','none');
				}
			}
		};
		super(params);
	}
}
