import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase, IDBPObjectStore } from 'idb';
import { Contact } from '../models/contact';
import ContactChange from '../models/contactChanges';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';


interface MyDB extends IDBPDatabase {
  readonly contacts: IDBPObjectStore<Contact>;
  readonly 'contact-changes': IDBPObjectStore<ContactChange>;
}

@Injectable({
  providedIn: 'root'
})
export class IdbService {

  private dbPromise: Promise<IDBPDatabase<MyDB>>;
  private url: string = 'http://localhost:8080/contacts/';

  constructor(
    private http: HttpClient
  ) {
    // Initialize database
    this.dbPromise = this.initDb();
  }


  async contactListCameFromServer(contacts: Contact[]): Promise<void> {
    try {

      const db = await this.dbPromise;

      const tx = db.transaction(['contacts', 'contact-changes'], 'readwrite');
      const contactsStore = tx.objectStore('contacts');
      contacts.forEach(contact => {
        if (!contact._id) {
          console.error('Contact object is missing _id:', contact);
          return;
        }
        contactsStore.put(contact);
      });
      await tx.done;
    } catch (error) {
      console.error('Error saving contacts to IndexedDB:', error);
    }
  }


  async contactCreated(contact: Contact, online: boolean = true): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(['contacts', 'contact-changes'], 'readwrite');
      const contactsStore = tx.objectStore('contacts');

      // Generate a temporary ID if the contact does not have one
      if (!contact._id) {
        contact._id = uuidv4();
      }

      contactsStore.put(contact);

      if (!online) {
        const changesStore = tx.objectStore('contact-changes');
        changesStore.put({ id: contact._id, operation: 'create', contact });
      }
      await tx.done;
    } catch (error) {
      console.error('Error saving contacts to IndexedDB:', error);
    }
  }



  async contactUpdated(contact: Contact, online: boolean = true): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put('contacts', contact);

      // Track the change
      if (!online)
        await db.put('contact-changes', { id: contact._id, operation: 'update', contact });
    } catch (error) {
      console.error('Error updating contact in IndexedDB:', error);
    }
  }


  async contactDeleted(contactId: string, online: boolean = true): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete('contacts', contactId);

      if (!online) {
        await db.put('contact-changes', { id: contactId, operation: 'delete' });
      }
    } catch (error) {
      console.error('Error deleting contact from IndexedDB:', error);
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      const db = await this.dbPromise;

      const contacts = await db.getAll('contacts');

      // Sort contacts by name, ignoring case sensitivity
      contacts.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

      return contacts;
    } catch (error) {
      console.error('Error fetching contacts from IndexedDB:', error);
      return [];
    }
  }








  private async initDb(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('contacts-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('contacts')) {
          db.createObjectStore('contacts', { keyPath: '_id' });
        }
        if (!db.objectStoreNames.contains('contact-changes')) {
          db.createObjectStore('contact-changes', { keyPath: 'id' });
        }
      },
    });
  }


  private syncInProgress = false;
  async syncChanges(): Promise<void> {

    if (this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;

    try {
      const db = await this.dbPromise;
      const tx = db.transaction('contact-changes', 'readonly');
      const changes = await tx.store.getAll();


      // Filter changes
      const updates = changes.filter(change => change.operation === 'update');
      const creations = changes.filter(change => change.operation === 'create');
      const deletions = changes.filter(change => change.operation === 'delete');

      // Handle updates
      for (const change of updates) {
        const formData = this.formData(change.contact);
        await this.http.put<Contact>(`${this.url}/${change.id}`, formData).toPromise();
      }

      // Handle creations
      for (const change of creations) {
        const formData = this.formData(change.contact);
        const newContact = await this.http.post<Contact>(this.url, formData).toPromise();
        const newTx = db.transaction(['contacts', 'contact-changes'], 'readwrite');
        const contactsStore = await newTx.objectStore('contacts');
        const changesStore = await newTx.objectStore('contact-changes');

        // Delete the old contact with the temporary ID
        await contactsStore.delete(change.id);
        await changesStore.delete(change.id);

        // Add the new contact with the server-assigned ID
        await contactsStore.put(newContact);
        await newTx.done;
      }

      // Handle deletions
      for (const change of deletions) {
        await this.http.delete(`${this.url}/${change.id}`).toPromise();
      }

      // Clear the changes after successful sync
      const txClear = db.transaction('contact-changes', 'readwrite');
      await txClear.store.clear();
      await txClear.done;

    } catch (error) {
      console.error('Error syncing changes with the server:', error);
    } finally {
      this.syncInProgress = false;
    }
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

    return formData;
  }

}
