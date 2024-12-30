import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from '../services/popup.service';

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private popupService: PopupService) {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.status == 0) {
                        this.popupService.openError("Can't connect to the server !")
                        errorMessage = `Error: can't connect to the server`;
                    } 
                    else if (error.error instanceof ErrorEvent) {
                        // erreur client
                        errorMessage = `Error: ${error.error.message}`;
                        this.popupService.openWarning(error.error.message)
                    } else {
                        // erreur serveur
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        this.popupService.openError(error.message)
                    }
                    return throwError(errorMessage);
                })
            )
    }
}