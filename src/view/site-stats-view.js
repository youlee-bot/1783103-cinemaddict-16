import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { settingsForChart, timeCount, getDataForPeriod } from '../stats-utils';
import { StatsType } from '../const';

const renderChart = (statisticCtx, data) => {

  const chartSettings = settingsForChart(data);

  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: chartSettings.genres,
      datasets: [{
        data: chartSettings.genresCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data) => {

  const styleTotalDuration = timeCount(getDataForPeriod(data)).replace('m', '<span class="statistic__item-description">m</span>').replace('h', '<span class="statistic__item-description">h</span>');

  return (`<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Movie buff</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${ data.statsType === 'all-time'?'checked':''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${ data.statsType === 'today'?'checked':''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${ data.statsType === 'week'?'checked':''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${ data.statsType === 'month'?'checked':''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${ data.statsType === 'year'?'checked':''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${ getDataForPeriod(data).length } <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${ styleTotalDuration }</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${ settingsForChart(data).topGenre?settingsForChart(data).topGenre:'' }</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`);
};

export default class StatisticsView extends SmartView {
  #statsType = StatsType.ALL;
  #chart = null;

  constructor(movies) {
    super();

    this._data = {movies, statsType: this.#statsType};

    this.#setCharts();
    this.#setPeriodClickHandler();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  updateStatsData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  removeElement = () => {
    this.element.remove();
    super.removeElement();
    this.#chart.destroy();
  }

  renderComments = () => {}

  restoreHandlers = () => {
    this.#setCharts();
    this.#setPeriodClickHandler();
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(statisticCtx, this._data);
  }

  #setPeriodClickHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('click', this.#handlePeriodClick);
  }

  #handlePeriodClick = (evt) => {
    if (evt.target.classList.contains('statistic__filters-input')) {
      if (this.#statsType === evt.target.value){
        return;
      }

      this.#statsType = evt.target.value;
      this.updateStatsData({statsType: this.#statsType});
    }
  }
}
