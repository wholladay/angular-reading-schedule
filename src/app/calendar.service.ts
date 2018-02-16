import {Injectable} from '@angular/core';
import {Book} from './book';
import {ScheduleType} from './schedule-type.enum';
import {VolumeId} from './volume-id.enum';
import moment = require('moment');

@Injectable()
export class CalendarService {

  fileNames = {};
  oldTestament: Book[] = [
    new Book('Genesis', 50),
    new Book('Exodus', 40),
    new Book('Leviticus', 27),
    new Book('Numbers', 36),
    new Book('Deuteronomy', 34),
    new Book('Joshua', 24),
    new Book('Judges', 21),
    new Book('Ruth', 4),
    new Book('1 Samuel', 31),
    new Book('2 Samuel', 24),
    new Book('1 Kings', 22),
    new Book('2 Kings', 25),
    new Book('1 Chronicles', 29),
    new Book('2 Chronicles', 36),
    new Book('Ezra', 10),
    new Book('Nehemiah', 13),
    new Book('Esther', 10),
    new Book('Job', 42),
    new Book('Psalms', 150),
    new Book('Proverbs', 31),
    new Book('Ecclesiastes', 12),
    new Book('Song of Solomon', 8),
    new Book('Isaiah', 66),
    new Book('Jeremiah', 52),
    new Book('Lamentations', 5),
    new Book('Ezekiel', 48),
    new Book('Daniel', 12),
    new Book('Hosea', 14),
    new Book('Joel', 3),
    new Book('Amos', 9),
    new Book('Obadiah', 1),
    new Book('Jonah', 4),
    new Book('Micah', 7),
    new Book('Nahum', 3),
    new Book('Habakkuk', 3),
    new Book('Zephaniah', 3),
    new Book('Haggai', 2),
    new Book('Zechariah', 14),
    new Book('Malachi', 4),
  ];
  newTestament: Book[] = [
    new Book('Matthew', 28),
    new Book('Mark', 16),
    new Book('Luke', 24),
    new Book('John', 21),
    new Book('Acts', 28),
    new Book('Romans', 16),
    new Book('1 Corinthians', 16),
    new Book('2 Corinthians', 13),
    new Book('Galatians', 6),
    new Book('Ephesians', 6),
    new Book('Philippians', 4),
    new Book('Colossians', 4),
    new Book('1 Thessalonians', 5),
    new Book('2 Thessalonians', 3),
    new Book('1 Timothy', 6),
    new Book('2 Timothy', 4),
    new Book('Titus', 3),
    new Book('Philemon', 1),
    new Book('Hebrews', 13),
    new Book('James', 5),
    new Book('1 Peter', 5),
    new Book('2 Peter', 3),
    new Book('1 John', 5),
    new Book('2 John', 1),
    new Book('3 John', 1),
    new Book('Jude', 1),
    new Book('Revelation', 22),
  ];
  bookOfMormon: Book[] = [
    new Book('1 Nephi', 22),
    new Book('2 Nephi', 33),
    new Book('Jacob', 7),
    new Book('Enos', 1),
    new Book('Jarom', 1),
    new Book('Omni', 1),
    new Book('Words of Mormon', 1),
    new Book('Mosiah', 29),
    new Book('Alma', 63),
    new Book('Helaman', 16),
    new Book('3 Nephi', 30),
    new Book('4 Nephi', 1),
    new Book('Mormon', 9),
    new Book('Ether', 15),
    new Book('Moroni', 10)
  ];
  doctrineAndCovenants: Book[] = [];
  pearlOfGreatPrice: Book[] = [
    new Book('Moses', 8),
    new Book('Abraham', 5),
    new Book('Joseph Smith -- Matthew', 1),
    new Book('Joseph Smith -- History', 1),
    new Book('The Articles of Faith', 1),
  ];
  scriptures = [];
  assignments: any[] = [];

  constructor() {
    for (let i = 1; i <= 138; i++) {
      this.doctrineAndCovenants.push(new Book(`Section ${i}`, 1));
    }
    this.scriptures[VolumeId.OT] = this.oldTestament;
    this.scriptures[VolumeId.NT] = this.newTestament;
    this.scriptures[VolumeId.BOM] = this.bookOfMormon;
    this.scriptures[VolumeId.DC] = this.doctrineAndCovenants;
    this.scriptures[VolumeId.PGP] = this.pearlOfGreatPrice;

    this.fileNames[VolumeId.OT] = 'OldTestament.ics';
    this.fileNames[VolumeId.NT] = 'NewTestament.ics';
    this.fileNames[VolumeId.BOM] = 'BookOfMormon.ics';
    this.fileNames[VolumeId.DC] = 'DoctrineAndCovenants.ics';
    this.fileNames[VolumeId.PGP] = 'PearlOfGreatPrice.ics';
  }

  generateSchedule(scriptureKey: VolumeId, dailyCount: number, startDate: Date) {

    let currentBook: string = null;
    let currentCount = 0;
    let dailyAssignment = '';

    this.assignments = [];

    for (const book of this.scriptures[scriptureKey]) {
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        dailyAssignment += dailyAssignment ? ',' : '';
        dailyAssignment += `${currentBook !== book.name ? ((dailyAssignment ? ' ' : '') + book.name) : ''} ${chapter}`;
        currentCount++;
        if (currentCount === dailyCount) {
          currentCount = 0;
          this.assignments.push(dailyAssignment);
          dailyAssignment = '';
          currentBook = null;
        } else {
          currentBook = book.name;
        }
      }
    }
    if (dailyAssignment) {
      this.assignments.push(dailyAssignment);
    }

    const beginDate = moment(startDate);
    const endDate = moment(startDate).add(1, 'days');
    let schedule = 'BEGIN:VCALENDAR\n';
    this.assignments.forEach(assignment => {
      schedule += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${beginDate.format('YYYYMMDD')}
DTEND;VALUE=DATE:${endDate.format('YYYYMMDD')}
STATUS:CONFIRMED
SUMMARY:${assignment}
TRANSP:TRANSPARENT
END:VEVENT
`;
      beginDate.add(1, 'days');
      endDate.add(1, 'days');
    });

    schedule += 'END:VCALENDAR\n';
    this.saveTextAsFile(schedule, this.fileNames[scriptureKey]);
  }

  saveTextAsFile(data: string, filename: string) {

    if (!data) {
      console.error('Console.save: No data');
      return;
    }

    if (!filename) {
      filename = 'schedule.ics';
    }

    const blob = new Blob([data], {type: 'text/plain'});

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const e = document.createEvent('MouseEvents');
      const a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  getDays(startDate: Date, endDate: Date): number {
    return moment(endDate).endOf('day').diff(moment(startDate).startOf('day'), 'days') + 1;
  }

  getChapterCount(volumeId: VolumeId): number {
    let chapterCount = 0;
    this.scriptures[volumeId].forEach(book => {
      chapterCount += book.chapters;
    });
    return chapterCount;
  }

  calculateChaptersPerDay(volumeId: VolumeId, startDate: Date, endDate: Date): number {
    const days = this.getDays(startDate, endDate);
    return Math.round(this.getChapterCount(volumeId) / days);
  }

  calculateStartDate(volumeId: VolumeId, endDate: Date, chaptersPerDay: number): Date {
    const chapterCount = this.getChapterCount(volumeId);
    const days = Math.round(chapterCount / chaptersPerDay) - 1;
    return moment(endDate).subtract(days, 'days').toDate();
  }
}
