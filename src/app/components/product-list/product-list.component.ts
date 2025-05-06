import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  Math = Math;
  
  numberPages: number[] = [];
  middlePages: number[] = [];
  lastPage: number | null = null;
  showFirstEllipsis: boolean = false;
  showLastEllipsis: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  loadAllProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.error = 'Failed to load products. Please try again later.';
          console.error('Error loading products:', err);
          return [];
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(products => {
        this.allProducts = products;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    let filtered = this.allProducts;
    
    if (this.searchQuery.trim() !== '') {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search)
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    
    this.filteredProducts = filtered;
    this.updateDisplayedProducts();
    this.updatePagination();
  }

  updateDisplayedProducts(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = this.filteredProducts.slice(start, end);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.filteredProducts.length) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    
    this.numberPages = [];
    this.middlePages = [];
    this.lastPage = null;
    this.showFirstEllipsis = false;
    this.showLastEllipsis = false;
    
    if (totalPages <= 7) {
      this.numberPages = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      if (this.currentPage <= 3) {
        this.numberPages = [0, 1, 2, 3, 4];
        this.showLastEllipsis = true;
        this.lastPage = totalPages - 1;
      } else if (this.currentPage >= totalPages - 4) {
        this.numberPages = [0];
        this.showFirstEllipsis = true;
        this.middlePages = [
          totalPages - 5, 
          totalPages - 4, 
          totalPages - 3, 
          totalPages - 2, 
          totalPages - 1
        ];
      } else {
        this.numberPages = [0];
        this.showFirstEllipsis = true;
        this.middlePages = [
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1
        ];
        this.showLastEllipsis = true;
        this.lastPage = totalPages - 1;
      }
    }
  }

  addToCart(product: Product): void {
    alert(`${product.name} added to cart!`);
  }
} 