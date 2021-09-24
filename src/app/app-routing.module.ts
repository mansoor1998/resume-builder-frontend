import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PreviewComponent } from './preview/preview.component';
import { TemplateComponent } from './template/template.component';
import { AuthRouteGaurd } from 'src/shared/auth-route-gaurd';
import { CreateTemplateNewComponent } from './create-template-new/create-template-new.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: '/home'
  // },
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { animation: 'HomeComponent' }
      },
      {
        path: 'template',
        component: TemplateComponent,
        data: { animation: 'TemplateComponent' }
      },
      {
        path: 'preview',
        component: PreviewComponent,
        data: { animation: 'PreviewComponent' },
        canActivate: [AuthRouteGaurd]

      }
    ],
    component: DashboardComponent
  },
  {
    path: "template/create",
    component: CreateTemplateComponent,
    data: { animation: 'CreateTemplateComponent' },
    canActivate: [AuthRouteGaurd]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthRouteGaurd]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthRouteGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
