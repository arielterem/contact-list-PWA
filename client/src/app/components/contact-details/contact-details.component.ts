import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {Contact} from '../../models/contact';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { blobToImageUrl } from '../../middleware/imageUtils';
import { handleImageChange } from '../../middleware/imageUtils';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { SanitizeInputDirective } from '../../directives/sanitize-input.directive';
import { SanitizeNumbersInputDirective } from '../../directives/sanitize-numbers-input.directive';
import { FileInput, ImageURL } from '../../models/types';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, ConfirmDeleteDialogComponent, SanitizeInputDirective, SanitizeNumbersInputDirective],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  providers: [ContactsService],

})
export class ContactDetailsComponent implements OnInit {

  contactForm!: FormGroup;
  isEditMode: boolean = false;
  id: string = ''
  data: Contact = {
    _id: '',
    name: '',
    fullAddress: '',
    email: '',
    phone: '',
    cell: '',
    registrationDate: new Date(),
    age: 0,
    image: null,
    imageType: ''
  };

  imageInput: FileInput = null;
  imageURL: ImageURL = null;

  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: ConfirmDeleteDialogComponent;

  constructor(
    private contactsService: ContactsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm()

    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.id = params.get('_id');
      const editParam = params.get('edit');
      this.isEditMode = editParam === 'true';

      this.componentUpdates()
    });

    if (this.confirmDeleteDialog) {
      this.confirmDeleteDialog.confirm.subscribe(() => this.onDeleteConfirmed());
    }
  }

  //Initializing the component
  componentUpdates() {
    if (this.id != '') {
      this.contactsService.getContactById(this.id).subscribe(value => {
        this.data = value
        this.imageURL = blobToImageUrl(this.data.image)
        this.createForm()
      })
    }
    else
      this.isEditMode == true
  }

  createForm() {
    this.contactForm = this.fb.group({
      name: [this.data.name, Validators.required],
      fullAddress: [this.data.fullAddress],
      email: [this.data.email, [Validators.email]],
      phone: [this.data.phone, [Validators.pattern(/^[0-9]*$/)]],
      cell: [this.data.cell],
      age: [this.data.age],
      image: [this.data.image]
    });
  }

  //for validations
  get name(): AbstractControl {
    return this.contactForm.get('name')!;
  }

  get email(): AbstractControl {
    return this.contactForm.get('email')!;
  }

  get phone(): AbstractControl {
    return this.contactForm.get('phone')!;
  }


  onImageChange(event: Event) {
    handleImageChange(event, (result, file) => {
      this.imageURL = result;
      this.imageInput = file;
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeImage() {
    this.imageURL = null;
    this.imageInput = null;
  }


  addNewContact(): void {
    if (this.contactForm.valid) {

      this.fillDataFromForm()

      this.contactsService.createContact(this.data)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error creating contact', error);
          }
        });
    }
  }

  editExistingContact(): void {
    if (this.contactForm.valid) {
      this.fillDataFromForm()

      this.contactsService.updateContact(this.data)
        .subscribe({
          next: (response) => {

            this.router.navigate([`details/${this.id}/false`]);
          },
          error: (error) => {
            console.error('Error creating contact', error);
          }
        });
    }
  }

  fillDataFromForm() {
    this.data.name = this.contactForm.value.name
    this.data.fullAddress = this.contactForm.value.fullAddress
    this.data.email = this.contactForm.value.email
    this.data.phone = this.contactForm.value.phone
    this.data.cell = this.contactForm.value.cell
    this.data.age = this.contactForm.value.age
    this.data.age = this.contactForm.value.age
    this.data.image = this.imageInput; // Set the image as File
  }

  deleteContact() {
    this.confirmDeleteDialog.show('Are you sure you want to delete this contact?');
  }

  onDeleteConfirmed() {
    this.contactsService.deleteContact(this.id).subscribe(() => {
      this.router.navigate(['/']);
    })

  }



}
