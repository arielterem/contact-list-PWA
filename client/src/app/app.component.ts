import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SingleContactRecordComponent } from './components/single-contact-record/single-contact-record.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactRecordsListComponent } from './components/contact-records-list/contact-records-list.component';
import { IdbService } from './services/idb.service';
import { ContactsService } from './services/contacts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SingleContactRecordComponent, ContactDetailsComponent, HttpClientModule, ContactRecordsListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [IdbService, ContactsService]
})
export class AppComponent {

  constructor(
    private idbService : IdbService
  ) {
    // Listen to online/offline events
    window.addEventListener('online', () => this.syncData());
    window.addEventListener('offline', () => {
    });
  }


  private syncData() {
    this.idbService.syncChanges().catch(err => console.error('Sync failed:', err));
  }
}

