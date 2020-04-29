import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from './service';

@Injectable({ providedIn: 'root' })
export class CategoryService extends Service {
    constructor(public http: HttpClient) { 
        super(http, 'categories');
    }

    getCategories(perPage) {
        return this.getItemList(null, null, null, perPage, 100)
    }
}