import { Injectable } from "@angular/core";
import { AuthRespData, JwtToken, User } from "../@type/auth.type";
import { tokenKey } from "../@constant/local-storage.const";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user: User | null = null;

  constructor(private router: Router) {}

  setCredential(credential: AuthRespData) {
    this.setTokens(credential.tokens);
    this.user = credential.user;
  }

  set user(userInfo: User | null) {
    this._user = userInfo;
  }

  get user() {
    return this._user;
  }

  setTokens(tokens: JwtToken | null) {
    if (!!tokens) {
      localStorage.setItem(tokenKey.accessToken, tokens.accessToken);
      localStorage.setItem(tokenKey.refreshToken, tokens.refreshToken);
    } else {
      localStorage.removeItem(tokenKey.accessToken);
      localStorage.removeItem(tokenKey.refreshToken);
    }
  }

  getTokens() {
    const accessToken = localStorage.getItem(tokenKey.accessToken);
    const refreshToken = localStorage.getItem(tokenKey.refreshToken);
    if (!!accessToken && !!refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  }

  logout() {
    this.setTokens(null);
    this.user = null;
    this.router.navigate(["/"]);
  }
}
