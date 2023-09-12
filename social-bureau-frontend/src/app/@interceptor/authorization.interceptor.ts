import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../@service/auth.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getTokens();

    if (!!token?.accessToken && !!token?.refreshToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token?.accessToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
