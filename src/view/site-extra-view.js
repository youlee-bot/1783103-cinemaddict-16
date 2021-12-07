import ItemView from './site-item-view';
import { createElement } from '../render';

const createExtraTemplate = (movie) => (`<section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container">
    ${ (new ItemView(movie).element).outerHTML }
    ${ (new ItemView(movie).element).outerHTML }
  </div>
  </section>`);

export default class ExtraView {
  #element = null;
  #movie = null;

  constructor (movie) {
    this.#movie = movie;
  }

  get element () {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get movie () {
    if(!this.#movie) {
      this.#movie = createElement(this.template);
    }

    return this.#movie;
  }

  get template () {
    return createExtraTemplate(this.#movie);
  }

  removeElement() {
    this.#element = null;
  }
}
