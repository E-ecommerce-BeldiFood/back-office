import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Customer } from 'src/app/Module/Customer';
import { CustomerService } from '../customer.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  postCustomerForm!: FormGroup;
  updateCustomerForm!: FormGroup;
  customers: Customer[] = [];
  //pagination
 page = 0;
 pageSize = 5; 
 totalItems = 0;
 paginatedCustomer: Customer[] = [];
 currentPage: number = 1;
 itemsPerPage: number = 5;
 selectedCategoryid: number | undefined;
 filteredCustomers: Customer[] = [];

 showAllUsers: boolean = true;
  showInactiveUsers: boolean = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router : Router
  ) { }

  ngOnInit() {
    this.postCustomerForm = this.fb.group({
      id: [null], 
      name: [null, [Validators.required]], 
    });
    this.updateCustomerForm = this.fb.group({
      id: [null], 
      name: [null, [Validators.required]], 
    });
    this.getAllUsers();
  }
  getAllUsers() {
    this.customerService.getAllUsers().subscribe((res) => {
      console.log(res);
      this.customers = res;
      this.updatePaginatedProducts();
      this.filterUsers();
    });
  }
  // New method to toggle between 'All' and 'Inactive Users'
  toggleUserFilter(showAll: boolean) {
    this.showAllUsers = showAll;
    this.showInactiveUsers = !showAll;
    this.filterUsers();
  }
 
  isConfirmDelete: boolean = false;

   confirmDelete(id: number): void {
    console.log("loool")
    this.selectedCategoryid = id;
    this.isConfirmDelete = !this.isConfirmDelete;

    this.customerService.deleteUsers(id).subscribe({
      next: () => {

        // Delete successful, reset selected field and hide modal
        this.selectedCategoryid = 0;
        this.getAllUsers();
        
        console.log('user deleted successfully');
        
      },
      error: (error) => {
        // Handle error if deletion fails
        console.error('Error deleting field:', error);
      }
    });

    this.selectedCategoryid = 0;
  } 


  loadCategories() {
    this.customerService.getAllUsers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  loadProductsWithPagiantion() {
    this.customerService.getAllUsers().subscribe(data => {
      this.customers = data;
  
      this.updatePaginatedProducts();
  
    })
  }
  onPageChange(): void {
    this.updatePaginatedProducts();
  }
  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomer = this.filteredCustomers.slice(startIndex, endIndex);
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
    return Math.ceil(this.customers.length / this.itemsPerPage);
  }
   get totalUsers(): number {
    return this.customers.length;
  } 
  
  getPaginationArray(): number[] {
    const totalPages = this.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // Enable user
  enableUser(id: number): void {
    this.customerService.enableUser(id).subscribe({
      next: () => {
        this.getAllUsers();
        console.log('user enabled successfully');
      },
      error: (error) => {
        console.error('Error enabling user:', error);
      }
    });
  }

  // Disable user
  disableUser(id: number): void {
    this.customerService.deleteUsers(id).subscribe({
      next: () => {
        this.getAllUsers();
        console.log('user disabled successfully');
      },
      error: (error) => {
        console.error('Error disabling user:', error);
      }
    });
  }

  // Toggle user status
  toggleUserStatus(customer: Customer): void {
    if (customer.status === 'ENABLED') {
      this.disableUser(customer.id);
    } else {
      this.enableUser(customer.id);
    }
  }
  filterUsers() {
    if (this.showInactiveUsers) {
      this.filteredCustomers = this.customers.filter(customer => customer.status !== 'ENABLED');
    } else {
      this.filteredCustomers = this.customers;
    }
    this.updatePaginatedProducts();
  }


}
