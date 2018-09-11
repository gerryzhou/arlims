import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

/// This service fetches data blobs from the server via Angular's HttpClient
/// and prompts the user to save the resulting data to file. This allows
/// authentication to be passed to the server via http header(s) (if the
/// HttpClient is so configured such as via an interceptor), which direct
/// hyperlinks would not support.
@Injectable({providedIn: 'root'})
export class FileDownloadsService {

   constructor(private httpClient: HttpClient) {}

   promptDownloadFile(url: string, fileName: string | null): Observable<void>
   {
      return this.httpClient.get(url, {responseType: 'blob'}).pipe(
         map(blob => FileSaver.saveAs(blob, fileName, true))
      );
   }
}
