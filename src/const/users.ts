export enum UserRole {
  Master = 0,
  Admin = 1,
}

export const USER_ROLE_INFO = {
  [UserRole.Master]: {name: 'Мастер'},
  [UserRole.Admin]: {name: 'Админ'},
}