
import { ApiTask } from './task.model';

export interface Column {
  id: string;
  name: string;
  tasks: ApiTask[]; 
}
