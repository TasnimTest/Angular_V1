import { Domaine, Niveau } from "../Components/competence/competence-enum";

export class EmployeeSkill {
  [x: string]: any;
  id_employeeskill: number; 
  id:number;
  userId: number; 
  nom_compétence:string; 
  domaine: Domaine; 
  niveau: Niveau; 

  constructor(id_employeeskill: number,id :number,userId: number, nom_compétence: string, domaine:Domaine, niveau: Niveau) {
    this.id_employeeskill = id_employeeskill;
    this.id=id;
    this.userId =userId;
    this.nom_compétence = nom_compétence;
    this.domaine = domaine;
    this.niveau = niveau;
  }
}