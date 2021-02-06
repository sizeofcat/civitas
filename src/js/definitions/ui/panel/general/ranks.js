/**
 * Ranks panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_ranks
 * @extends ui_panel
 * @returns {ui_panel_ranks}
 */
class ui_panel_ranks extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_ranks}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'ranks';
		params.template = ui.generic_panel_template('World Ranks');
		params.on_show = function(params) {
			let core = this.core();
			let settlement = core.get_settlement();
			$(this.handle + ' section').append('<div class="ranks-list"></div>');
			$(this.handle).on('click', '.view', function () {
				let _settlement_id = parseInt($(this).data('id'), 10);
				let _settlement = core.get_settlement(_settlement_id);
				if (_settlement) {
					if (_settlement.is_player()) {
						core.ui().open_panel('council');
					} else {
						core.ui().open_panel('settlement', _settlement);
					}
				}
				return false;
			});
		};
		params.on_refresh = function() {
			let ranking_list = [];
			let settlements = this.core().get_settlements();
			for (let i = 0; i < settlements.length; i++) {
				if (settlements[i].is_urban()) {
					ranking_list.push({
						id: settlements[i].id(),
						name: settlements[i].name(),
						data: settlements[i].get_rank()
					});
				}
			}
			ranking_list.sort(function(a, b) {
				let keyA = new Date(a.data.score);
				let keyB = new Date(b.data.score);
				if (keyA > keyB) {
					return -1;
				}
				if (keyA < keyB) {
					return 1;
				}
				return 0;
			});
			let _t = '<table class="normal">';
			_t += '<thead>' +
					'<tr>' +
						'<td class="center">Rank</td>' +
						'<td>Settlement</td>' +
						'<td class="center">Score</td>' +
					'</tr>' +
				'</thead>' +
				'<tbody>';
			for (let i = 0; i < ranking_list.length; i++) {
				_t += '<tr>' +
					'<td class="center">' + (i + 1) + '</td>' +
					'<td>' +
						'<a data-id="' + ranking_list[i].id +
						'" title="View info about this settlement." class="tips view" href="#">' +
						ranking_list[i].name + '</a> ' +
					'</td>' +
					'<td class="center">' + ranking_list[i].data.score + '</td>' +
				'</tr>';
			}
			_t += '</tbody>' +
				'<tfoot>' +
					'<tr>' +
						'<td class="center">Rank</td>' +
						'<td>Settlement</td>' +
						'<td class="center">Score</td>' +
					'</tr>' +
				'</tfoot>' +
				'</table>';
			$(this.handle + ' .ranks-list').empty().append(_t);
		};
		super(params);
	}
}
