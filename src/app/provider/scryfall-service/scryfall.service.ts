import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ScryfallService {
  url = "https://api.scryfall.com";

  constructor(private http: HttpClient) {}

  searchData(search: string, order: string): Observable<any> {
    console.log("finding");
    return this.http.get(`${this.url}/cards/search?q=${search}`);
  }

  getDetails(id: string): Observable<any> {
    console.log("Fetching");
    console.log(this.http.get(`${this.url}/cards/${id}`));
    return this.http.get(`${this.url}/cards/${id}`);
  }
}
