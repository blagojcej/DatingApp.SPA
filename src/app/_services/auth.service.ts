import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;
    decodedToken: any;
    currentUser: User;
    jwtHelper: JwtHelper = new JwtHelper();
    private photoUrl = new BehaviorSubject('../../assets/user.png');
    currentPhotoUrl = this.photoUrl.asObservable();

    constructor(private http: Http) { }

    changeMemberPhoto(photoUrl: string) {
        this.photoUrl.next(photoUrl);
    }

    login(model: any) {
        // const headers = new Headers({ 'Content-type': 'application/json' });
        // const options = new RequestOptions({ headers: headers });
        // return this.http.post(this.baseUrl + 'login', model, options)
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
            .map((response: Response) => {
                const user = response.json();
                if (user && user.tokenString) {
                    localStorage.setItem('token', user.tokenString);
                    localStorage.setItem('user', JSON.stringify(user.user));
                    this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
                    this.currentUser = user.user;
                    // console.log(this.decodedToken);
                    this.userToken = user.tokenString;
                    if (this.currentUser.photoUrl !== null) {
                        this.changeMemberPhoto(this.currentUser.photoUrl);
                    } else {
                        this.changeMemberPhoto('../../assets/user.png');
                    }
                }
            }).catch(this.handleError);
    }

    register(user: User) {
        return this.http.post(this.baseUrl + 'register', user, this.requestOptions()).catch(this.handleError);
    }

    loggedIn() {
        return tokenNotExpired('token');
    }

    private requestOptions() {
        const headers = new Headers({ 'Content-type': 'application/json' });
        return new RequestOptions({ headers: headers });
    }

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

    roleMatch(allowedRoles): boolean {
        let isMatch = false;
        const userRoles = this.decodedToken.role as Array<string>;
        allowedRoles.forEach(element => {
            if (userRoles.includes(element)) {
                isMatch = true;
                return;
            }
        });

        return isMatch;
    }
}
