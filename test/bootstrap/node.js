'use strict';

const chai = require('chai');

chai.use(require('@passport-next/chai-connect-middleware'));
chai.use(require('@passport-next/chai-passport-strategy'));

global.expect = chai.expect;
