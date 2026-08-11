/* eslint-disable no-shadow -- Convenient */

import { expect } from './bootstrap/node.js';
import Authenticator from '../lib/authenticator.js';


describe('Authenticator', () => {
  describe('#framework', () => {
    describe('with an authenticate function used for authorization', () => {
      const passport = new Authenticator();
      passport.framework({
        initialize() {
          return function initialize() {};
        },
        authenticate(passport, name, options) {
          return function authenticate() {
            const assignProperty = typeof options === 'function'
              ? undefined
              : options?.assignProperty;
            return `authenticate(): ${name} ${assignProperty}`;
          };
        }
      });

      // @ts-expect-error -- Invoke the test middleware directly without Connect arguments.
      const rv = passport.authorize('foo')();
      it('should call authenticate', () => {
        expect(rv).to.equal('authenticate(): foo account');
      });
    });

    describe('with an authorize function used for authorization', () => {
      const passport = new Authenticator();
      passport.framework({
        initialize() {
          return function initialize() {};
        },
        authenticate(passport, name, options) {
          return function authenticate() {
            const assignProperty = typeof options === 'function'
              ? undefined
              : options?.assignProperty;
            return `authenticate(): ${name} ${assignProperty}`;
          };
        },
        authorize(passport, name, options) {
          return function authorize() {
            const assignProperty = typeof options === 'function'
              ? undefined
              : options?.assignProperty;
            return `authorize(): ${name} ${assignProperty}`;
          };
        }
      });

      // @ts-expect-error -- Invoke the test middleware directly without Connect arguments.
      const rv = passport.authorize('foo')();
      it('should call authorize', () => {
        expect(rv).to.equal('authorize(): foo account');
      });
    });
  });
});
