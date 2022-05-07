import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{


  public Ejclick="";
  navigationExtras: NavigationExtras;
  items = this.supabaseService.Ejercicio;
  static Ejercicio: string;


  constructor(private supabaseService: SupabaseService,private router: Router,public navCtrl: NavController) {
    
  }
  

  ngOnInit() {
   
  }

  masDetalles(val){
    
    this.Ejclick=val
    this.navigationExtras = { queryParams: {ejercicio: JSON.stringify(this.Ejclick)} }
    this.navCtrl.navigateForward(['/ejercicio'], this.navigationExtras);
    
  }
  
}
