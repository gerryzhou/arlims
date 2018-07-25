import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-pre-enr',
  templateUrl: './stage-pre-enr.component.html',
  styleUrls: ['./stage-pre-enr.component.scss']
})
export class StagePreEnrComponent implements OnInit {

   @Input()
   form: FormGroup;

   // TODO: Fetch resource identifiers by type from the lab group (should be added to resolver-supplied data), for balances and incubators select lists.
   constructor() { }

   ngOnInit() {
   }

}
