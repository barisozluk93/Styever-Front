import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../modules/auth/models/auth.model';
import { Router } from '@angular/router';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { ResultModel } from '../models/result.model';
import { AuthHTTPService } from '../modules/auth/services/auth-http.service';

@Injectable({ providedIn: 'root' })
export class Interceptor implements HttpInterceptor {
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    constructor(private router: Router, private authHttpService: AuthHTTPService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = localStorage.getItem(this.authLocalStorageToken);
        const user: AuthModel = currentUser ? JSON.parse(currentUser) : null;

        // Refresh endpoint ise intercept etme
        if (request.url.includes('/auth/RefreshToken')) {
            return next.handle(request);
        }

        let authRequest = request;

        if (user?.accessToken) {
            authRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.accessToken}`,
                }
            });
        }

        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status === 401 && user?.refreshToken) {

                    return this.authHttpService.refreshToken(user.accessToken, user.refreshToken).pipe(
                        switchMap((response: ResultModel<any>) => {

                            if (response.isSuccess) {

                                user.accessToken = response.data.accessToken;
                                user.refreshToken = response.data.refreshToken;

                                localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));

                                const retryRequest = request.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${user.accessToken}`,
                                    }
                                });

                                return next.handle(retryRequest);
                            }

                            this.logout();
                            return throwError(() => error);
                        }),
                        catchError(() => {
                            this.logout();
                            return throwError(() => error);
                        })
                    );
                }

                if (error.status === 403) {
                    this.router.navigate(['/error/500']);
                }

                return throwError(() => error);
            })
        );
    }

    private logout() {
        localStorage.removeItem(this.authLocalStorageToken);
        this.router.navigate(['/home']);
    }

}