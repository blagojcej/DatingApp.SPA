import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private authHttp: AuthHttp) { }

    getUsers(): Observable<User[]> {
        // return this.http.get(this.baseUrl + 'users', this.jwt())
        //     .map(response => <User[]>response.json())
        //     .catch(this.handleError);
        return this.authHttp.get(this.baseUrl + 'users')
            .map(response => <User[]>response.json())
            .catch(this.handleError);
    }

    updateUser(id: number, user: User) {
        return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handleError);
    }

    getUser(id): Observable<User> {
        return this.authHttp.get(this.baseUrl + 'users/' + id)
            .map(response => <User>response.json())
            .catch(this.handleError);
    }

    // private jwt() {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    //         headers.append('Content-Type', 'application/json');
    //         return new RequestOptions({ headers: headers });
    //     }
    // }

    private handleError(error: any) {
        // console.log(error);
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }

        const serverError = error.json();
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(modelStateErrors || 'Server Error');
    }
}
