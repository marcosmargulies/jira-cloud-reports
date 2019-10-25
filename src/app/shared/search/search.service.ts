import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get('assets/data/people.json')
      .pipe(map(res => res as Array<Person>));
  }

  search(q: string): Observable<any> {
    if (!q || q === '*') {
      q = '';
    } else {
      q = q.toLowerCase();
    }
    return this.getAll().pipe(
      map(data =>
        data.filter(item =>
          JSON.stringify(item)
            .toLowerCase()
            .includes(q)
        )
      )
    );
  }
}

export class Address {
  street: string;
  city: string;
  state: string;
  zip: string;

  constructor(obj?: any) {
    this.street = (obj && obj.street) || null;
    this.city = (obj && obj.city) || null;
    this.state = (obj && obj.state) || null;
    this.zip = (obj && obj.zip) || null;
  }
}

export class Person {
  id: number;
  name: string;
  phone: string;
  address: Address;

  constructor(obj?: any) {
    this.id = (obj && Number(obj.id)) || null;
    this.name = (obj && obj.name) || null;
    this.phone = (obj && obj.phone) || null;
    this.address = (obj && obj.address) || null;
  }
}
