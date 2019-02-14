import {Component, HostListener, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSelectionList} from '@angular/material';

@Component({
   selector: 'app-items-selection-dialog',
   templateUrl: './items-selection-dialog.component.html',
   styleUrls: ['./items-selection-dialog.component.scss']
})
export class ItemsSelectionDialogComponent {

   // dialog init data
   title: string;
   message: string;
   choiceItems: any[];
   itemText: (any) => string;
   minSelectionCount: number;
   maxSelectionCount: number;

   @ViewChild('selectionList')
   selectionList: MatSelectionList;

   constructor
   (
      public dialogRef: MatDialogRef<ItemsSelectionDialogComponent, any[]>,
      @Inject(MAT_DIALOG_DATA) public data: any
   )
   {
      this.title = data.title;
      this.message = data.message;
      this.choiceItems = data.choiceItems;
      this.itemText = data.itemText;
      this.minSelectionCount = data.minSelectionCount;
      this.maxSelectionCount = data.maxSelectionCount;
   }

   valid(): boolean
   {
      const numSelected = this.selectionList.selectedOptions.selected.length;

      return (
         numSelected >= this.minSelectionCount &&
         numSelected <= this.maxSelectionCount
      );
   }

   selectedItems(): any[]
   {
      return this.selectionList.selectedOptions.selected.map(sel => sel.value);
   }

   @HostListener('window:keydown.ENTER')
   acceptAndClose()
   {
      if ( this.valid() )
         this.dialogRef.close(this.selectedItems());
   }
}
