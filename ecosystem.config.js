module.exports = {
  apps: [
    {
      name: '4G UA Cron',
      script: 'npm',
      args: 'run cron',
      watch: ['cron'],
    },
    {
      name: '4G UA API',
      script: 'npm',
      args: 'run server',
      watch: ['server'],
    },
  ],
}
