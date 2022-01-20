import AbstractView from './abstract-view';

const createBoardTemplate = () => ('<section class="films"><section class="films-list"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div></section></section>');

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }

  static getBoardContainerTag () {
    return document.querySelector('.films-list__container');
  }

  static getFilmListTag () {
    return document.querySelector('.films-list');
  }

  static getBodyTag () {
    return document.querySelector('body');
  }

  static getFooterTag () {
    return document.querySelector('.footer__statistics');
  }
}
