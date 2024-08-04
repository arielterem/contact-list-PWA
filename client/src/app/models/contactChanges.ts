import {Contact} from "./contact";

export default interface ContactChange {
    id: string;
    operation: 'update' | 'create' | 'delete';
    contact: Contact;
}