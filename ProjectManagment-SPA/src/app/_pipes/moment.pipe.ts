import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'
@Pipe({
  name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {

  transform(value: moment.Moment, ...args: any[]): any {
    let [format] = args;
    if(value == null) return ''
    return moment(value).locale("he").format(format)
  }
}
