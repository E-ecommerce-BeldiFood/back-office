import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { Category } from 'src/app/Module/Category';
import { AngularFireStorage } from '@angular/fire/compat/storage';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  postCategoryForm!: FormGroup;
  updateCategoryForm!: FormGroup;
  categories: Category[] = [];
  showSuccessDeleteAlert: boolean = false;
  showErrorDeleteAlert: boolean = false;
  showSuccessUpdateAlert: boolean = false;
  showErrorUpdateAlert: boolean = false;
  selectedCategories: number[] = [];
  imageUrl: string="" ;
  file: File | null = null;

  //pagination
 page = 0;
 pageSize = 5; 
 totalItems = 0;
 paginatedCategory: Category[] = [];
 currentPage: number = 1;
 itemsPerPage: number = 5;
  // Add a property to hold the current category being updated
  currentCategory: Category | null = null;
  openAddCategoryModal() {
    this.isAddModalOpen = true;
  }
  
  
  deleteCategoryId: number | null = null;
  category: any;

  setDeleteCategory(id: number): void {
    this.deleteCategoryId = id;
  }

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.postCategoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
    });
    this.updateCategoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
    });
    this.getAllCategories();
  }

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
       
         
         this.postCategoryForm.value.imageUrl=this.imageUrl as string ;
        // Log form value and validity for verification
        console.log('Form Value:', this.postCategoryForm.value);
        console.log('this.postProductForm.value.imageUrl', this.postCategoryForm.value.imageUrl);

        console.log('imageUrl Control Valid:', this.postCategoryForm.get('imageUrl'));
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error if upload or retrieval fails
      }
    }
  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((res) => {
      console.log(res);
      this.categories = res;
      this.updatePaginatedProducts();
    });
  }

  setUpdateCategory(category: Category) {
    console.log('Category ID:', category.id); // Log the ID value
    this.currentCategory = category; // Copy category object to prevent mutation

    this.updateCategoryForm.patchValue({
      id: category.id,
      name: category.name,
      imageUrl: [null, Validators.required]
    });

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
        console.log(str, id);
        this.isEditModalOpen = !this.isEditModalOpen;
        this.selectedCategoryid = id;
        this.currentCategory = this.categories.find(sub => sub.id === id) || null;
        if (this.currentCategory) {
          this.updateCategoryForm.patchValue({
            id: this.currentCategory.id,
            name: this.currentCategory.name,
            imageUrl: this.currentCategory.imageUrl,
          });
          this.imageUrl = this.currentCategory.imageUrl; // Set imageUrl for preview
        }
        console.log(this.updateCategoryForm.value);
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



 // EDIT Stuff


 confirmUpdate(editForm: FormGroup, id: number): void {
  this.selectedCategoryid = id;

  this.categoryService.updateCategories(id, editForm.value).subscribe({
    next: () => {
      this.selectedCategoryid = 0;
      this.getAllCategories();
      this.closeModal('edit', id); 
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

  closeDeleteModal(): void {
    this.deleteCategoryId = null;
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
        this.updateCategoryForm.patchValue({ imageUrl: this.imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  postCategories() {
    console.log(this.postCategoryForm.value);
    this.categoryService.postCategories(this.postCategoryForm.value).subscribe((res) => {
      console.log(res);
      this.getAllCategories();

      this.closeModalCate();
    }

    )
    this.postCategoryForm = this.fb.group({
      id: [null],
      name: [null],
      imageUrl: [null, Validators.required]
    });
  }


  isModalOpen: boolean = false;

  toggleModalProduct(): void {
    this.isModalOpen = !this.isModalOpen;
  }
 

  isModalEditOpen: boolean = false;
  toggleModalEdit(): void {
    this.isModalEditOpen = !this.isModalEditOpen;
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  closeModalCate() {
  this.isAddModalOpen = false; // Set isAddModalOpen to false to close the modal
  this.imageUrl = "";
  this.postCategoryForm.reset();
}


  // Delete Stuff
  deleteAlert: boolean = false;
  isConfirmDelete: boolean = false;

  // Method to trigger delete confirmation modal for the selected field
  confirmDelete(id: number): void {
    console.log("loool")
    this.selectedCategoryid = id;
    this.isConfirmDelete = !this.isConfirmDelete;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {

        // Delete successful, reset selected field and hide modal
        this.selectedCategoryid = 0;
        this.getAllCategories();
        this.closeModal('delete', id);
        console.log('Category deleted successfully');
        this.showSuccessDeleteAlert = true;
        setTimeout(() => {
          this.showSuccessDeleteAlert = false;
        }, 2500);
      },
      error: (error) => {
        // Handle error if deletion fails
        console.error('Error deleting field:', error);
      }
    });

    this.selectedCategoryid = 0;
  }

  toggleConfirmDelete(id: number) {
    console.log("toggle confirm delete called");
    this.selectedCategoryid = id;
    this.isConfirmDelete = !this.isConfirmDelete;
  }

  // Method to cancel delete confirmation modal
  cancelDelete(): void {
    this.selectedCategoryid = 0;
    this.isConfirmDelete = !this.isConfirmDelete;
  }

  closeDeleteAlert() {
    this.deleteAlert = !this.deleteAlert;
  }
  loadProductsWithPagiantion() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
  
      //this.loadProductsWithPagiantion();
      console.log("products loaded ",this.categories);
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
    this.paginatedCategory = this.categories.slice(startIndex, endIndex);
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
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }
  
  getPaginationArray(): number[] {
    const totalPages = this.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  onSearch(name: string): void {
    if (name.trim() === '') {
      this.getAllCategories();
      this.resetPagination();
     
    } else {
      this.categoryService.searchProducts(name).subscribe(
        (response: Category[]) => {
          this.paginatedCategory = response;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }
  
  onSearchInputChange(value: string): void {
    if (value.trim() === '') {
      this.getAllCategories();
      this.resetPagination();
    }
  }
  paginate(array: any[], page_size: number, page_number: number): any[] {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }
  
  resetPagination(): void {
    this.currentPage = 1;
    this.paginatedCategory = this.paginate(this.categories, this.currentPage, this.pageSize);
  }
  
  // Method to toggle selection of all products
  toggleSelectAll(event: any): boolean {
    const checked = event.target.checked;
    this.selectedCategories = checked ? this.paginatedCategory.map(category => category.id) : [];
    return checked;
  }
  
  
  // Method to handle mass delete action
  massDeleteSelectedCategories(): void {
    if (this.selectedCategories.length > 0) {
      // Call the ProductService method to delete selected products
      this.categoryService.massDeleteCategories(this.selectedCategories).subscribe({
        next: () => {
          // Handle success
          console.log('Selected products deleted successfully');
          // Clear the selectedProducts array after deletion
          this.selectedCategories = [];
          // Refresh product list
          this.getAllCategories();
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
  
  
  toggleSelectCategory(event: any, id: number): void {
    const checked = event.target.checked;
  
    if (checked) {
        // Add product ID to selectedProducts array
        this.selectedCategories.push(id);
    } else {
        // Remove product ID from selectedProducts array
        const index = this.selectedCategories.indexOf(id);
        if (index !== -1) {
            this.selectedCategories.splice(index, 1);
        }
    }
  }
  
  
  isSelected(id: number): boolean {
    return this.selectedCategories.includes(id);
  }
  

}
