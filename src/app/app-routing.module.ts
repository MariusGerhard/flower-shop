import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {LegalNoticeComponent} from './legal-notice/legal-notice.component';
import {FlowersComponent} from './shop/flowers/flowers.component';
import {BouquetsComponent} from './shop/bouquets/bouquets.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notice', component: LegalNoticeComponent},
  {path: 'menu', component: MainMenuComponent},
  {path: 'flowers', component: FlowersComponent},
  {path: 'bouquets', component: BouquetsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
