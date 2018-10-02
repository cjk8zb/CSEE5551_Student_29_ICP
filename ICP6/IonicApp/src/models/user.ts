
export class Credentials {
  username: string;
  password: string;
}

export class User extends Credentials {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
