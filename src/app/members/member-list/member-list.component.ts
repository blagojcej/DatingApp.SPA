import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService, private alertifyService: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Commented after adding route resolvers
    //Also removed all save conditional operators (?) in model
    // this.loadUsers();
    this.route.data.subscribe(data => {
      this.users=data['users'];
    })
  }

  loadUsers() {
    this.userService.getUsers()
      .subscribe((users: User[]) => {
        this.users = users;
      }, error => {
        this.alertifyService.error(error);
      });
  }

}