

export interface Task {
  clientName: string;
  visaApplicationType: string;
  clientId: string;
  file: string;
  agency: string;
  agencyContact: string;
  hiringDate: string;
  state: string;
  casvDateTime: string;
  consulateDateTime: string;
  visaCountry: string;
  processStatus: string;
}

export interface ApiTask extends Task {
  id: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export interface PedidoFormData {
  id?: string;
  clientName?: string;
  visaApplicationType?: string;
  clientId?: string;
  file?: string;
  agency?: string;
  agencyContact?: string;
  hiringDate?: string;
  state?: string;
  casvDateTime?: string;
  consulateDateTime?: string;
  visaCountry?: string;
  processStatus?: string;
  editReason?: string;
}
