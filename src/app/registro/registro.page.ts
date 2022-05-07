import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private supabaseService: SupabaseService
   ) {}

  ngOnInit() {
    this.formularioLogin = this.fb.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators. required],
    });
  }


  async signUp() {
    console.log("entra en login")

    const loading = await this.loadingController.create(); 
    await loading.present();

    this.supabaseService.signUp(this.formularioLogin.value).then(async data => {
      await loading.dismiss();
      
      this.supabaseService.signIn(this.formularioLogin.value).then(async data => {
        await loading.dismiss();
        this.router.navigateByUrl('/user-data', { replaceUrl: true });
      }, async err => {
        await loading.dismiss();
       this.showError('Login failed', err.message);
      })

    }, async err => {
      await loading.dismiss();
     this.showError('Login failed', err.message);
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
