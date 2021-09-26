import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { AppSession } from 'src/shared/app.session';
import { GoogleAuth } from 'src/shared/google-auth';
import { JwtDto, UserService } from 'src/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends GoogleAuth implements OnInit {

  public registerForm: FormGroup;
  constructor(private fb: FormBuilder, userService: UserService, authService: SocialAuthService) {
    super(userService, authService);
    this.registerForm = this.fb.group({});
  }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: [ '', [
        Validators.required,
        (control: AbstractControl) => {
          let password = this.password?.value
          return (password === control.value) ? null : {'passwordMismatch': { value: control.value }};
        }
      ]]
    });
  }

  get email(){
    return this.registerForm.get('email');
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  get password(){
    return this.registerForm.get('password') as AbstractControl;
  }

  // confirmPasswordValidator(passwordControl: AbstractControl): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | any => {
  //       const password = passwordControl?.value;
  //       console.log(control.value, passwordControl);
  //       return control.value === password ? null : {'passwordMismatch': { value: control.value }};
  //   };
  // }

  submit(){
    if ( this.registerForm.valid ){
      // console.log('the form is valid', this.registerForm.value);
      const user = this.registerForm.value;
      if(user['confirmPassword'])
        delete user['confirmPassword'];
      this.userService.register(user).subscribe((result: JwtDto) => {
        const jwt = result?.jwt;
        if(jwt != null){
          AppSession.setToken('auth-token', jwt, 1);
          // console.log('Application authentication token');
          window.location.href = '/';
        }
      }, (err: HttpErrorResponse) => {
        if(err.status === 404 || err.status === 400) {
          Swal.fire({
            icon: 'error',
            title: err.error.message
            // text: 'invalid email or password'
          });
        }
      });
    }
  }

}
