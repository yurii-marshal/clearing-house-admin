import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridRoutingModule } from './grid-routing.module';
import { GridComponent } from './grid.component';
import { PageHeaderModule } from '../../common-components/page-header/page-header.module';

@NgModule({
    imports: [CommonModule, GridRoutingModule, PageHeaderModule],
    declarations: [GridComponent]
})
export class GridModule {}
