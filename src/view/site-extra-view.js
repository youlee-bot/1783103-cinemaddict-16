import ItemView from './site-item-view';
import AbstractView from './abstract-view';

const createExtraTemplate = (movie) => (`<section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>

  <div class="films-list__container">
    ${ (new ItemView(movie).element).outerHTML }
    ${ (new ItemView(movie).element).outerHTML }
  </div>
  </section>`);

export default class ExtraView extends AbstractView{
  #movie = null;

  constructor (movie) {
    super();
    this.#movie = movie;
  }

  get template () {
    return createExtraTemplate(this.#movie);
  }
}
