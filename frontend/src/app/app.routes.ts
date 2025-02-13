import { Routes } from '@angular/router';
import { guardGuard } from './core/gaurds/guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then((m) => m.PublicModule),
  },
  {
          path:'auth',
          loadChildren: () =>
            import('./public/features/auth/auth.module').then(
              (m) => m.AuthModule
            ),
        }
];
