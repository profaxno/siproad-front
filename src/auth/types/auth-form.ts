export type AuthForm = {
  username: string;
  password: string;
}

export type AuthFormErrors = {
  username? : string;
  password? : string;
  login?    : string;
}