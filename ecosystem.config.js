module.exports = {
  apps: [
    {
      name: 'ural-dash',
      script: 'npm',
      args: 'start',
      env: {
        'NODE_ENV': 'production',
        'BASE_URL': 'https://api.ural.henek.ru',
      },
    },
  ],
};
