import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoryService } from '../subcategory.service';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { Category } from 'src/app/Module/Category';
import { Subcategory } from 'src/app/Module/Subcategory';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})

export class SubcategoryComponent implements OnInit {
  postSubCategoryForm!: FormGroup;
  updateSubCategoryForm!: FormGroup;
  showForm: boolean = false;
  subcategories: Subcategory[] = [];
  categories: Category[] = [];
  selectedSubCategories: number[] = [];
  // Add a property to hold the current category being updated
  currentSubCategory: Subcategory | null = null;
  //pagination
 page = 0;
 pageSize = 5; 
 totalItems = 0;
 paginatedSubcategory: Subcategory[] = [];
 currentPage: number = 1;
 itemsPerPage: number = 5;
 showSuccessDeleteAlert: boolean = false;
  showErrorDeleteAlert: boolean = false;
  showSuccessUpdateAlert: boolean = false;
  showErrorUpdateAlert: boolean = false;




  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.postSubCategoryForm = this.fb.group({
      name: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
    this.updateSubCategoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });

    this.getAllSubcategories();
    this.getAllCategories();
  }
  closeModalCate() {
    this.isAddModalOpen = false; // Set isAddModalOpen to false to close the modal
    this.postSubCategoryForm = this.fb.group({
      id: [null],
      name: [null]
    });
  }

closeModaladd(str: string) {
    // Get the modal element
    switch (str) {
      case 'add': this.isAddModalOpen = !this.isAddModalOpen; break;
      //case 'edit': this.isEditModalOpen = !this.isEditModalOpen; break;
      //case 'delete': this.isDeleteModalOpen = !this.isDeleteModalOpen; break;

    }
    this.isModalOpen = !this.isModalOpen

  }
  postSubCategories() {
    console.log(this.postSubCategoryForm.value);
    this.subcategoryService.postSubCategories(this.postSubCategoryForm.value).subscribe((res) => {
      console.log(res);
      this.getAllSubcategories();
      this.closeModaladd('add');
    }
    )
    this.postSubCategoryForm = this.fb.group({
      id: [null],
      name: [null]
    });
  }

  openAddCategoryModal() {
    this.isAddModalOpen = true;
  }

  getAllSubcategories() {
    this.subcategoryService.getAllSubcategories().subscribe((res) => {
      console.log(res);
      this.subcategories = res;
      this.updatePaginatedProducts();
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((res) => {
      console.log(res);
      this.categories = res;
      
    });
  }



  isModalOpen: boolean = false;

  toggleModalProduct(): void {
    this.isModalOpen = !this.isModalOpen;
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
        this.currentSubCategory = this.subcategories.find(sub => sub.id === id) || null;
        if (this.currentSubCategory) {
          this.updateSubCategoryForm.patchValue({
            id: this.currentSubCategory.id,
            name: this.currentSubCategory.name,
            categoryId: this.currentSubCategory.categoryId,
          });
        }
        console.log(this.updateSubCategoryForm.value);
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
  
    this.subcategoryService.updateSubCategories(id, editForm.value).subscribe({
      next: () => {
        // Update successful, reset selected field and hide modal
        this.selectedCategoryid = 0;
        this.getAllSubcategories();
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
  
 


  // Delete Stuff
  deleteAlert: boolean = false;
  isConfirmDelete: boolean = false;
  

  // Method to trigger delete confirmation modal for the selected field
  confirmDelete(id: number): void {
    console.log("loool")
    this.selectedCategoryid = id;
    this.isConfirmDelete = !this.isConfirmDelete;

    this.subcategoryService.deleteSubcategory(id).subscribe({
      next: () => {

        // Delete successful, reset selected field and hide modal
        this.selectedCategoryid = 0;
        
        this.getAllSubcategories();
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
        this.showErrorDeleteAlert = false;
        setTimeout(() => {
          this.showErrorDeleteAlert = false;
        }, 2500);
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
  loadProductsWithPagiantion() {
    this.subcategoryService.getAllSubcategories().subscribe(data => {
      this.subcategories = data;
  
      //this.loadProductsWithPagiantion();
      console.log("products loaded ",this.subcategories);
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
    this.paginatedSubcategory = this.subcategories.slice(startIndex, endIndex);
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
      this.getAllSubcategories();
      this.resetPagination();
     
    } else {
      this.subcategoryService.searchsubcategories(name).subscribe(
        (response: Subcategory[]) => {
          this.paginatedSubcategory = response;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }
  
  onSearchInputChange(value: string): void {
    if (value.trim() === '') {
      this.getAllSubcategories();
      this.resetPagination();
    }
  }
  paginate(array: any[], page_size: number, page_number: number): any[] {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }
  
  resetPagination(): void {
    this.currentPage = 1;
    this.selectedSubCategories = this.paginate(this.subcategories, this.currentPage, this.pageSize);
  }
  
  // Method to toggle selection of all products
  toggleSelectAll(event: any): boolean {
    const checked = event.target.checked;
    this.selectedSubCategories = checked ? this.paginatedSubcategory.map(subcategory => subcategory.id) : [];
    return checked;
  }
  
  
  
  // Method to handle mass delete action
  massDeleteSelectedSubCategories(): void {
    if (this.selectedSubCategories.length > 0) {
      // Call the ProductService method to delete selected products
      this.subcategoryService.massDeletesubcategories(this.selectedSubCategories).subscribe({
        next: () => {
          // Handle success
          console.log('Selected products deleted successfully');
          // Clear the selectedProducts array after deletion
          this.selectedSubCategories = [];
          // Refresh product list
          this.getAllSubcategories();
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
        this.selectedSubCategories.push(id);
    } else {
        // Remove product ID from selectedProducts array
        const index = this.selectedSubCategories.indexOf(id);
        if (index !== -1) {
            this.selectedSubCategories.splice(index, 1);
        }
    }
  }
  
  
  isSelected(id: number): boolean {
    return this.selectedSubCategories.includes(id);
  }
  

}
