import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, tap, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Contact from '../models/contact';
import { convertContactImageBufferToBlob } from '../middleware/imageUtils';
import { IdbService } from './idb.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private url: string = 'http://localhost:8080/contacts/';

  constructor(
    private http: HttpClient,
    private idbService: IdbService
  ) { }

  // GET: Retrieve all contacts sorted alphabetically
  getAllContacts(): Observable<Contact[]> {
    if (navigator.onLine) {
      return this.http.get<Contact[]>(this.url).pipe(
        map(contacts =>
          contacts.map(contact => convertContactImageBufferToBlob(contact))
        ),
        tap(contacts => {
          // Save contacts to IndexedDB
          this.idbService.contactListCameFromServer(contacts).catch(err => {
            console.error('Failed to save contacts to IndexedDB', err);
          });
        }),
        catchError(error => {
          console.error('Error fetching contacts from server', error);
          return this.getContactsFromIdb(); // Fallback to IndexedDB if there's an error
        })

      );
    } else {
      // Offline: Fetch from IndexedDB and convert to Observable
      return this.getContactsFromIdb();
    }
  }

  // GET: Retrieve one contact by id
  getContactById(id: string): Observable<Contact> {
    if (navigator.onLine) {
      return this.http.get<Contact>(`${this.url}${id}`).pipe(
        map(contact => convertContactImageBufferToBlob(contact)),
        catchError(error => {
          console.error('Error fetching contact from server', error);
          return this.getContactFromIdb(id);
        })
      );
    } else {
      return this.getContactFromIdb(id);
    }
  }

  // POST: Create a new contact
  createContact(contact: Contact): Observable<Contact> {
    const formData = this.formData(contact);

    if (navigator.onLine) {
      return this.http.post<Contact>(this.url, formData).pipe(
        tap(newContact => {
          // Save new contact to IndexedDB
          this.idbService.contactCreated(newContact).catch(err => {
            console.error('Failed to save contacts to IndexedDB', err);
          });
        }),
        catchError(error => {
          console.error('Error creating contact', error);
          return throwError(error);
        })
      );
    } else {
      return from(this.idbService.contactCreated(contact, false)).pipe(
        map(() => contact),
        catchError(error => {
          console.error('Error creating contact offline', error);
          return throwError(error);
        })
      );
    }
  }

  // PUT: Edit contact
  updateContact(contact: Contact): Observable<Contact> {

    if (!contact._id) {
      console.error('Contact object is missing _id:', contact);
      return throwError('Contact object is missing _id');
    }

    if (navigator.onLine) {
      const formData = this.formData(contact);
      return this.http.put<Contact>(`${this.url}/${contact._id}`, formData).pipe(
        tap(updatedContact => {
          this.idbService.contactUpdated(updatedContact).catch(err => {
            console.error('Failed to update contact in IndexedDB', err);
          });
        }),
        catchError(error => {
          console.error('Error updating contact #AA', error);
          return throwError(error);
        })
      );
    }
    else {
      return from(this.idbService.contactUpdated(contact, false)).pipe(
        map(() => contact),
        catchError(error => {
          console.error('Failed to update contact in IndexedDB while offline', error);
          return throwError(error);
        })
      );
    }
  }

  // DELETE: Remove a contact
  deleteContact(contactId: string): Observable<void> {
    if (navigator.onLine) {
      return this.http.delete<void>(`${this.url}/${contactId}`).pipe(
        tap(() => {
          this.idbService.contactDeleted(contactId).catch(err => {
            console.error('Failed to delete contact from IndexedDB', err);
          });
        }),
        catchError(error => {
          console.error('Error deleting contact', error);
          return throwError(error);
        })
      );
    } else {
      return from(this.idbService.contactDeleted(contactId, false)).pipe(
        catchError(error => {
          console.error('Error deleting contact offline', error);
          return throwError(error);
        })
      );
    }
  }

  // Post: Create 10 random contacts
  createRandom10Contacts() {
    if (navigator.onLine) {
      return this.http.post<Contact[]>(`${this.url}/10Contacts`, {}).pipe(
        map(contacts =>
          contacts.map(contact => convertContactImageBufferToBlob(contact)) // Convert image buffer to Blob
        ),
        tap(contacts => {
          // Save contacts to IndexedDB
          this.idbService.contactListCameFromServer(contacts).catch(err => {
            console.error('Failed to save contacts to IndexedDB', err);
          });
        }),
        catchError(error => {
          console.error('Error fetching contacts from server', error);
          return of([]); // Return an empty array if there's an error
        })
      );
    } else {
      return of([]); // Return an empty array if offline
    }
  }


  private getContactsFromIdb(): Observable<Contact[]> {
    return new Observable(observer => {
      this.idbService.getContacts().then(contacts => {
        observer.next(contacts);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  private getContactFromIdb(id: string): Observable<Contact> {
    return new Observable(observer => {
      this.idbService.getContacts().then(contacts => {
        const contact = contacts.find(c => c._id === id);
        if (contact) {
          observer.next(contact);
          observer.complete();
        } else {
          observer.error('Contact not found');
        }
      }).catch(error => {
        observer.error('Error fetching contact from IndexedDB');
      });
    });
  }

  private formData(contact: Contact): FormData {
    const formData = new FormData();
    
    formData.append('name', contact.name || '');
    formData.append('fullAddress', contact.fullAddress || '');
    formData.append('email', contact.email || '');
    formData.append('phone', contact.phone || '');
    formData.append('cell', contact.cell || '');
    formData.append('age', (contact.age !== undefined && contact.age !== null) ? contact.age.toString() : '');
  
    
    if (contact.image) {
      
      if (contact.image instanceof File || contact.image instanceof Blob) {
        formData.append('image', contact.image); // Append File or Blob
        formData.append('imageType', contact.image.type);

      } else {
        console.error('Invalid image format');
      }
    }
    else{
      formData.append('image', '');
      formData.append('imageType', '');
    }
  
    return formData;
  }
  



}
