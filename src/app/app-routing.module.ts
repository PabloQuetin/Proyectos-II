import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard"

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]

  },
  {
    path: 'ejercicio',
    loadChildren: () => import('./ejercicio/ejercicio.module').then( m => m.EjercicioPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'rutina',
    loadChildren: () => import('./rutina/rutina.module').then( m => m.RutinaPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'user-data',
    loadChildren: () => import('./user-data/user-data.module').then( m => m.UserDataPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
