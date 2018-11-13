import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'plusMinus'
})
export class PlusMinusPipe implements PipeTransform {

   transform(value: any, args?: any): any {
      return value == null ? null : value ? '+' : '\u2212';
  }

}
