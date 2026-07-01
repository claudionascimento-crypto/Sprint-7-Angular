import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';// 1. Importa o serviço de autenticação

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario = '';
  senha = '';
  mensagem = '';

  // Usando o recurso "inject" do Angular moderno para trazer o router e o authService
  private router = inject(Router);
  private authService = inject(AuthService);

  login() {
    if (this.usuario === 'admin' && this.senha === '123456') {
      
      // 2. Salva o token fictício no localStorage antes de ir para a home
      this.authService.login('token_fake_ford_sprint7');
      
      // 3. Agora o segurança (Guard) vai deixar passar!
      this.router.navigate(['/home']);

    } else {
      this.mensagem = 'Usuário ou senha inválidos';
    }
  }
}