import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterContactsList',
  standalone: true
})
export class FilterContactsListPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!items) return [];
    if (!searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    const temp: any[] = items.filter(item => {
      if (typeof item !== 'string') {
        if (item.name.toLowerCase().includes(searchTerm))
          return item
      }
    });
    
    return temp
  }
}
