import { Component, OnChanges } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestAttachedFileMetadata} from '../../generated/dto';
import {TestAttachedFiles} from '../routing/test-attached-files.resolver';
import {SampleInTest} from '../shared/models/sample-in-test';

@Component({
  selector: 'app-test-attached-files',
  templateUrl: './test-attached-files.component.html',
  styleUrls: ['./test-attached-files.component.scss']
})
export class TestAttachedFilesComponent implements OnChanges {

   sampleInTest: SampleInTest;
   attachedFiles: TestAttachedFileMetadata[];

   constructor
      (
         private activatedRoute: ActivatedRoute,
      )
   {
      const testAttachedFiles = <TestAttachedFiles>this.activatedRoute.snapshot.data['testAttachedFiles'];
      this.attachedFiles = testAttachedFiles.attachedFiles;
      this.sampleInTest = testAttachedFiles.sampleInTest;
   }

   ngOnChanges()
   {
   }
}
