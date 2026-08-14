# Passport-Next/Passport

Status:
[![NPM version](https://img.shields.io/npm/v/@passport-next/passport.svg)](https://www.npmjs.com/package/@passport-next/passport)
[![Build Status](https://travis-ci.org/passport-next/passport.svg?branch=master)](https://travis-ci.org/passport-next/passport)
[![Coverage Status](https://coveralls.io/repos/github/passport-next/passport/badge.svg?branch=master)](https://coveralls.io/github/passport-next/passport?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/deaf381bf0cff6bf26a5/maintainability)](https://codeclimate.com/github/passport-next/passport/maintainability)
[![Dependencies](https://david-dm.org/passport-next/passport.png)](https://david-dm.org/passport-next/passport)
[![SAST](https://gitlab.com/passport-next/passport/badges/master/pipeline.svg)](https://gitlab.com/passport-next/passport)

## About

Passport-Next/Passport is a [Connect](https://github.com/senchalabs/connect) and [Express](http://expressjs.com/)-compatible authentication
middleware for [Node.js](http://nodejs.org/).

Passport's sole purpose is to authenticate requests, which it does through an
extensible set of plugins known as _strategies_.  Passport does not mount
routes or assume any particular database schema, which maximizes flexibility and
allows application-level decisions to be made by the developer.  The API is
simple: you provide Passport a request to authenticate, and Passport provides
hooks for controlling what occurs when authentication succeeds or fails.


## Install

```
$ npm install @passport-next/passport
```

## Migrating from 3.x

Most authentication strategies that worked with Passport 3.x should continue
to work with 4.x without modification. Passport still accepts strategy instances that
implement `authenticate(request, options)` and augments them with the standard
`success`, `fail`, `redirect`, `pass`, and `error` actions. Strategies do not
need to extend the current `Strategy` class or pass an `instanceof` check.

Applications must run a supported Node.js version and load Passport as native
ESM. The default export is the Passport singleton; constructors and strategy
base classes are named exports:

```js
import passport, { Passport } from '@passport-next/passport';

const customPassport = new Passport();
app.use(passport.initialize());
otherApp.use(customPassport.initialize());
```

Custom strategies that import Passport's strategy base class should update
their imports for ESM. Application-level serializers, deserializers, and
auth-info transforms also require the 4.x request-first signature and may use a
callback, synchronous return value, or Promise. These migration requirements
apply to application hooks around a strategy, not to the strategy's usual
`authenticate()` implementation. See [CHANGELOG.md](CHANGELOG.md) for the full
list of breaking changes.

## Docs

[Please see the wiki](https://github.com/passport-next/passport/wiki)

## Need help?

Please raise an [issue](https://github.com/passport-next/passport/issues) and/or ask a question on [Stackoverflow](https://stackoverflow.com) with the `passport.js` tag.

## Support policy

We support all [node versions](https://github.com/nodejs/Release) supported by the Node Foundation



## Contributing

Please see [CONTRIBUTING.md](https://github.com/passport-next/passport/blob/master/CONTRIBUTING.md)
