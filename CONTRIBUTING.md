## Contributing

Pull Requests are welcome for any issues, if you have any questions please 
[raise an issue](https://github.com/passport-next/passport/issues).

If you discover a security issue please create an issue stating you've discovered a security
issue but don't divulge the issue, one of the maintainers will respond with an email address
you can send the details to. Once the issue has been patched the details can be made public.

If you wish to join the team please raise an issue and one of the maintainers will assess your
request.

### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases with complete code coverage.  Patches
that increase test coverage are happily accepted.

Ensure that the test suite passes by executing:

```bash
$ make test
```

Ensure that lint passes
```bash
$ npm run-script lint
```

Coverage reports can be generated and viewed by executing:

```bash
$ make test-cov
$ make view-cov
```
