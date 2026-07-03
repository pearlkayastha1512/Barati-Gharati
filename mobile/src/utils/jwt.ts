import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export const decodeToken = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};