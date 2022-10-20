export default ({ onGetWebpackConfig }: any) => {
  onGetWebpackConfig((config: any) => {
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
  });
};
