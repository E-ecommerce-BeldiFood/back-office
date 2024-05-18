import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { Subcategory } from 'src/app/Module/Subcategory';
import { SubcategoryService } from 'src/app/Categories/subcategory.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  showForm: boolean = false;
  products:any=[];
  nom: string = "";
  imageUrl:string= '';
  postProductForm!: FormGroup;
  subcategories: Subcategory[] = [];

  constructor(
    private productService: ProductService, 
    private fb: FormBuilder,
    private router : Router,
    private SubcategoryService: SubcategoryService,
    private fireStorage:AngularFireStorage
  ) { }

    
  // Adjust the previewImage method to correctly handle image uploads
previewImage(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.postProductForm.patchValue({ imageUrl: e.target.result }); // Set imageUrl in form
    };
    reader.readAsDataURL(file);
  }
}
  
  ngOnInit() {
    this.postProductForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      imageUrl: [null, [Validators.required]], // Ensure correct field name for the image URL
      timeToPrepareInMinute: [null, [Validators.required]],
      status: [null, [Validators.required]],
      id: [null, [Validators.required]],
    });
    this.getAllProducts();
    this.getAllSubcategories();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      console.log(res);
      this.products = res;
    });
  }
  getAllSubcategories() {
    this.SubcategoryService.getAllSubcategories().subscribe((res) => {
      console.log(res);
      this.subcategories = res;
    });
  }
  closeModalCate() {
    this.isModalOpen = false;
  }
  postProduct(){
    console.log(this.postProductForm.value);
    this.productService.postProduct(this.postProductForm.value).subscribe((res)=>{
    console.log(res);
    this.getAllProducts();

    this.closeModalCate();
    }
    )}


    //Add Modal Attrribute
isAddModalOpen: boolean = false;
//Edit Modal Attribute
isEditModalOpen: boolean = false;
//Delete Modal Attribute
isDeleteModalOpen: boolean = false;
//Details Modal Attribute
isDetailsModalOpen: boolean = false;
// Variable to track selected field ID
selectedCategoryid: number | undefined; 

//Toggle Edit Modal
closeModal(str: string, id: number) {

  switch (str) {

    case 'add': 
                this.isAddModalOpen = !this.isAddModalOpen;
                break;

    case 'edit': 
                this.isEditModalOpen = !this.isEditModalOpen;
                this.selectedCategoryid = id;
             

              break;
    case 'delete':
                this.isDeleteModalOpen = !this.isDeleteModalOpen;
                console.log("toggle confirm delete called");
                this.selectedCategoryid = id;
                break;

               
    
    
    case 'details': 
                this.isDetailsModalOpen = !this.isDetailsModalOpen;
                console.log("toggle details called");
                this.selectedCategoryid = id;
                break;

    case 'cancel':
                this.selectedCategoryid = 0;
                this.isDeleteModalOpen = false;
                break;

    case 'alert':
                this.deleteAlert = !this.deleteAlert;
                break;
  };

}

    // Delete Stuff
deleteAlert: boolean = false;
isConfirmDelete: boolean =false;

  // Method to trigger delete confirmation modal for the selected field
confirmDelete(id: number): void {
  console.log("loool")
this.selectedCategoryid = id;
  this.isConfirmDelete = !this.isConfirmDelete;

  this.productService.deleteProduct(id).subscribe({
    next: () => {

      // Delete successful, reset selected field and hide modal
      this.selectedCategoryid = 0;
      this.getAllProducts();
      this.closeModal('delete', id);
      console.log('Category deleted successfully');
    },
    error: (error) => {
      // Handle error if deletion fails
      console.error('Error deleting field:', error);
    }
  });
  
  this.selectedCategoryid = 0;
}

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  editProduct(id: number): void {
    // Here you can implement the logic to handle editing the product with the given id
    console.log('Editing product with id:', id);
  }

  isModalOpen: boolean = false;

  toggleModalProduct(): void {
    this.isModalOpen = !this.isModalOpen;
  }
  closeModaladd() {
    this.isModalOpen = false;
  }

  isModalEditOpen: boolean = false;
  toggleModalEdit(): void {
    this.isModalEditOpen = !this.isModalEditOpen;
  }

  toggleModalDelete() {
    const modalDelete = document.getElementById('deleteModal');
    if (modalDelete) {
      modalDelete.classList.toggle('hidden');
    }
  }

  closeModalDelete() {
    // Get the modal element
    const modalDelete = document.getElementById('deleteModal');
  
    // Check if modal exists before performing operations
    modalDelete?.classList.add('hidden');
    modalDelete?.setAttribute('aria-hidden', 'true');
  }

  
  


}
