import { EventEmitter } from './EventEmitter';
import { IItem, IToDoModel } from '../types';

export class ToDoModel extends EventEmitter implements IToDoModel {
  protected _items: IItem[];

  constructor() {
    super();
    this._items = [];
  };
  
  get items() {
    return this._items;
  };

  set items(data: IItem[]) {
    this._items = data; //позволяет сохранить готовый массив
    this.emit('changed');//генерируем событие, название сами придумали
  };

  addItem(data: string) {
    const uniqueId: number = Math.max(...this._items.map(item => Number(item.id))) + 1;//создаем новый уникальный id
    const newItem: IItem = {id: String(uniqueId), name: data};
    this._items.push(newItem);
    this.emit('changed');//лучше разные события генерировать => логика на будущее
    return newItem;
  };

  removeItem (id: string) {
    this._items = this._items.filter(item => item.id !== id);
    this.emit('changed');
  };

  editItem (id: string, name: string) {
    const editedItem = this._items.find(item => item.id === id);
    editedItem.name = name;
    this.emit('changed');
  };
  
  //чтобы изменять данные одного дела, а не массива
  getItem (id: string) {
    return this._items.find(item => item.id === id)
  };
}