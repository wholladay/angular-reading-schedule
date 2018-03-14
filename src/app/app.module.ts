import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {AlertModule, BsDatepickerModule, ModalModule} from 'ngx-bootstrap';

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {ScheduleFormComponent} from './schedule-form/schedule-form.component';
import {CalendarService} from './calendar.service';
import {MarkdownModule} from 'angular2-markdown';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    ScheduleFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    MarkdownModule.forRoot()
  ],
  providers: [CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
