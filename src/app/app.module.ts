import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './login/login.page';
import { AccountPage } from './account/account.page';
import { PendingPage } from './pending/pending.page';
import { InboxPage } from './inbox/inbox.page';
import { FormsPage } from './forms/forms.page';
import { PurchasesPage } from './purchases/purchases.page';
import { ReportsPage } from './reports/reports.page';
import { QrscannerPage } from './qrscanner/qrscanner.page';
import { ZXingScannerModule } from './modules/zxing-scanner/zxing-scanner.module';
import { FormInputComponent } from './form-input/form-input.component';
import { PurchasesInputComponent } from './purchases-input/purchases-input.component';
import { HttpClientModule } from '@angular/common/http';
import { PopoverComponent } from './popover/popover.component';
import { ModalSelectComponent } from './modal-select/modal-select.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FieldforceService } from './api/fieldforce.service';
import { FilterProducts, FilterRetailer, FilterProductsUsertype } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPage,
    LoginPage,
    AccountPage,
    PendingPage,
    InboxPage,
    FormsPage,
    PurchasesPage,
    ReportsPage,
    QrscannerPage,
    FormInputComponent,
    PurchasesInputComponent,
    PopoverComponent,
    ModalSelectComponent,
    CheckoutComponent,
    FilterProducts,
    FilterRetailer,
    FilterProductsUsertype,
  ],
  entryComponents: [
    PopoverComponent,
    ModalSelectComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    ZXingScannerModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FieldforceService
    // QRScanner,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
