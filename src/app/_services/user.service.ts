import { PaginatedResult } from './../_models/pagination';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../_models/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private authHttp: AuthHttp) { }

    // getUsers(page?: number, itemsPerPage?: number): Observable<User[]> {
    getUsers(page?: number, itemsPerPage?: number, userParams?: any) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let queryString = '?';
        if (page != null && itemsPerPage != null) {
            queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
        }

        if (userParams != null) {
            queryString +=
                'minAge=' + userParams.minAge +
                '&maxAge=' + userParams.maxAge +
                '&gender=' + userParams.gender +
                '&orderBy=' + userParams.orderBy;
        }

        // return this.http.get(this.baseUrl + 'users', this.jwt())
        //     .map(response => <User[]>response.json())
        //     .catch(this.handleError);
        return this.authHttp.get(this.baseUrl + 'users' + queryString)
            // .map(response => <User[]>response.json())
            .map((response: Response) => {
                paginatedResult.result = response.json();

                if (response.headers.get('pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
                }

                return paginatedResult;
            })
            .catch(this.handleError);
    }

    updateUser(id: number, user: User) {
        return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handleError);
    }

    setMainPhoto(userId: number, photoId: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {}).catch(this.handleError);
    }
    deletePhoto(userId: number, id: number) {
        return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id).catch(this.handleError);
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
