import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  constructor() {}

  // O ngOnInit pode ser assíncrono!
  async ngOnInit() {
    await this.carregarVeiculos();
  }

  // 1. GET /vehicles usando Fetch
  async carregarVeiculos() {
    try {
      const response = await fetch(`${this.apiUrl}/vehicles`);
      if (!response.ok) throw new Error('Erro ao buscar veículos');
      
      const dados = await response.json();
      this.veiculosApi = dados.vehicles;
      this.modelos = this.veiculosApi.map(v => v.vehicle);
      
      // Seleciona o primeiro modelo por padrão (ex: Ranger)
      if (this.modelos.includes('Ranger')) {
        this.selecionarModelo('Ranger');
      } else if (this.modelos.length > 0) {
        this.selecionarModelo(this.modelos[0]);
      }
    } catch (error) {
      console.error('Erro na requisição dos veículos:', error);
    }
  }

  selecionarModelo(modelo: string) {
    this.modeloSelecionado = modelo;
    const veiculo = this.veiculosApi.find(v => v.vehicle === modelo);

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

  // 2. POST /vehicleData usando Fetch
  async filtrarTabela() {
    if (!this.filtroVin.trim()) {
      this.tabelaFiltrada = [];
      this.mostrarTabela = false;
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/vehicleData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vin: this.filtroVin.trim() })
      });

      // Se o status for 400 ou 500 (VIN não encontrado), vai direto para o catch
      if (!response.ok) {
        throw new Error('VIN não encontrado');
      }

      const dadosVeiculo = await response.json();

      // Formata os dados para bater com o que o HTML espera
      this.tabelaFiltrada = [{
        vin: this.filtroVin.toUpperCase(),
        odometro: `${dadosVeiculo.odometro} km`,
        combustivel: `${dadosVeiculo.nivelCombustivel}%`,
        status: dadosVeiculo.status === 'on' ? 'Online' : 'OFF',
        lat: dadosVeiculo.lat,
        long: dadosVeiculo.long
      }];

      this.mostrarTabela = true;

    } catch (error) {
      // Limpa a tabela caso dê erro (VIN inválido)
      this.tabelaFiltrada = [];
      this.mostrarTabela = false;
    }
  }
}