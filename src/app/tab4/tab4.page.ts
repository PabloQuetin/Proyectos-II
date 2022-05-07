import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  usuarios = this.supabaseService.Usuario;
  hist = this.supabaseService.Historial;
  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.supabaseService.loadHist()
    this.hist = this.supabaseService.Historial;
  }
}

