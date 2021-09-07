import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layout/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TemplateComponent } from './template/template.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { PreviewComponent } from './preview/preview.component';
import { TemplateItemComponent } from './template-item/template-item.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    TemplateComponent,
    CreateTemplateComponent,
    PreviewComponent,
    TemplateItemComponent,
    DashboardComponent
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
    MatChipsModule
    // MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
