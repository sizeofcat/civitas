/**
 * Debug panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_debug
 * @extends ui_panel
 * @returns {ui_panel_debug}
 */
class ui_panel_debug extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_debug}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'debug';
		params.template = ui.generic_panel_template('Debugging');
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			let handle = this.handle;
			$(this.handle + ' section').append(core.ui().tabs([
				'Data',
				'Console',
				'Cheats'
			]));
			$(this.handle + ' #tab-console').empty().append('<div class="console"></div>');
			$(this.handle + ' #tab-cheats').empty().append('<div class="toolbar">' +
						'<a href="#" class="btn gray one">+1M coins</a>' +
						'<a href="#" class="btn two">+1000 cons. mats</a>' +
						'<a href="#" class="btn thirty">+1000 food / wine</a>' +
						'<a href="#" class="btn fifteen">+1000 prov./spyg.</a><br /><br />' +
						'<a href="#" class="btn green five">level up</a>' +
						'<a href="#" class="btn fourteen">+900 faith/research/espionage</a>' +
						'<a href="#" class="btn six">+1000 fame</a><br /><br />' +
						'<a href="#" class="btn eleven">random soldiers</a>' +
						'<a href="#" class="btn twelve">random ships</a>' +
						'<a href="#" class="btn fourty">defend city</a>' +
						'<a href="#" class="btn blue fifty">battle-ready</a><br /><br />' +
						'<a href="#" class="btn ninety">add city</a>' +
						'<a href="#" class="btn seven">refresh trades</a>' +
					'</div>');
			$(this.handle + ' #tab-data').empty().append(
				'<textarea class="storage-data"></textarea>' +
				'<div class="toolbar">' +
					'<a href="#" class="btn iblock refresh">Refresh</a> ' +
					'<a href="#" class="btn iblock load">Load</a> ' +
					'<a href="#" class="btn iblock save">Save</a> ' +
				'</div>');
			$(this.handle).on('click', '.fourty', function() {
				let city_index = game.get_random(1, core.get_num_settlements() - 1);
				let _settlement = core.get_settlement(city_index);
				core.queue_add(_settlement, settlement, game.ACTION_CAMPAIGN, game.CAMPAIGN_ARMY, {
					army: {
						militia: 40,
						axeman: 30,
						knight: 10,
						bowman: 20,
						cannon: 200,
						catapult: 300,
						crossbowman: 10,
						pikeman: 30
					}
				});
				return false;
			}).on('click', '.fifty', function() {
				for (let i = 0; i < 9; i++) {
					core.level_up();
				}
				settlement.add_to_storage('wood', 1000);
				settlement.add_to_storage('stones', 1000);
				settlement.add_to_storage('woodplanks', 1000);
				settlement.add_to_storage('provisions', 1000);
				settlement.add_to_storage('ropes', 50);
				settlement.add_to_storage('barrels', 50);
				settlement.add_to_storage('tools', 100);
				settlement.inc_coins(2000000);
				let army = settlement.army();
				for (let soldier in army) {
					army[soldier] = game.get_random(1, 100);
				}
				settlement.build('provisions');
				settlement.build('barracks');
				settlement.build('shipyard');
				core.save_and_refresh();
				return false;
			}).on('click', '.eleven', function() {
				let army = settlement.army();
				for (let soldier in army) {
					army[soldier] = game.get_random(1, 100);
				}
				core.save_and_refresh();
				return false;
			}).on('click', '.twelve', function() {
				let navy = settlement.navy();
				for (let ship in navy) {
					navy[ship] = game.get_random(1, 10);
				}
				core.save_and_refresh();
				return false;
			}).on('click', '.fourteen', function() {
				settlement.raise_faith(900);
				settlement.raise_espionage(900);
				settlement.raise_research(900);
				settlement.raise_prestige(900);
				core.save_and_refresh();
				return false;
			}).on('click', '.one', function() {
				settlement.inc_coins(1000000);
				core.save_and_refresh();
				return false;
			}).on('click', '.fifteen', function() {
				settlement.add_to_storage('provisions', 1000);
				settlement.add_to_storage('donkeys', 1000);
				settlement.add_to_storage('ropes', 1000);
				settlement.add_to_storage('spyglasses', 1000);
				core.save_and_refresh();
				return false;
			}).on('click', '.two', function() {
				settlement.add_to_storage('wood', 1000);
				settlement.add_to_storage('stones', 1000);
				settlement.add_to_storage('woodplanks', 1000);
				settlement.add_to_storage('clay', 1000);
				settlement.add_to_storage('bricks', 1000);
				settlement.add_to_storage('tools', 500);
				core.save_and_refresh();
				return false;
			}).on('click', '.thirty', function() {
				settlement.add_to_storage('bread', 1000);
				settlement.add_to_storage('meat', 1000);
				settlement.add_to_storage('wine', 1000);
				core.save_and_refresh();
				return false;
			}).on('click', '.five', function() {
				core.level_up();
				core.save_and_refresh();
				return false;
			}).on('click', '.six', function() {
				settlement.raise_fame(1000);
				core.save_and_refresh();
				return false;
			}).on('click', '.seven', function() {
				core.refresh_trades();
				core.save_and_refresh();
				return false;
			}).on('click', '.refresh', function() {
				$(handle + ' .storage-data').val(core.get_storage_data('live', true));
				return false;
			}).on('click', '.ninety', function() {
				core.add_random_settlement();
				return false;
			}).on('click', '.load', function() {
				let save_game = $(handle + ' .storage-data').val();
				if (save_game !== '') {
					core.ui().open_modal(
						function(button) {
							if (button === 'yes') {
								core.set_storage_data('live', save_game, true);
								document.location.reload();
							}
						},
						'Are you sure you want to load a new game? You will lose all ' +
						'progress on the current game!',
						'Civitas'
					);
				} else {
					core.ui().error('Invalid save game.');
				}
				return false;
			}).on('click', '.save', function() {
				let save_game = $(handle + ' .storage-data').val();
				if (save_game === '') {
					save_game = core.get_storage_data('live', true);
				}
				let a = document.createElement("a");
				a.style.display = "none";
				document.body.appendChild(a);
				a.href = window.URL.createObjectURL(
					new Blob([save_game], {
						type: 'text/plain'
					})
				);
				a.setAttribute("download", 'civitas_savegame.json');
				a.click();
				window.URL.revokeObjectURL(a.href);
				document.body.removeChild(a);
				return false;
			});
		};
		super(params);
	}
}
