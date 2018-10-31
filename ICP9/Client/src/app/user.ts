export class User {
  public username: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public address: {
    city: string;
    state: string
  };
  public education: {
    university: string;
    degree: string;
    major: string;
  };
  public email: string;
}
