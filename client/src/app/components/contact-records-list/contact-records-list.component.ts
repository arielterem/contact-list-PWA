import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import Contact from '../../models/contact';
import { CommonModule } from '@angular/common';
import { SingleContactRecordComponent } from '../single-contact-record/single-contact-record.component';
import { Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../dialogs/loader/loader.component';
import { FilterContactsListPipe } from '../../pipes/filter-contacts-list.pipe';
import { FormsModule } from '@angular/forms';
import { StatusDialogComponent } from '../dialogs/status-dialog/status-dialog.component';


@Component({
  selector: 'app-contact-records-list',
  standalone: true,
  imports: [CommonModule, SingleContactRecordComponent, RouterModule, StatusDialogComponent, LoaderComponent, FilterContactsListPipe, FormsModule],
  templateUrl: './contact-records-list.component.html',
  styleUrl: './contact-records-list.component.scss',
  providers: [ContactsService]
})
export class ContactRecordsListComponent implements OnInit {

  @ViewChild('statusDialog') statusDialog!: StatusDialogComponent;
  loading = true
  searchTerm: string = '';


  constructor(
    private contactsService: ContactsService,
    private router: Router
  ) { }

  contactsList: Contact[] = []
  titledList: any[] = []
  ngOnInit(): void {

    this.contactsService.getAllContacts().subscribe(value => {
      this.contactsList = value
      this.createTitledList(value)
      this.loading = false
    })

  }


  createTitledList(list: Contact[]): void {
    // Helper function to get the first letter of a name, ignoring case
    const getFirstLetter = (name: string) => name[0].toUpperCase();

    // Sort the list by name in ascending order, ignoring case
    list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    const temp: any[] = [];
    let lastTitle: string | null = null;

    // Iterate through the sorted list
    list.forEach(contact => {
      // Determine the title based on the first letter or a special character
      const firstLetter = getFirstLetter(contact.name);
      let title = /^[A-Z]$/.test(firstLetter) ? firstLetter : 'OTHER';

      // Add title to temp if it is different from the last title
      if (title !== lastTitle) {
        temp.push(title);
        lastTitle = title;
      }

      // Add the contact to the list
      temp.push(contact);
    });

    this.titledList = temp;
  }

  // Method to check if the item is a string
  isString(item: any): boolean {
    return typeof item === 'string';
  }

  random10() {
    this.loading = true;
    this.contactsService.createRandom10Contacts().subscribe({
      next: (value) => {
        
        if (value.length > 0) {
          this.contactsList.push(...value);
          this.createTitledList(this.contactsList);
          this.statusDialog.show('10 new contacts added successfully');
        } else {
          
          this.statusDialog.show('No new contacts available. Please reconnect to the internet.', false);
        }
        this.loading = false;
      },
      error: (err) => {
        this.statusDialog.show('Error fetching contacts. Please try again later.', false);
        this.loading = false;
      }
    });
  }



}
