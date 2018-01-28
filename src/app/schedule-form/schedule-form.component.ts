import {Component, OnInit} from '@angular/core';
import {ScheduleOption} from '../schedule-option';
import {ScheduleType} from '../schedule-type.enum';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  st = ScheduleType;
  selectedSchedule: ScheduleType;
  scheduleChoices: ScheduleOption[];
  currentScheduleChoice: ScheduleOption;
  scriptureChoices: any[];

  constructor() {
  }

  ngOnInit() {
    this.scheduleChoices = [
      new ScheduleOption(ScheduleType.StartEnd, 'Choose start and end dates.'),
      new ScheduleOption(ScheduleType.StartCount, 'Choose start date and chapters per day.'),
      new ScheduleOption(ScheduleType.EndCount, 'Choose end date and chapters per day.')
    ];
    this.scriptureChoices = [
      {id: 'OT', label: 'Old Testament'},
      {id: 'NT', label: 'New Testament'},
      {id: 'BM', label: 'Book of Mormon'},
      {id: 'DC', label: 'Doctrine and Covenants'},
      {id: 'PP', label: 'Pearl of Great Price'},
    ];
    this.selectedSchedule = ScheduleType.StartEnd;
  }

  calculate() {
    console.log('calculate called');
  }

  scheduleChoiceChanged(index: number) {
    this.selectedSchedule = this.scheduleChoices[index].id;
    this.initInputs();
  }

  private initInputs() {
    switch (this.selectedSchedule) {
      case ScheduleType.StartEnd:
        break;
      case ScheduleType.EndCount:
        break;
      case ScheduleType.StartCount:
        break;
    }
  }

}
