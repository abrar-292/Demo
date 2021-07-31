import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry, retryWhen, scan, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    pageTitle: string;
    private httpOptions: any;
    showNavbar = false;
    open = false;

    constructor(private http: HttpClient, private router: Router) {
    }

    getBasicHeader() {
        this.httpOptions = new HttpHeaders({
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin',
        });
        return {headers: this.httpOptions};
    }

    getList(data): Observable<any> {
        return this.http.get(`http://www.omdbapi.com/?${data}`).pipe(
            catchError((err => {
                    ApiService.handleAuthError(err);
                    return throwError(err);
                })
            ));
    }

    private static handleAuthError(err: HttpErrorResponse): Observable<never> {
        return Observable.throw(err.error.message);
    }
}
