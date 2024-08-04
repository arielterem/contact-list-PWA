// export default class Contact {
//     public _id: string;
//     public name: string;
//     public fullAddress: string;
//     public email: string;
//     public phone: string;
//     public cell: string;
//     public registrationDate: Date;
//     public age: number;
//     public image: Blob | null;
//     public imageType: string;
//     constructor(
//         _id: string = '',
//         name: string = '',
//         fullAddress: string = '',
//         email: string = '',
//         phone: string = '',
//         cell: string = '',
//         registrationDate: Date = new Date(),
//         age: number = 0,
//         image: Blob | null = null,
//         imageType: string = ''

//     ) {
//         this._id = _id;
//         this.name = name;
//         this.fullAddress = fullAddress;
//         this.email = email;
//         this.phone = phone;
//         this.cell = cell;
//         this.registrationDate = registrationDate;
//         this.age = age;
//         this.image = image;
//         this.imageType = imageType;
//     }
// }

export interface Contact {
    _id: string;
    name: string;
    fullAddress: string;
    email: string;
    phone: string;
    cell: string;
    registrationDate: Date;
    age: number;
    image: Blob | null;
    imageType: string;
  }
  