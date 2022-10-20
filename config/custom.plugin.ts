/**
 * 自定义属性
 * 插件定制工程能力
 * https://ice.work/docs/plugin/develop/build
 */
import fs from 'fs';

export default ({ onGetWebpackConfig }: any) => {
  onGetWebpackConfig((config: any) => {
    console.log('进入这');
    // ignore mini-css-extract-plugin warning
    config.plugin('MiniCssExtractPlugin').tap((args: []) => {
      // 解决mini-css-extract-plugin 警告，Conflicting order. Following module has been added:
      return [Object.assign(...args, { ignoreOrder: true })];
    });
    // single:只生成1个runtime文件
    config.optimization.runtimeChunk('single');
    ['jsx', 'tsx'].forEach((ruleKey) => {
      const rule = config.module.rule(ruleKey);
      rule.use('thread-loader').loader('thread-loader');
      rule.use('babel-loader').tap((options) => {
        // 添加一条 babel plugin，同理可添加 presets
        // options.plugins.push(require.resolve('@babel/plugin-transform-runtime'));
        // options.plugins.push(require.resolve('@babel/plugin-external-helpers'));

        // 修改 babel preset 配置，同理可修改 plugins
        options.presets = options.presets.map((preset) => {
          if (Array.isArray(preset)) {
            const [modulePath, presetOptions] = preset;
            // 判断指定配置
            if (modulePath.indexOf('preset-env') > -1) {
              return [
                modulePath,
                // 自定义新的 options
                {
                  ...presetOptions,
                  targets: ['> 1%', 'last 2 versions', 'not dead'],
                  // targets: ['chrome >= 80'],
                  // exclude: [
                  //   // 这个语法ie不支持
                  //   'es.array.iterator',
                  //   // 现在浏览器基本支持promise
                  //   'es.promise',
                  //   // 这个语法ie也不支持
                  //   'es.object.assign',
                  //   // #2012 es.promise replaces native Promise in FF and causes missing finally
                  //   'es.promise.finally',
                  // ],
                },
              ];
            }
          }
          return preset;
        });
        return options;
      });
    });

    // --analyzer 自带了，目前不用，其他差距可以加这里
    // config.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, []);
    // 输出webpack config配置，类似vue的inspect
    const inspect = config.toString();
    fs.writeFile('output.js', inspect, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('File saved successfully!');
    });
  });
};
