import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';

@Pipe({
  name: 'filterProducts'
})
export class FilterProducts implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    console.log(items)
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();

    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText);
    });
  }

}

@Pipe({
  name: 'filterRetailer'
})
export class FilterRetailer implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();

    return items.filter(it => {
      let fullname;
      fullname = it.first_name + ' ' + it.middle_name + ' ' + it.last_name;
      console.log(items);
      return fullname.toLowerCase().includes(searchText);
    });

  }

}

@Pipe({
  name: 'filterProductsUsertype'
})
export class FilterProductsUsertype implements PipeTransform {
  filtered: any = [];
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    console.log(searchText)
    items.filter(prod => {
      // prod.points.filter(pr => {
      //   if (pr.user_type.toLowerCase() == searchText) {
      //   }
      // })
      // return prod;

      // prod.points.filter(type => {
      //   // console.log(type)
      //   return type.user_type.toLowerCase().includes(searchText);
      //   // if (type.user_type.toLowerCase() == searchText) {
      //   //   console.log(count = count + 1)
      //   //   return prod;
      //   // }
      // })
      if (prod.points.length == 6) {
        this.filtered.push(prod);
      } else {
        if (prod.points[0].user_type.toLowerCase().includes(searchText)) {
          this.filtered.push(prod);
        }
        // return prod.points[0].user_type.toLowerCase().includes(searchText);
      }
    });
    return this.filtered;

  }

}

