import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'restaurants', loadComponent: () => import('./pages/restaurants/restaurants.component').then(m => m.RestaurantsComponent) },
  { path: 'foods', loadComponent: () => import('./pages/food-items/food-items.component').then(m => m.FoodItemsComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent), canActivate: [authGuard] },
  { path: 'order/:id', loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard] },
  { 
    path: 'payment', 
    loadComponent: () => import('./pages/payment/payment.component')
      .then(m => m.PaymentComponent),
    canActivate: [authGuard] 
  },


  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'restaurants', loadComponent: () => import('./admin/manage-restaurants/manage-restaurants.component').then(m => m.ManageRestaurantsComponent) },
      { path: 'foods', loadComponent: () => import('./admin/manage-food-items/manage-food-items.component').then(m => m.ManageFoodItemsComponent) },
      { path: 'orders', loadComponent: () => import('./admin/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent) },
      { path: 'users', loadComponent: () => import('./admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent) }
    ]
  },

  { path: '**', redirectTo: 'home' }
];