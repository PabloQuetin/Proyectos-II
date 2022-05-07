import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  formularioInfo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private supabaseService: SupabaseService
   ) {}


  ngOnInit() {
    this.formularioInfo = this.fb.group({ 
      Nombre: ['', Validators. required],
      Apellidos: ['', Validators. required],
      password: ['', Validators. required],
      Edad: ['', Validators. required],
      Peso: ['', Validators. required],
    });

  }
  async mandar_data() {
    
    const loading = await this.loadingController.create(); 
    await loading.present();

    this.supabaseService.adduserdata(this.formularioInfo.value).then(async data => {
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/tabs/tab2', { replaceUrl: true });
    }, async err => {
      await loading.dismiss();
     this.showError('failed', err.message);
    });

  }
  async showError(title,msg){
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

