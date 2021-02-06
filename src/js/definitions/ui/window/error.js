/**
 * Options window data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_window_error
 * @extends ui_window
 * @returns {ui_window_error}
 */
class ui_window_error extends ui_window {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_window_error}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'error';
		params.template = '<section id="window-{ID}" class="window">' +
				'<div class="logo">Civitas</div>' +
				'<fieldset>' +
					'<div class="error">' +
						'An error has occured in Civitas and the game is unable to resume.' +
						'<br /><br />' +
						'<span class="error-message"></span>' +
						'<br />' +
						'<span class="error-code"></span>' +
						'<br /><br />' +
						'<a href="#" class="do-restart button">Restart</a>' +
					'</div>' +
				'</fieldset>' +
			'</section>';
		params.on_show = function() {
			let core = this.core();
			let handle = this.handle;
			$(handle + ' .error-message').html('Message: ' + this.params_data.error);
			$(handle + ' .error-code').html('Code: ' + this.params_data.code);
			$(handle).on('click', '.do-restart', function () {
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							core.reset_storage_data();
							document.location.reload();
						}
					},
					'Are you sure you want to restart the game? You will lose ' +
					'all progress on the current game!',
					'Civitas'
				);
				return false;
			});
		};
		params.on_hide = function() {
			this.core().ui().hide_loader();
		};
		super(params);
	}
}
