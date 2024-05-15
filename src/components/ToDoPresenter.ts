import { IPopup } from './Popup';
import { IToDoModel } from "../types";
import { IViewItem, IViewItemConstructor } from "./Item";
import { IForm, IFormConstructor } from "./Form";
import { IPage } from "./Page";

//отвечает за взаимодействие между слоями
export class ItemPresenter {
  protected itemTemplate: HTMLTemplateElement;
  protected formTemplate: HTMLTemplateElement;
  protected todoNewForm: IForm;
  protected todoEditForm: IForm;
  protected handleSubmitEditForm: (data: {value: string}) => void;

  constructor(
    protected model: IToDoModel,
    protected formConstructor: IFormConstructor,//для создания новых форм
    protected viewPageContainer: IPage,
    protected viewItemConstructor: IViewItemConstructor,//конструктор для созданий item
    protected modal: IPopup,
  ) {
// const itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;
// const formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement
    this.itemTemplate = document.querySelector(
      "#todo-item-template"
    ) as HTMLTemplateElement;
    this.formTemplate = document.querySelector(
      "#todo-form-template"
    ) as HTMLTemplateElement;
  }

  //наполнение страницы
  //было
  // const todoForm = new Form(formTemplate);
  // todoForm.setHandler(handleFormSubmit);
  // //render возращает разметку формы и мы ее добавляем в контейнер
  // page.formContainer = todoForm.render();
  //стало
   init() {
    this.todoNewForm = new this.formConstructor(this.formTemplate);
    // this.todoForm.setHandler(this.handleSubmitForm.bind(this));
    this.todoNewForm.buttonText = 'Добавить';
    this.todoNewForm.placeholder = 'Следующее дело';
    this.viewPageContainer.formContainer = this.todoNewForm.render();
    this.todoEditForm = new this.formConstructor(this.formTemplate);
    this.todoEditForm.buttonText = 'Изменить';
    this.todoEditForm.placeholder = 'Новое название';
    
    this.model.on('changed', () => {
      this.renderView();
    })

    this.todoNewForm.on('submit', this.handleSubmitForm.bind(this));
    this.todoEditForm.on('submit', (data: {value: string}) => this.handleSubmitEditForm(data));
  }

  //было
  // function handleFormSubmit(data: string) {
  //   todoArray.addItem(data);//добавляем новую тудушку
  //   // => надо очистить форму
  //   todoForm.clearValue();
  //   // => надо перерисовать
  //   renderTodoItems();
  // }
  //стало
  handleSubmitForm(data: string) {
    this.model.addItem(data);
    // => больше не нужно в обработчиках вызывать эту функцию
    // this.renderView();
    this.todoNewForm.clearValue();
  }

  // //обработчик для новой формы (сабмита)
  // handleSubmitEditForm(data: string, id: string) {
  //   this.model.editItem(id, data);
  //   // this.renderView();
  //   this.todoEditForm.clearValue();
  //   this.modal.close();
  // }

  //обработчик для редактирования (кнопки)
  handleEditItem(item: {id: string}) {
    const editedItem = this.model.getItem(item.id);
    this.todoEditForm.setValue(editedItem.name);
    this.modal.content = this.todoEditForm.render();
    // this.setHandler((data: string) => this.handleSubmitEditForm(data, item.id))
    // пересоздаем функцию при каждом открытии формы, за счет замыкания сохраняем айдишник текущего эл-та
    this.handleSubmitEditForm = (data: {value: string}) => {
      this.model.editItem(item.id, data.value);
      this.todoEditForm.clearValue();
      this.modal.close();
    }
    this.modal.open();
  }
  //обработчик для копирования
  handleCopyItem(item: {id: string}) {
    const copyedItem = this.model.getItem(item.id);
    this.model.addItem(copyedItem.name);
    // this.renderView();
  }

  //обработчик для удаления
  // было (внимание на параметр)
  // handleDeleteItem(item: IViewItem) {
  //   this.model.removeItem(item.id);
  //   // this.renderView();
  // }
  //стало
  handleDeleteItem(item: {id: string}) {
    this.model.removeItem(item.id);
  }

  //было
  // const page = new Page(contentElement);
  // function renderTodoItems() {
  //   page.todoContainer = todoArray.items.map(item => {
  //     const todoItem = new Item(itemTemplate);//получаем экземпляр класса
  //     const itemElement = todoItem.render(item);//получаем разметку 1 карточки
  //     return(itemElement);
  //   }).reverse();//чтобы тудушки добавлялись сверху
  // }
  // renderTodoItems();//для начального отображения
  //стало
  renderView() {
    const itemList = this.model.items
      .map((item) => {
        const todoItem = new this.viewItemConstructor(this.itemTemplate); //получаем экземпляр класса
        todoItem.on('copy', this.handleCopyItem.bind(this));//чтобы не потерять контекст
        todoItem.on('delete', this.handleDeleteItem.bind(this));
        todoItem.on('edit', this.handleEditItem.bind(this));
        const itemElement = todoItem.render(item); //получаем разметку 1 карточки
        return itemElement;
      })
      .reverse();

    this.viewPageContainer.todoContainer = itemList;
  }
}
