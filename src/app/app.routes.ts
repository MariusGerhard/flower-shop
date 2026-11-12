import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', loadComponent: () => import('./auth/register/register').then((m) => m.Register) },
  { path: 'login', loadComponent: () => import('./auth/login/login').then((m) => m.Login) },
  { path: 'reset', loadComponent: () => import('./auth/reset/reset').then((m) => m.Reset) },
  { path: 'notice', loadComponent: () => import('./legal-notice/legal-notice').then((m) => m.LegalNotice) },
  { path: 'terms', loadComponent: () => import('./terms-conditions/terms-conditions').then((m) => m.TermsConditions) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'shop', loadComponent: () => import('./shop/main-menu/main-menu').then((m) => m.MainMenu) },
      { path: 'flowers', loadComponent: () => import('./shop/flowers/flowers').then((m) => m.Flowers) },
      { path: 'bouquets', loadComponent: () => import('./shop/bouquets/bouquets').then((m) => m.Bouquets) },
      { path: 'orders', loadComponent: () => import('./shop/my-orders/my-orders').then((m) => m.MyOrders) },
      { path: 'profile', loadComponent: () => import('./auth/profile/profile').then((m) => m.Profile) },
      { path: 'control', loadComponent: () => import('./admin/control/control').then((m) => m.Control) },
    ],
  },
  { path: '**', redirectTo: '' },
];
