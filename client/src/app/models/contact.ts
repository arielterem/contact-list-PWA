export default class Contact {
    public _id = ''
    public name = ''
    public fullAddress = ''
    public email = ''
    public phone = ''
    public cell = ''
    public registrationDate = new Date()
    public age = 0
    public image: Blob | null = null
    public imageType = ''
    constructor(
        _id: string = '',
        name: string = '',
        fullAddress: string = '',
        email: string = '',
        phone: string = '',
        cell: string = '',
        registrationDate: Date = new Date(),
        age: number = 0,
        image: Blob | null = null,
        imageType: string = ''

    ) {
        _id = _id;
        name = name;
        fullAddress = fullAddress;
        email = email;
        phone = phone;
        cell = cell;
        registrationDate = registrationDate;
        age = age;
        image = image;
        imageType = imageType;
    }
}
