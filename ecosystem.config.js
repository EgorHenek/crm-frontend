module.exports = {
  apps: [
    {
      name: 'ural-dash',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        BASE_URL: 'https://api.ural.henek.ru',
      },
    },
  ],
};
