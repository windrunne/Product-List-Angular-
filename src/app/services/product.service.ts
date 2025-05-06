import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private categories = ['Electronics', 'Audio', 'Wearables', 'Home', 'Accessories'];
  private cachedProducts: Map<number, Product> = new Map();
  private totalProductsCount = 0;

  constructor(private apiService: ApiService) { }

  getAllProducts(): Observable<Product[]> {
    if (this.cachedProducts.size > 0 && this.cachedProducts.size >= this.totalProductsCount) {
      return of(Array.from(this.cachedProducts.values()));
    }
    
    return this.apiService.getPosts({ _limit: 100 }).pipe(
      map(response => {
        this.totalProductsCount = response.total;
        
        const products: Product[] = response.data.map(post => this.transformPostToProduct(post));
        
        products.forEach(product => {
          this.cachedProducts.set(product.id, product);
        });
        
        return products;
      }),
      catchError(error => {
        console.error('Error processing products:', error);
        return of([]);
      })
    );
  }

  getProductsPage(page: number = 0, pageSize: number = 10): Observable<{ products: Product[], total: number }> {
    return this.getAllProducts().pipe(
      map(allProducts => {
        const start = page * pageSize;
        const end = start + pageSize;
        return {
          products: allProducts.slice(start, end),
          total: allProducts.length
        };
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    if (this.cachedProducts.has(id)) {
      return of(this.cachedProducts.get(id));
    }

    return this.apiService.getPost(id).pipe(
      map(post => {
        if (!post) return undefined;
        
        const product = this.transformPostToProduct(post);
        this.cachedProducts.set(product.id, product);
        return product;
      }),
      catchError(error => {
        console.error(`Error processing product with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
  
  searchProducts(query: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        return products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.description.toLowerCase().includes(query.toLowerCase())
        );
      })
    );
  }
  
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.category === category))
    );
  }
  
  getCategories(): Observable<string[]> {
    return of(this.categories);
  }
  
  private transformPostToProduct(post: any): Product {
    return {
      id: post.id,
      name: this.capitalizeFirstLetter(post.title),
      price: this.generatePrice(post.id),
      description: post.body,
      imageUrl: `https://placehold.co/400x300?text=${encodeURIComponent(post.title.slice(0, 20))}`,
      category: this.categories[post.id % this.categories.length]
    };
  }
  
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  private generatePrice(id: number): number {
    const basePrice = 50 + (id * 19) % 1450;
    return Math.round(basePrice * 100) / 100;
  }
} 