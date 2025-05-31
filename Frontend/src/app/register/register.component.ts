import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public inputNombre: string = "";
  public inputApellido: string = "";
  public inputEmail: string = "";
  public inputPassword: string = "";
  public confirmPassword: string = "";
  public message: string = "";

  constructor(private http : HttpClient, private router: Router){}

  goToLogin(){
    this.router.navigate(['/login']);
  }

  register() {
    if (this.inputPassword !== this.confirmPassword) {
      this.message = "Las contraseñas no coinciden.";
      return;
    }

    const url = "http://localhost:6542/api/register";

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      name: this.inputNombre,
      lastName: this.inputApellido,
      email: this.inputEmail,
      password: this.inputPassword,
      role: "User",
    };

    this.http.post(url, body, { headers }).subscribe({
      next: (resp: any) => {
        this.message = resp.message || "Usuario registrado con éxito";
        this.inputNombre = "";
        this.inputApellido = "";
        this.inputEmail = "";
        this.inputPassword = "";
        this.confirmPassword = "";
      },
      error: err => {
        console.error(err);
        this.message = "Error al registrar usuario";
      }
    });
  }
}
