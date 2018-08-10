import {Component, HostListener, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-files-selector',
  templateUrl: './files-selector.component.html',
  styleUrls: ['./files-selector.component.scss']
})
export class FilesSelectorComponent {

   selectedFiles: File[] = [];

   dragAreaClass = 'dragarea';

   @Output()
   filesSelected = new EventEmitter<File[]>();

   @Output()
   helpRequested = new EventEmitter();

   constructor() { }

   addFiles(files: FileList)
   {
      this.selectedFiles.push(...Array.from(files));
      this.filesSelected.next(this.selectedFiles);
   }

   clearFiles()
   {
      this.selectedFiles = [];
      this.filesSelected.next(this.selectedFiles);
   }

   requestHelp()
   {
      this.helpRequested.next();
   }

   @HostListener('dragover', ['$event']) onDragOver(event)
   {
      this.dragAreaClass = 'dragarea-dragover';
      event.preventDefault();
   }
   @HostListener('dragend', ['$event']) onDragEnd(event)
   {
      this.dragAreaClass = 'dragarea';
      event.preventDefault();
   }
   @HostListener('dragleave', ['$event']) onDragLeave(event)
   {
      this.dragAreaClass = 'dragarea';
      event.preventDefault();
   }
   @HostListener('drop', ['$event']) onDrop(event)
   {
      this.dragAreaClass = 'dragarea';
      this.addFiles(event.dataTransfer.files);
      event.preventDefault();
      event.stopPropagation();
   }
}
