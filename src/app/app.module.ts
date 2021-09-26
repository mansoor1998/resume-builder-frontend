import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layout/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TemplateComponent } from './template/template.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { PreviewComponent } from './preview/preview.component';
import { TemplateItemComponent } from './template-item/template-item.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import { PlatformLocation } from '@angular/common';
import {HttpClient } from '@angular/common/http';
import { AppConst } from 'src/shared/app.const';
import { LoginComponent } from './login/login.component';
import { CreateTemplateNewComponent } from './create-template-new/create-template-new.component';
import {MatMenuModule} from '@angular/material/menu';
import { RegisterComponent } from './register/register.component';
import {MatSliderModule} from '@angular/material/slider';

// import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig, SocialAuthService } from 'angularx-social-login';

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';



function appInitializerFactory(injector: Injector, platformLocation: PlatformLocation) {
  return () => {
    return new Promise((res, rej) => {
      injector.get(HttpClient).get('./assets/appconfig.json').toPromise()
      //@ts-ignore
        .then((data: { remoteServiceBaseUrl: string, appBaseUrl: string }) => {
          AppConst.remoteServiceBaseUrl = data.remoteServiceBaseUrl;
          AppConst.appBaseUrl = data.appBaseUrl;
          res(true);
          // const userService: UserService = injector.get(UserService);
          // userService.isAuthorized().subscribe((result: boolean) => {
          //   if(result){
          //     res(true)
          //   }
          // }, (err: HttpErrorResponse) => {
          //   if(err.status === 401){
          //     AppSession.removeToken('auth-token');
          //     console.log('the token is removed completly');
          //   }
          //   res(true);
          // });
      }).catch(e => {
          rej(e);
      });
    })
  }
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TemplateComponent,
    CreateTemplateComponent,
    PreviewComponent,
    TemplateItemComponent,
    DashboardComponent,
    LoginComponent,
    CreateTemplateNewComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatMenuModule,
    MatSliderModule
    // ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Injector, PlatformLocation],
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '671706216760-l59h6blcqh2qpsderbe7mg4algkmrjc8.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    SocialAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
