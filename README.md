## Getting started

> **Important!** requires Node >= 18

## Install

```batch
# install dependencies
$ yarn install --prod --peer

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```

## Barrelsby

This project uses [barrelsby](https://www.npmjs.com/package/barrelsby) to generate index files to import the controllers.

Edit `.barreslby.json` to customize it:

```json
{
  "directory": ["./src/controllers/rest", "./src/controllers/pages"],
  "exclude": ["__mock__", "__mocks__", ".spec.ts"],
  "delete": true
}
```
