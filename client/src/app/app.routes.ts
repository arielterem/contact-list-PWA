import { Routes } from '@angular/router';
import { SingleContactRecordComponent } from './components/single-contact-record/single-contact-record.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ContactRecordsListComponent } from './components/contact-records-list/contact-records-list.component';

export const routes: Routes = [
    { path: '', component: ContactRecordsListComponent },
    { path: 'details/:_id/:edit', component: ContactDetailsComponent },
];
