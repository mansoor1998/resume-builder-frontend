import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthDto, UserService } from 'src/shared/services/user.service';
import { AppSession } from 'src/shared/app.session';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  constructor(private fb: FormBuilder,  private userService: UserService) {
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

  submit() {
    // mark all as touched.
    this.loginForm?.markAllAsTouched();
    if(this.loginForm?.valid){
      const authDto: AuthDto = this.loginForm.value;

      this.userService.login(authDto).subscribe((result: { jwt: string }) => {
        const jwt = result?.jwt;
        if(jwt != null){
          AppSession.setToken('auth-token', jwt, 1);
          // console.log('Application authentication token');
          window.location.href = '/';
        }
      }, (err: HttpErrorResponse) => {
        if(err.status === 404){
          Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'invalid email or password'
          })
        }
        console.error(err);
      });

    }
  }

}
