module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    "index": ["off", 2],
    'indent': 0,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
