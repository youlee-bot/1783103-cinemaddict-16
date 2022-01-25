import { MenuItem } from '../const';
import SmartView from './smart-view';


const createSiteMenuTemplate = (filter, currentFilterType, menuType) => {
  const {type, name, count, caption} = filter;
  if (type ==='all') {
    return `<a href="#${ name }" class="main-navigation__item ${ currentFilterType === type&menuType === MenuItem.MOVIES ? 'main-navigation__item--active':''}" data-type=${ type }>${ caption }</a>`;
  }
  return (`<a href="#${ name }" class="main-navigation__item ${ currentFilterType === type&menuType === MenuItem.MOVIES ? 'main-navigation__item--active':''}" data-type=${ type }>${ caption } <span class="main-navigation__item-count">${ count }</span></a>`);
};

const createFilterTemplate = (filterItems, currentFilterType, menuType) => {
  const currentFilterElement = filterItems.map((filter) => createSiteMenuTemplate(filter, currentFilterType, menuType)).join('');
  return (`<nav class="main-navigation">
  <div class="main-navigation__items">
  ${ currentFilterElement }
  </div>
  <a href="#stats" class="main-navigation__additional ${menuType === MenuItem.STATS ?' main-navigation__additional--active' : ''}" data-stats="stats">Stats</a>
  </nav>`);
};

export default class SiteMenuView extends SmartView{
  #filters = null;
  #currentFilter = null;
  #menuType = MenuItem.MOVIES;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#setFilterTypeChangeHandler();
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter, this.#menuType);
  }

  restoreHandlers = () => {
    this.#setFilterTypeChangeHandler();
  }

  setFilterTypeChangeCallback = (callback) => {
    this._callback.filterTypeChange = callback;
  }

  #setFilterTypeChangeHandler = () => {
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  updateMenu = (type) => {
    this.#menuType = type;
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.element.remove();
    this.removeElement();
    const newElement = this.element;
    parent.prepend(newElement);
  }

  setStatsClickCallback = (callback) => {
    this._callback.statsClick = callback;
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.dataset.type){
      this._callback.filterTypeChange(evt.target.dataset.type);
      this._callback.statsClick(MenuItem.MOVIES);
      this.updateMenu(MenuItem.MOVIES);
      this.restoreHandlers();
    }
    if (evt.target.dataset.stats) {
      this.updateMenu(MenuItem.STATS);
      this._callback.statsClick(MenuItem.STATS);
      this.restoreHandlers();

    }
  }
}

