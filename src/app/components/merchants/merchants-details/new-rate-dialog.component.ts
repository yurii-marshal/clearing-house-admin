import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'new-rate-dialog',
    templateUrl: './new-rate-dialog.component.html',
    styleUrls: ['./new-rate-dialog.component.scss'],
})
export class NewRateDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<NewRateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
