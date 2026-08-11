export type GenericObject = Record<string, unknown>;

declare module '@passport-next/passport-types' {
  interface User {
    [key: string]: unknown;
    id?: string | 0;
    username?: string;
    email?: string;
  }

  interface AuthInfo {
    [key: string]: unknown;
    type?: string;
    message?: string;
    clientId?: string;
    scope?: string;
    client?: {name: string};
  }
}

export type User = import('@passport-next/passport-types').User;
export type AuthInfo = import('@passport-next/passport-types').AuthInfo;
export type AuthenticateCallback = (
  error: Error | null,
  user?: User | false,
  info?: unknown,
  status?: unknown
) => void;

export type AuthenticationError = Error & {status: number};

export type PassportSession = GenericObject & {user?: unknown};
export type SessionStore = GenericObject & {passport?: PassportSession};
export type SessionRequest = import('@passport-next/passport-types').Request & {
  session?: SessionStore;
  _passport: GenericObject & {session?: PassportSession};
};

export type TestSession = GenericObject & {
  authentication?: PassportSession;
  messages?: string[];
  passport?: PassportSession;
  returnTo?: string;
  save?: (done: () => void) => void;
};

export type TestPassportState = GenericObject & {
  instance?: {_userProperty?: string};
  session?: PassportSession;
};

export type TestLogIn = (
  user: User,
  options?: GenericObject
) => unknown;

export interface TestRequestExtensions {
  authInfo: AuthInfo;
  user: User;
  account: User;
  currentUser: User;
  session: TestSession;
  _passport: TestPassportState;
  message: {type: string; msg: string};
  logIn: TestLogIn;
  flash: (type: string, message: string) => void;
}

declare module '@passport-next/chai-connect-middleware/request-extensions' {
  interface RequestExtensions extends TestRequestExtensions {}
}

declare module '@passport-next/chai-passport-strategy/request-extensions' {
  interface RequestExtensions extends TestRequestExtensions {}
}

export type Request =
  import('@passport-next/chai-connect-middleware').Request &
  import('@passport-next/chai-passport-strategy').Request;
