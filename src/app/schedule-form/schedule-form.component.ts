import {Component, OnInit, TemplateRef} from '@angular/core';
import {ScheduleOption} from '../schedule-option';
import {ScheduleType} from '../schedule-type.enum';
import {VolumeId} from '../volume-id.enum';
import {CalendarService} from '../calendar.service';
import * as moment from 'moment';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  modalRef: BsModalRef;
  st = ScheduleType;
  selectedSchedule: ScheduleType;
  selectedScripture: VolumeId;
  scheduleChoices: ScheduleOption[];
  scriptureChoices: any[];
  currentScripture: number;
  startDate: Date;
  endDate: Date;
  chaptersPerDay: number;
  error: string;
  earlyStartWarning = false;

  constructor(private calendarService: CalendarService, private modalService: BsModalService) {
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
          this.error = 'You have to specify a start and end date.';
          return;
        }
        this.chaptersPerDay = this.calendarService.calculateChaptersPerDay(this.selectedScripture, this.startDate, this.endDate);
        break;
      case ScheduleType.EndCount:
        if (!this.endDate || !this.chaptersPerDay || this.chaptersPerDay < 1) {
          this.error = 'You must specify an end date and number of chapters per day.';
          return;
        }
        this.startDate = this.calendarService.calculateStartDate(this.selectedScripture, this.endDate, this.chaptersPerDay);
        if (!this.earlyStartWarning) {
          if (moment(this.startDate).isBefore(moment(), 'day')) {
            this.earlyStartWarning = true;
            this.error = `Your start date is in the past. Are you sure this is what you want?
            If you are sure, click the "Generate" button again.`;
            return;
          }
        }
        this.earlyStartWarning = false;
        break;
      case ScheduleType.StartCount:
        if (!this.startDate || !this.chaptersPerDay || this.chaptersPerDay < 1) {
          this.error = 'You must specify a start date and number of chapters per day.';
          return;
        }
        break;
    }
    this.error = null;
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
