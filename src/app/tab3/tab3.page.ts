import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Console } from 'console';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  
  navigationExtras: NavigationExtras;
  items = this.supabaseService.Ejercicio;
  Rutinas= this.supabaseService.Rutinas;
  last_Rutina: any
  static Ejercicio: string;
  Ejercicios_seleccionados=[]
  Ejercicios_seleccionados_id=[]
  ejercicio
  aux

  constructor(private supabaseService: SupabaseService,private router: Router,public navCtrl: NavController) {
    
  }

  ngOnInit() {
    this.Ejercicios_seleccionados=[]
    this.Ejercicios_seleccionados_id=[]
  }
  async Add_ej(Ej,rep){
    await this.supabaseService.loadEjercicioConcreto(Ej)
    await this.supabaseService.EjercicioConcreto.subscribe(ej=>this.ejercicio=ej)
    this.Ejercicios_seleccionados.push({Ejercicio: this.ejercicio[0].Nombre,Repeticiones: rep})
    this.Ejercicios_seleccionados_id.push({Ejercicio: this.ejercicio[0].Ejercicio_id,Repeticiones: rep})
  }
 
  async Add_rutina(Nombre_rutina){
   
    //creamos rutinas
    await this.supabaseService.addRutina(Nombre_rutina)
    //actualizamos el array de rutinas y obtenemos ela ultima rutina añadida
    await this.supabaseService.loadRutinas();
    this.Rutinas = this.supabaseService.Rutinas;
    let temp
    await this.Rutinas.subscribe(rutinas => this.aux=rutinas.sort((a, b) => (a.id > b.id) ? -1 : 1))
    this.aux=this.aux.sort((a, b) => (a.Rutina_id < b.Rutina_id) ? -1 : 1)
      
    this.last_Rutina=this.aux[this.aux.length-1]
   

    await this.Ejercicios_seleccionados_id.forEach(i => {
      this.supabaseService.addEjerciciosRutina({Rutina: this.last_Rutina.Rutina_id, Ejercicio: i.Ejercicio, Repeticiones: i.Repeticiones})
      
    });

    
    
  
  }

  
}
