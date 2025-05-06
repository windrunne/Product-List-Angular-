import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { catchError, finalize, Subject, takeUntil, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: number = 0;
  product: Product | undefined;
  loading: boolean = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  get hasProduct(): boolean {
    return !!this.product;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.productId = +id;
          this.loadProduct(this.productId);
        } else {
          this.error = 'No product ID provided';
          this.loading = false;
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProductById(id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.error = 'Failed to load product details. Please try again later.';
          console.error(`Error loading product ${id}:`, err);
          return of(undefined);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(product => {
        this.product = product;
        
        if (!product) {
          this.error = `Product with ID ${id} not found`;
        }
      });
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  addToCart(): void {
    if (this.product) {
      alert(`${this.product.name} added to cart!`);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
} 