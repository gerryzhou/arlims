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
         compsMethods: this.samplingMethodChoices.filter(m => m.numberOfComposites > 0),
         subsMethods:  this.samplingMethodChoices.filter(m => !(m.numberOfComposites > 0)),
      };

      this.subscribeToSampleTestUnitChanges();
   }

   private subscribeToSampleTestUnitChanges()
   {
      const samplingMethodformGroup = this.form.get('samplingMethod');
      const numSubsCtrl = samplingMethodformGroup.get('numberOfSubs');
      const numCompsCtrl = samplingMethodformGroup.get('numberOfComposites');

      if (this.sampleTestUnitsChangeSubcription)
         this.sampleTestUnitsChangeSubcription.unsubscribe();

      this.sampleTestUnitsChangeSubcription =
         merge(numSubsCtrl.valueChanges, numCompsCtrl.valueChanges)
            .subscribe(() => {
               this.onSampleTestUnitsFieldChanged();
            });
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

      const numCompsCtrl = samplingMethodformGroup.get('numberOfComposites');
      if (numCompsCtrl) numCompsCtrl.setValue(samplingMethod.numberOfComposites);

      const numSubsPerCompCtrl = samplingMethodformGroup.get('numberOfSubsPerComposite');
      if (numSubsPerCompCtrl) numSubsPerCompCtrl.setValue(samplingMethod.numberOfSubsPerComposite);

      const massPerSubCtrl = samplingMethodformGroup.get('extractedGramsPerSub');
      if (massPerSubCtrl) massPerSubCtrl.setValue(samplingMethod.extractedGramsPerSub);

      const numSubsCtrl = samplingMethodformGroup.get('numberOfSubs');
      if (numSubsCtrl) numSubsCtrl.setValue(samplingMethod.numberOfSubs);

      const compMassCtrl = samplingMethodformGroup.get('compositeMassGrams');
      if (compMassCtrl) compMassCtrl.setValue(samplingMethod.compositeMassGrams);

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

