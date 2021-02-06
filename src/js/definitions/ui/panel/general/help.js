/**
 * Help panel data.
 *
 * @param {Object} params
 * @license GPL-3.0-or-later
 * @class ui_panel_help
 * @extends ui_panel
 * @returns {ui_panel_help}
 */
class ui_panel_help extends ui_panel {

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @constructor
	 * @returns {ui_panel_help}
	 * @param {Object} params
	 */
	constructor (params) {
		params.id = 'help';
		params.template = ui.generic_panel_template('Help');
		params.on_show = function(params) {
			let core = this.core();
			$(this.handle + ' section').append(core.ui().tabs([
				'About',
				'Buildings',
				'Settlements',
				'Religion',
				'Research'
			]));
			$(this.handle + ' #tab-buildings').empty().append(
				'<fieldset>' +
					'<legend>Table of Contents</legend>' +
					'<ul>' +
						'<li><a href="#">Intro</a></li>' +
						'<li><a href="#">Build</a></li>' +
						'<li><a href="#">Upgrade</a></li>' +
						'<li><a href="#">Demolish</a></li>' +
						'<li><a href="#">Production</a></li>' +
						'<li><a href="#">Housing</a></li>' +
						'<li><a href="#">Municipal</a></li>' +
						'<li><a href="#">Storage</a></li>' +
						'<li><a href="#">Coins</a></li>' +
					'</ul>' +
				'</fieldset>' +
				'<h3>Intro</h3>' +
				'<p>In Civitas, buildings are the backbone of your city, providing you with goods for export.</p>' +
				'<h3>Build</h3>' +
				'<p>Each building has some special requirements to build, whether a required city level or another existing building.</p>' +
				'<h3>Upgrade</h3>' +
				'<p>Upgrading one of your buildings has several benefits, besides the obvious estetic one.</p>' +
				'<img title="Level 1 house" class="help tips" src="' + game.ASSETS_URL + 'images/assets/buildings/house1.png" /> ' +
				'<img title="Level 3 house" class="help tips" src="' + game.ASSETS_URL + 'images/assets/buildings/house3.png" /> ' +
				'<img title="Maximum level house" class="help tips" src="' + game.ASSETS_URL + 'images/assets/buildings/house5.png" />' +
				'<p>Upgrading a building costs the initial building price multiplied by the level. So, if a building initially costs 100 ' + core.ui().resource_small_img('coins') + ' and 20 ' + core.ui().resource_small_img('wood') + ' to construct, upgrading it to level 2 will cost 200 ' + core.ui().resource_small_img('coins') + ' and 40 ' + core.ui().resource_small_img('wood') + ', so on.</p>' +
				'<p>When a building is upgraded, it produces the inital amount of goods multiplied by the level of the building. Keep in mind that the materials it uses for production are the same as for a building of level 1, so upgrading a building is an easy way of getting double (or triple) the production goods for the same materials as the previous level used.</p>' +
				'<h3>Demolish</h3>' +
				'<p>Demolishing a building has no actual benefits except it no longer used the production materials (a better way to adjust that will be to stop the production of the specific building, this way you can restart it when you want). Demolishing a building refunds 100% of the inial cost of the build, except eventual upgrades.</p>' +
				'<h3>Production</h3>' +
				'<p></p>' +
				'<h3>Housing</h3>' +
				'<p></p>' +
				'<h3>Municipal</h3>' +
				'<p></p>' +
				'<h3>Storage</h3>' +
				'<p>The goods you`re producing need a storage place inside your city, the initial Marketplace provides some storage space (100k <img class="small" src="' + game.ASSETS_URL + 'images/assets/resources/storage.png" /> ), and it can be increased even further with upgrading, but you will need to build Warehouses to store all the goods. If you have no free storage space, the produced goods will be lost.</p>' +
				'<h3>Coins</h3>' +
				'<p>Your city can only gain coins through trades and taxes.</p>');
			$(this.handle + ' #tab-religion').empty().append('<h2>Religion</h2>');
			$(this.handle + ' #tab-settlements').empty().append('<fieldset>' +
					'<legend>Table of Contents</legend>' +
					'<ul>' +
						'<li><a href="#">Intro</a></li>' +
						'<li><a href="#">Cities and villages</a></li>' +
						'<li><a href="#">Diplomacy</a></li>' +
						'<li><a href="#">Fame and levels</a></li>' +
						'<li><a href="#">Influence</a></li>' +
						'<li><a href="#">Espionage</a></li>' +
						'<li><a href="#">Prestige</a></li>' +
						'<li><a href="#">Pacts and alliances</a></li>' +
						'<li><a href="#">Wars</a></li>' +
						'<li><a href="#">Caravans</a></li>' +
					'</ul>' +
				'</fieldset>' +
				'<h3>Intro</h3>' +
				'<p></p>' +
				'<h3>Cities and villages</h3>' +
				'<p></p>' +
				'<h3>Diplomacy</h3>' +
				'<p></p>' +
				'<h3>Fame and levels</h3>' +
				'<p>Each time you reach a specific fame level, your city gets a new level, thus you never lose your initial fame. There are several ways of getting extra fame (besides your initial Marketplace), there are several municipal buildings that add a small amount of fame to your city each day (this amount can be increased by upgrading the buildings).</p>' +
				'<p>There is no fixed way in which you can lose fame, except the random events that occur from time to time, or if another city manages to incite your population to revolt.</p>' +
				'<h3>Influence</h3>' +
				'<p>All settlements in the game world have an influence rating with each of the other settlements. The influence drops over time (yearly) and needs to be kept above a certain level, else the other cities might attack your city.</p>' +
				'<p>Maximum influence a settlement can have is <strong>' + game.MAX_INFLUENCE_VALUE + '</strong>.</p>' +
				'<h3>Espionage</h3>' +
				'<p>After building your city Embassy, you can start assigning spies to other settlements using your accumulated espionage points. Depending on the amount of espionage you use for a spy mission, that mission has a rate of success. The most points you can assign are <strong>' + game.MAX_ESPIONAGE_VALUE + '</strong> ' + core.ui().resource_small_img('espionage') + ' (maximum espionage points a city can get) and this gives you approximately a <strong>' + (game.MAX_ESPIONAGE_VALUE / game.MAX_ESPIONAGE_SUCESS_RATE) + '%</strong> success rate.</p>' +
				'<h3>Prestige</h3>' +
				'<p>Prestige is a very important feature of your city because it influences the way other settlements see you and they will act upon that information. Low prestige might be good for your city if you plan to lay low and prepare (the other settlements won`t bother to go to war with a city with low prestige unless you manage somehow to piss them off) but usually, your city prestige should raise with the city level.</p>' +
				'<p>Prestige is gained through trading with other settlements, sending caravans with resources to help them when in need, etc. Random events can also affect your city prestige. The maximum prestige a settlement can get is <strong>' + game.MAX_PRESTIGE_VALUE + '</strong> ' + core.ui().resource_small_img('prestige') + '.</p>' +
				'<h3>Pacts and alliances</h3>' +
				'<p></p>' +
				'<h3>Wars</h3>' +
				'<p></p>' +
				'<h3>Caravans</h3>' +
				'<p></p>');
			$(this.handle + ' #tab-about').empty().append('<h2>About Civitas</h2>' +
				'<p>Civitas is an empire-building game written in Javascript with the help of the <a target="_blank" href="https://jquery.com">jQuery</a> library. All the development is done over <a target="_blank" href="https://github.com/sizeofcat/civitas">GitHub</a> and everybody can contribute.</p>' +
				'<p>Civitas is written by <a target="_blank" href="https://sizeof.cat">sizeof(cat)</a>, is free and distributed under the <a target="_blank" href="https://raw.githubusercontent.com/sizeofcat/civitas/master/LICENSE">GPLv3 license</a>.</p>' +
				'<p>Big thanks to:</p>' +
				'<ul>' +
					'<li><a target="_blank" href="https://soundcloud.com/shantifax">Shantifax</a> for the music (Glandula Pinealis).</li>' +
					'<li><a target="_blank" href="http://bluebyte.com">Blue Byte</a> for Anno 1404.</li>' +
				'</ul>');
			$(this.handle + ' #tab-research').empty().append('<h2>Research</h2>');
			$(this.handle + ' #tab-diplomacy').empty().append('<h2>Diplomacy</h2>');
		};
		super(params);
	}
}
