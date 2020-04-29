import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { CategoryService } from './categoty.service';
import { Observable } from 'rxjs/Observable';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(private userService: UserService, private categoryService: CategoryService) { }

  sync() {
    return new Observable(observer => {
      this.userService.getItemList().subscribe((items: Array<any>) => {
        if (!items) {
          return
        }
        let storeItem = {};
        items.forEach(element => {
          storeItem[element.id] = element;
        });
        localStorage.setItem('users', JSON.stringify(storeItem))
      })

      this.categoryService.getCategories(1).subscribe((items: Array<any>) => {
        let storeItem = {};
        if (!items) {
          return
        }
        items.forEach(element => {
          storeItem[element.id] = element;
        });
        localStorage.setItem('category', JSON.stringify(storeItem))
        observer.next(storeItem);
        observer.complete();
      });
    });
  }
}