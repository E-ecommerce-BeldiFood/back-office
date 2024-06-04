import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/Module/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  orders: Order[] = [];
  showForm: boolean = false;
  updateOrderForm!: FormGroup;
  selectedProduct: any = null; 
  id: number=this.activatedRoute.snapshot.params["id"];
  selectedStatus: string = '';
  orderStatuses: string[] = ['Completed', 'Processing', 'SHIPPED', 'CANCELLED'];
 //pagination
 page = 0;
 pageSize = 5; 
 totalItems = 0;
 paginatedOrders: Order[] = [];
 currentPage: number = 1;
 itemsPerPage: number = 5;

 showErrorUpdateAlert: boolean = false;
  showSuccessUpdateAlert: boolean = false;

  constructor(private orderService: OrderService, private fb: FormBuilder, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.updateOrderForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      imageUrl: ['', Validators.required],
      quantity: [null, [Validators.required]],
      totalPrice: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
    this.getAllOrders();

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']; // Récupérez l'ID dans ngOnInit
      //this.getOrderById(this.id);
      // Vous pouvez également exécuter d'autres actions dépendant de l'ID ici
    });
  }

  
  getOrderById(id: number) {
    this.orderService.getOrderById(id).subscribe((res) => {
      console.log(res);
      this.selectedProduct = res; // Assign the product details to selectedProduct
      this.updateOrderForm.patchValue({
        name: res.name,
        quantity: res.quantity,
        price: res.price,
        imageUrl: res.imageUrl,
        totalPrice: res.totalPrice,
        status: res.status,
        id: res.id,
      });
    });
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe((res) => {
      console.log(res);
      this.orders = res;
      this.updatePaginatedProducts();
    });
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe((res) => {
      console.log(res);
      this.getAllOrders();
    });
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  editOrder(id: number): void {
    // Here you can implement the logic to handle editing the product with the given id
    console.log('Editing product with id:', id);
  }

  isModalOpen: boolean = false;

  toggleModalProduct(): void {
    this.isModalOpen = !this.isModalOpen;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  

  updateOrderStatus(orderId: number, newStatus: string) {
    const orderToUpdate = this.orders.find((order: any) => order.orderResponse.orderId === orderId);
    if (orderToUpdate) {
      console.log('New status for order', orderId, ':', newStatus);
      this.orderService.updateOrderStatus(orderId, newStatus)
        .subscribe(
          updatedOrder => {
            console.log('Order status updated successfully:', updatedOrder);
            const index = this.orders.findIndex((order: any) => order.orderResponse.orderId === orderId);
            if (index !== -1) {
              this.orders[index] = updatedOrder;
              this.getAllOrders();
              this.showSuccessUpdateAlert = true;
        setTimeout(() => {
          this.showSuccessUpdateAlert = false;
        }, 2500);
            }

            // Apply background color to the selected option
            const selectElement = document.querySelector(`select[data-order-id="${orderId}"]`);
            if (selectElement) {
              selectElement.classList.remove('bg-green-100', 'text-green-800', 'bg-yellow-100', 'text-yellow-800', 'bg-blue-100', 'text-blue-800', 'bg-red-100', 'text-red-800');
              if (newStatus === 'Completed') {
                selectElement.classList.add('bg-green-100', 'text-green-800');
              } else if (newStatus === 'Processing') {
                selectElement.classList.add('bg-yellow-100', 'text-yellow-800');
              } else if (newStatus === 'SHIPPED') {
                selectElement.classList.add('bg-blue-100', 'text-blue-800');
              } else if (newStatus === 'CANCELLED') {
                selectElement.classList.add('bg-red-100', 'text-red-800');
              }
            }


            
          },
          error => {
            console.error('Error updating order status:', error);
            this.showErrorUpdateAlert = true;
          setTimeout(() => {
            this.showErrorUpdateAlert = false;
          }, 2500);
          }
        );
    }
  }

  loadProductsWithPagiantion() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
  
      //this.loadProductsWithPagiantion();
      console.log("products loaded ",this.orders);
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
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
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
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }
  
  getPaginationArray(): number[] {
    const totalPages = this.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  

}
