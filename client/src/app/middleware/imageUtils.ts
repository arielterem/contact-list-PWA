// imageUtils.ts


/**
 * Convert a Blob to an object URL for displaying the image.
 * @param image - The image as a Blob or File object.
 * @returns The URL representing the image or an empty string if the image is not a Blob.
 */
export function blobToImageUrl(image: Blob | string | null): string | null {
  if (!image) {
    return null;
  }

  if (image instanceof Blob) {
    return URL.createObjectURL(image);
  } else if (typeof image === 'string') {
    return image;
  }

  return null;
}




/**
 * Handle image change event and read the image file as a data URL.
 * @param event - The change event triggered by file input.
 * @param callback - A callback function to handle the result.
 */
export function handleImageChange(event: Event, callback: (result: string | ArrayBuffer | null, file: File | null) => void): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result, file);
    };
    reader.readAsDataURL(file);
  } else {
    callback(null, null); // Handle case where no file is selected
  }
}


/**
 * Converts a Buffer to a Blob.
 * @param buffer - The Buffer data of the image.
 * @returns The Blob representing the image.
 */
export function convertBufferToBlob(buffer: any): Blob {
  // Check if the buffer has a data property, indicating it might be a MongoDB Binary object
  if (buffer && buffer.data) {
    // Convert Buffer data to Uint8Array
    const byteArray = new Uint8Array(buffer.data);
    // Create and return a Blob with the given data and type
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }

  // If the buffer does not have data property, handle accordingly
  console.error('Invalid buffer data:', buffer);
  return new Blob(); // Return an empty Blob if conversion fails
}



import {Contact} from "../models/contact";
/**
 * Converts a Contact's image buffer to a Blob.
 * @param contact - The Contact object containing the image buffer.
 * @returns The Contact object with the image as a Blob.
 */
export function convertContactImageBufferToBlob(contact: Contact): Contact {
  // Only convert if the image exists
  if (contact.image) {
    // Convert the buffer to a Blob using the helper function
    contact.image = convertBufferToBlob(contact.image);
  }
  return contact;
}


/**
 * Converts a File or Blob to a Buffer.
 * @param file - The File or Blob to convert.
 * @returns A Promise that resolves to a Uint8Array representing the file data.
 */
export async function convertFileToBuffer(file: File | Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        // Convert the result to an ArrayBuffer
        const arrayBuffer = reader.result as ArrayBuffer;
        // Convert ArrayBuffer to Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      } else {
        reject(new Error('Failed to read the file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error occurred while reading the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
