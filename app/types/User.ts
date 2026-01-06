export interface UserCtx {
  username: string,
  role: string,
  isAuth: boolean,
}

export interface User {
  id?: number,
  username: string,
  password: string,
  role: string,
}