import { Component, OnInit} from '@angular/core';
import { Niveau } from '../competence/competence-enum';
import { Chart, ChartConfiguration, ChartOptions, ChartTypeRegistry, registerables } from 'chart.js';
import { EmployeeSkill } from '../../Model/employee-skill.module';
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { UserService } from '../../Service/user.service';
import { AuthService } from '../../Service/auth.service';
import { User } from '../../Model/user.model';

@Component({
  selector: 'app-dashboard-equipe',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-equipe.component.html',
  styleUrl: './dashboard-equipe.component.scss'
})
export class DashboardEquipeComponent  {
  
}

