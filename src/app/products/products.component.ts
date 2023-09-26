import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  isEditing: boolean = false;
  submitted: boolean = false;

  selectedProduct: Product = {} as Product;
  formGroupProduct: FormGroup;

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder
  ) {

    this.formGroupProduct = formBuilder.group({
      name: ['',  [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]]
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
    this.submitted = true;
    if(this.formGroupProduct.valid)
    {
      if (this.isEditing) {
        //Atualiza os dados do produto selecionado
        this.selectedProduct.name = this.formGroupProduct.get("name")?.value;
        this.selectedProduct.price = this.formGroupProduct.get("price")?.value;

        this.productService.update(this.selectedProduct).subscribe({
          next: () => {
            this.formGroupProduct.reset();
            this.isEditing = false;
            this.submitted = false;
          }
        })
      }
      else {
        this.productService.save(this.formGroupProduct.value).subscribe({
          next: product => {
            this.products.push(product);
            this.formGroupProduct.reset();
            this.submitted = false;
          }
        })
      }
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

  get name(): any {
    return this.formGroupProduct.get("name");
  }
  get price(): any {
    return this.formGroupProduct.get("price");
  }
}






