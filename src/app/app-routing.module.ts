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
import {ControlComponent} from './admin/control/control.component';
import {ResetComponent} from './auth/reset/reset.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notice', component: LegalNoticeComponent, canActivate: [AuthGuard]},
  {path: 'shop', component: MainMenuComponent},
  {path: 'flowers', component: FlowersComponent},
  {path: 'bouquets', component: BouquetsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'terms', component: TermsConditionsComponent},
  {path: 'control', component: ControlComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'reset', component: ResetComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
