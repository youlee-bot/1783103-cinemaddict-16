import AbstractView from './abstract-view';

const createSiteMenuTemplate = (filter, currentFilterType) => {
  const {type, name, count, caption} = filter;
  if (type ==='all') {
    return `<a href="#${ name }" class="main-navigation__item main-navigation__item--active" data-type=${ type }>${ caption }</a>`;
  }
  return (`<a href="#${ name }" class="main-navigation__item ${ currentFilterType === type ? 'main-navigation__item--active':''}" data-type=${ type }>${ caption } <span class="main-navigation__item-count">${ count }</span></a>`);
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const currentFilterElement = filterItems.map((filter) => createSiteMenuTemplate(filter, currentFilterType)).join('');
  return (`<nav class="main-navigation">
  <div class="main-navigation__items">
  ${ currentFilterElement }
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`);
};

export default class SiteMenuView extends AbstractView{
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.dataset.type){
      this._callback.filterTypeChange(evt.target.dataset.type);
    }
  }
}

