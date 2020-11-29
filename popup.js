class Popup {
  constructor(popupSelector) {
    this.popup = document.querySelector(popupSelector);
    this.handleOverlayClose = (e) => {
      if (e.target === this.popup) {
        this.close();
      }
    }
  }

  //Открыть попап
  open() {
    document.addEventListener('click', this.handleOverlayClose);
    this.popup.classList.add('popup_opened');
  }

  close() {
    document.removeEventListener('click', this.handleOverlayClose);
    this.popup.classList.remove('popup_opened');
  }

  setEventListeners() {
    this.closeIcon = this.popup.querySelector('.popup__close-icon');
    this.closeIcon.addEventListener('click', () => this.close());
  }
}
const popup = new Popup('.popup');
popup.setEventListeners();