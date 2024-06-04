import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory } from 'src/app/Module/Subcategory';
import { SubcategoryService } from 'src/app/Categories/subcategory.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from 'src/app/Module/Product';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  showForm: boolean = false;
  selectedProductId:number = 0;
 //products: any = [];
  nom: string = "";
  imageUrl: string="" ;
  postProductForm!: FormGroup;
  updateProductForm!: FormGroup;
  id: number=this.activatedRoute.snapshot.params["id"];
  subcategories: Subcategory[] = [];
  selectedProduct: any = null; 
  selectedProducts: number[] = [];
  currentProduct: Product | null = null;
  products: Product[] = [];
  selectedSubCategoryId: number | undefined; // Ajoutez cette variable pour stocker l'ID de la catégorie sélectionnée
  showSuccessDeleteAlert: boolean = false;
  showErrorDeleteAlert: boolean = false;
  showSuccessUpdateAlert: boolean = false;
  showErrorUpdateAlert: boolean = false;

  selectAllChecked: boolean = false;
 
  //pagination
  page = 0;
  pageSize = 5; 
  totalItems = 0;
  paginatedProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  

  file: File | null = null;
 
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private SubcategoryService: SubcategoryService,
    private storage: AngularFireStorage,
    private activatedRoute: ActivatedRoute
  ) { }


  async previewImage(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files ? element.files[0]: null;
    if (this.file) {
      // Generate a unique file name using timestamp and file extension
      const filePath = `yt/${Date.now()}-${this.file}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
  
      try {
        // Wait for the upload task to complete
        const snapshot = await task;
  
        // Get the download URL once the upload is complete
        this.imageUrl = await fileRef.getDownloadURL().toPromise();
  
        // Log the URL to verify
 

        console.log("sgsgsgsgsg",this.imageUrl);
       
         
         this.postProductForm.value.imageUrl=this.imageUrl as string ;
        // Log form value and validity for verification
        console.log('Form Value:', this.postProductForm.value);
        console.log('this.postProductForm.value.imageUrl', this.postProductForm.value.imageUrl);

        console.log('imageUrl Control Valid:', this.postProductForm.get('imageUrl'));
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error if upload or retrieval fails
      }
    }
  }
  

  ngOnInit() {
    this.postProductForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      imageUrl: [null, Validators.required],
      timeToPrepareInMinute: [null, [Validators.required]],
      status: [null, [Validators.required]],
      subcategoryId: [null, [Validators.required]],
     // id: [null, [Validators.required]],
    } as { [key: string]: any });
   
    this.updateProductForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      imageUrl: [null, Validators.required],
      timeToPrepareInMinute: [null, [Validators.required]],
      status: [null, [Validators.required]],
      subcategoryId: [null, [Validators.required]],
     // id: [null, [Validators.required]],
    }as { [key: string]: any });
    this.getAllProducts();
    this.getAllSubcategories();

   
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe((res) => {
      console.log(res);
      this.selectedProduct = res; // Assign the product details to selectedProduct
      this.updateProductForm.patchValue({
        name: res.name,
        description: res.description,
        price: res.price,
        imageUrl: res.imageUrl,
        timeToPrepareInMinute: res.timeToPrepareInMinute,
        status: res.status,
        id: res.id,
      });
    });
  }

  showProductDetails(id: number) {
    
    this.getProductById(id);
    // Optionally, you could add some code here to handle showing the modal
    // if not using data-bs-toggle and data-bs-target attributes in HTML.
  }
 

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      console.log(res);
      this.products = res;
      this.updatePaginatedProducts();
    });
  }
  getAllSubcategories() {
    this.SubcategoryService.getAllSubcategories().subscribe((res) => {
      console.log(res);
      this.subcategories = res;
    });
  }
  closeModalCate() {
    this.isAddModalOpen = false;
    this.imageUrl = "";
    this.postProductForm.reset();
  }
  openAddProductModal() {
    this.isAddModalOpen = true;
  }
  postProduct() {
    if (this.postProductForm.valid) {
      
      
      console.log("jkadjkad", this.postProductForm.value.imageUrl);

      // Call your product service to save the product
      this.productService.postProduct(this.postProductForm.value).subscribe(
        response => {
          console.log('Product successfully added!', response);
          // Handle successful response here, like redirecting or showing a success message
         
          this.getAllProducts();
          this.closeModalCate();
          this.loadProductsWithPagiantion();
        },
        error => {
          console.error('Error adding product', error);
          // Handle error response here, like showing an error message
        }
      );
    } else {
      console.log('Form is invalid', this.postProductForm);
    }
    
  }

  onSubCategoryChange(event: any) {
    const subcategoryId = event.target.value;
    this.selectedSubCategoryId = subcategoryId;
    this.postProductForm.patchValue({ subcategoryId: subcategoryId });
    this.updateProductForm.patchValue({ subcategoryId: subcategoryId });
  }

 
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
          this.currentProduct = this.products.find(sub => sub.id === id) || null;
          if (this.currentProduct) {
            this.updateProductForm.patchValue({
              id: this.currentProduct.id,
              name: this.currentProduct.name,
              price: this.currentProduct.price,
              status: this.currentProduct.status,
              description: this.currentProduct.description,
              imageUrl: this.currentProduct.imageUrl, // Ensure imageUrl is correctly set
              timeToPrepareInMinute: this.currentProduct.timeToPrepareInMinute,
              subcategoryId: this.currentProduct.subcategoryId
            });
            this.imageUrl = this.currentProduct.imageUrl; // Set imageUrl for preview
          }
          break;
        
      case 'delete':
        this.isDeleteModalOpen = !this.isDeleteModalOpen;
        console.log("toggle confirm delete called");
        this.selectedCategoryid = id;
        break;




      case 'details':
        this.isDetailsModalOpen = !this.isDetailsModalOpen;
        console.log("toggle details called");
        this.selectedProductId = id;
        break;
    };

  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  async previewEditImage(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files ? element.files[0] : null;
    if (this.file) {
      const filePath = `yt/${Date.now()}-${this.file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);

      try {
        const snapshot = await task;
        this.imageUrl = await fileRef.getDownloadURL().toPromise();
        this.updateProductForm.patchValue({ imageUrl: this.imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
  // Delete Stuff
  deleteAlert: boolean = false;
  isConfirmDelete: boolean = false;

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
        this.showSuccessDeleteAlert = true;
        setTimeout(() => {
          this.showSuccessDeleteAlert = false;
        }, 2500);
      },
      error: (error) => {
        // Handle error if deletion fails
        console.error('Error deleting field:', error);
        this.showErrorDeleteAlert = false;
        setTimeout(() => {
          this.showErrorDeleteAlert = false;
        }, 2500);
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



  // EDIT Stuff


 confirmUpdate(editForm: FormGroup, id: number): void {
  this.selectedCategoryid = id;
  console.log('Update Payload:', editForm.value); // Log the payload
  this.productService.updateProduct(id, editForm.value).subscribe({
    next: () => {
      // Update successful, reset selected field and hide modal
      //console.log("jkadjkad", this.updateProductForm.value.imageUrl);
      this.selectedCategoryid = 0;
     
      this.getAllProducts();
      this.closeModal('edit', id); // Close modal after update
      this.showSuccessUpdateAlert = true;
      setTimeout(() => {
        this.showSuccessUpdateAlert = false;
      }, 2500);
    },
    error: (error) => {
      // Handle error if update fails
      console.error('Error updating field:', error);
      this.showErrorUpdateAlert = true;
          setTimeout(() => {
            this.showErrorUpdateAlert = false;
          }, 2500);
    
    }
  });
}

loadProductsWithPagiantion() {
  this.productService.getAllProducts().subscribe(data => {
    this.products = data;

    //this.loadProductsWithPagiantion();
    console.log("products loaded ",this.products);
    this.updatePaginatedProducts();

  })
}
onPageChange(): void {
  // Réagissez au changement de page
  this.updatePaginatedProducts();
}

updatePaginatedProducts() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedProducts = this.products.slice(startIndex, endIndex);
}
goToPage(page: number, event?: MouseEvent): void {
  if (event) {
    event.preventDefault();
  }
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePaginatedProducts();
}

get totalPages(): number {
  return Math.ceil(this.products.length / this.itemsPerPage);
}

getPaginationArray(): number[] {
  const totalPages = this.totalPages;
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

onSearch(name: string): void {
  if (name.trim() === '') {
    this.getAllProducts();
    this.resetPagination();
   
  } else {
    this.productService.searchProducts(name).subscribe(
      (response: Product[]) => {
        this.paginatedProducts = response;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}

onSearchInputChange(value: string): void {
  if (value.trim() === '') {
    this.getAllProducts();
    this.resetPagination();
  }
}
paginate(array: any[], page_size: number, page_number: number): any[] {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

resetPagination(): void {
  this.currentPage = 1;
  this.paginatedProducts = this.paginate(this.products, this.currentPage, this.pageSize);
}





// Method to handle mass delete action
massDeleteSelectedProducts(): void {
  if (this.selectedProducts.length > 0) {
    // Call the ProductService method to delete selected products
    this.productService.massDeleteProducts(this.selectedProducts).subscribe({
      next: () => {
        // Handle success
        console.log('Selected products deleted successfully');
        // Clear the selectedProducts array after deletion
        this.selectedProducts = [];
        // Refresh product list
        this.getAllProducts();
      },
      error: (error) => {
        // Handle error
        console.error('Error deleting selected products:', error);
      }
    });
  } else {
    // No products selected, show message or handle accordingly
    console.log('No products selected for deletion');
  }
}

// Method to toggle selection of all products
toggleSelectAll(event: any): void {
  const checked = event.target.checked;
  this.selectedProducts = checked ? this.paginatedProducts.map(product => product.id) : [];
  this.updateSelectAllCheckbox();
}

toggleSelectProduct(event: any, id: number): void {
  const checked = event.target.checked;
  if (checked) {
    this.selectedProducts.push(id);
  } else {
    const index = this.selectedProducts.indexOf(id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }
  }
  this.updateSelectAllCheckbox();
}


updateSelectAllCheckbox(): void {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
  if (!selectAllCheckbox) return;

  const allSelected = this.paginatedProducts.every(product => this.selectedProducts.includes(product.id));
  const someSelected = this.paginatedProducts.some(product => this.selectedProducts.includes(product.id));

  selectAllCheckbox.checked = allSelected;
  selectAllCheckbox.indeterminate = !allSelected && someSelected;
}

isSelected(id: number): boolean {
  return this.selectedProducts.includes(id);
}



}
