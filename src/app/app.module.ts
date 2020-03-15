/*
Modules import app
 */
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';

/*
Component import app
 */
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { MainMenuComponent } from './shop/main-menu/main-menu.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import {HeaderComponent} from './navigation/header/header.component';
import {BouquetsComponent} from './shop/bouquets/bouquets.component';
import {FlowersComponent} from './shop/flowers/flowers.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AutofocusDirective } from './shared/directives/autofocus.directive';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { SettingsComponent } from './admin/bouquets/settings.component';
import { ControlComponent } from './admin/control/control.component';
import { UsersComponent } from './admin/users/users.component';
import { OrdersComponent } from './admin/orders/orders.component';

import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {ResetComponent} from './auth/reset/reset.component';
import { MyOrdersComponent } from './shop/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    MainMenuComponent,
    LegalNoticeComponent,
    SidenavComponent,
    HeaderComponent,
    BouquetsComponent,
    FlowersComponent,
    FooterComponent,
    ProfileComponent,
    AutofocusDirective,
    TermsConditionsComponent,
    SettingsComponent,
    ControlComponent,
    UsersComponent,
    OrdersComponent,
    ResetComponent,
    MyOrdersComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'Flower-Shop'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'en-En'
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
