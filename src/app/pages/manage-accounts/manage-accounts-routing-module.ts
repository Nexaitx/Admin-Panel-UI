import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAccounts } from './manage-accounts';

const routes: Routes = [
  { path: '', redirectTo: 'manage-accounts', pathMatch: 'full' },
  { path: 'manage-accounts', component: ManageAccounts }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule]
})
export class ManageAccountsRoutingModule { }
