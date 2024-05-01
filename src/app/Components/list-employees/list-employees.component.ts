import { Component, OnInit } from '@angular/core';
import { User } from '../../Model/user.model';
import { UserService } from '../../Service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-employees',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent implements OnInit {
  employees: User[] = [];
  showRegistrationPopup = false; // To control the popup display
  newEmployee: User = {} as User; // For registration form model

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadAllEmployees();
  }

  loadAllEmployees() {
    this.userService.getAllEmployees().subscribe(data => {
      this.employees = data;
    }, error => {
      console.error('Failed to get employees', error);
    });
  }

  togglePopup() {
    this.showRegistrationPopup = !this.showRegistrationPopup;
  }

  register() {
    this.userService.register(this.newEmployee).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.loadAllEmployees(); // Reload the list to include the new employee
        this.togglePopup(); // Close the popup after registration
        this.newEmployee = {} as User; // Reset form
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }


  
}


