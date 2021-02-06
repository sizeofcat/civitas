/**
 * Place panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_place
 * @extends ui_panel
 * @returns {ui_panel_place}
 */
class ui_panel_place extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_place}
	 * @param {Object} params
	 */
	constructor (params) {
		params.template = '<div id="panel-{ID}" class="panel">' +
				'<header>Ruins' +
					'<a class="tips close" title="Close"></a>' +
				'</header>' +
				'<section></section>' +
				'<footer>' +
					'<a class="tips green-link scout" title="Send a scout to this place." href="#"><span></span></a>' +
					'<a class="tips green-link claim" title="Claim this place for your settlement." href="#"><span></span></a>' +
					'<a class="tips red-link unclaim" title="Remove your settlement`s claim of this place." href="#"><span></span></a>' +
					'<a class="tips blue-link caravan" title="Send a caravan to this place." href="#"><span></span></a>' +
				'</footer>' +
			'</div>',
		params.params_data = null;
		params.id = 'place';
		params.on_show = function(params) {
			let self = this;
			let core = this.core();
			let my_settlement = core.get_settlement();
			let location = my_settlement.location();
			let place = params.data;
			this.params_data = params;
			let tabs = ['Info'];
			if (place.is_scouted()) {
				tabs.push('Resources', 'Construction');
			}
			$(this.handle + ' section').append(core.ui().tabs(tabs));
			let claimed_by = place.is_claimed();
			let claimed_by_settlement = core.get_settlement(claimed_by);
			$(this.handle + ' #tab-info').empty().append(
				'<img class="avatar right" src="' + game.ASSETS_URL + 'images/assets/avatars/avatar999.png" />' +
				'<dl>' +
					(place.is_scouted() || (claimed_by !== false && claimed_by_settlement.id() === my_settlement.id()) ?
					'<dt>Name</dt>' +
					'<dd>' + place.name() + '</dd>' +
					'<dt>Claimed by</dt>' +
					'<dd>' + (claimed_by !== false ? '<span data-id="' + claimed_by_settlement.id() + '" title="View info about this settlement" class="tips view">' + claimed_by_settlement.name() + '</span>' : 'nobody') + '</dd>'
					: '') +
					'<dt>Scouted</dt>' +
					'<dd>' + (place.is_scouted() ? 'yes': 'no') + '</dd>' +
					'<dt>Time to build</dt>' +
					'<dd>' + game.RUINS_TIME_TO_BUILD + ' days</dd>' +
					'<dt>Distance</dt>' +
					'<dd>' + core.world().get_distance(location, place.location()) + ' miles (' + core.world().get_distance_in_days(location, place.location()) + ' days)</dd>' +
				'</dl>'
			);
			if (place.is_scouted()) {
				$(this.handle + ' #tab-resources').empty().append(
					'<p>Stage 2: Gather the resources below and use caravans to send them to this place.</p>' +
					'<p><strong>Note!</strong> If the place is not claimed by anybody, do not send resources or they will be lost.</p>' +
					'<div class="required">' +
						'<p>This place has no required resources.</p>' +
					'</div>'
				);
				$(this.handle + ' #tab-construction').empty().append(
					'<p>Stage 3: Once the required resources have been stored you can start building the world wonder on this place. It will take a dozen of years to build it (around 20) and other settlements might attack so make sure you have an army to guard it.</p>' +
					'<div class="toolbar"></div>'
				);
				if (claimed_by !== false && claimed_by === my_settlement.id()) {
					$(this.handle + ' footer .unclaim').css('display', 'inline-block');
					$(this.handle + ' footer .caravan').css('display', 'inline-block');
				} else if (claimed_by === false) {
					$(this.handle + ' footer .claim').css('display', 'inline-block');
				}
			} else {
				$(this.handle + ' footer .scout').css('display', 'inline-block');
			}
			$(this.handle).on('click', '.claim', function () {
				if (!my_settlement.can_diplomacy() || !my_settlement.can_research()) {
					core.ui().error('You will need to construct an Embassy and Academy before being able to claim world places.');
					return false;
				}
				if (place.is_claimed() !== false) {
					core.ui().error('This place has been claimed by another settlement.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!place.claim(my_settlement)) {
								core.ui().error('There was an error claiming this world place, check the data you entered and try again.');
								return false;
							} else {
								core.ui().notify('A place in the world has been claimed by your settlement.');
								core.save_and_refresh();
								self.destroy();
							}
						}
					},
					'Are you sure you want to claim this world place?'
				);
				return false;
			}).on('click', '.unclaim', function () {
				if (!my_settlement.can_diplomacy() || !my_settlement.can_research()) {
					core.ui().error('You will need to construct an Embassy and Academy before being able to unclaim world places.');
					return false;
				}
				if (place.is_claimed() === false) {
					core.ui().error('This place is not claimed by your settlement.');
					return false;
				}
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							if (!place.unclaim(my_settlement)) {
								core.ui().error('There was an error unclaiming this world place, check the data you entered and try again.');
								return false;
							} else {
								core.ui().notify('A place in the world has been unclaimed by your settlement.');
								core.save_and_refresh();
								self.destroy();
							}
						}
					},
					'Are you sure you want to unclaim this world place?'
				);
				return false;
			}).on('click', '.caravan', function () {
				if (!my_settlement.can_trade()) {
					core.ui().error('You will need to construct a Trading Post before being able to send caravans to other places.');
					return false;
				}
				core.ui().open_panel('new_caravan', place);
				return false;
			}).on('click', '.construct', function () {
				return false;
			}).on('click', '.view', function () {
				let _settlement_id = parseInt($(this).data('id'), 10);
				let _settlement = core.get_settlement(_settlement_id);
				if (_settlement) {
					if (_settlement.id() === my_settlement.id()) {
						core.ui().open_panel('council');
					} else {
						core.ui().open_panel('settlement', _settlement);
					}
				}
				return false;
			}).on('click', '.scout', function () {
				if (!my_settlement.can_diplomacy()) {
					core.ui().error('You will need to construct an Embassy before being able to send scouts to other places.');
					return false;
				}
				core.ui().open_panel('new_scout', place);
				return false;
			});
		};
		params.on_refresh = function() {
			let core = this.core();
			let place = this.params_data.data;
			let amount = 0;
			let total = 0;
			let all_resources = 0;
			let _resources = place.get_resources();
			if (place.is_scouted()) {
				let out = '';
				let ruin_data = place.ruins();
				let resources = ruin_data.resources;
				for (let item in resources) {
					if (!game.is_virtual_resource(item)) {
						if (resources[item] > 0) {
							amount = typeof _resources[item] !== 'undefined' ? _resources[item] : 0;
							total = resources[item] - amount;
							if (total > 0) {
								out += core.ui().resource_storage_small_el(item, total);
								all_resources += total;
							}
						}
					}
				}
				if (out !== '') {
					$(this.handle + ' #tab-resources .required').empty().append(out);
				}
				if (all_resources <= 0) {
					$(this.handle + ' #tab-construction .toolbar').empty().append('<a class="btn blue construct">Start Construction</a>');
				}
			}
		};
		super(params);
	}
}
