import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './login/login.page';
import { ReportsPage } from './reports/reports.page';
import { PurchasesPage } from './purchases/purchases.page';
import { AccountPage } from './account/account.page';
import { PendingPage } from './pending/pending.page';
import { InboxPage } from './inbox/inbox.page';
import { FormsPage } from './forms/forms.page';
import { QrscannerPage } from './qrscanner/qrscanner.page';
import { FormInputComponent } from './form-input/form-input.component';
import { PurchasesInputComponent } from './purchases-input/purchases-input.component';
import { PopoverComponent } from './popover/popover.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'account',
    component: AccountPage
  },
  {
    path: 'pending',
    component: PendingPage
  },
  {
    path: 'inbox',
    component: InboxPage
  },
  {
    path: 'forms',
    component: FormsPage
  },
  {
    path: 'purchases',
    component: PurchasesPage
  },
  {
    path: 'reports',
    component: ReportsPage
  },
  {
    path: 'qrscanner',
    component: QrscannerPage
  },
  {
    path: 'forminput',
    component: FormInputComponent
  },
  {
    path: 'purchasesinput',
    component: PurchasesInputComponent
  },
  {
    path: 'popover',
    component: PopoverComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
