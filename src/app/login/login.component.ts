import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthDto, UserService } from 'src/shared/services/user.service';
import { AppSession } from 'src/shared/app.session';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { GoogleAuth } from 'src/shared/google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends GoogleAuth implements OnInit {


  public loginForm: FormGroup;
  constructor(private fb: FormBuilder, userService: UserService, authService: SocialAuthService) {
    super(userService, authService);
    this.loginForm = this.fb.group({});
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    // mark all as touched.
    this.loginForm?.markAllAsTouched();
    if(this.loginForm?.valid){
      const authDto: AuthDto = this.loginForm.value;

      this.userService.login(authDto).subscribe((result: { jwt: string }) => {
        const jwt = result?.jwt;
        if(jwt != null){
          AppSession.setToken('auth-token', jwt, 0.5);
          // console.log('Application authentication token');
          window.location.href = '/';
        }
      }, (err: HttpErrorResponse) => {
        if(err.status === 404){
          Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'invalid email or password'
          });
          return;
        }

        if(err.status === 400){
          Swal.fire({
            icon: 'error',
            text: err.error.message
          });
        }

        // console.error(err);
      });

    }
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
  //     this.userService.googleOAuth( { accessToken: data.idToken } ).subscribe((result: any) => {
  //       const { jwt } = result;
  //       if( jwt != null ) {
  //         AppSession.setToken('auth-token', jwt, 1);
  //         window.location.href = '/';
  //       }
  //     }, (err: HttpErrorResponse) => {
  //       if(err.status === 500 || err.status === 424) {
  //         Swal.fire({
  //           icon: 'error',
  //           text: err.message
  //         });
  //         return;
  //       }
  //     });
  //   });
  // }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }


  googleOAuth(){
    // this.userService.googleOAuth().subscribe((url: string) => {
      
      // return false;

      this.userService.getUrl().subscribe( (url: string) => {
        let w = window.open(url, "MsgWindow", "width=200,height=100");

        setTimeout( () => {
          console.log("this is the answer");
          console.log ( w?.location.href);
        }, 2000 )
      });



      // this.intervalId = setInterval(() => {
      //   //@ts-ignore
      //   console.log(this.windowHandle);
      //   let href: string | undefined;
      //   try {
      //     href = this.windowHandle?.location.href; // set window location to href string
      //   } catch (e) {
      //     console.log('Error:', e); // Handle any errors here
      //   }


      //   if(href != null){

      //     const getQueryString = function(field: any, url: string) {
      //       const windowLocationUrl = url ? url : href;
      //       const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
      //       const string = reg.exec(windowLocationUrl as string);
      //       return string ? string[1] : null;
      //     };


      //     if(href.match('code')){
      //       window.clearInterval(this.intervalId);
      //       this.intervalId = null;
      //       this.authorizationCode = getQueryString('code', href) as string;
      //       this.windowHandle?.close();
      //     }

      //     console.log('this is the authorization code ', this.authorizationCode);

      //   }

      // }, 500);
    // }) ;
  }

}
