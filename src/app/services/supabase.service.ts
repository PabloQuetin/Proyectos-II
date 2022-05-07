import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { log } from 'console';
import { promise } from 'protractor';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const EJERCICIO_DB = 'Ejercicio';
const RUTINA_DB = 'Rutina';
const USUARIO_DB = 'Usuario_data';

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  deporte: string;
 
}
export interface Rutina {
  id: number;
  usuario: string;
  nombre: string;
  
}
export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  peso: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase: SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  private _Ejercicio: BehaviorSubject<any> = new BehaviorSubject([]);
  private _EjercicioConcreto: BehaviorSubject<any> = new BehaviorSubject([]);
  private _Rutinas: BehaviorSubject<any> = new BehaviorSubject([]);
  private _LastRutine: BehaviorSubject<any> = new BehaviorSubject([]);
  private _ej_rut:BehaviorSubject<any> = new BehaviorSubject([]);
  private _Historial:BehaviorSubject<any> = new BehaviorSubject([]);
  private _Usuario: BehaviorSubject<any> = new BehaviorSubject([]);
  private aux=[]
  private aux2=[]
 
  
  constructor(private router: Router) {

    this.supabase = createClient(environment.supabaseUrl,environment.supabasekey,{
      autoRefreshToken: true,
      persistSession: true
    });

    this.supabase.auth.onAuthStateChange((event, session) => { 
    
      console.log('event: ', event);
                                                         
      if (event == 'SIGNED_IN') {
      
        this._currentUser.next(session.user);
        this.loadEjercicio();
        this.loadUsuario();
        this.loadHist();
      
      } else {
        
        this._currentUser.next(false);
      
      }
      });
  }

  //////////////////////////////////////user management //////////////////////////////////

  async signUp(credentials: { email, password }) {
    
    return new Promise(async (resolve,reject) => {
      const {error, user} = await this.supabase.auth.signUp(credentials);
      if(error){
        reject(error)

      }else{
        resolve(user)
      }
    })
  }

  async signIn(credentials: { email, password }) {
    
    return new Promise(async (resolve,reject) => {
      const {error, user} = await this.supabase.auth.signIn(credentials);
      if(error){
        reject(error)

      }else{
        resolve(user)
      }
    })
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.supabase.getSubscriptions().map(sup => {
      this.supabase.removeSubscription(sup);
    });
    this.router.navigateByUrl("/login")
  }
  
  async loadUsuario() {

    const queryU = await this.supabase.from(USUARIO_DB).select('*').match({Usuario_id: this._currentUser.value.id});
    console.log('query: ', queryU);
    this._Usuario.next(queryU.data);

  }
  //////////////////////////getters //////////////////////////////
  get Ejercicio(): Observable<Ejercicio[]>{
    return this._Ejercicio.asObservable();
  }

  get EjercicioConcreto(): Observable<Ejercicio[]>{
    return this._EjercicioConcreto.asObservable();
  }
  get Rutinas(): Observable<Rutina[]>{
    return this._Rutinas.asObservable();
  }
  get LastRutine(): Observable<Rutina[]>{
    return this._LastRutine.asObservable();
  }
  get ej_rut(): Observable<Rutina[]>{
    return this._ej_rut.asObservable();
  }
  get Historial(): Observable<Rutina[]>{
    return this._Historial.asObservable();
  }
  get Usuario(): Observable<Usuario[]>{
    return this._Usuario.asObservable();
  }
  /////////////////////////////////////EJERCICIOS/////////////////////////////////
  async loadEjercicio() {

   const query = await this.supabase.from(EJERCICIO_DB).select('*');
   console.log('query: ', query);
   this._Ejercicio.next(query.data);
  }
  async loadEjercicioConcreto(name:string) {

    const query1 = await this.supabase.from(EJERCICIO_DB).select('*').match({ Nombre: name });
    console.log('query1: ', query1);
    this._EjercicioConcreto.next(query1.data);
   }
  //////////////////////////////// USER DATA ///////////////////////

  async adduserdata(data){
    const datos={
      Usuario_id: this.supabase.auth.user().id,
      Nombre: data.Nombre,
      Apellidos: data.Apellidos,
      Edad: data.Edad,
      Peso: data.Peso
    };

    const result=await this.supabase.from("Usuario_data").insert(datos)
  }

  //////////////////////////////// RUTINAS /////////////////////////
  async loadRutinas() {

    const query = await this.supabase.from("Rutina").select('*').match({Usuario_id: this.supabase.auth.user().id}  );
    console.log('query: ', query);
    this._Rutinas.next(query.data);

  }
  async addRutina(Nombre){
    const datos={
      Usuario_id: this.supabase.auth.user().id,
      Nombre: Nombre,
    };

    const result=await this.supabase.from("Rutina").insert(datos)
  }

  async addEjerciciosRutina(data){
    const datos={
      Rutina_id: data.Rutina,
      Ejercicio_id: data.Ejercicio,
      Repeticiones: +data.Repeticiones
    };

    const result=await this.supabase.from("Rutina-Ejercicio").insert(datos)
  }

  async loadRutinaConcreta(name:string) {

    const query1 = await this.supabase.from("Rutina").select('*').match({ Nombre: name,Usuario_id: this.supabase.auth.user().id  });
    console.log('query1: ', query1);
    this._LastRutine.next(query1.data);

  }
  async loadEjercicioRutina(name_Rut){
    this.aux=[]
    const query_rutina = await this.supabase.from("Rutina").select('*').match({ Nombre: name_Rut });
    console.log(query_rutina.data[0].Rutina_id)
    const query_rutina2 = await this.supabase.from("Rutina-Ejercicio").select('*').match({ Rutina_id: query_rutina.data[0].Rutina_id });
    query_rutina2.data.forEach(element => {
      this.get_data_ej(element.Ejercicio_id,element.Repeticiones)
      
    });
    this._ej_rut.next(this.aux)
    
    console.log(this._ej_rut)
  }
  async get_data_ej(id,reps){
    const query1 = await this.supabase.from("Ejercicio").select('*').match({ Ejercicio_id: id });
    this.aux.push({Nombre: query1.data[0].Nombre,Reps: reps});
  }

  //////////////////////////////// Historial //////////////////////////////////
  async add_to_hist(name){
    const query_rutina = await this.supabase.from("Rutina").select('*').match({ Nombre: name, Usuario_id:  this.supabase.auth.user().id });
    console.log(query_rutina.data[0].Rutina_id)
    const datos={
      Usuario_id: this.supabase.auth.user().id,
      Rutina_id: query_rutina.data[0].Rutina_id,

    };
    const result=await this.supabase.from("Historial").insert(datos)
  }
  async loadHist(){
    this.aux2=[]
    const query_rutina = await this.supabase.from("Historial").select('*').match({ Usuario_id:  this.supabase.auth.user().id  });
    console.log(query_rutina.data)
    query_rutina.data.forEach(element => {
      this.get_data_hist(element.Rutina_id,element.Fecha)
      console.log(element.Rutina_id)
    });
    this._Historial.next(this.aux2)
    
  }
  async get_data_hist(id_ej,fecha){
    const query1 = await this.supabase.from("Rutina").select('*').match({ Rutina_id: id_ej,Usuario_id:  this.supabase.auth.user().id });
    console.log(query1.data)
    this.aux2.push({Nombre: query1.data[0].Nombre,Fecha: fecha});
  }
}
