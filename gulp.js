var gulp = require('gulp');
var elixir = require('laravel-elixir');
var YAML = require('yamljs');

require('elixir-jshint');
require('elixir-rsync');
require('laravel-elixir-browser-sync-simple');

elixir.config.production = true;
elixir.config.sourcemaps = true;
elixir.config.assetsPath = 'assets_src/';
elixir.config.publicPath = 'assets/';

elixir.config.css.sass.folder = 'scss';
elixir.config.css.sass.pluginoptions.includePaths = require('node-bourbon').includePaths;

var paths = {
  src: elixir.config.assetsPath,
  dest: elixir.config.publicPath,
  bower: 'vendor/bower/'
};

var wpcli = YAML.load( 'wp-cli.yml' );

elixir( function( mix )
{
    mix.browserSync({
        // notify: true,
        open: false,
        proxy: wpcli.url,
        files: [
            'app/*.php',
            'app/themes/child/assets/**/*',
            'app/themes/child/**/*.php'
        ]
    })
    .jshint( [ paths.src + 'js/**/*.js', '!' + paths.src + 'js/vendor/*.js'] )
    .scripts( 'admin.js', paths.dest + 'js/admin.min.js' )
    .scripts( 'vendor/custom.modernizr.js', paths.dest + 'js/modernizr.min.js' )
    .scripts( 'jquery/dist/jquery.js', paths.dest + 'js/jquery.min.js', paths.bower )
    .scripts(
        [
            '../../../' + paths.bower + 'placeholders/dist/placeholders.js',
            '../../../' + paths.bower + 'autosize/dest/autosize.js',
            '../../../' + paths.bower + 'magnific-popup/dist/jquery.magnific-popup.js',
            '../../../' + paths.bower + 'responsive-nav/client/dist/responsive-nav.js',
            'jquery/easing.js',
            'jquery/preloadImages.js',
            'jquery/noconflict.js',
            'jquery/migrate.js',
            'partials/UTIL.js',
            'partials/FUNC.js',
            'partials/APP.js',
            'app.js'
        ],
        paths.dest + 'js/app.min.js'
    )
    .sass( 'app.scss' )
    .copy( paths.bower + 'fontawesome/fonts', paths.dest + 'fonts' )
    .rsync( 'theme/public/', 'app/themes/child' );
});
