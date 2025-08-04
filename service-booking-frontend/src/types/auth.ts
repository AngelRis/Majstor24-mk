import type { ReactNode } from "react";

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  fullName: string;
  phone: string;
  role: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}
export interface UserDto{
   username: string;
   email: string;
   fullName: string;
   phone: string;
}

export type AuthContextType = {
  isLoggedIn: boolean;
  username: string;
  fullName: string;
  role:string;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};
export type AuthProviderProps = {
  children: ReactNode;
};