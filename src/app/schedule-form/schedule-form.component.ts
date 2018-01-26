import { Component, OnInit } from '@angular/core';
import {ScheduleOption} from '../schedule-option';
import {ScheduleType} from '../schedule-type.enum';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  scheduleChoices: ScheduleOption[];

  constructor() { }

  ngOnInit() {
    this.scheduleChoices = [
      new ScheduleOption(ScheduleType.StartEnd, 'Choose start and end dates.'),
      new ScheduleOption(ScheduleType.StartCount, 'Choose start date and chapters per day.'),
      new ScheduleOption(ScheduleType.EndCount, 'Choose end date and chapters per day.')
    ];
  }

}
