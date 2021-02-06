/**
 * Main modal object.
 * 
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_modal
 * @returns {ui_modal}
 */
class ui_modal {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_modal}
	 * @param {Object} params
	 */
	constructor (params) {
		this._core = params.core;
		this.template = '<div class="modal-overlay">' +
				'<div class="modal">' +
					'<header></header>' +
					'<section></section>' +
					'<footer></footer>' +
				'</div>' +
			'</div>';
		let self = this;
		$('body').append(this.template);
		$(window).bind('resize', function() {
			self._resize();
		});
		return this;
	}

	/**
	 * Main method to show the modal window.
	 *
	 * @public
	 * @param {Object} options
	 * @returns {ui_modal}
	 */
	alert (options) {
		let self = this;
		let settlement = false;
		if (this.core().settlements.length > 0) {
			settlement = this.core().get_settlement();
		}
		if (this._is_open()) {
			return false;
		}
		this.core().ui().show_loader();
		$('.modal').css({
			width: '400px'
		});
		this._resize();
		$('.modal header').html(options.title);
		$('.modal footer').html('<a data-id="yes" href="#" class="btn ' +
			'float-right">Yes</a><a data-id="no" href="#" class="btn">No</a>');
		$('.modal section').html((settlement ? '<img class="avatar ' +
			'right small" src="' + game.ASSETS_URL +
			'images/assets/avatars/avatar' +
			this.core().get_settlement().ruler().avatar + '.png" />' : '') +
			'<p>' + options.text + '</p>');
		$('.modal footer').on('click', 'a', function() {
			self._action($(this).data('id'));
			return false;
		});
		$('.modal-overlay, .modal').show();
		if (typeof options.on_click === 'function') {
			this.on_click = options.on_click;
		}
		return this;
	}

	/**
	 * Internal method to check out if the modal window is already open.
	 *
	 * @private
	 * @returns {Boolean}
	 */
	_is_open () {
		return $('.modal').css('display') === "block";
	}

	/**
	 * Internal method for resetting the modal window.
	 *
	 * @private
	 * @returns {Boolean}
	 */
	_clear () {
		$('.modal-overlay').remove();
		// $('body').append(this._template);
		this.core().ui().hide_loader();
		// this._resize();
		return true;
	}

	/**
	 * Internal method for triggering the click event on the buttons.
	 *
	 * @private
	 * @param {String} key
	 */
	_action (key) {
		this._clear();
		this.on_click(key);
		$(window).unbind('resize');
	}

	/**
	 * Internal method for resizing the modal window.
	 *
	 * @private
	 * @returns {ui_modal}
	 */
	_resize () {
		let lbox = $('.modal');
		if (lbox) {
			//let height = parseInt((lbox.css('height')).replace('px', ''), 10);
			let width = parseInt((lbox.css('width')).replace('px', ''), 10);
			lbox.css({
				top: ($(window).height() / 2) - 100 + 'px',
				left: ($(window).width() - width) / 2 + 'px'
			});
		}
		return this;
	}

	/**
	 * Callback function.
	 *
	 * @public
	 */
	on_click () {
		// nothing here, move along.
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
	 * Object destructor.
	 * 
	 * @private
	 * @returns {Boolean}
	 */
	destructor () {
		$('.modal-overlay').remove();
		$(window).unbind('resize');
		return false;
	}
}
