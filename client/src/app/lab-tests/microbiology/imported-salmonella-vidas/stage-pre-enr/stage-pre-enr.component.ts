import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {merge, Subscription} from 'rxjs';

import {LabResource} from '../../../../../generated/dto';
import {PreEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {makeSampleTestUnits, SampleTestUnits, SamplingMethod} from '../../sampling-methods';
import {ResourceControlAssignments} from '../../../resource-assignments';
import {ResourceCodesDialogComponent} from '../../../../common-components/resource-codes-dialog/resource-codes-dialog.component';
import {MatDialog} from '@angular/material';
import {ResourceCodesDialogResult} from '../../../../common-components/resource-codes-dialog/resource-codes-dialog-result';
import {AlertMessageService} from '../../../../shared/services/alerts';


@Component({
  selector: 'app-stage-pre-enr',
  templateUrl: './stage-pre-enr.component.html',
  styleUrls: ['./stage-pre-enr.component.scss']
})
export class StagePreEnrComponent implements OnChanges {

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
         new Map().set('blenderJarId', ['JAR']).set('bagId', ['BAG']).set('mediumBatchId', ['RV', 'TT', 'LAC'])
      );

      this.subscribeToSampleTestUnitChanges();
   }

   private subscribeToSampleTestUnitChanges()
   {
      if (this.sampleTestUnitsChangeSubcription)
         this.sampleTestUnitsChangeSubcription.unsubscribe();

      const samplingMethodformGroup = this.form.get('samplingMethod');
      const numSubsCtrl = samplingMethodformGroup.get('numberOfSubs');
      const numCompsCtrl = samplingMethodformGroup.get('numberOfComposites');

      this.sampleTestUnitsChangeSubcription =
         merge(numSubsCtrl.valueChanges, numCompsCtrl.valueChanges)
            .subscribe(() => {
               this.onSampleTestUnitsFieldChanged();
            });
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

   applyAssignedResource(resourceCode: string, controlName: string)
   {
      const ctrl = this.form.get(controlName);
      if (ctrl)
      {
         ctrl.setValue(resourceCode);
         this.resourceAssignments.removeAllAssignedResourceCodesForControl(controlName);
      }
   }

   removeAssignedResource(resourceCode: string, controlName: string)
   {
      this.resourceAssignments.removeAssignedResourceCodeForControl(resourceCode, controlName);
   }

   promptApplyResources()
   {
      const dlg = this.dialogSvc.open(ResourceCodesDialogComponent, {width: 'calc(80%)'});

      dlg.afterClosed().subscribe((result: ResourceCodesDialogResult) => {
         if (!result) return;
         this.resourceAssignments.assignResourceCodes(result.resourceCodes);
         const unassigned = this.resourceAssignments.unassignedResourceCodes;
         if (unassigned.size > 0)
         {
            this.alertMsgSvc.alertWarning(
               `${unassigned.size} resource codes were not matched to any fields:`,
               Array.from(unassigned)
            );
         }
      });
   }

   removeAllForControl(controlName: string)
   {
      this.resourceAssignments.removeAllForControl(controlName);

   }
}

