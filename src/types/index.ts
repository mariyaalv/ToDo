import { IEvents } from './../components/EventEmitter';
//обект одного дела
export interface IItem {
  id: string;
  name: string;
}

//модель наших данных
export interface IToDoModel extends IEvents {
  items: IItem[];
  addItem: (data: string) => IItem;
  removeItem: (id: string) => void;
  getItem: (id: string) => IItem;
  editItem: (id: string, name: string) => void;
}