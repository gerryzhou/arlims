import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {VidasData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {LabResource} from '../../../../../generated/dto';

@Component({
   selector: 'app-stage-vidas',
   templateUrl: './stage-vidas.component.html',
   styleUrls: ['./stage-vidas.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
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

   @Input()
   spiking: boolean | null = null;

   excessSampleTestUnitControlsCount: number | null = 0;

   mediumControlDetectionControl: AbstractControl;
   positiveControlDetectionControl: AbstractControl;
   spikeDetectionControl: AbstractControl;
   testUnitDetectionsControl: FormArray;

   constructor() {}

   ngOnChanges()
   {
      this.mediumControlDetectionControl = this.form.get('mediumControlDetection');
      this.positiveControlDetectionControl = this.form.get('positiveControlDetection');
      this.spikeDetectionControl = this.form.get('spikeDetection');
      this.testUnitDetectionsControl = this.form.get('testUnitDetections') as FormArray;

      if ( this.sampleTestUnitsCount )
      {
         const numCtrlsDelta = this.sampleTestUnitsCount - this.testUnitDetectionsControl.length;

         if ( numCtrlsDelta >= 0 )
            this.addSampleDetectionControls(numCtrlsDelta);
         else
            this.removeSampleDetectionControls(Math.abs(numCtrlsDelta), true);
      }
      else
         this.updateExcessSampleTestUnitControlsCount();

      // Enable or disable spike plate count control based on whether spiking is being done.
      const spikeDetectionCtrl = this.form.get('spikeDetection');
      if ( this.spiking ) spikeDetectionCtrl.enable();
      else spikeDetectionCtrl.disable();
   }

   private addSampleDetectionControls(numControls: number)
   {
      for (let d = 1; d <= numControls; ++d)
      {
         this.testUnitDetectionsControl.push(new FormControl(null));
      }

      this.updateExcessSampleTestUnitControlsCount();
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

   private updateExcessSampleTestUnitControlsCount()
   {
      const testUnitDetectionCtrls = this.form.get('testUnitDetections') as FormArray;
      this.excessSampleTestUnitControlsCount =
         this.sampleTestUnitsCount != null ?
            testUnitDetectionCtrls.length - this.sampleTestUnitsCount
            : null;
   }

}
