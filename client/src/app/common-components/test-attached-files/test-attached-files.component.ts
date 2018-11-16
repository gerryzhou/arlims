import {AfterViewInit, Component, Input, OnChanges, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {FilesSelectorComponent} from '../files-selector/files-selector.component';
import {TestAttachedFiles} from '../../routing/test-attached-files.resolver';
import {SampleInTest} from '../../shared/models/sample-in-test';
import {ApiUrlsService, TestsService, UserContextService} from '../../shared/services';
import {CreatedTestAttachedFiles, TestAttachedFileMetadata} from '../../../generated/dto';

@Component({
  selector: 'app-test-attached-files',
  templateUrl: './test-attached-files.component.html',
  styleUrls: ['./test-attached-files.component.scss']
})
export class TestAttachedFilesComponent implements OnChanges, AfterViewInit {

   @Input()
   modificationsEnabled = true;

   @Input()
   testId: number = null;

   @Input()
   testDataPart = null;

   @Input()
   attachedFiles: TestAttachedFileMetadata[] = null;

   readonly sampleInTest: SampleInTest | null;

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
         private httpClient: HttpClient,
         private activatedRoute: ActivatedRoute,
         private apiUrlsSvc: ApiUrlsService,
         private testsSvc: TestsService,
         private usrCtxSvc: UserContextService
      )
   {
      const testAttachedFiles = <TestAttachedFiles>this.activatedRoute.snapshot.data['testAttachedFiles'];
      this.attachedFiles = testAttachedFiles ? testAttachedFiles.attachedFiles : [];
      this.sampleInTest = testAttachedFiles ? testAttachedFiles.sampleInTest : null;
      this.testId = testAttachedFiles ? testAttachedFiles.sampleInTest.testMetadata.testId : null;
      this.attachedFilesTableDataSource = new MatTableDataSource<TestAttachedFileMetadata>(this.attachedFiles);
   }

   ngOnChanges()
   {
      if ( this.attachedFiles !== this.attachedFilesTableDataSource.data )
      {
         this.attachedFilesTableDataSource.data = this.attachedFiles;
      }
      if ( this.testId == null )
         console.log("warning: testId is null in test attached files component's ngOnChanges()");
   }

   ngAfterViewInit()
   {
      this.attachedFilesTableDataSource.paginator = this.attachedFilesPaginator;
   }

   refreshAttachedFiles()
   {
      this.testsSvc.getTestAttachedFilesMetadatas(this.testId)
         .subscribe(
            allAttachedFiles => {
               const testPartAttachedFiles =
                  allAttachedFiles.filter(af => this.testDataPart == null || af.testDataPart === this.testDataPart);
               this.attachedFiles.length = 0;
               this.attachedFiles.push(...testPartAttachedFiles);
               this.attachedFilesTableDataSource.data = this.attachedFiles;
            },
            err => {
                // TODO: Add alert message for error.
            }
         );
      this.usrCtxSvc.refreshLabGroupContents();
   }

   submitNewAttachments()
   {
      const pendingFiles = this.filesSelector.selectedFiles;

      if (pendingFiles.length === 0) return;

      this.testsSvc.attachFilesToTest(
         this.testId,
         pendingFiles,
         this.newAttachmentsForm.get('role').value,
         this.testDataPart
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

   promptDownloadFile(attachedFile: TestAttachedFileMetadata)
   {
      const fileUrl = this.apiUrlsSvc.testAttachedFileUrl(attachedFile.attachedFileId, attachedFile.testId);
      this.httpClient.get(fileUrl, {responseType: 'blob'})
         .pipe(
            map(blob => FileSaver.saveAs(blob, attachedFile.fileName, true))
         )
         .subscribe();
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

