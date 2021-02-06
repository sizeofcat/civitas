/**
 * Login window data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_window_signin
 * @extends ui_window
 * @returns {ui_window_signin}
 */
class ui_window_signin extends ui_window {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_window_signin}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'signin';
		params.template = '<section id="window-{ID}" class="window">' +
				'<div class="logo">Civitas</div>' +
				'<fieldset>' +
					'<div class="new-game">' +
						'<p>Enter the city password to decrypt the game data.</p>' +
						'<dl>' +
							'<dt class="clearfix">Password:</dt>' +
							'<dd>' +
								'<input type="password" class="password text-input" />' +
							'</dd>' +
						'</dl>' +
						'<a href="#" class="do-start highlight button">Load Game</a>' +
					'</div>' +
					'<a href="#" class="do-restart button">Restart</a>' +
					ui.window_about_section() +
				'</fieldset>' +
			'</section>';
		params.on_show = function() {
			let self = this;
			let handle = this.handle;
			let core = this.core();
			$(handle).on('click', '.do-start', function () {
				let password = $(handle + ' .password').val();
				if (password === '') {
					core.ui().error('Enter your city password.', 'Error', true);
					return false;
				}
				if (!core.load_game_data(password)) {
					$(handle + ' .password').val('');
					core.ui().error('Error decrypting the game data with the ' +
						'specified password. Try again.', 'Error', true);
				} else {
					self.destroy();
				}
				return false;
			}).on('click', '.do-restart', function () {
				core.ui().open_modal(
					function(button) {
						if (button === 'yes') {
							core.reset_storage_data();
							document.location.reload();
						}
					},
					'Are you sure you want to restart the game? You will lose all ' +
					'progress on the current game!',
					'Civitas'
				);
				return false;
			}).on('click', '.do-about', function () {
				$(handle + ' .about-game').slideToggle();
				return false;
			});
		};
		params.on_hide = function() {
			this.core().ui().hide_loader();
		};
		super(params);
	}
}
