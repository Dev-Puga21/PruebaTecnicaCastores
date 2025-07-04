// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterUserPageComponent } from './pages/register-user-page/register-user-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password-page/reset-password.component';
import { VideosComponent } from './pages/videos-page/videos.component';
import { FavoritesVideosPageComponent } from './pages/favorites-videos-page/favorites-videos-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AuthGuard } from './guards/auth.guard.ts/auth.guard';

export const routes: Routes = [
  { path: '/', component: LoginPageComponent },
  { path: 'register', component: RegisterUserPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'home', component: VideosComponent, canActivateChild: [AuthGuard] },
  { path: 'favorites', component: FavoritesVideosPageComponent, canActivateChild: [AuthGuard] },

  { path: '**', component: NotFoundComponent },
];
