import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
// import { AuthService } from '../@service/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          // TODO refreash token process here
          // this.authService.logout();
        }
        return throwError(err);
      })
    );
  }
}
