import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public Ejclick="";
  navigationExtras: NavigationExtras;
  items = this.supabaseService.Rutinas;
  hist = this.supabaseService.Historial;

  static Ejercicio: string;
  constructor(private supabaseService: SupabaseService,private router: Router,public navCtrl: NavController) {}
  ngOnInit() {
    this.supabaseService.loadRutinas()
    this.items=this.supabaseService.Rutinas
    this.supabaseService.loadHist()
    this.hist = this.supabaseService.Historial;
  }

  masDetalles(val){
    
    this.Ejclick=val
    this.navigationExtras = { queryParams: {ejercicio: JSON.stringify(this.Ejclick)} }
    this.navCtrl.navigateForward(['/rutina'], this.navigationExtras);
    
  }
}
