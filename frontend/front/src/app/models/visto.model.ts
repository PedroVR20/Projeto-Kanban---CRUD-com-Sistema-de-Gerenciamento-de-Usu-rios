// src/app/models/visto.model.ts

export interface VistoRequest {
  nome: string;
}

export interface VistoResponse {
  id: string; 
  nome: string;
  nomeOperador: string;
}
