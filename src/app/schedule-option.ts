import {ScheduleType} from './schedule-type.enum';

export class ScheduleOption {

  constructor(public id: ScheduleType,
              public label: string) {
  }
}
