import SiteMenuView from '../view/site-menu-view';
import { render, RenderPosition, replace, remove } from '../render';
import { UpdateType, FilterType } from '../const';
import { filter } from '../site-utils';

export default class FilterPresenter {
    #filterContainer = null;
    #filterModel = null;
    #moviesModel = null;
    #filterComponent = null;

    constructor(filterContainer, filterModel, moviesModel) {
      this.#filterContainer = filterContainer;
      this.#filterModel = filterModel;
      this.#moviesModel = moviesModel;

      this.#moviesModel.addObserver(this.#handleModelEvent);
      this.#filterModel.addObserver(this.#handleModelEvent);
    }

    get filters() {
      const movies = this.#moviesModel.movies;
      return [
        {
          type: 'all',
          name: 'ALL',
          count: filter[FilterType.ALL](movies).length,
          caption: 'All movies'
        },
        {
          type: 'watchlist',
          name: 'WATCHLIST',
          count: filter[FilterType.WATCHLIST](movies).length,
          caption: 'Watchlist'
        },
        {
          type: 'history',
          name: 'HISTORY',
          count: filter[FilterType.HISTORY](movies).length,
          caption: 'History'
        },
        {
          type: 'favorites',
          name: 'FAVORITES',
          count: filter[FilterType.FAVORITES](movies).length,
          caption: 'Favorites'
        },
      ];
    }

      init = () => {
        const filters = this.filters;
        const prevFilterComponent = this.#filterComponent;

        this.#filterComponent = new SiteMenuView(filters, this.#filterModel.filter);
        this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

        this.#moviesModel.addObserver(this.#handleModelEvent);
        this.#filterModel.addObserver(this.#handleModelEvent);

        if (prevFilterComponent === null) {

          render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
          return;
        }

        replace(this.#filterComponent, prevFilterComponent);
        remove(prevFilterComponent);
      }

      #handleModelEvent = () => {
        this.init();
      }

      #handleFilterTypeChange = (filterType) => {
        if (this.#filterModel.filter === filterType) {
          return;
        }

        this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
      }
}
