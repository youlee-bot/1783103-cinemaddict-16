import AbstractView from './abstract-view';
import { SortType } from '../const';

const createSortTemplate = (sortType) => (`<ul class="sort">
<li><a href="#" class="sort__button ${ sortType === SortType.DEFAULT?'sort__button--active':'' }" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button ${ sortType === SortType.DATE?'sort__button--active':'' }" data-sort="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${ sortType === SortType.RATING?'sort__button--active':'' }" data-sort="${SortType.RATING}">Sort by rating</a></li>
</ul>`);

export default class SortView extends AbstractView{
  #SortType = null;

  constructor(SelectedSortType) {
    super();
    this.#SortType = SelectedSortType;
  }

  get template() {
    return createSortTemplate(this.#SortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.classList.contains('sort__button')) {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.dataset.sort);
    }
  }
}
