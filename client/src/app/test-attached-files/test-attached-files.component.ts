import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreatedTestAttachedFiles, TestAttachedFileMetadata} from '../../generated/dto';
import {TestAttachedFiles} from '../routing/test-attached-files.resolver';
import {SampleInTest} from '../shared/models/sample-in-test';
import {ApiUrlsService, TestsService, UserContextService} from '../shared/services';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {FilesSelectorComponent} from '../common-components/files-selector/files-selector.component';


@Component({
  selector: 'app-test-attached-files',
  templateUrl: './test-attached-files.component.html',
  styleUrls: ['./test-attached-files.component.scss']
})
export class TestAttachedFilesComponent implements AfterViewInit {

   @Input()
   modificationsEnabled = true;

   readonly sampleInTest: SampleInTest;

   // table of currently attached files
   readonly attachedFilesTableDataSource: MatTableDataSource<TestAttachedFileMetadata>;
   readonly attachedFilesDisplayColumns = ['name', 'role', 'uploaded', 'size', 'delete'];
   @ViewChild('attachedFilesPaginator') readonly attachedFilesPaginator: MatPaginator;

   @ViewChild('filesSelector') readonly filesSelector: FilesSelectorComponent;

   readonly newAttachmentsForm = new FormGroup({
      role: new FormControl(''),
   });

   constructor
      (
         private activatedRoute: ActivatedRoute,
         public apiUrls: ApiUrlsService,
         private testsSvc: TestsService,
         private usrCtxSvc: UserContextService
      )
   {
      const testAttachedFiles = <TestAttachedFiles>this.activatedRoute.snapshot.data['testAttachedFiles'];
      this.sampleInTest = testAttachedFiles.sampleInTest;
      this.attachedFilesTableDataSource = new MatTableDataSource<TestAttachedFileMetadata>(testAttachedFiles.attachedFiles);
   }

   ngAfterViewInit()
   {
      this.attachedFilesTableDataSource.paginator = this.attachedFilesPaginator;
   }

   refreshAttachedFiles()
   {
      this.testsSvc.getTestAttachedFilesMetadatas(this.sampleInTest.testMetadata.testId)
         .subscribe(
            attachedFiles => {
               this.attachedFilesTableDataSource.data = attachedFiles;
            },
            err => {
                // TODO: Add alert message for error.
            }
         );
      this.usrCtxSvc.loadLabGroupContents();
   }

   submitNewAttachments()
   {
      const pendingFiles = this.filesSelector.selectedFiles;

      if (pendingFiles.length === 0) return;

      this.testsSvc.attachFilesToTest(
         this.sampleInTest.testMetadata.testId,
         pendingFiles,
         this.newAttachmentsForm.get('role').value
      ).subscribe(
         (res: CreatedTestAttachedFiles) => {
            this.filesSelector.clearFiles();
            this.newAttachmentsForm.reset();
            this.refreshAttachedFiles();
         },
         err => {
            // TODO: Add alert message for error.
            // if ( err.error && err.error.message )
            //    this.errors.push(err.error.message) // service message
            // else if ( err.message )                // http level message
            //    this.errors.push(err.message);
            // else
            //    this.errors.push("An unknown error occurred.");
         }
      );
   }

   removeAttachedFile(attachedFile: TestAttachedFileMetadata)
   {
      this.testsSvc.deleteTestAttachedFile(attachedFile.attachedFileId, attachedFile.testId).subscribe(
          () => {
             this.refreshAttachedFiles();
          },
          err => {
             // TODO: Add alert message for error.
             // if ( err.error && err.error.message )
             //    this.errors.push(err.error.message) // service message
             // else if ( err.message )                // http level message
             //    this.errors.push(err.message);
             // else
             //    this.errors.push("An unknown error occurred.");
          }
      );
   }
}


