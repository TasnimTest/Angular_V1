import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';
import { EmployeeSkill } from '../../Model/employee-skill.module';
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { Domaine, Niveau } from '../competence/competence-enum';
import { UserService } from '../../Service/user.service';
import { AuthService } from '../../Service/auth.service';
import { User } from '../../Model/user.model';
import { ChartOptions } from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  skills: EmployeeSkill[] = [];
  userId!: number;

  constructor(
    private skillService: EmployeeSkillService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.fetchUserSkills();
  }

  // Fetch the user ID + fetch user skills related to this iD
  fetchUserSkills(): void {
    const userDetails = this.authService.getUserDetails(); //Fetch for the Username in the token of the logged in user
  

    if (userDetails && userDetails.username) {
      this.userService.getUserByUsername(userDetails.username).subscribe(   // load the user details based on his username
        (user: User | null) => {
          if (user) {
            this.userId = user.matricule;  // get the user ID from the loaded data 
            this.getAllUserSkills();  //fetch for  this user_skills
          } else {
            console.error('User NOT found');
          }
        },
        (error) => {
          console.error('Error while fetching user skills:', error);
        }
      );
    } else {
      console.error('Username not found');
    }
  }

  //fetch userskills based on his ID
  getAllUserSkills(): void {
    if (this.userId !== null) {
      this.skillService.getAllUserSkills(this.userId).subscribe(
        (data: any[]) => {
          this.skills = data.map(item => item.skill);  // stock the fetched data in the data array
          this.renderCharts();
        },
        (error) => {
          console.error(' error while fetching user skills', error);
        }
      );
    } else {
      console.error('User ID is null');
    }
  }

  renderCharts(): void {
    this.renderPieChart();
    this.renderBarChart();
  }

  // Pie Chart to display the different USer_skills Domains
  renderPieChart(): void {
    if (this.skills.length === 0) {
      console.warn('No skills found for user ID:', this.userId);
      return;
    }
  
    const domainDataMap = new Map<string, number>();
    this.skills.forEach(skillObj => {
      const domaine = skillObj.domaine; 
      if (domaine) {
        const count = domainDataMap.get(domaine) || 0;
        domainDataMap.set(domaine, count + 1);
      }
    });
  
    const labels: string[] = Array.from(domainDataMap.keys());
    const dataValues: number[] = Array.from(domainDataMap.values());
  
    if (labels.length === 0 || dataValues.length === 0) {
      console.warn('No labels or data values found.');
      return;
    }
  
    const backgroundColors: string[] = labels.map(() => this.generateRandomColor());
    const borderColors: string[] = backgroundColors.map(color => this.darkenColor(color));
  
    const data = {
      labels: labels,
      datasets: [{
        label: 'Skills by Domain',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    };
  
    const options: ChartOptions = {

        plugins: {
          title: {
            display: true,
            text: 'Employee Skills domains', 
            position: 'bottom', 
            font: {
              size: 18 
            }
          },
        legend: {
          display: true,
          position: 'top', 
          align: 'start', 
        },
      },
    };
  
    this.createChart('pieChart', 'pie', data, options);
  }
  

  renderBarChart(): void {
    if (!this.userId) {
      console.error('User ID is null.');
      return;
    }

    this.skillService.getAllUserSkills(this.userId).subscribe(
      (userSkills: EmployeeSkill[]) => {
        if (!userSkills || userSkills.length === 0) {
          console.warn('No skills found for the user.');
          return;
        }

        const labels: string[] = [];
        const dataValues: number[] = [];
        const backgroundColor: string = this.generateRandomColor();

        userSkills.forEach((skill) => {
          const skillName = skill['skill'].nom_compétence;
          const skillLevel = skill['skill'].niveau as Niveau;
          labels.push(skillName);
          dataValues.push(Object.values(Niveau).indexOf(skillLevel) + 1);
        });

        const dataset = {
          label: 'Skill Level',
          data: dataValues,
          backgroundColor: backgroundColor,
        };

        const data = {
          labels: labels,
          datasets: [dataset],
        };

        const options: ChartOptions = {
          plugins: {
            title: {
              display: true,
              text: 'Employee Skills levels', 
              position: 'bottom', 
              font: {
                size: 18 
              }
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Skill Name'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Skill Level'
              },
              ticks: {
                callback: (value: string | number) => {
                  if (typeof value === 'number') {
                    return Object.values(Niveau)[value - 1];
                  }
                  return value;
                },
                stepSize: 1,
              },
            },
          },
        };
        

        this.createChart('barChart', 'bar', data,options);
      },
      (error) => {
        console.error('An error occurred while fetching user skills:', error);
      }
    );
  }

  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  darkenColor(color: string): string {
    let num = parseInt(color.replace("#",""), 16);
    num -= 0x222222;
    let hex = num.toString(16);
    hex = hex.padStart(6, '0');
    return "#" + hex;
  }

  createChart(canvasId: string, type: keyof ChartTypeRegistry, data: ChartConfiguration['data'], options?: ChartOptions): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Unable to get 2D context for canvas.');
      return;
    }
  
    new Chart(ctx, {
      type: type,
      data: data,
      options: options 
    });
  }
}