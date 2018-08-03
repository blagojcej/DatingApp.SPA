import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AdminService {
    baseUrl = environment.apiUrl;

    constructor(private http: Http) { }

    getUsersWithRoles(): Observable<User[]> {
        return this.http.get(this.baseUrl + 'admin/usersWithRoles', this.jwt())
            .map(res => <User[]>res.json());
    }

    updateUserRoles(user: User, roles: {}) {
        return this.http.post(this.baseUrl + 'admin/editRoles/' + user.userName, roles, this.jwt());
    }

    private jwt() {
        const token = localStorage.getItem('token');
        if (token) {
            const headers = new Headers({ 'Authorization': 'Bearer ' + token });
            headers.append('Content-Type', 'application/json');
            return new RequestOptions({ headers: headers });
        }
    }
}
