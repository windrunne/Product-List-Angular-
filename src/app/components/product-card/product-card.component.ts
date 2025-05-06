import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  onViewDetails(): void {
    this.viewDetails.emit(this.product);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
} 