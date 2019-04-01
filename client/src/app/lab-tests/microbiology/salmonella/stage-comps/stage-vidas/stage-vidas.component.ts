import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

import {VidasData} from '../../test-data';
import {EmployeeTimestamp} from '../../../../../shared/client-models/employee-timestamp';
import {LabResource, TestAttachedFileMetadata} from '../../../../../../generated/dto';
import {arraysEqual} from '../../../../../shared/util/data-objects';
import {TestUnitsType} from '../../../sampling-methods';

@Component({
   selector: 'app-stage-vidas',
   templateUrl: './stage-vidas.component.html',
   styleUrls: ['./stage-vidas.component.scss'],
})
export class StageVidasComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   testId: number;

   @Input()
   attachedFilesByTestPart: Map<string|null, TestAttachedFileMetadata[]>;

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
   sampleTestUnitsType: TestUnitsType | null = null;

   @Input()
   spiking: boolean | null = null;

   @Output()
   positiveSampleTestUnitNumbersChange = new EventEmitter<number[]>();
   lastEmittedPositiveSampleTestUnitNumbers: number[] = null;

   resultsFiles: TestAttachedFileMetadata[];

   excessSampleTestUnitControlsCount: number | null = 0;

   mediumControlDetectionControl: AbstractControl;
   positiveControlDetectionControl: AbstractControl;
   spikeDetectionControl: AbstractControl;
   testUnitDetectionsControl: FormArray;

   readonly RESULTS_ATTACHED_FILES_KEY = 'vidas/results';

   constructor() {}

   ngOnChanges()
   {
      this.mediumControlDetectionControl = this.form.get('mediumControlDetection');
      this.positiveControlDetectionControl = this.form.get('positiveControlDetection');
      this.spikeDetectionControl = this.form.get('spikeDetection');
      this.testUnitDetectionsControl = this.form.get('testUnitDetections') as FormArray;

      this.resultsFiles = this.attachedFilesByTestPart.get(this.RESULTS_ATTACHED_FILES_KEY) || [];

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

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
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

      if ( !stopOnControlWithValue )
         this.testUnitDetectionsChanged();
   }

   removeTestUnitControlAtIndex(i: number)
   {
      const detectionCtrls = this.form.get('testUnitDetections') as FormArray;
      const wasPos = detectionCtrls.at(i).value === true;
      detectionCtrls.removeAt(i);

      this.updateExcessSampleTestUnitControlsCount();
      if ( wasPos )
         this.testUnitDetectionsChanged();
   }

   private updateExcessSampleTestUnitControlsCount()
   {
      const testUnitDetectionCtrls = this.form.get('testUnitDetections') as FormArray;
      this.excessSampleTestUnitControlsCount =
         this.sampleTestUnitsCount != null ?
            testUnitDetectionCtrls.length - this.sampleTestUnitsCount
            : null;
   }

   positiveTestUnitNumbers(): number[]
   {
      const positiveTestUnitNumbers: number[] = [];

      const detections = this.testUnitDetectionsControl.getRawValue();
      if ( detections )
      {
         detections.forEach((detection, ix) => {
            if (detection === true) positiveTestUnitNumbers.push(ix + 1);
         });
      }

      return positiveTestUnitNumbers;
   }

   testUnitDetectionsChanged()
   {
      const positives: number[] = this.positiveTestUnitNumbers();

      if ( this.lastEmittedPositiveSampleTestUnitNumbers == null ||
           !arraysEqual(this.lastEmittedPositiveSampleTestUnitNumbers, positives) )
      {
         this.positiveSampleTestUnitNumbersChange.emit(positives);
         this.lastEmittedPositiveSampleTestUnitNumbers = positives.slice();
      }
   }

   onAttachedFilesChanged(attachedFiles: TestAttachedFileMetadata[])
   {
      this.resultsFiles = attachedFiles;
   }
}

