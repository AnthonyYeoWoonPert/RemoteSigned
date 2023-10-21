export default interface Account {
  name: string;
  username: string;
  password: string;
  status: AccountStatus;
}

export enum AccountStatus {
  NONE,
  LOADING,
  SUCCESS,
  DUPLICATE,
  FAIL,
}
