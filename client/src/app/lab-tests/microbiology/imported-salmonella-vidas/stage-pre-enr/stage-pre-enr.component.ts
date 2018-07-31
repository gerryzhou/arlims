import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LabResource} from '../../../../../generated/dto';
import {PreEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {SamplingMethod} from '../../sampling-method';

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

   constructor() { }

   ngOnChanges()
   {
      console.log('sampling method choices: ', this.samplingMethodChoices);
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
}
