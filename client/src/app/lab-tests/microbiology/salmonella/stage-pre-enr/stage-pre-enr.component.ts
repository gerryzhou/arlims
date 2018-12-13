import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {merge, Subscription} from 'rxjs';

import {LabResource} from '../../../../../generated/dto';
import {PreEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {makeSampleTestUnits, SampleTestUnits, SamplingMethod} from '../../sampling-methods';
import {ResourceControlAssignments} from '../../../resource-assignments';
import {MatDialog} from '@angular/material';
import {AlertMessageService} from '../../../../shared/services/alerts';


@Component({
   selector: 'app-stage-pre-enr',
   templateUrl: './stage-pre-enr.component.html',
   styleUrls: ['./stage-pre-enr.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StagePreEnrComponent implements OnChanges, OnDestroy {

   @Input()
   form: FormGroup;

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
   allowTogglingSelects = true; // TODO: Retrieve from test configuration.

   sampleTestUnitsChangeSubcription: Subscription;

   resourceAssignments: ResourceControlAssignments;

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
   }

   private subscribeToSampleTestUnitChanges()
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      const testUnitsCountCtrl = samplingMethodformGroup.get('testUnitsCount');
      const testUnitsTypeCtrl = samplingMethodformGroup.get('testUnitsType');

      if (this.sampleTestUnitsChangeSubcription)
         this.sampleTestUnitsChangeSubcription.unsubscribe();

      this.sampleTestUnitsChangeSubcription =
         merge(testUnitsCountCtrl.valueChanges, testUnitsTypeCtrl.valueChanges)
         .subscribe(() => { this.onSampleTestUnitsFieldChanged(); });
   }

   onManualEntrySamplingMethodSelected()
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      if (!samplingMethodformGroup) return;

      const userModifiable = samplingMethodformGroup.get('userModifiable');
      if (userModifiable) userModifiable.setValue(true);
   }

   onToggleSamplingMethodManualEntry()
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      if (!samplingMethodformGroup) return;

      const userModifiable = samplingMethodformGroup.get('userModifiable');
      if ( userModifiable != null ) userModifiable.setValue(!userModifiable.value);
   }

   onSamplingMethodClicked(samplingMethod: SamplingMethod)
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      if (!samplingMethodformGroup) return;

      samplingMethodformGroup.get('testUnitsType').setValue(samplingMethod.testUnitsType);
      samplingMethodformGroup.get('testUnitsCount').setValue(samplingMethod.testUnitsCount);

      const numSubsPerCompCtl = samplingMethodformGroup.get('numberOfSubsPerComposite');
      numSubsPerCompCtl.setValue(samplingMethod.numberOfSubsPerComposite);

      const extractedGramsPerSub = samplingMethodformGroup.get('extractedGramsPerSub');
      extractedGramsPerSub.setValue(samplingMethod.extractedGramsPerSub);

      switch ( samplingMethod.testUnitsType )
      {
         case 'composite':
            numSubsPerCompCtl.enable();
            extractedGramsPerSub.enable();
            break;
         case 'subsample':
            numSubsPerCompCtl.disable();
            extractedGramsPerSub.disable();
      }

      const userModifiable = samplingMethodformGroup.get('userModifiable');
      if (userModifiable) userModifiable.setValue(samplingMethod.userModifiable);
   }

   onSampleTestUnitsFieldChanged()
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      const numSubs = +samplingMethodformGroup.get('numberOfSubs').value;
      const numComps = +samplingMethodformGroup.get('numberOfComposites').value;

      this.sampleTestUnitsChange.emit(makeSampleTestUnits(numSubs, numComps));
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

