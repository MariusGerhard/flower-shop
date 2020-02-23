/*
Modules import app
 */
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/firestore';

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
import {HttpClientModule} from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';
import { environment } from '../environments/environment';
import { FooterComponent } from './navigation/footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

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
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `flower`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/flower.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `bouquet`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/bouquet.svg')
    );
  }
}
