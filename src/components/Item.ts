import { IEvents } from './EventEmitter';
import { EventEmitter } from './EventEmitter';
import { IItem } from './../types/index';
// переписана данная функция
//   function createItem(template: HTMLTemplateElement, name: string) {
//   const itemElement = template.content.querySelector('.todo-item').cloneNode(true) as HTMLElement;
//   const title = itemElement.querySelector('.todo-item__text');
//   title.textContent = name;
//   return itemElement;
// }

//интерфейс для элемента, который создается как экземпляр класса
//будущий объект
export interface IViewItem extends IEvents {
  id: string;
  name: string;
  render(item: IItem): HTMLElement;
  //класс стал легче, удаляем эти функции
  // setCopyHandler(handleCopyItem: Function): void;
  // setDeleteHandler(handleDeleteItem: Function): void;
  // setEditHandler(handleEditItem: Function): void;
}


//позволяет избежать высокой связности в коде
//интерфейс для конструктора
//описывает какие параметры принимает и какой рез-т выдает
export interface IViewItemConstructor {
  new (template: HTMLTemplateElement): IViewItem;
}

// объект предназначен для создания разметки тудушки
// работы с данными здесь не будет, как хранилище тоже не используется
// слой View
export class Item extends EventEmitter implements IViewItem{
  protected itemElement: HTMLElement;
  protected title: HTMLElement;
  protected _id: string;
  protected editButton: HTMLButtonElement;
  protected copyButton: HTMLButtonElement;
  protected deleteButton: HTMLButtonElement;
  // обработчики больше хранить не нужно => мы расширили класс
  // protected handleEditItem: Function;
  // protected handleCopyItem: Function;
  // protected handleDeleteItem: Function;

  constructor(template: HTMLTemplateElement) {
    super();
    //тк метод возвращает нам ноду, а не HTML эл-т, мы принудительно говорим, в каком формате вернуть
    this.itemElement = template.content.querySelector('.todo-item').cloneNode(true) as HTMLElement;
    this.title = this.itemElement.querySelector('.todo-item__text');
    this.editButton = this.itemElement.querySelector('.todo-item__edit');
    this.copyButton = this.itemElement.querySelector('.todo-item__copy');
    this.deleteButton = this.itemElement.querySelector('.todo-item__del');

    //теперь так генерируем событие по клику на кнопку
    this.editButton.addEventListener('click', () => this.emit('edit', {id: this._id}));
    this.copyButton.addEventListener('click', () => this.emit('copy', {id: this._id}));
    this.deleteButton.addEventListener('click', () => this.emit('delete', {id: this._id}));
  }

  get id() {
    return this._id || '';
  }

  set id(data: string) {
    this._id = data;
  }

  get name() {
    return this.title.textContent || '';
  }

  set name(value: string) {
    this.title.textContent = value;
  }
  
  render(item: IItem) {
    this.name = item.name;
    this.id = item.id;
    return this.itemElement;
  }

  // функции нам больше не нужны
  // setEditHandler(handleEditItem: Function) {
  //   this.handleEditItem = handleEditItem;
  //   this.editButton.addEventListener('click', evt => {
  //     this.handleEditItem(this);
  //   })
  // }

  // //установка слушателя
  // setCopyHandler(handleCopyItem: Function) {
  //   this.handleCopyItem = handleCopyItem;
  //   this.copyButton.addEventListener('click', evt => {
  //     //передаем экземпляр самого класса, чтобы потом прописывать любые действия в обработчике
  //     //имеем доступ ко всем данным в карточке (на экране)
  //     this.handleCopyItem(this);
  //   })
  // }

  // setDeleteHandler(handleDeleteItem: Function) {
  //   this.handleDeleteItem = handleDeleteItem;
  //   this.deleteButton.addEventListener('click', evt => {
  //     this.handleDeleteItem(this);
  //   })
  // }

  // название карточки может меняться => 
  // метод будет возвращать карточку с всегда актуальным названием

}