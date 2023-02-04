export interface IUsername {
  username?: string;
}

export interface IEmailPassword {
  email?: string;
  password?: string;
}

export interface IUsernamePassword {
  username?: string;
  password?: string;
}

export interface IEmailUsernamePassword {
  email?: string;
  username?: string;
  password?: string;
}

export interface IEmailVerificationCode {
  email?: string;
  verification_code?: string;
}
