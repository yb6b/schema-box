const antfu = require('@antfu/eslint-config').default

module.exports = antfu({}, {
  rules: {
    'node/prefer-global/process': ['off'],
    'no-console': ['warn'],
  },
})
