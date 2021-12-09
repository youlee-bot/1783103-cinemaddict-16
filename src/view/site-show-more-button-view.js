import AbstractView from './abstract-view';

const createShowMoreButtonTemplate = () => ('<button class="films-list__show-more">Show more</button>');

export default class ButtonView extends AbstractView{
  get template () {
    return createShowMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    this._callback.click();
  }
}
