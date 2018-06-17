import { Observable } from 'rxjs/Observable';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

    constructor(private userService: UserService, private router: Router, private alertifyService: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot) : Observable<User[]> {
        return this.userService.getUsers()
        .catch(error=> {
            this.alertifyService.error('Problem retrieving data!');
            this.router.navigate(['/members']);
            return Observable.of(null);
        })
    }
}