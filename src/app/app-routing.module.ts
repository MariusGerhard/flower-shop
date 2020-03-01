import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {MainMenuComponent} from './shop/main-menu/main-menu.component';
import {LegalNoticeComponent} from './legal-notice/legal-notice.component';
import {FlowersComponent} from './shop/flowers/flowers.component';
import {BouquetsComponent} from './shop/bouquets/bouquets.component';
import {ProfileComponent} from './profile/profile.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';
import {SettingsComponent} from './admin/settings/settings.component';

import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notice', component: LegalNoticeComponent},
  {path: 'shop', component: MainMenuComponent, canActivate: [AuthGuard]},
  {path: 'flowers', component: FlowersComponent, canActivate: [AuthGuard]},
  {path: 'bouquets', component: BouquetsComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'terms', component: TermsConditionsComponent},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
