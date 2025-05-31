import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeUserComponent } from './home-user/home-user.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeUserComponent}
];