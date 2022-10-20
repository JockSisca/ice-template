import classnames from 'classnames';

interface TypeOptions {
  allowMultiple?: boolean | undefined;
  handleNotFoundStyleName?: 'throw' | 'log' | 'ignore' | undefined;
}

export const CSSModule = <C extends Function>(Component: C, defaultStyles: any, options?: TypeOptions) => {
  if (!options) {
    options = {
      // https://github.com/gajus/react-css-modules#allowmultiple
      allowMultiple: true, // 允许多个 CSS 模块名称。
      /**
       * 定义styleName无法映射到现有 CSS 模块时所需的操作。
        throw 抛出错误
        log 使用记录警告 console.warn
        ignore 默默地忽略缺少的样式名称
       */
      handleNotFoundStyleName: 'ignore',
    };
  }
  return classnames<C>(Component, defaultStyles, options);
};
