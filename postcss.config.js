const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssImport(),
    postcssUrl(),
    postcssPresetEnv(),
    postcssFlexbugsFixes(),
    cssnano({
      preset: 'advanced',
    }),
    autoprefixer({
      overrideBrowserslist: ['> 1%', 'last 7 versions', 'not ie <= 8', 'ios >= 8', 'android >= 4.0'],
      grid: true,
    }),
  ],
};
