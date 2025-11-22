import { Routes } from '@angular/router';
import { Loja } from './pages/loja/loja';
import { Home } from './home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { UserListComponent } from './components/user-list/user-list';
import { ProductFormComponent } from './components/product-form/product-form';
import { UserFormComponent } from './components/user-form/user-form';
import { AdminGuard } from './guards/guard';
import { LoginComponent } from './components/login/login';
import { ProductDetailsComponent } from './product-details/product-details';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [

    // Rotas básicas abertas
    { path: 'loja', component: Loja, title: 'Minha Loja' },
    { path: 'home', component: Home, title: 'Home' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, 

    // ✅ Rota da lista de produtos: ABERTA PARA TODOS.
    { path: 'products', component: ProductListComponent }, 

    // =========================================================
    // 🛑 ROTAS ESPECÍFICAS DE PRODUTO (DEVE VIR ANTES de /:id)
    // =========================================================
    { path: 'products/new', component: ProductFormComponent, canActivate: [AdminGuard] },
    { path: 'products/edit/:id', component: ProductFormComponent , canActivate: [AdminGuard] },
    
    // ✅ Rota de Detalhes de Produto (AGORA LIDA APENAS COM NÚMEROS)
    { path: 'products/:id', component: ProductDetailsComponent }, // Rota genérica com parâmetro ID

    // 🛑 Rota do carrinho
    { path: 'cart', component: CartComponent },

    // Rotas de Usuários
    { path: 'users', component: UserListComponent , canActivate: [AdminGuard] },       
    { path: 'users/new', component: UserFormComponent },
    { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AdminGuard] },
];