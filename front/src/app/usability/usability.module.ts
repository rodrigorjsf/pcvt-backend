import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutsModule} from '../shared/layouts/layouts.module';
import {SharedModule} from '../shared/shared.module';

import {UsabilityComponent} from "./usability.component";
import {UsabilityRoutingModule} from "./usability.routing.module";

@NgModule({
  imports: [
    UsabilityRoutingModule,
    CommonModule,
    SharedModule,
    LayoutsModule
  ],
  declarations: [
    UsabilityComponent
  ],
  providers: []
})
export class UsabilityModule { }
