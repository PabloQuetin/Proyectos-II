import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { Tab2Page } from '../tab2/tab2.page';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.page.html',
  styleUrls: ['./ejercicio.page.scss'],
})
export default class EjercicioPage implements OnInit {
  
  Ejercicio: string;
  ejercicios = this.supabaseService.EjercicioConcreto;
  constructor(private supabaseService: SupabaseService,private route: ActivatedRoute) { }
  
  ngOnInit() {
 
    this.route.queryParams.subscribe(params => { this.Ejercicio = JSON.parse(params["ejercicio"]); });
    this.supabaseService.loadEjercicioConcreto(this.Ejercicio);
  }


}
