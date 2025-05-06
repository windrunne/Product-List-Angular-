import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

export interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface PaginationParams {
  _start?: number;
  _limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getPosts(params: PaginationParams = {}): Observable<{ data: JsonPlaceholderPost[], total: number }> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      httpParams = httpParams.set(key, params[key as keyof PaginationParams]!.toString());
    });

    return this.http.get<JsonPlaceholderPost[]>(`${this.baseUrl}/posts`, {
      params: httpParams,
      observe: 'response'
    }).pipe(
      map(response => {
        const totalCount = response.headers.get('X-Total-Count') 
          ? parseInt(response.headers.get('X-Total-Count')!, 10) 
          : response.body!.length;
        
        return {
          data: response.body || [],
          total: totalCount
        };
      }),
      catchError(error => {
        console.error('Error fetching posts from JSONPlaceholder:', error);
        return of({ data: [], total: 0 });
      })
    );
  }

  getPost(id: number): Observable<JsonPlaceholderPost | null> {
    return this.http.get<JsonPlaceholderPost>(`${this.baseUrl}/posts/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching post with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getUsers(): Observable<JsonPlaceholderUser[]> {
    return this.http.get<JsonPlaceholderUser[]>(`${this.baseUrl}/users`).pipe(
      catchError(error => {
        console.error('Error fetching users from JSONPlaceholder:', error);
        return of([]);
      })
    );
  }

  getUser(id: number): Observable<JsonPlaceholderUser | null> {
    return this.http.get<JsonPlaceholderUser>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching user with id ${id}:`, error);
        return of(null);
      })
    );
  }
} 