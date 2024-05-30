import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../Users/customer.service';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { Customer } from '../Module/Customer';
import { Product } from '../Module/Product';
import { Order, OrderItem, } from '../Module/Order';
import Chart from 'chart.js/auto';




@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css']
})
export class DashHomeComponent implements OnInit{
 

  constructor(
    private customerService: CustomerService, 
    private orderService:OrderService,
    private productService:ProductService
  ) { }

  totalUsers: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;

  customers:Customer[]=[];
  products:Product[]=[];
  orders:Order[]=[];
  recentOrders: Order[] = [];
  popularProducts: any[] = [];

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllProducts();
    this.getAllOrders();
    this.getRecentOrders();
    this.getPopularProducts();
    this.initSalesChart();
    this.initOrdersChart();

  }
   getAllUsers(): void {
    this.customerService.getAllUsers().subscribe((res) => {
      this.customers = res;
      this.calculateTotals();
      this.incrementUsers();
    });
  }
  getAllProducts(): void {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
      this.calculateTotals();
      this.incrementProducts();
    });
  }
  getAllOrders(): void {
    this.orderService.getAllOrders().subscribe((res) => {
     this.orders = res;
     this.calculateTotals();
     this.incrementOrders();
    });
  }
  calculateTotals(): void {
    this.totalUsers = this.customers.length;
    this.totalOrders = this.orders.length;
    this.totalProducts = this.products.length;
    //this.totalSales = this.orders.reduce((acc, order) => acc + order.amount, 0);
  }

  incrementUsers(): void {
    let count = 0;
    const incrementInterval = setInterval(() => {
      count++;
      if (count >= this.customers.length) {
        clearInterval(incrementInterval);
      }
      this.totalUsers = count;
    }, 100);
  }
  incrementProducts(): void {
    let count = 0;
    const incrementInterval = setInterval(() => {
      count++;
      if (count >= this.products.length) {
        clearInterval(incrementInterval);
      }
      this.totalProducts = count;
    }, 100);
  }
  incrementOrders(): void {
    let count = 0;
    const incrementInterval = setInterval(() => {
      count++;
      if (count >= this.orders.length) {
        clearInterval(incrementInterval);
      }
      this.totalOrders = count;
    }, 100);
  }

  getRecentOrders() {
    this.orderService.getAllOrders().subscribe((orders) => {
      // Assuming you want the most recent 5 orders
      this.recentOrders = orders.slice(-5).reverse();
    });
  }

  getPopularProducts(): void {
    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      const productCountMap = new Map<number, number>();

      orders.forEach((order: Order) => {
        order.orderResponse.orderItems.forEach((item: OrderItem) => {
          if (productCountMap.has(item.productId)) {
            productCountMap.set(item.productId, productCountMap.get(item.productId)! + item.quantity);
          } else {
            productCountMap.set(item.productId, item.quantity);
          }
        });
      });

      const sortedProducts = Array.from(productCountMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

      sortedProducts.forEach(([productId, count]) => {
        this.productService.getProductById(productId).subscribe(product => {
          this.popularProducts.push({ ...product, count });
        });
      });
    });
  }

  initSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Sales Value',
          data: [30, 50, 40, 60, 70, 80],
          borderColor: '#6c757d',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          pointBackgroundColor: '#6c757d',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6c757d'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#333'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            ticks: {
              color: '#333'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: '#333'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        backgroundColor: '#fff' // Set the background color of the chart
      }
    });
  }
  
  initOrdersChart(): void {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;
    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#007bff');
    gradient.addColorStop(1, '#00c9ff');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Total Orders',
          data: [10, 20, 30, 40, 50, 60],
          backgroundColor: gradient,
          borderColor: '#007bff',
          borderWidth: 1,
          hoverBackgroundColor: '#00c9ff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#333'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            ticks: {
              color: '#333'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: '#333'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        backgroundColor: '#fff' // Set the background color of the chart
      }
    });
  }

  
}
