export type Tokens = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
};