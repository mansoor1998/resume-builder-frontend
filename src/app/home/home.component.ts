import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSession } from 'src/shared/app.session';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public logout(){
    AppSession.removeToken(AppSession.AUTH_TOKEN);
    this.router.navigate(['/login']);
  }

}
