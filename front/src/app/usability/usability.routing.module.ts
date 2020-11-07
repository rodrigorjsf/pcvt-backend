import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BasicLayoutComponent} from "../shared/layouts/basic-layout/basic-layout.component";
import {UsabilityComponent} from "./usability.component";

const dashboardRoutes: Routes = [
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: '', component: UsabilityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class UsabilityRoutingModule {}
