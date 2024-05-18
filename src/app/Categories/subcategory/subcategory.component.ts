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
  // Add a property to hold the current category being updated
  currentSubCategory: Subcategory | null = null;




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
  }


  getAllSubcategories() {
    this.subcategoryService.getAllSubcategories().subscribe((res) => {
      console.log(res);
      this.subcategories = res;
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

 /* toggleModalDelete() {
    const modalDelete = document.getElementById('deleteModal');
    if (modalDelete) {
      modalDelete.classList.toggle('hidden');
    }
  }*/

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
      console.log(str, id)
                  this.isEditModalOpen = !this.isEditModalOpen;
                  console.log(this.isEditModalOpen);

                  this.selectedCategoryid = id;
                  console.log(this.selectedCategoryid);


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
      },
      error: (error) => {
        // Handle error if update fails
        console.error('Error updating field:', error);
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

}
