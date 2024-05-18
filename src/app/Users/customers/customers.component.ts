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
    });
  }

  postUsers(){
    console.log(this.postCustomerForm.value);
    this.customerService.postUsers(this.postCustomerForm.value).subscribe((res)=>{
    console.log(res);
    this.loadCategories();
    this.router.navigateByUrl("/Customer");
  }
)}
updateUsers(): void {
  const id = this.updateCustomerForm.get('id')?.value;
  if (!id) {
      console.error('ID is null');
      return;
  }
  const updatedCustomer: Customer = {
    id: id,
    userName: this.updateCustomerForm.get('userName')?.value,
    email: this.updateCustomerForm.get('email')?.value,
    phone: this.updateCustomerForm.get('phone')?.value,
    status: this.updateCustomerForm.get('status')?.value,
    firstName: '',
    lastName: '',
    role: '',
    createdAt: '',
    updatedAt: '',
    confirmedAt: ''
  };
  this.customerService.updateUsers(id, updatedCustomer).subscribe(
      (res) => {
          console.log(res);
          this.router.navigateByUrl('/Customer');
      },
      (error) => {
          console.error(error);
          // Handle error appropriately
      }
  );

  const modalupdate = document.getElementById('updateProductModal');

  // Check if modal exists before performing operations
  modalupdate?.classList.add('hidden');
  modalupdate?.setAttribute('aria-hidden', 'true');
}
  toggleModalDelete() {
    const modalDelete = document.getElementById('deleteModal');
    if (modalDelete) {
      modalDelete.classList.toggle('hidden');
    }
  }
  closeModalCate() {
    this.isModalOpen = false;
  }

  closeModalDelete() {
    // Get the modal element
    const modalDelete = document.getElementById('deleteModal');
  
    // Check if modal exists before performing operations
    modalDelete?.classList.add('hidden');
    modalDelete?.setAttribute('aria-hidden', 'true');
  }
  toggleModalUpdate() {
    const modalupdate = document.getElementById('updateProductModal');
    if (modalupdate) {
      modalupdate.classList.toggle('hidden');
    }
  }
  closeModalUpdate() {
    // Get the modal element
    const modalupdate = document.getElementById('updateProductModal');
  
    // Check if modal exists before performing operations
    modalupdate?.classList.add('hidden');
    modalupdate?.setAttribute('aria-hidden', 'true');
  }

  isModalOpen: boolean = false;

  toggleModalUser(): void {
    this.isModalOpen = !this.isModalOpen;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  loadCategories() {
    this.customerService.getAllUsers().subscribe((customers) => {
      this.customers = customers;
    });
  }
}
