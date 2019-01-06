module.exports = {
  apps: [
    {
      name: 'ural-dash',
      script: 'yarn.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        BASE_URL: 'https://api.ural.henek.ru',
      },
    },
  ],
};
