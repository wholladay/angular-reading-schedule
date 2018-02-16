import {Component, OnInit} from '@angular/core';
import {ScheduleOption} from '../schedule-option';
import {ScheduleType} from '../schedule-type.enum';
import {VolumeId} from '../volume-id.enum';
import {CalendarService} from '../calendar.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  st = ScheduleType;
  selectedSchedule: ScheduleType;
  selectedScripture: VolumeId;
  scheduleChoices: ScheduleOption[];
  scriptureChoices: any[];
  currentScripture: number;
  startDate: Date;
  endDate: Date;
  chapterCount: number;
  chaptersPerDay: number;

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit() {
    this.scheduleChoices = [
      new ScheduleOption(ScheduleType.StartEnd, 'Choose start and end dates.'),
      new ScheduleOption(ScheduleType.StartCount, 'Choose start date and chapters per day.'),
      new ScheduleOption(ScheduleType.EndCount, 'Choose end date and chapters per day.')
    ];
    this.scriptureChoices = [
      {id: VolumeId.OT, label: 'Old Testament'},
      {id: VolumeId.NT, label: 'New Testament'},
      {id: VolumeId.BOM, label: 'Book of Mormon'},
      {id: VolumeId.DC, label: 'Doctrine and Covenants'},
      {id: VolumeId.PGP, label: 'Pearl of Great Price'},
    ];
    this.selectedSchedule = ScheduleType.StartEnd;
    this.currentScripture = 2;
    this.selectedScripture = this.scriptureChoices[this.currentScripture].id;
  }

  calculate() {
    switch (this.selectedSchedule) {
      case ScheduleType.StartEnd:
        if (!this.startDate || !this.endDate) {
          console.log('You have to specify a start and end date.');
          return;
        }
        this.chaptersPerDay = this.calendarService.calculateChaptersPerDay(this.selectedScripture, this.startDate, this.endDate);
        break;
      case ScheduleType.EndCount:
        if (!this.endDate || !this.chaptersPerDay || this.chaptersPerDay < 1) {
          console.log('You must specify an end date and number of chapters per day.');
          return;
        }
        this.startDate = this.calendarService.calculateStartDate(this.selectedScripture, this.endDate, this.chaptersPerDay);
        break;
      case ScheduleType.StartCount:
        if (!this.startDate || !this.chaptersPerDay || this.chaptersPerDay < 1) {
          console.log('You must specify a start date and number of chapters per day.');
          return;
        }
        break;
    }
    this.calendarService.generateSchedule(this.selectedScripture, this.chaptersPerDay, this.startDate);
  }

  scheduleChoiceChanged(index: number) {
    this.selectedSchedule = this.scheduleChoices[index].id;
    switch (this.selectedSchedule) {
      case ScheduleType.StartCount:
        this.endDate = null;
        break;
      case ScheduleType.EndCount:
        this.startDate = null;
        break;
      case ScheduleType.StartEnd:
        this.chaptersPerDay = null;
        break;
    }
  }

  scriptureChoiceChanged(index: number) {
    this.selectedScripture = this.scriptureChoices[index].id;
  }

}
