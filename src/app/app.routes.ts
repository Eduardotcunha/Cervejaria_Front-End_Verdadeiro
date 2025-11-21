import { Routes } from '@angular/router';
import { Loja } from './pages/loja/loja';
import { Home } from './home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { UserListComponent } from './components/user-list/user-list';
import { ProductFormComponent } from './components/product-form/product-form';
import { UserFormComponent } from './components/user-form/user-form';
import { AdminGuard } from './guards/guard';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [

    // Rotas básicas abertas
    { path: 'loja', component: Loja, title: 'Minha Loja' },
    { path: 'home', component: Home, title: 'Home' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 

    // ✅ Rota da lista de produtos: ABERTA PARA TODOS.
    { path: 'products', component: ProductListComponent }, 
    
    // Rotas de GERENCIAMENTO de Produtos: PROTEGIDAS PELO ADMIN GUARD.
    { path: 'products/new', component: ProductFormComponent, canActivate: [AdminGuard] },
    { path: 'products/edit/:id', component: ProductFormComponent , canActivate: [AdminGuard] },
    
    // Rota da lista de Usuários: PROTEGIDA (Apenas ADMIN vê a lista).
    { path: 'users', component: UserListComponent , canActivate: [AdminGuard] },       
    
    // Cadastro de Novo Usuário (Aberto)
    { path: 'users/new', component: UserFormComponent },
    
    // Edição de Usuário: PROTEGIDA.
    { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AdminGuard] },
];