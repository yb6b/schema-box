const antfu = require('@antfu/eslint-config').default

module.exports = antfu({}, {
  rules: {
    'n/prefer-global/process': ['off'],
  },
})
