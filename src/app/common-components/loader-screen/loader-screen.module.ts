import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoaderScreenComponent } from './loader-screen.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [LoaderScreenComponent],
    exports: [LoaderScreenComponent]
})
export class LoaderScreenModule {}
