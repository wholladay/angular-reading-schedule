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
  dayCount: number;
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
        this.chapterCount = this.calendarService.getChapterCount(this.selectedScripture);
        this.dayCount = this.calendarService.getDays(this.startDate, this.endDate);
        this.chaptersPerDay = this.calendarService.calculateChaptersPerDay(this.selectedScripture, this.startDate, this.endDate);
        break;
      case ScheduleType.EndCount:
        break;
      case ScheduleType.StartCount:
        break;
    }
    this.calendarService.generateSchedule(this.selectedScripture, this.chaptersPerDay, this.startDate);
  }

  scheduleChoiceChanged(index: number) {
    this.selectedSchedule = this.scheduleChoices[index].id;
  }

  scriptureChoiceChanged(index: number) {
    this.selectedScripture = this.scriptureChoices[index].id;
  }

}
