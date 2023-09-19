import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  isEditing: boolean = false;
  selectedProduct: Product = {} as Product;
  formGroupProduct: FormGroup;

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder
  ) {

    this.formGroupProduct = formBuilder.group({
      name: [''],
      price: ['']
    });
  }


  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      {
        next: products => this.products = products
      }
    )
  }

  save() {
    if (this.isEditing) {
      //Atualiza os dados do produto selecionado
      this.selectedProduct.name = this.formGroupProduct.get("name")?.value;
      this.selectedProduct.price = this.formGroupProduct.get("price")?.value;

      this.productService.update(this.selectedProduct).subscribe({
        next: () => {
          this.formGroupProduct.reset();
          this.isEditing = false;
        }
      })
    }
    else {
      this.productService.save(this.formGroupProduct.value).subscribe({
        next: product => {
          this.products.push(product);
          this.formGroupProduct.reset();
        }
      })
    }
  }

  edit(product: Product) {
    this.selectedProduct = product;
    this.isEditing = true;
    this.formGroupProduct.setValue({ "name": product.name, "price": product.price });
  }

  delete(product: Product) {
    this.productService.delete(product).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id)
      }
    })
  }

  cancel() {
    this.formGroupProduct.reset();
    this.isEditing = false;
  }

}






