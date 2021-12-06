import { createElement } from '../render';

const createShowMoreButtonTemplate = () => ('<button class="films-list__show-more">Show more</button>');

export default class ButtonView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element =createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createShowMoreButtonTemplate();
  }

  removeElement () {
    this.element = null;
  }
}
