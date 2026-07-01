import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private apiUrl = 'http://localhost:3001';

  modeloSelecionado = '';
  filtroVin = '';
  imagemCarro = '';

  vendas = 0;
  conectados = 0;
  atualizados = 0;

  mostrarTabela = false;

  veiculosApi: any[] = [];
  modelos: string[] = [];
  tabelaFiltrada: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {

    this.http.get<any>(`${this.apiUrl}/vehicles`)
      .subscribe({

        next: (dados) => {

          this.veiculosApi = dados.vehicles;

          this.modelos = this.veiculosApi.map(
            (v: any) => v.vehicle
          );

          // Seleciona Ranger automaticamente
          if (this.modelos.includes('Ranger')) {

            this.selecionarModelo('Ranger');

          } else if (this.modelos.length > 0) {

            this.selecionarModelo(this.modelos[0]);

          }

        },

        error: (erro) => {

          console.error('Erro ao buscar veículos:', erro);

        }

      });

  }

  selecionarModelo(modelo: string): void {

    this.modeloSelecionado = modelo;

    const veiculo = this.veiculosApi.find(
      (v: any) => v.vehicle === modelo
    );

    if (veiculo) {

      this.vendas = veiculo.volumetotal;
      this.conectados = veiculo.connected;
      this.atualizados = veiculo.softwareUpdates;
      this.imagemCarro = veiculo.img;

    }

    this.tabelaFiltrada = [];
    this.filtroVin = '';
    this.mostrarTabela = false;

  }

  filtrarTabela(): void {

    if (!this.filtroVin.trim()) {

      this.tabelaFiltrada = [];
      this.mostrarTabela = false;
      return;

    }

    this.http.post<any>(
      `${this.apiUrl}/vehicleData`,
      {
        vin: this.filtroVin.trim()
      }
    )
    .subscribe({

      next: (dadosVeiculo) => {

        this.tabelaFiltrada = [

          {
            vin: this.filtroVin.toUpperCase(),
            odometro: `${dadosVeiculo.odometro} km`,
            combustivel: `${dadosVeiculo.nivelCombustivel}%`,
            status: dadosVeiculo.status === 'on'
              ? 'Online'
              : 'OFF',
            lat: dadosVeiculo.lat,
            long: dadosVeiculo.long
          }

        ];

        this.mostrarTabela = true;

      },

      error: (erro) => {

        console.error('Erro ao buscar dados do veículo:', erro);

        this.tabelaFiltrada = [];
        this.mostrarTabela = false;

      }

    });

  }

  // ==========================
  // LOGOUT
  // ==========================
  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}