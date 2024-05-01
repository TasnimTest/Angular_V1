import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../Model/user.model';
import { UserService } from '../../Service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  username: string = '';
  updatedUserData: any = {};
  user: User | null = null; // Placeholder for employee details

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
     const allowedRoles = ['Admin']; // Define roles allowed to access this component
  
 
     // Check if the user is authenticated and their role is allowed
     if (!this.authService.isLoggedIn() || !allowedRoles) {
       this.router.navigate(['/']);
     }
     const userDetails = this.authService.getUserDetails();

     if (userDetails) {
       this.username = userDetails.username;
       this.fetchEmployeeDetails();
     } else {
       console.error('User details not available.');
     }
   }
   fetchEmployeeDetails() {
    if (!this.username) {
      console.error('Username is not defined.');
      return;
    }
  
    this.userService.getUserByUsername(this.username).subscribe(
      (data: User | null) => {
        if (data) {
          this.user = data;
        } else {
          console.error('User not found or an error occurred.');
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  updateUserByUsername() {
    if (this.user !== null && this.user !== undefined) {
      const userDataToUpdate = { ...this.user }; // Clone the user object or create a new one with updated fields
      this.userService.updateUserByUsername(this.username, userDataToUpdate).subscribe(
        (updatedUser: User | null) => {
          if (updatedUser) {
            console.log('Employee details updated successfully:', updatedUser);
            this.user = updatedUser;
          }
        } 
      ); 
    } 
  }

}
