// src/app/App.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
// REMOVA ESTAS LINHAS:
// import { ReactiveFormsModule } from '@angular/forms'; 
// import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-root',
  // MANTENHA APENAS o RouterOutlet e os componentes filhos
  imports: [RouterOutlet, Header, Footer], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cervejaria');
}