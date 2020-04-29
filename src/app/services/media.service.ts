import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from './service';

@Injectable({ providedIn: 'root' })
export class MediaService extends Service {
  constructor(public http: HttpClient) { 
    super(http, 'media');
  }
}