import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {merge, Subscription} from 'rxjs';

import {LabResource} from '../../../../../generated/dto';
import {PreEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {SampleTestUnits, SamplingMethod, TestUnitsType} from '../../sampling-methods';
import {ResourceControlAssignments} from '../../../resource-assignments';
import {MatDialog} from '@angular/material';
import {AlertMessageService} from '../../../../shared/services/alerts';


@Component({
   selector: 'app-stage-pre-enr',
   templateUrl: './stage-pre-enr.component.html',
   styleUrls: ['./stage-pre-enr.component.scss'],
})
export class StagePreEnrComponent implements OnChanges, OnDestroy {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   conflicts: PreEnrData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   balances: LabResource[];

   @Input()
   incubators: LabResource[];

   @Input()
   samplingMethodChoices: SamplingMethod[];

   sampleMethodChoicesByTestUnitType = { subsMethods: <SamplingMethod[]>[], compsMethods: <SamplingMethod[]>[] };

   @Input()
   showUnsetAffordances = false;

   @Output()
   sampleTestUnitsChange = new EventEmitter<SampleTestUnits>();

   // These allow the user to control how lab resources are entered, either via select field (when true) or else by free-form text input.
   selectBalance = true;
   selectIncubator = true;
   allowTogglingSelects = false; // Get this from test config if this option is useful.

   sampleTestUnitsChangeSubcription: Subscription;

   resourceAssignments: ResourceControlAssignments;

   testUnitsTypeDescr = 'subs/comps?';

   constructor(private dialogSvc: MatDialog, private alertMsgSvc: AlertMessageService) {}

   ngOnChanges()
   {
      this.resourceAssignments = new ResourceControlAssignments(
         this.form,
         new Map()
            .set('blenderJarId', ['JAR'])
            .set('bagId', ['BAG'])
            .set('mediumBatchId', ['RV', 'TT', 'LAC'])
      );

      this.sampleMethodChoicesByTestUnitType = {
         compsMethods: this.samplingMethodChoices.filter(m => m.testUnitsType === 'composite'),
         subsMethods:  this.samplingMethodChoices.filter(m => !(m.testUnitsType === 'composite')),
      };

      this.subscribeToSampleTestUnitChanges();
      this.onSampleTestUnitsFieldChanged();

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   private subscribeToSampleTestUnitChanges()
   {
      const samplingMethodFormGroup = this.form.get('samplingMethod');
      if ( !samplingMethodFormGroup ) return;

      const testUnitsTypeCtrl = samplingMethodFormGroup.get('testUnitsType');
      const testUnitsCountCtrl = samplingMethodFormGroup.get('testUnitsCount');

      if (this.sampleTestUnitsChangeSubcription)
         this.sampleTestUnitsChangeSubcription.unsubscribe();

      this.sampleTestUnitsChangeSubcription =
         merge(testUnitsCountCtrl.valueChanges, testUnitsTypeCtrl.valueChanges)
         .subscribe(() => { this.onSampleTestUnitsFieldChanged(); });
   }

   onToggleSamplingMethodManualEntry()
   {
      const samplingMethodFormGroup = this.form.get('samplingMethod');
      if (!samplingMethodFormGroup) return;

      const userModifiable = samplingMethodFormGroup.get('userModifiable');
      if ( userModifiable != null ) userModifiable.setValue(!userModifiable.value);
   }

   onSamplingMethodClicked(samplingMethod: SamplingMethod)
   {
      const samplingMethodFormGroup = this.form.get('samplingMethod');
      if (!samplingMethodFormGroup) return;

      samplingMethodFormGroup.get('testUnitsType').setValue(samplingMethod.testUnitsType);
      samplingMethodFormGroup.get('testUnitsCount').setValue(samplingMethod.testUnitsCount);

      const numSubsPerCompCtl = samplingMethodFormGroup.get('numberOfSubsPerComposite');
      numSubsPerCompCtl.setValue(samplingMethod.numberOfSubsPerComposite);

      const extractedGramsPerSub = samplingMethodFormGroup.get('extractedGramsPerSub');
      extractedGramsPerSub.setValue(samplingMethod.extractedGramsPerSub);

      const userModifiable = samplingMethodFormGroup.get('userModifiable');
      if (userModifiable) userModifiable.setValue(samplingMethod.userModifiable);

      this.setSamplingMethodFieldEnablements(samplingMethod.testUnitsType);
   }

   onManualEntrySamplingMethodSelected(testUnitsType: TestUnitsType | null)
   {
      const samplingMethodFormGroup = this.form.get('samplingMethod');
      if (!samplingMethodFormGroup) return;

      samplingMethodFormGroup.get('testUnitsType').setValue(testUnitsType);

      const userModifiable = samplingMethodFormGroup.get('userModifiable');
      if (userModifiable) userModifiable.setValue(true);

      this.setSamplingMethodFieldEnablements(testUnitsType);
   }

   onSampleTestUnitsFieldChanged()
   {
      const samplingMethodFormGroup = this.form.get('samplingMethod');
      if ( !samplingMethodFormGroup ) return;

      const testUnitsType = samplingMethodFormGroup.get('testUnitsType').value;
      const testUnitsCount = (+samplingMethodFormGroup.get('testUnitsCount').value) || null;

      this.testUnitsTypeDescr = testUnitsType == null ? 'subs/comps?' :
            testUnitsType === 'subsample' ? 'subs'
            : 'composites';

      this.sampleTestUnitsChange.emit({testUnitsType, testUnitsCount});
   }

   private setSamplingMethodFieldEnablements(testUnitsType: TestUnitsType | null)
   {
      const numSubsPerCompCtl = this.form.get(['samplingMethod', 'numberOfSubsPerComposite']);

      switch ( testUnitsType )
      {
         case 'subsample':
            numSubsPerCompCtl.disable();
            break;
         default:
            numSubsPerCompCtl.enable();
            break;
      }
   }

   toggleSelectBalance()
   {
      this.selectBalance = !this.selectBalance;
   }

   toggleSelectIncubator()
   {
      this.selectIncubator = !this.selectIncubator;
   }

   promptApplyResources()
   {
      this.resourceAssignments.promptAssignResources(this.dialogSvc, this.alertMsgSvc);
   }

   ngOnDestroy()
   {
      if (this.sampleTestUnitsChangeSubcription)
         this.sampleTestUnitsChangeSubcription.unsubscribe();
   }
}

