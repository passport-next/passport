import * as chaiModule from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiConnectMiddleware from '@passport-next/chai-connect-middleware';
import chaiPassportStrategy from '@passport-next/chai-passport-strategy';

const chai = chaiPassportStrategy(chaiModule.use((chaiInstance, utils) => {
  chaiAsPromised(chaiInstance, utils);
  chaiConnectMiddleware(chaiInstance);
}));

const { expect } = chai;

export { chai, expect };
