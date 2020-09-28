## Install
Install PM2 globaly
```bash
npm i -g pm2
```
Install local packages for server
```bash
npm ci
```
Init start-up service
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Force update API and regenerate pages
```bash
npm run crawler -- --force
```
