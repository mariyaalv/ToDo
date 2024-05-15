export interface IPopup {
  content: HTMLElement;
  open(): void;
  close(): void;
}

export class Popup implements IPopup {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(protected container: HTMLElement) {
    this.closeButton = container.querySelector('.popup__close');
    this._content = container.querySelector('.popup__content');

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.container.querySelector('.popup__container').addEventListener('click', event => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('popup_is-opened');
  }

  close() {
    this.container.classList.remove('popup_is-opened');
    this.content = null;
  }
}