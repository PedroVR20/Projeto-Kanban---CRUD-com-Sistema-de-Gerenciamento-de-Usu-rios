import { Routes } from '@angular/router';
import { CadastroagenciasComponent } from './components/cadastroagencias/cadastroagencias.component';
import { VistosComponent } from './components/vistos/vistos.component';
import { KanbanBoardComponent } from './components';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GerenciarPerfisComponent } from './components/gerenciar-perfis/gerenciar-perfis.component';

export const routes: Routes = [
    {
        path: 'cadastro-agencia',
        component: CadastroagenciasComponent,
        canActivate: [AuthGuard] // Protegido pelo guarda
    },
    {
        path: 'vistos',
        component: VistosComponent,
        canActivate: [AuthGuard] // Protegido pelo guarda
    },
    {
        path: 'Home',
        component: KanbanBoardComponent,
        canActivate: [AuthGuard] // Protegido pelo guarda
    },
    {
        path: 'Login',
        component: LoginComponent,
        canActivate: [AuthGuard] // Protegido também, para evitar acesso de quem já logou
    },
    {
        path: '', 
        redirectTo: '/Home', // A rota padrão agora é a Home
        pathMatch: 'full' 
    },

    {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
    },
    {
    path: 'gerenciar-perfis',
    component: GerenciarPerfisComponent,
    canActivate: [AuthGuard, AdminGuard]
    }
];
