
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
  status: string;
  columnId: string;
}


export interface ApiTask extends Task {
  id: string;
}


export interface Column {
  id: string;
  name: string;
  tasks: ApiTask[];
}
