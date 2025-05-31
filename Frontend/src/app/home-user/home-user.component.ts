import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit{
  contacto = {
    nombre: '',
    apellido: '',
    telefonoFijo: '',
    celular: '',
    email: ''
  };

  editPopupVisible = false;
  deletePopupVisible = false;

  editarContacto = {
    name: '',
    lastName: '',
    landline: '',
    celular: '',
    email: ''
  };

  contactos: any[] = [];

  selectedContactIndex: number | null = null;
  contactToDeleteIndex: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(){
    this.cargarContactos();
  }

  logOut(){
    sessionStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decodificando JWT', e);
      return null;
    }
  }

  crearContacto(){
    if(this.contacto.nombre &&
      this.contacto.apellido &&
      this.contacto.telefonoFijo &&
      this.contacto.celular &&
      this.contacto.email){

      const token = sessionStorage.getItem('token');

      if(!token){
        alert('No se ha iniciado sesión');
        return;
      }

      const decoded = this.parseJwt(token);
      const userId = decoded ? decoded.sub : null;

      if(!userId){
        alert('Token inválido');
      }

      const body = {
        userId: userId,
        name: this.contacto.nombre,
        lastName: this.contacto.apellido,
        landline: this.contacto.telefonoFijo,
        celular: this.contacto.celular,
        email: this.contacto.email
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      const url = 'http://localhost:6542/api/contact/create';
      
      this.http.post(url, body, {headers}).subscribe({
        next: (resp: any) => {
          alert('Contacto agregado');
          this.contactos.push(resp);
          this.cargarContactos();
          this.contacto = {
            nombre: '',
            apellido: '',
            telefonoFijo: '',
            celular: '',
            email: ''
          };
        },
        error: err => {
          console.error(err);
        }
      });     
    }else{
      alert('Por favor completa todos los campos');
    }
  }

  cargarContactos(){
    const token = sessionStorage.getItem('token');

      if(!token){
        alert('No se ha iniciado sesión');
        return;
      }

      const decoded = this.parseJwt(token);
      console.log(decoded)
      const userId = decoded ? decoded.sub : null;

      if(!userId){
        alert('Token inválido');
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      const url = `http://localhost:6542/api/contact/find/${userId}`;

      this.http.get<any>(url, {headers}).subscribe({
        next: (resp) => {
          console.log(resp)
          this.contactos = resp.contacts;
        },
        error:(err) =>{
          console.error('Error cargando los contactos:', err);
        }
      });
  }

  popupModificarContacto(contacto: any, index: number){
    this.editarContacto = { ...contacto};
    this.selectedContactIndex = index;
    this.editPopupVisible = true;
    this.deletePopupVisible = false;
  }

  modificarContacto(){
    if(this.selectedContactIndex !== null){
      if (this.editarContacto.name &&
      this.editarContacto.lastName &&
      this.editarContacto.landline &&
      this.editarContacto.celular &&
      this.editarContacto.email
      ) {
        const token = sessionStorage.getItem('token');
        if (!token) {
          alert('No se ha iniciado sesión');
          return;
        }

        const decoded = this.parseJwt(token);
        const userId = decoded ? decoded.sub : null;

        if (!userId) {
          alert('Token inválido');
          return;
        }

        const contactoId = this.contactos[this.selectedContactIndex]._id;
        
        const body = {
          userId: userId,
          name: this.editarContacto.name,
          lastName: this.editarContacto.lastName,
          landline: this.editarContacto.landline,
          celular: this.editarContacto.celular,
          email: this.editarContacto.email
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        });

        const url = `http://localhost:6542/api/contact/edit/${contactoId}`

        this.http.put(url, body, {headers}).subscribe({
          next: (res: any) => {
            alert('Contacto modificado');
            this.cargarContactos();
            this.contactos[this.selectedContactIndex!] = res;
            this.editPopupVisible = false;
            this.selectedContactIndex = null;

            this.editarContacto = {
              name: '',
              lastName: '',
              landline: '',
              celular: '',
              email: ''
            };
          },
          error: (err) => {
            console.error('Error modificando el contacto:', err);
            alert('Error al modificar el contacto');
          }
        });
      } else {
        alert('Por favor completa todos los campos para modificar el contacto');
      }
    }
  }

  closepopup(){
    this.editPopupVisible = false;
  }


  popupEliminarContacto(index: number){
    this.contactToDeleteIndex = index;
    this.deletePopupVisible = true;
    this.editPopupVisible = false;
  }

  eliminarContacto(){
    if(this.contactToDeleteIndex !== null){
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      const decoded = this.parseJwt(token);
      const userId = decoded ? decoded.sub : null;

      if (!userId) {
        alert('Token inválido');
        return;
      }

      const contactoId = this.contactos[this.contactToDeleteIndex]._id;

      const url = `http://localhost:6542/api/contact/delete/${contactoId}`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      this.http.delete(url, { headers }).subscribe({
        next: () => {
          alert('Contacto eliminado correctamente');
          this.deletePopupVisible = false;
          this.contactToDeleteIndex = null;
          this.cargarContactos();
        },
        error: (err) => {
          console.error('Error al eliminar el contacto:', err);
        }
      });
    }
  }

  cancelDeleteContact(){
    this.deletePopupVisible = false;
    this.contactToDeleteIndex = null;
  }

}
