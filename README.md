# twastral

[twastral](https://TBD) is a web client for interacting with [Nostr](https://github.com/fiatjaf/nostr), a protocol that attempts to make decentralized social media a reality. Adittionaly users can post to Twitter using their own dev credentials. twastral began as a fork of [astral](https://github.com/monlovesmango/astral), which itself began as a fork of [Branle](https://github.com/fiatjaf/branle).

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
# or if quasar is not installed globally
./node_modules/.bin/quasar dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```
### Format the files
```bash
yarn format
# or
npm run format
```

### Build the app for production
```bash
quasar build
# or if quasar is not installed globally
./node_modules/.bin/quasar build
```

## Docker

### Build the docker image
```bash
docker build -t astral .
```

### Run the container
```bash
docker run -d -p 8080:8000 --name astral astral
```

and connect to 'http://localhost:8080/'

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
