import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-rutina',
  templateUrl: './rutina.page.html',
  styleUrls: ['./rutina.page.scss'],
})
export class RutinaPage implements OnInit {

  

  Ejercicio: string;
  ejercicios=this.supabaseService.ej_rut
  constructor(private supabaseService: SupabaseService,private route: ActivatedRoute) {
    
   }
  
  ngOnInit() {
 
    this.route.queryParams.subscribe(params => { this.Ejercicio = JSON.parse(params["ejercicio"]); });
    this.supabaseService.loadEjercicioRutina(this.Ejercicio)
    this.ejercicios=this.supabaseService.ej_rut

  }
  add_to_hist(){
    this.supabaseService.add_to_hist(this.Ejercicio)
    
  }
  

}
