const gulp = require('gulp');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const minifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const sort = require('gulp-sort');
const cache = require('gulp-cache');
const remember = require('gulp-remember');
const plumber = require('gulp-plumber');
const pkg = require('./package.json');
const header = require('gulp-header');
const fs = require('fs');
const replace = require('gulp-replace');

const BROWSERS_LIST = [
	'last 2 versions',
	'> 0.5%',
	'ie >= 11'
];

const errorHandler = (r) => {
	notify.onError('\n\n----- ERROR: <%= error.message %> -----\n')(r);
};

const browsersync = (done) => {
	browserSync.init({
		open: true,
		port:8080,
		server: "./dist",
		injectChanges: true,
		watchEvents: [
			'change',
			'add',
			'unlink',
			'addDir',
			'unlinkDir'
		]
	});
	done();
};

const reload = (done) => {
	browserSync.reload();
	done();
};

gulp.task('css', () => {
	return gulp
		.src('./src/scss/default.scss', {
			allowEmpty: true
		})
		.pipe(plumber(errorHandler))
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				errLogToConsole: true,
				outputStyle: 'expanded',
				precision: 10
			})
		)
		.on('error', sass.logError)
		.pipe(sourcemaps.write({
			includeContent: false
		}))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/'))
		.pipe(filter('**/*.css'))
		.pipe(browserSync.stream())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss({
			maxLineLen: 10
		}))
		.pipe(header(fs.readFileSync('docs/header', 'utf8'), {
			pkg
		}))
		.pipe(replace('__VERSION_NUMBER__', pkg.version + '.' + ((new Date()).getMonth() + 1) + '' + (new Date()).getDate() + '' + (new Date()).getFullYear()))
		.pipe(gulp.dest('./dist/'))
		.pipe(filter('**/*.css'))
		.pipe(browserSync.stream())
		.pipe(notify({
			message: '\n\n----- CSS compiled -----\n',
			onLast: true
		}));
});

gulp.task('lib', () => {
	return gulp
		.src([
			'vendor/js/jquery.js',
			'vendor/js/jquery.ui.js',
			'vendor/js/jquery.scrollto.js',
			'vendor/js/jquery.tipsy.js',
			'vendor/js/crypto.js',
			'vendor/js/pmprng.js',
			'vendor/js/simplexnoise.js',
		], {
			since: gulp.lastRun('lib')
		})
		.pipe(plumber(errorHandler))
		.pipe(remember('./vendor/js/**/*.js'))
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('./dist/'))
		.pipe(
			rename({
				basename: 'lib',
				suffix: '.min'
			})
		)
		.pipe(terser())
		.pipe(gulp.dest('./dist/'))
		.pipe(notify({
			message: '\n\n----- External libraries compiled -----\n',
			onLast: true
		}));
});

gulp.task('app', () => {
	return gulp
		.src([
		'src/js/others/functions.js',
		'src/js/objects/core/game.js',
		'src/js/bootstrap.js',
		'src/js/constants/default.js',
		'src/js/constants/api.js',
		'src/js/constants/timeline.js',
		'src/js/constants/religion.js',
		'src/js/constants/diplomacy.js',
		'src/js/constants/nation.js',
		'src/js/constants/climate.js',
		'src/js/constants/personality.js',
		'src/js/constants/military.js',
		'src/js/constants/research.js',
		'src/js/constants/buildings.js',
		'src/js/constants/world.js',
		'src/js/constants/trades.js',
		'src/js/constants/settlements.js',
		'src/js/constants/events.js',
		'src/js/constants/resources.js',
		'src/js/constants/achievements.js',
		'src/js/constants/items.js',
		'src/js/constants/hero.js',
		'src/js/constants/initial.js',
		'src/js/objects/modules/ai.js',
		'src/js/objects/modules/chat.js',
		'src/js/objects/modules/api.js',
		'src/js/objects/modules/jailer.js',
		'src/js/objects/core/world.js',
		'src/js/objects/core/settlement.js',
		'src/js/objects/core/event.js',
		'src/js/objects/core/building.js',
		'src/js/objects/core/battleground.js',
		'src/js/objects/core/hero.js',
		'src/js/objects/core/quest.js',
		'src/js/objects/ui/controls/window.js',
		'src/js/objects/ui/controls/modal.js',
		'src/js/objects/ui/controls/panel.js',
		'src/js/objects/ui/ui.js',
		'src/js/definitions/ui/panel/place.js',
		'src/js/definitions/ui/panel/settlement.js',
		'src/js/definitions/ui/panel/help.js',
		'src/js/definitions/ui/panel/debug.js',
		'src/js/definitions/ui/panel/building.js',
		'src/js/definitions/ui/panel/campaign.js',
		'src/js/definitions/ui/panel/storage.js',
		'src/js/definitions/ui/panel/world.js',
		'src/js/definitions/ui/panel/ranks.js',
		'src/js/definitions/ui/panel/new_army.js',
		'src/js/definitions/ui/panel/new_spy.js',
		'src/js/definitions/ui/panel/new_scout.js',
		'src/js/definitions/ui/panel/new_caravan.js',
		'src/js/definitions/ui/panel/council.js',
		'src/js/definitions/ui/panel/army.js',
		'src/js/definitions/ui/panel/buildings.js',
		'src/js/definitions/ui/panel/trades.js',
		'src/js/definitions/ui/panel/building/barracks.js',
		'src/js/definitions/ui/panel/building/shipyard.js',
		'src/js/definitions/ui/panel/building/church.js',
		'src/js/definitions/ui/panel/building/embassy.js',
		'src/js/definitions/ui/panel/building/tavern.js',
		'src/js/definitions/ui/panel/building/academy.js',
		'src/js/definitions/ui/window/signin.js',
		'src/js/definitions/ui/window/battle.js',
		'src/js/definitions/ui/window/signup.js',
		'src/js/definitions/ui/window/error.js',
		'src/js/definitions/ui/window/options.js'
	], {
			since: gulp.lastRun('app')
		})
		.pipe(plumber(errorHandler))
		.pipe(remember('./src/js/**/*.js'))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./dist/'))
		.pipe(
			rename({
				basename: 'app',
				suffix: '.min'
			})
		)
		.pipe(terser())
		.pipe(header(fs.readFileSync('docs/header', 'utf8'), {
			pkg
		}))
		.pipe(replace('__VERSION_NUMBER__', pkg.version + '.' + ((new Date()).getMonth() + 1) + '' + (new Date()).getDate() + '' + (new Date()).getFullYear()))
		.pipe(gulp.dest('./dist/'))
		.pipe(notify({
			message: '\n\n----- Application libraries compiled -----\n',
			onLast: true
		}));
});

gulp.task('default',
	gulp.parallel('css', 'lib', 'app', browsersync, () => {
		gulp.watch('./src/scss/**/*.scss', gulp.parallel('css'));
		gulp.watch('./vendor/js/**/*.js', gulp.series('lib', reload));
		gulp.watch('./src/js/**/*.js', gulp.series('app', reload));
	})
);
