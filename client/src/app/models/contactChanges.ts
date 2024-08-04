import Contact from "./contact";

export default interface ContactChange {
    id: string;
    operation: 'update' | 'create';
    contact: Contact;
}