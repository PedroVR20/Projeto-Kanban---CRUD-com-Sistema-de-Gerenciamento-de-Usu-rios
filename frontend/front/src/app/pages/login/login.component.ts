import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from '../../services/users-api.service'; // Ajuste o caminho se necessário
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;      // O 'subject', que no seu caso é o e-mail.
  userId: string;   // O ID do usuário.
  role: string;     // O perfil (ex: "MASTER", "OPERADOR").
  status: string;   // O status (ex: "ATIVO", "PENDENTE", "REJEITADO").
  exp: number;      // O timestamp de expiração (padrão do JWT).
  iat: number;      // O timestamp de criação (padrão do JWT).
  iss: string;      // O 'issuer', quem emitiu o token.
}

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
     CommonModule,
     FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public isLoginMode = true;
  public successMessage: string | null = null;

  public registerForm = {
    nome: '',
    email: '',
    senha: ''
  };

  public loginForm = {
    email: '',
    senha: ''
  };
 
  public errorMessage: string | null = null;

  // --- INÍCIO DAS NOVAS ALTERAÇÕES ---
  private rejectedTimestamp: number | null = null; // Guarda quando o usuário foi detectado como rejeitado
  private readonly COOLDOWN_SECONDS = 10; // 10 segundos de tempo de espera
  // --- FIM DAS NOVAS ALTERAÇÕES ---
 
  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) { }

  public toggleMode(event: Event): void {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
    this.clearMessages();
  }

  
  public onRegisterSubmit(): void {
    this.clearMessages();

    this.userApiService.criar(this.registerForm).subscribe({
      next: (response) => {
        console.log('Cadastro realizado com sucesso!', response);
        this.successMessage = 'Cadastro realizado com sucesso! Agora você já pode fazer o login.';
        this.isLoginMode = true; 
      },
     error: (err) => {
        console.error('Erro no cadastro:', err);
        if (err.status === 400 && err.error) {
            if (err.error.email) {
                this.errorMessage = err.error.email;
            } 
            else if (err.error.nome) {
                this.errorMessage = err.error.nome;
            }
            else if (err.error.senha) {
                this.errorMessage = err.error.senha;
            }
            else {
                this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
            }
        } else {
            this.errorMessage = 'Não foi possível realizar o cadastro. Tente novamente.';
        }
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
    // --- INÍCIO DAS NOVAS ALTERAÇÕES ---
    this.rejectedTimestamp = null; // Garante que o timer seja limpo ao trocar de formulário ou limpar mensagens
    // --- FIM DAS NOVAS ALTERAÇÕES ---
  }
  
  public onLoginSubmit(): void {
    this.errorMessage = null;
   
    if (!this.loginForm.email || !this.loginForm.senha) {
      this.errorMessage = 'Por favor, preencha o e-mail e a senha.';
      return;
    }

    // --- INÍCIO DAS NOVAS ALTERAÇÕES ---
    // Se já sabemos que o usuário foi rejeitado, vamos tratar o cooldown
    if (this.rejectedTimestamp) {
      const secondsSinceRejection = (Date.now() - this.rejectedTimestamp) / 1000;

      if (secondsSinceRejection < this.COOLDOWN_SECONDS) {
        // Ainda está no cooldown, apenas mostra a mensagem e não faz nada
        this.errorMessage = `Seu perfil foi rejeitado. Aguarde ${Math.ceil(this.COOLDOWN_SECONDS - secondsSinceRejection)} segundos para solicitar novamente.`;
        return;
      } else {
        // Cooldown acabou! Vamos tentar "recadastrar" para reativar o pedido.
        console.log('Cooldown finalizado. Tentando reenviar solicitação de aprovação...');
        this.resubmitApprovalRequest();
        return; // Interrompe o fluxo de login normal
      }
    }
    // --- FIM DAS NOVAS ALTERAÇÕES ---
   
    this.userApiService.autenticar(this.loginForm).subscribe({
      next: (response) => {
        try {
          const token = response.token;
          const decodedToken: DecodedToken = jwtDecode(token);

          if (decodedToken.status === 'PENDENTE') {
            this.errorMessage = 'Seu perfil ainda aguarda aprovação do administrador.';
            return;
          }

          // --- INÍCIO DAS NOVAS ALTERAÇÕES ---
          if (decodedToken.status === 'REJEITADO') {
            this.errorMessage = 'Seu perfil foi rejeitado. Tente novamente em alguns segundos para reenviar sua solicitação.';
            // Inicia o timer!
            this.rejectedTimestamp = Date.now(); 
            return;
          }
          // --- FIM DAS NOVAS ALTERAÇÕES ---

          // Se o status for 'ATIVO', o login continua.
          console.log('Login bem-sucedido e perfil ativo!');
          this.userApiService.setToken(token); 
          this.router.navigate(['/Home']);

        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          this.errorMessage = 'Ocorreu um erro inesperado durante o login (token inválido).';
        }
      },
      error: (err) => {
        console.error('Erro na autenticação:', err);
        this.errorMessage = 'Credenciais inválidas ou erro no servidor.';
      }
    });
  }

  // --- INÍCIO DAS NOVAS ALTERAÇÕES ---
  private resubmitApprovalRequest(): void {
  this.userApiService.criar({ 
      nome: 'Re-solicitacao',
      email: this.loginForm.email, 
      senha: this.loginForm.senha 
  }).subscribe({
    // AGORA O SUCESSO É O CAMINHO ESPERADO!
    next: () => {
      this.errorMessage = 'Uma nova solicitação de aprovação foi enviada ao administrador.';
      this.rejectedTimestamp = null; // Reseta o timer
    },
    // O erro agora só acontece se algo inesperado ocorrer (ex: servidor offline)
    error: (err) => {
      this.errorMessage = 'Não foi possível reenviar a solicitação. Tente novamente mais tarde.';
      this.rejectedTimestamp = null; // Reseta o timer após a tentativa
    }
  });
}
  // --- FIM DAS NOVAS ALTERAÇÕES ---
}
