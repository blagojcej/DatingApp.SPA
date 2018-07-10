import { AuthService } from './../_services/auth.service';
import { Observable } from 'rxjs/Rx';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import { Message } from '../_models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageSize = 5;
    pageNumber = 1;
    messageContainer = 'Unread';

    constructor(private userService: UserService,
        private router: Router,
        private alertifyService: AlertifyService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer)
            .catch(error => {
                this.alertifyService.error('Problem retrieving data!');
                this.router.navigate(['/members']);
                return Observable.of(null);
            })
    }
}