import {Component, Input, OnChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {VidasData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {LabResource} from '../../../../../generated/dto';

@Component({
  selector: 'app-stage-vidas',
  templateUrl: './stage-vidas.component.html',
  styleUrls: ['./stage-vidas.component.scss']
})
export class StageVidasComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: VidasData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   vidasInstruments: LabResource[];

   @Input()
   showUnsetAffordances = false;

   // Number of sample test units and their type (subs or composites) is set in pre-enr stage.
   @Input()
   sampleTestUnitsCount: number | null = null;
   @Input()
   sampleTestUnitsType: string | null = null;

   excessSampleTestUnitControlsCount: number | null = 0;

   constructor() {}

   ngOnChanges()
   {
      if ( this.sampleTestUnitsCount )
      {
         const testUnitDetectionCtrls = this.form.get('testUnitDetections') as FormArray;

         const numCtrlsDelta = this.sampleTestUnitsCount - testUnitDetectionCtrls.length;

         if ( numCtrlsDelta >= 0 )
         {
            for (let d = 1; d <= numCtrlsDelta; ++d)
            {
               testUnitDetectionCtrls.push(new FormControl(null));
            }
         }
         else
         {
            this.removeSampleDetectionControls(Math.abs(numCtrlsDelta), true);
         }
      }
      else
      {
         this.updateExcessSampleTestUnitControlsCount();
      }
   }

   removeSampleDetectionControls(removeCount: number, stopOnControlWithValue: boolean = false)
   {
      const testUnitDetectionCtrls = this.form.get('testUnitDetections') as FormArray;

      for (let rn = 1; rn <= removeCount; ++rn)
      {
         const i = testUnitDetectionCtrls.length - 1;
         if ( testUnitDetectionCtrls.at(i).value === null || !stopOnControlWithValue) testUnitDetectionCtrls.removeAt(i);
         else break; // Stop because we hit a non-empty value, which will not be automatically removed.
      }

      this.updateExcessSampleTestUnitControlsCount();
   }

   removeTestUnitControlAtIndex(i: number)
   {
      const detectionCtrls = this.form.get('testUnitDetections') as FormArray;
      detectionCtrls.removeAt(i);

      this.updateExcessSampleTestUnitControlsCount();
   }

   getSampleTestUnitDetectionControls(): AbstractControl[]
   {
      const detectionCtrls = this.form.get('testUnitDetections') as FormArray;
      return detectionCtrls.controls;
   }

   private updateExcessSampleTestUnitControlsCount()
   {
      const testUnitDetectionCtrls = this.form.get('testUnitDetections') as FormArray;
      this.excessSampleTestUnitControlsCount =
         this.sampleTestUnitsCount != null ?
            testUnitDetectionCtrls.length - this.sampleTestUnitsCount
            : null;
   }

   mediumControlDetectionControl(): AbstractControl
   {
      return this.form.get('mediumControlDetection');
   }

   positiveControlDetectionControl(): AbstractControl
   {
      return this.form.get('positiveControlDetection');
   }

   spikeDetectionControl(): AbstractControl
   {
      return this.form.get('spikeDetection');
   }
}
