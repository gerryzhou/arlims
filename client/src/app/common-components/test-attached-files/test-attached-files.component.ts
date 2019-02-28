import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {FilesSelectorComponent} from '../files-selector/files-selector.component';
import {TestAttachedFiles} from '../../routing/test-attached-files.resolver';
import {AlertMessageService, ApiUrlsService, TestsService, UserContextService} from '../../shared/services';
import {TestAttachedFileMetadata, SampleOpTest} from '../../../generated/dto';
import {AttachedFileMetadataDialogComponent} from '../attached-file-metadata-dialog/attached-file-metadata-dialog.component';
import {AttachedFileMetadataDialogData} from '../attached-file-metadata-dialog/attached-file-metadata-dialog-data';

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

   @Output()
   attachedFilesChange = new EventEmitter<TestAttachedFileMetadata[]>();

   readonly sampleOpTest: SampleOpTest | null;

   // table of currently attached files
   readonly attachedFilesTableDataSource: MatTableDataSource<TestAttachedFileMetadata>;
   readonly attachedFilesDisplayColumns = ['edit', 'name', 'label', 'ordering', 'uploaded', 'size', 'delete'];
   @ViewChild('attachedFilesPaginator') readonly attachedFilesPaginator: MatPaginator;

   @ViewChild('filesSelector') readonly filesSelector: FilesSelectorComponent;

   readonly newAttachmentsForm = new FormGroup({
      label: new FormControl(''),
      ordering: new FormControl(''),
   });

   constructor
      (
         private httpClient: HttpClient,
         private activatedRoute: ActivatedRoute,
         private dialogSvc: MatDialog,
         private apiUrlsSvc: ApiUrlsService,
         private testsSvc: TestsService,
         private usrCtxSvc: UserContextService,
         private alertMsgSvc: AlertMessageService,
      )
   {
      const testAttachedFiles = <TestAttachedFiles>this.activatedRoute.snapshot.data['testAttachedFiles'];
      this.attachedFiles = testAttachedFiles ? testAttachedFiles.attachedFiles : [];
      this.sampleOpTest = testAttachedFiles ? testAttachedFiles.sampleOpTest : null;
      this.testId = testAttachedFiles ? testAttachedFiles.sampleOpTest.testMetadata.testId : null;
      this.attachedFilesTableDataSource = new MatTableDataSource<TestAttachedFileMetadata>(this.attachedFiles);
   }

   ngOnChanges()
   {
      if ( this.attachedFiles !== this.attachedFilesTableDataSource.data )
      {
         this.attachedFilesTableDataSource.data = this.attachedFiles;
      }
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
               this.attachedFiles = allAttachedFiles.filter(af => this.testDataPart == null || af.testDataPart === this.testDataPart);
               this.attachedFilesTableDataSource.data = this.attachedFiles;
               this.attachedFilesChange.emit(this.attachedFiles);
            },
            err => {
               this.alertMsgSvc.alertWarning('Could not refresh the attached files list due to error.');
               console.error('Error occurred while trying to refresh attached files: ', err);
            }
         );

      this.usrCtxSvc.refreshLabGroupContents();
   }

   submitNewAttachments()
   {
      const pendingFiles = this.filesSelector.selectedFiles;

      if ( pendingFiles.length === 0 )
         return;

      this.testsSvc.attachFilesToTest(
         this.testId,
         pendingFiles,
         this.newAttachmentsForm.get('label').value,
         +this.newAttachmentsForm.get('ordering').value,
         this.testDataPart
      ).subscribe(
         () => { // ignoring CreatedTestAttachedFiles result
            this.filesSelector.clearFiles();
            this.newAttachmentsForm.reset();
            this.refreshAttachedFiles();
         },
         err => {
            console.error('Error occurred while trying to attach files to test: ', err);
            const msg = err.error && err.error.message || err.message;
            if ( msg )
               this.alertMsgSvc.alertWarning(`Error attaching files: ${err.error.message}`);
            else
               this.alertMsgSvc.alertWarning(`An error occurred while trying to attach files.`);
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

   promptUpdateFileMetadata(attachedFile: TestAttachedFileMetadata)
   {
      const dlg = this.dialogSvc.open(AttachedFileMetadataDialogComponent, {
         width: 'calc(75%)',
         data: {
            attachedFileId: attachedFile.attachedFileId,
            testId: attachedFile.testId,
            testDataPart: attachedFile.testDataPart,
            fileName: attachedFile.fileName,
            label: attachedFile.label,
            ordering: attachedFile.ordering,
         }
      });

      dlg.afterClosed().subscribe((fmd: AttachedFileMetadataDialogData) => {
         if (fmd)
         {
            this.testsSvc.updateTestAttachedFileMetadata(
               fmd.attachedFileId,
               fmd.testId,
               fmd.label,
               fmd.ordering,
               fmd.testDataPart,
               fmd.fileName
            ).subscribe(
               () => { this.refreshAttachedFiles(); },
               err => {
                  console.error('Error occurred while trying to updated attached file metadata: ', err);
                  const msg = err.error && err.error.message || err.message;
                  if ( msg )
                     this.alertMsgSvc.alertWarning(`Error updating attached file properties: ${err.error.message}`);
                  else
                     this.alertMsgSvc.alertWarning(`An error occurred while trying to update attached file properties.`);
               }
            );
         }
      });
   }

   removeAttachedFile(attachedFile: TestAttachedFileMetadata)
   {
      this.testsSvc.deleteTestAttachedFile(attachedFile.attachedFileId, attachedFile.testId).subscribe(
          () => {
             this.refreshAttachedFiles();
          },
          err => {
             console.error('Error trying to remove attached file: ', err);
             const msg = err.error && err.error.message || err.message;
             if ( msg )
                this.alertMsgSvc.alertWarning(`Error removing attached file: ${err.error.message}`);
             else
                this.alertMsgSvc.alertWarning(`An error occurred while trying to remove the attached file.`);
          }
      );
   }

}


