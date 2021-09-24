import { HttpErrorResponse } from "@angular/common/http";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import Swal from "sweetalert2";
import { AppSession } from "./app.session";
import { UserService } from "./services/user.service";

export class GoogleAuth {

    constructor(protected userService: UserService, protected authService: SocialAuthService){
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
          this.userService.googleOAuth( { accessToken: data.idToken } ).subscribe((result: any) => {
            const { jwt } = result;
            if( jwt != null ) {
              AppSession.setToken('auth-token', jwt, 1);
              window.location.href = '/';
            }
          }, (err: HttpErrorResponse) => {
            if(err.status === 500 || err.status === 424) {
              Swal.fire({
                icon: 'error',
                text: err.error.message
              });
              return;
            }
          });
        });
      }
}