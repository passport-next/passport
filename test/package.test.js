const passport = require('..');

describe('passport', () => {
  it('should expose singleton authenticator', () => {
    expect(passport).to.be.an('object');
    expect(passport).to.be.an.instanceOf(passport.Authenticator);
  });

  it('should export constructors', () => {
    expect(passport.Authenticator).to.equal(passport.Passport);
    expect(passport.Authenticator).to.be.a('function');
    expect(passport.Strategy).to.be.a('function');
  });

  it('should export strategies', () => {
    expect(passport.strategies.SessionStrategy).to.be.a('function');
  });
});
