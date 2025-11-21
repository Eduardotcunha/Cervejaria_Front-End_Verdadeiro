import { Routes } from '@angular/router';
import { Loja } from './pages/loja/loja';
import { Home } from './home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { UserListComponent } from './components/user-list/user-list';
import { ProductFormComponent } from './components/product-form/product-form'; // Importar
import { UserFormComponent } from './components/user-form/user-form';
export const routes: Routes = [

    {
    path: 'loja', // O segmento da URL (ex: suaapp.com/loja)
    component: Loja, // O componente que o Angular deve carregar
    title: 'Minha Loja' // Opcional: Define o título do documento (guia do navegador)
},
  { path: 'home', component: Home, title: 'Home' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'products', component: ProductListComponent }, // Rota para listar produtos
  { path: 'products/new', component: ProductFormComponent }, // Nova rota para cadastro
  
  
  { path: 'users', component: UserListComponent },       // Rota para listar usuários
  { path: 'users/new', component: UserFormComponent },
];
