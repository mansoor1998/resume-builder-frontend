import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AppSession } from "./app.session";


@Injectable({ providedIn: 'root' })
export class AuthRouteGaurd implements CanActivate, CanActivateChild {
    constructor(private router: Router) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const user = AppSession.getUserDetails();
        // if user does not exist than entery is forbidden.
        if((state.url != '/login' && state.url != '/register') && !user.id){
            this.router.navigate(['/login']);
            return false; 
        }
        // if user does not exist the entry is forbidden
        // if((state.url != '/register') && !user.id){
        //     this.router.navigate(['/register']);
        //     return false; 
        // }

        // if user is loged in but accessing login page then redirect to home page.
        if((state.url === '/login') && user.id){
            this.router.navigate(['/home']);
            return false;
        }

        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return true
    }
}