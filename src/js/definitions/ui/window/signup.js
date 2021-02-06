/**
 * Sign Up window data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_window_signup
 * @extends ui_window
 * @returns {ui_window_signup}
 */
class ui_window_signup extends ui_window {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_window_signup}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'signup';
		params.template = '<section id="window-{ID}" class="window">' +
				'<div class="logo">Civitas</div>' +
				'<fieldset>' +
					'<div class="new-game">' +
						'<img class="avatar-select-top" src="' + game.ASSETS_URL +
						'images/assets/avatars/avatar1.png">' +
						'<p>Choose your city details well, climate and game ' +
						'difficulty affects your building options and resources.</p>' +
						'<dl>' +
							'<dt class="clearfix">Your Name:</dt>' +
							'<dd>' +
								'<input type="text" maxlength="12" ' +
								'title="Maximum of 12 characters." ' +
								'class="tips name text-input" />' +
							'</dd>' +
((game.ENCRYPTION === true) ?
							'<dt class="clearfix">Password:</dt>' +
							'<dd>' +
								'<input type="password" class="password text-input" />' +
							'</dd>' +
							'<dt class="clearfix">Confirm Password:</dt>' +
							'<dd>' +
								'<input type="password" class="password2 text-input" />' +
							'</dd>'
: '') +
							'<div class="hr"></div>' +
							'<dt class="clearfix">City Name:</dt>' +
							'<dd>' +
								'<input type="text" maxlength="12" ' +
								'title="Maximum of 12 characters." class="tips ' +
								'cityname text-input" />' +
							'</dd>' +
							'<dt class="clearfix">Nationality:</dt>' +
							'<dd>' +
								'<select class="nation text-input"></select>' +
							'</dd>' +
							'<dt class="clearfix">Climate:</dt>' +
							'<dd>' +
								'<select class="climate text-input"></select>' +
							'</dd>' +
							'<dt class="clearfix">Difficulty:</dt>' +
							'<dd>' +
								'<select class="difficulty text-input">' +
									'<option value="1">Easy</option>' +
									'<option value="2">Medium</option>' +
									'<option value="3">Hard</option>' +
									'<option value="4">Hardcore</option>' +
								'</select>' +
							'</dd>' +
							'<div class="avatar-select"></div>' +
						'</dl>' +
						'<a href="#" class="do-start highlight button">Start Playing</a>' +
						ui.window_about_section() +
					'</div>' +
				'</fieldset>' +
			'</section>';
		params.on_show = function() {
			let self = this;
			let avatar = 1;
			let password = '';
			let password2 = '';
			let core = this.core();
			let handle = this.handle;
			for (let i = 1; i < game.CLIMATES.length; i++) {
				$(handle + ' .climate').append('<option value="' +
					game['CLIMATE_' + game.CLIMATES[i].toUpperCase()] + '">' +
					game.CLIMATES[i].capitalize() + '</option>');
			}
			for (let i = 1; i < game.NATIONS.length; i++) {
				$(handle + ' .nation').append('<option value="' +
					game['NATION_' + game.NATIONS[i].toUpperCase()] + '">' +
					game.NATIONS[i].capitalize() + '</option>');
			}
			for (let i = 1; i <= game.AVATARS; i++) {
				$(handle + ' .avatar-select').append('<img class="avatar' +
					(i === avatar ? ' selected' : '') + '" data-avatar="' + i +
					'" src="' + game.ASSETS_URL +
					'images/assets/avatars/avatar' + i + '.png" />');
			}
			$(handle).on('click', '.do-start', function () {
				if (game.ENCRYPTION === true) {
					password = $(handle + ' .password').val();
					password2 = $(handle + ' .password2').val();
				}
				let name = $(handle + ' .name').val();
				let cityname = $(handle + ' .cityname').val();
				let nation = parseInt($(handle + ' .nation').val(), 10);
				let climate = parseInt($(handle + ' .climate').val(), 10);
				let difficulty = parseInt($(handle + ' .difficulty').val(), 10);
				if (name.length > 12) {
					name = name.substring(0, 12);
				}
				if (cityname.length > 12) {
					cityname = cityname.substring(0, 12);
				}
				if (name === '') {
					core.ui().error('Enter your ruler name, for example ' +
						'<strong>Ramses</strong>.', 'Error', true);
					return false;
				}
				if (cityname === '') {
					core.ui().error('Enter your city name, for example ' +
						'<strong>Alexandria</strong>.', 'Error', true);
					return false;
				}
				if (game.ENCRYPTION === true) {
					if (password === '') {
						core.ui().error('Enter a strong password for ' +
							'your city.', 'Error', true);
						return false;
					}
					if (password !== password2) {
						core.ui().error('Your passwords do not match.', 'Error', true);
						return false;
					}
				}
				core.new_game(name, cityname, nation, climate, avatar, difficulty, password);
				self.destroy();
				return false;
			}).on('click', '.avatar', function () {
				$(handle + ' img.avatar').removeClass('selected');
				$(this).addClass('selected');
				let new_avatar = parseInt($(this).data('avatar'), 10);
				if (new_avatar >= 1 && new_avatar <= game.AVATARS) {
					avatar = new_avatar;
					$('.avatar-select-top').attr('src', game.ASSETS_URL +
						'images/assets/avatars/avatar' + avatar + '.png');
				}
				return false;
			}).on('click', '.avatar-select-top', function() {
				$('.avatar-select').fadeToggle('fast');
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
