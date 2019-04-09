import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {merge, Subscription} from 'rxjs';

import {LabResource} from '../../../../../../generated/dto';
import {SampleTestUnits, SamplingMethod, TestUnitsType} from '../../../sampling-methods';
import {ResourceControlAssignmentsManager} from '../../../../resource-control-assignments-manager';
import {MatDialog} from '@angular/material';
import {AlertMessageService} from '../../../../../shared/services/alerts';


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
   balances: LabResource[] | undefined;

   @Input()
   incubators: LabResource[] | undefined;

   @Input()
   samplingMethodChoices: SamplingMethod[];

   sampleMethodChoicesByTestUnitType = { subsMethods: <SamplingMethod[]>[], compsMethods: <SamplingMethod[]>[] };

   @Input()
   showUnsetAffordances = false;

   @Input()
   allowFreeformEntryForSelectFields = false;

   @Output()
   sampleTestUnitsChange = new EventEmitter<SampleTestUnits>();

   // These allow the user to control how lab resources are entered, either via select field (when true) or else by free-form text input.
   selectBalance = true;
   selectIncubator = true;
   selectMediumType = true;

   sampleTestUnitsChangeSubcription: Subscription;

   resourceAssignments: ResourceControlAssignmentsManager;

   testUnitsTypeDescr = 'subs/comps?';

   constructor(private dialogSvc: MatDialog, private alertMsgSvc: AlertMessageService) {}

   ngOnChanges()
   {
      this.resourceAssignments = new ResourceControlAssignmentsManager(
         this.form,
         new Map()
            .set('balanceId', ['BAL'])
            .set('incubatorId', ['INC'])
            .set('blenderJarId', ['JAR'])
            .set('bagId', ['BAG'])
            .set('mediumBatchId', ['RV', 'TT', 'LAC']),
         ',',
      );
      this.resourceAssignments.setMultipleValuesAssignable('balanceId', !this.selectBalance);
      this.resourceAssignments.setMultipleValuesAssignable('incubatorId', !this.selectIncubator);

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
      this.resourceAssignments.setMultipleValuesAssignable('balanceId', !this.selectBalance);
   }

   toggleSelectIncubator()
   {
      this.selectIncubator = !this.selectIncubator;
      this.resourceAssignments.setMultipleValuesAssignable('incubatorId', !this.selectIncubator);
   }

   toggleSelectMediumType()
   {
      this.selectMediumType = !this.selectMediumType;
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

