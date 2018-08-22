import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewTitleService {

   private subject = new BehaviorSubject<string | null>(null);

   constructor() { }

   titles(): Observable<string | null> {
      return this.subject.asObservable();
   }

   setTitle(title: string | null)
   {
      this.subject.next(title);
   }
}
