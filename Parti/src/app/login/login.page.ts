import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  unsubscribe$ = new Subject();
  
  constructor(
    private authService: AuthService,
    private router: Router
    ) {  
   }

  ngOnInit() {
  }

}
