import { Component, OnInit } from '@angular/core';
import { User } from '../../Model/user.model';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membre-equipe',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './membre-equipe.component.html',
  styleUrl: './membre-equipe.component.scss'
})
export class MembreEquipeComponent implements OnInit{
  employees: User[] = [];
  employeeUsername: string = '';
  updatedNote: string = '';

  
  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.loadAllEmployeesByRoleEmployee();
  }
  

  // Méthode pour charger tous les employés avec le rôle "Employé"
 loadAllEmployeesByRoleEmployee() {
    this.userService.getAllEmployeesByRoleEmployee().subscribe(
      (employees: User[]) => {
        this.employees = employees;
      },
      (error) => {
        console.error('Error fetching employees by role employee:', error);
      }
    );
  }


/*
  updateEmployeeNote(username: string, note: string): void {
    this.userService.updateEmployeeNote(username, note)
      .subscribe(
        (response) => {
          console.log('Note de l\'employé mise à jour avec succès :', response);
          
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la note de l\'employé :', error);
        }
      );
  }
*/

  
 


}
