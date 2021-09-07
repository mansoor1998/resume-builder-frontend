import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public selectedIndex = 0;

  public menuItems = [
    {
      name: 'Home',
      route: '/home'
    },
    {
      name: 'Template',
      route: '/template'
    },
    {
      name: 'Preview',
      route: '/preview'
    }
  ]

  constructor(private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // const pathName = window.location.pathname;
  
    // this.router.events.filter(event => event instanceof NavigationEnd)
    //   .subscribe(event => 
    //   {
    //     this.currentRoute = event.url;          
    //     console.log(event);
    //   });

    this.selectedIndex = this.menuItems.findIndex(x => window.location.pathname == x.route);  


    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
          this.selectedIndex = this.menuItems.findIndex(x => event.url == x.route);  
      }
    });
  }

  // itemClicked(index: number){
  //   this.selectedIndex = index;
  // }

}
