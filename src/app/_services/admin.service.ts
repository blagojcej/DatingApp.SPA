import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdminService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsersWithRoles() {
        return this.http.get(this.baseUrl + 'admin/usersWithRoles');
    }

}
