import { BecauseError } from "./errors";


export class Username extends String {
}

export class Password extends String {
}

export class Credentials {
    public username: Username;
    public password: Password;
}

export class LoginError extends BecauseError {
}
