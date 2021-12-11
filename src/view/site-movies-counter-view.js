import AbstractView from './abstract-view';

const createMoviesCounterTemplate = (content) => (`<p>${ content } movies inside</p>`);

export default class moviesView extends AbstractView{
  #content = null;

  constructor (content) {
    super();
    this.#content = content;
  }

  get template () {
    return createMoviesCounterTemplate(this.#content);
  }
}
