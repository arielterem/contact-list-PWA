import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { blobToImageUrl} from '../../middleware/imageUtils';

@Component({
  selector: 'app-single-contact-record',
  standalone: true,
  imports: [],
  templateUrl: './single-contact-record.component.html',
  styleUrl: './single-contact-record.component.scss'
})
export class SingleContactRecordComponent implements OnInit, OnDestroy {
  @Input() name: string = '';
  @Input() fullAddress: string = '';
  @Input() image: Blob | null = null;

  imageURL: string = '';

  ngOnInit() {
    this.imageURL = blobToImageUrl(this.image)
  }

  ngOnDestroy() {
    // Clean up URL when component is destroyed
    if (this.imageURL) {
      URL.revokeObjectURL(this.imageURL);
    }
  }

}
