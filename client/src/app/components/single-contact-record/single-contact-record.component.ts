import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { blobToImageUrl} from '../../middleware/imageUtils';
import { ImageBlob, ImageURL } from '../../models/types';

@Component({
  selector: 'app-single-contact-record',
  standalone: true,
  imports: [],
  templateUrl: './single-contact-record.component.html',
  styleUrl: './single-contact-record.component.scss'
})
export class SingleContactRecordComponent implements OnInit {
  @Input() name: string = '';
  @Input() fullAddress: string = '';
  @Input() image: ImageBlob = null;

  imageURL: ImageURL = '';

  ngOnInit() {
    this.imageURL = blobToImageUrl(this.image)
  }


}
