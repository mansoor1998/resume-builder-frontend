import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {AppSession} from '../../../shared/app.session';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('navbar') nav: ElementRef<HTMLElement> | undefined;

  public selectedIndex = 0;
  public defaultRoute = '/home';

  private currentScroll = 0;

  sideBarEnabled = false;

  public menuItems = [
    {
      name: 'Home',
      route: '/'
    },
    {
      name: 'Template',
      route: '/template'
    },
    {
      name: 'Preview',
      route: '/preview',
      isAuthorized: true
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
    this.currentScroll = window.scrollY || window.document.documentElement.scrollTop || window.document.body.scrollTop || 0;
    this.selectedIndex = this.menuItems.findIndex(x => window.location.pathname == x.route);  


    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
          this.selectedIndex = this.menuItems.findIndex(x => event.url == x.route);  
      }
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollY = window.scrollY || window.document.documentElement.scrollTop || window.document.body.scrollTop || 0;

    if(scrollY >= 63 + 40){
      if(scrollY > this.currentScroll){
        this.nav?.nativeElement.classList.add('header-hide');
      } 
    }

    if(scrollY <= this.currentScroll) {
      this.nav?.nativeElement.classList.remove('header-hide');
    }
  
    this.currentScroll = scrollY;

  }

  sidebarClick(item: any){
    this.router.navigate([item.route]);
    this.sideBarEnabled = !this.sideBarEnabled;
  }

  isAuthorized(item: any){
    const user = AppSession.getUserDetails();
    if(item?.isAuthorized)
      return user?.id;
    return true;
  }

  
  public logout(){
    AppSession.removeToken(AppSession.AUTH_TOKEN);
    this.router.navigate(['/login']);
  }

  isLoggedIn(){
    return AppSession.isLogedIn();
  }
}
