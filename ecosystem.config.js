module.exports = {
  apps: [
    {
      name: '4G UA Cron',
      script: 'npm',
      args: 'run cron',
      watch: ['cron'],
    },
  ],
}
