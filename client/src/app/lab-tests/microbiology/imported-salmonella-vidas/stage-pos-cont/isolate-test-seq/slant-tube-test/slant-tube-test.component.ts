import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';

import {EditSlantTubeTestDialogComponent} from './edit-slant-tube-test-dialog/edit-slant-tube-test-dialog.component';
import {SlantTubeTest} from '../../../test-data';

@Component({
   selector: 'app-slant-tube-test',
   templateUrl: './slant-tube-test.component.html',
   styleUrls: ['./slant-tube-test.component.scss']
})
export class SlantTubeTestComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   tubeType: string; // uppercase form of tube type, e.g. 'TSI' or 'LIA'.

   @Input()
   isolateDescription: string;

   @Input()
   editingEnabled: boolean;

   constructor(private dialogSvc: MatDialog) { }

   ngOnChanges()
   {
   }

   promptEditSlantTubeTest(tubeType: string)
   {
      const origSlantTubeTest = this.form.value as SlantTubeTest;

      const dlg = this.dialogSvc.open(EditSlantTubeTestDialogComponent, {
         width: 'calc(65%)',
         data: {
            tubeLabel: tubeType,
            isolateDescription: this.isolateDescription,
            test: origSlantTubeTest,
         }
      });

      dlg.afterClosed().subscribe((editedSlantTubeTest: SlantTubeTest) => {
         console.log('dialog results: ', editedSlantTubeTest);
         if ( editedSlantTubeTest )
         {
            this.form.setValue(editedSlantTubeTest);
         }
      });
   }

}
