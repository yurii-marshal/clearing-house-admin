import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorizationGuard} from './authorization.guard';
import {AutoLoginComponent} from './components/auto-login/auto-login.component';

const routes: Routes = [
    {
        path: 'error',
        loadChildren: './components/server-error/server-error.module#ServerErrorModule'
    },
    {
        path: 'access-denied',
        loadChildren: './components/access-denied/access-denied.module#AccessDeniedModule'
    },
    {
        path: 'not-found',
        loadChildren: './components/not-found/not-found.module#NotFoundModule',
    },
    {
        path: 'autologin',
        component: AutoLoginComponent
    },
    // {
    // this is only for demo purposes
    //     path: 'call-api',
    //     component: CallApiComponent,
    //     canActivate: [AuthorizationGuard]
    // },
    {
        path: '**',
        redirectTo: 'not-found'
    },
    // {
    //     path: '',
    //     loadChildren: './components/shell.module#ShellModule',
    //     canActivate: [AuthorizationGuard]
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
