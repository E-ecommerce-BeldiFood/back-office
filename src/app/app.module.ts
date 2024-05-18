import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule} from "@angular/fire/compat/storage";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './product/products/products.component';
import { CustomersComponent } from './Users/customers/customers.component';
import { OrdersComponent } from './order/orders/orders.component';
import { CategoryComponent } from './Categories/category/category.component';
import { SubcategoryComponent } from './Categories/subcategory/subcategory.component';
import { NzIconModule } from 'ng-zorro-antd/icon'; 
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'; 
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { DashHomeComponent } from './dash-home/dash-home.component'
import { environment } from './environment/environment';
import { LoginComponent } from './auth/login/login.component';
import { TokenInterceptorService } from './auth/token-interceptor.service';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductsComponent,
    CustomersComponent,
    OrdersComponent,
    CategoryComponent,
    SubcategoryComponent,
    DashHomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzIconModule, 
    NzTableModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    NzPopconfirmModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorService, multi:true,
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
