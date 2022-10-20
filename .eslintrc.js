const { getESLintConfig } = require('@iceworks/spec');

module.exports = getESLintConfig('react-ts', {
  rules: {
    radix: 'off', // parseInt的第二个参数radix
    'function-paren-newline': 'off',
    'prefer-rest-params': 'off', // 不允许使用arguments
    'no-param-reassign': 'off', // 重新修改传入的params的数据
    'react/jsx-filename-extension': 0,
    // eslint文档 https://eslint.bootcss.com/docs/rules/
    // 关闭console告警
    'no-console': 'off',
    // 禁用链式 a=b=c=1
    'no-multi-assign': 'off',
    // (x) => {} 箭头函数参数只有一个时是否要有小括号。
    'arrow-parens': 'off',
    // for in 中必须有if判断 比如判断hasOwnProperty
    'guard-for-in': ['error'],
    // error; 结尾必须有分号
    semi: [2, 'always'],
    // 禁止在函数的 ( 前面有空格。存在async () => 这种问题，所以干掉这个
    'space-before-function-paren': 'off',
    // 当最后一个元素或属性与闭括号 ] 或 } 在 不同的行时，允许（但不要求）使用拖尾逗号；当在 同一行时，禁止使用拖尾逗号。
    'comma-dangle': ['error', 'only-multiline'],
    // 规定逗号后面必须添加空格
    'comma-spacing': ['error', { before: false, after: true }],
    // 缩进字节数
    // indent: [
    //   'error',
    //   2,
    //   {
    //     SwitchCase: 1, // case 子句将相对于 switch 语句缩进 2 个空格。
    //   },
    // ],
    // 字符串最大长度
    'max-len': 'off',
    // 禁止插入html元素
    'react/no-danger': ['off'],
    // 代码最大行数
    'max-lines': 'off',
    // 字面量属性不严格使用""号
    'quote-props': ['error', 'as-needed'],
    // 允许在空行使用空白符\允许在注释块中使用空白符
    'no-trailing-spaces': ['error', { skipBlankLines: true, ignoreComments: true }],
    // 允许使用常量表达式 if(true)
    'no-constant-condition': 'off',
    // 使用单引号代替双引号 | 允许字符串使用``
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'no-unused-expressions': 'off',
    // 允许单行中不使用大括号 if(true) xxx
    curly: ['error', 'multi-line'],
    // 这禁止掉 空格报错检查
    'no-irregular-whitespace': 'off',
    'import/newline-after-import': ['error'],
    // 使用驼峰命名
    camelcase: 'off',
    // es6 模块 -------------------
    // error; 箭头函数的箭头前后必须有空格
    'arrow-spacing': [2, { before: true, after: true }],
    // error; 禁止import重复模块
    'no-duplicate-imports': 2,
    // 需要使用解构
    'prefer-destructuring': 'off',
    // error; 要求使用 let 或 const 而不是 var
    'no-var': 'error',
    // 箭头函数后面如果是很长的运算或者其他，不需要用小括号包裹
    'no-confusing-arrow': 'off',
    // 非嵌套三元表达式
    'no-nested-ternary': 'off',
    'cSpell.userWords': ['off'],
    // 非空文件末尾至少存在一行空行（或缺少换行）off 不用
    'eol-last': ['off'],
    // 关于引入的顺序，这玩意有点智障，关了
    'import/order': ['off'],
    // 允许使用obj["a"]和obj.a的模式
    'dot-notation': ['off'],
    // Object.entries抛警告，已做了polyfill
    '@iceworks/best-practices/recommend-polyfill': ['off'],
    // ts 模块 --------------------- https://github.com/typescript-eslint/typescript-eslint/tree/v2.34.0/packages/eslint-plugin/docs/rules
    '@typescript-eslint/dot-notation': ['off'],
    // 空格缩进
    '@typescript-eslint/indent': ['off'],
    '@typescript-eslint/member-ordering': ['off'],
    // 支持Array<T>和T[]两种模式
    '@typescript-eslint/array-type': ['off'],
    // 函数需要使用箭头函数
    '@typescript-eslint/method-signature-style': ['off'],
    // 禁止强制使用as 断言
    '@typescript-eslint/consistent-type-assertions': ['off'],
    // 未使用的参数
    '@typescript-eslint/no-unused-vars': ['off'],
    // 返回值没必要，比如生命周期就没必要加void
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/camelcase': ['off'],
    // 不限定[off]使用type还是interface
    '@typescript-eslint/consistent-type-definitions': ['off'],
    // 不允许使用require
    '@typescript-eslint/no-require-imports': ['off'],
    // interface里面不能为空
    // '@typescript-eslint/no-empty-interface': ['off'],
    // ice
    '@iceworks/best-practices/no-js-in-ts-project': ['off'],
    // 末尾>不换号
    'react/jsx-closing-bracket-location': ['off'],
    // 索引作key
    'react/no-array-index-key': 'off',
    // 空内容自闭合标签
    'react/self-closing-comp': 'off',
    '@typescript-eslint/no-shadow': ['off'],
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-key': ['error'],
    // effect里面使用func会抛黄
    'react-hooks/exhaustive-deps': ['off'],
    // 没用到的props不抛错
    'react/no-unused-prop-types': 'off',
    // react代码的缩进问题
    'react/jsx-indent': ['off'],
  },
});
