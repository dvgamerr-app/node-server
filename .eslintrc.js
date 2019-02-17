module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018
  },
  extends: [ 'plugin:vue/recommended' ],
  // required to lint *.vue files
  plugins: [ 'backpack' ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/max-attributes-per-line': [ 2, {
      'singleline': 16,
      'multiline': { 'max': 8, 'allowFirstLine': false }
    }]
  }
}
