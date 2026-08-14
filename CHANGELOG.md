This changelog follows Semantic Versioning https://semver.org/

# UNRELEASED

## 4.0.0 (2026-08-14)

### Major

- chore: Require Node.js `^22.22.2 || >=24.15.0`.
- refactor: Publish native ESM only and define the package through `exports`.
  CommonJS `require()` is no longer supported. The default ESM export remains
  the Passport singleton; `Passport`, `Authenticator`, `Strategy`,
  `EnhancedStrategy`, and `strategies` are available as named exports.
- feat: Publish generated TypeScript declarations through the package export;
  fixes #5.
- refactor: Registered serializers and deserializers are now invoked as
  `(request, value, done)`, and auth-info transforms as
  `(request, info, done)`. The previous function-arity dispatch for
  `(value, done)` callbacks and one-argument synchronous transforms has been
  removed. Promise and synchronous-return handlers must also use the
  request-first signature.
- refactor: `serializeUser`, `deserializeUser`, and `transformAuthInfo` now
  return Promises when executing their registered handler chains.
  Callback-style handlers remain supported, but must call `done(...)` without
  returning it because non-`undefined` return values and Promises are treated
  as handler results.
- refactor: `req.logIn` and `req.login` no longer throw merely because a
  callback was omitted; they always return a Promise and reject it on failure
  when no callback handles the error.

### Minor

- feat: Registered serializers, deserializers, and auth-info transforms may
  return a synchronous result or a Promise instead of calling `done`.
- feat: Thrown or rejected `Error('pass')` values advance to the next
  serializer, deserializer, or auth-info transform, matching `done('pass')`.
- feat: `req.logIn`/`login`, `SessionManager#logIn`, session restoration, and
  authentication middleware success handling support async/await while
  retaining their callback forms.

### Patch

- security: Reject prototype-related `userProperty` keys and Passport-owned
  request fields or methods, including `__proto__`, `_passport`, and `logIn`.
  Invalid values passed to `initialize({ userProperty })` now throw a
  `TypeError`, preventing request prototype manipulation or overwriting of
  Passport request state and behavior.
- feat: Prefer `res.redirect` when supplied by the framework, and otherwise
  redirect with the native Node response API. Native redirects set status 302,
  `Location`, and a zero content length; session-backed redirects still wait
  for `session.save()`; fixes #24.
- fix: Avoid an error when authentication fails without a recorded failure and
  an application callback handles the result.
- fix: Guard access to the request's Passport `instance` when middleware has
  not initialized it.
- docs: Add async/await serialization examples and update session examples to
  use `express-session` without `cookieParser`.
- test: Add synchronous and Promise handler coverage, callback-free login and
  session restoration coverage, and Connect/Express redirect coverage.
- chore: Add declaration builds and `attw` package validation, migrate coverage
  from `nyc` to `c8`, adopt ESLint flat config, and move the lockfile/workspace
  to pnpm.
- chore: Add JSDoc build/open scripts and a `test-one` script for focused tests.
- chore: Update development dependencies and remove obsolete ESLint peer
  dependencies.

## 3.1.0 (2019-12-11)

### Minor

* Feature: Pass instantiated strategy to authenticate. @rwky @jaredhanson @ayZagen
* Updated npm deps @rwky

## 3.0.1 (2019-09-10)

### Patch

* Updated npm deps @rwky

## 3.0.0 (2019-07-13)

### Major

* Major lint changes, there are no functional changes but due to the massive
  amount of code changes this is being marked as a major bump for caution sake
  this will hopefully be the last of the changes like this for a while.

### Patch

* Fixed premature redirect in logOut and improved test coverage #20 @rwky
* Removed make-node and replaced with nyc and coveralls @rwky

## 2.1.1 (2019-04-30)

### Patch

* Added gitlab sast testing @rwky
* Updated npm dev deps @rwky
* Updated README and CONTRIBUTING to explain differences between passport and passport-next #13 @rwky
* Fixed monkey patch and memory leak #15 #9 @MayaWolf

## 2.1.0 (2018-11-03)

### Minor

* Exposed the method to customize the SessionManager object @adamhathcock

### Patch

* Added node 11 support @rwky
* Lint fixes @rwky
* Updated dev deps @rwky
* Added linting to travis @rwky

## 2.0.0 (2018-08-18)

### Major

* Added eslint configuration, and fixed a pletora of lint errors @idurotola
  This change should have been a patch (to 1.0.2) but because of the size of the
  number of lines changed it was made a major.

## 1.0.1 (2018-08-11)

### Patch

* Fixed premature redirect when using express sessions @zypA13510 @idurotola

## 1.0.0 (2018-09-06)

### Major

* Removed obsolete pauseStream option, streams as of node 0.10 are paused by default https://nodejs.org/api/stream.html#stream_two_modes @rwky

### Minor

* Updated dev deps @rwky

## 0.5.0 (2018-06-29)

### Minor

* Added CHANGELOG.md @rwky
* Updated travis to use node 6, 8 and 10 @rwky
* Updated dev deps @rwky
* Updated README.md and package.json for passport-next org @rwky
