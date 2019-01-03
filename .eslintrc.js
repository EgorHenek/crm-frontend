module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  settings: {
    'import/resolver': {
      nuxt: {
        extensions: ['.js', '.vue'],
      },
    },
  },
};
