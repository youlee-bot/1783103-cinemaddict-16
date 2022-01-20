import AbstractView from './abstract-view';

const createExtraTemplate = (title, tag) => (`<section class="films-list films-list--extra">
  <h2 class="films-list__title">${ title }</h2>

  <div class="films-list__container films-list__container--${ tag }">
  </div>
  </section>`);

export default class ExtraView extends AbstractView{
  #title = null;
  #tag = null;

  constructor (title, tag) {
    super();
    this.#tag = tag;
    this.#title = title;
  }

  static getExtraTag (tag) {
    return document.querySelector(`.films-list__container--${tag}`);
  }

  get template () {
    return createExtraTemplate(this.#title, this.#tag);
  }
}
