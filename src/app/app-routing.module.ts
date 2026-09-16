import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/logitrack-auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { 
    path: '', 
    component: LayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'warehouses', loadChildren: () => import('./pages/warehouses/warehouses.module').then(m => m.WarehousesModule) },
      { path: 'zones', loadChildren: () => import('./pages/zones/zones.module').then(m => m.ZonesModule) },
      { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule) },
      { path: 'check-in', loadChildren: () => import('./pages/check-in/check-in.module').then(m => m.CheckinModule) },
      { path: 'check-out', loadChildren: () => import('./pages/check-out/check-out.module').then(m => m.CheckoutModule) },
      { path: 'stocks', loadChildren: () => import('./pages/stocks/stocks.module').then(m => m.StocksModule) },
      { path: 'dashboards', loadChildren: () => import('./pages/dashboards/dashboards.module').then(m => m.DashboardsModule) },
      { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule) },
      { path: 'documents', loadChildren: () => import('./pages/documents/documents.module').then(m => m.DocumentsModule) },
    ]
  },
  { path: '**', redirectTo: '/auth/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
