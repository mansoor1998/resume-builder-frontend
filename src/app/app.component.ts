import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInOut } from 'src/shared/animations/routerTransition';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeInOut()
  ]
})
export class AppComponent {
  title = 'resume-customizer'; 

  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
