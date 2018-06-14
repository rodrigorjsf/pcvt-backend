import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BasicLayoutComponent} from '../shared/layouts/basic-layout/basic-layout.component';
import {CanDeactivateFormGuard} from '../guards/candeactivate-form.guard';
import {PlanResolver} from "../guards/plan.resolver";

import {AuthGuard} from "../guards/auth.guard";
import {ReadyToReviewComponent} from "./ready-to-review/ready-to-review.component";
import {CreateReviewComponent} from "./create-review/create-review.component";

const planRoutes: Routes = [
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: '', redirectTo: 'ready-to-review', pathMatch: 'prefix' },
      { path: 'ready-to-review', component: ReadyToReviewComponent, canActivate: [AuthGuard]},
      { path: 'ready-to-review/create/:id', component: CreateReviewComponent, canDeactivate: [CanDeactivateFormGuard], canActivate: [AuthGuard], resolve: { plan : PlanResolver}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(planRoutes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule {}
