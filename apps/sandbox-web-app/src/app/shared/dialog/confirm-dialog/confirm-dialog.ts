import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  protected dialogRef = inject(MatDialogRef<ConfirmDialog>);
  protected data = inject<{message: string}>(MAT_DIALOG_DATA);

  onCloseDialog(value: boolean) {
    this.dialogRef.close(value);
  }
}
