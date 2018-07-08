import { Observable } from 'rxjs/Rx';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/catch';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    pageSize = 5;
    pageNumber = 1;
    likesParam = 'Likers';

    constructor(private userService: UserService, private router: Router, private alertifyService: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam)
            .catch(error => {
                this.alertifyService.error('Problem retrieving data!');
                this.router.navigate(['/members']);
                return Observable.of(null);
            })
    }
}