import {NgModule} from "@angular/core";
import {PreventCopyPasteDirective} from "./directives/preventCopyPaste.directive";

@NgModule({
    imports: [],
    declarations: [
        PreventCopyPasteDirective,
    ],
    exports: [
        PreventCopyPasteDirective,
    ],
})

export class DirectivesModule {
}