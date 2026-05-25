export type FlightType = 'Azul nacional' | 'Gol nacional' | 'Latam nacional';

export interface FlightInfo {
  observacao: string;
  taxaAbertura: string;
  sinalizacao: string;
  pagamentoIntegral: string;
  nominacao: string;
  reembolso: string;
  alteracao: string;
  assentos: string;
  correcaoTrocaNomes: string;
  formaPagamento: string;
  siglaTc: string;
  comissao: string;
  comoSolicitar: string;
  siteEmail: string;
  txAbertura2: string;
  sinalizacao2: string;
  emissao: string;
}