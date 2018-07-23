import { Pipe, PipeTransform } from '@angular/core';
import {parseISODateLocal} from '../shared/util/dates-and-times';

@Pipe({
  name: 'dayNumber'
})
export class DayNumberPipe implements PipeTransform {

   transform(value: any, args?: any): any {
      if ( !value ) {
        return null;
      }

      const millis_per_day = 1000 * 60 * 60 * 24;
      // Convert beginning of day for the date string interpreted in local timezone to UTC instant (js Date).
      const beginDate = parseISODateLocal(value);
      const now = new Date().getTime(); // now as UTC instant
      return Math.trunc((now - beginDate.getTime()) / millis_per_day) + 1;
  }

}
