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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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

  async logIn() {
    console.log("entra en login")

    const loading = await this.loadingController.create(); 
    await loading.present();

    this.supabaseService.signIn(this.formularioLogin.value).then(async data => {
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/tabs/tab1', { replaceUrl: true });
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
