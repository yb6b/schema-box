const antfu = require('@antfu/eslint-config').default({}, {
  rules: {
    'n/prefer-global/process': ['always'],
  },
})

module.exports = antfu
