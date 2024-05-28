import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './product/products/products.component';
import { CustomersComponent } from './Users/customers/customers.component';
import { OrdersComponent } from './order/orders/orders.component';
import { CategoryComponent } from './Categories/category/category.component';
import { SubcategoryComponent } from './Categories/subcategory/subcategory.component';
import { DashHomeComponent } from './dash-home/dash-home.component';
import { LoginComponent } from './auth/login/login.component';
import { DetailOrderComponent } from './order/DeatilOrder/detail-order/detail-order.component';
// import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {path:'', redirectTo:'/login',pathMatch:'full'},
    {path:'login', component:LoginComponent},
    //{ path: 'dashhome', component: DashboardComponent },
   { path: 'dash-home', component:  DashHomeComponent},
    { path: 'products', component: ProductsComponent },
    { path: 'Customers', component: CustomersComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'subcategory', component: SubcategoryComponent },
    { path: 'Orders', component: OrdersComponent },
    { path: 'Order_detail/:orderId', component: DetailOrderComponent }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
