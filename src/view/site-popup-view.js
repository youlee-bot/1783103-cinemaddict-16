import { minsToHours } from '../mock/utils';
import dayjs from 'dayjs';
import { genresWrapSpan } from '../site-utils';
import CommentView from './site-comment-view';
import SmartView from './smart-view';

const createPopupTemplate = (movieToShow, comments) => {

  const showComments = () => {
    let movieComments = '';
    comments.forEach((comment) => {
      if (comment.movieId>=0) {
        movieComments += (new CommentView(comment).element).outerHTML;
      }
    });

    return movieComments;
  };

  const genreCounter = () => (movieToShow.genre.length > 1)?'s':'';

  const activeButton = (status) => (status)?'film-details__control-button--active':'';

  const insertEmoji = () => {
    const lastComment = comments[comments.length-1];
    if (!lastComment.emotion) {
      return '';
    }
    return `<img src="images/emoji/${ lastComment.emotion }.png" width="55" height="55" alt="emoji-${ lastComment.emotion }"></img>`;
  };

  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${ movieToShow.poster }" alt="">

          <p class="film-details__age">${ movieToShow.ageRating }+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${ movieToShow.title }</h3>
              <p class="film-details__title-original">${ movieToShow.alternativeTitle }</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${ movieToShow.totalRating }</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${ movieToShow.director }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${ movieToShow.writers }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${ movieToShow.actors }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${ dayjs(movieToShow.release.date).format('DD MMMM YYYY') }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${ minsToHours(movieToShow.runtime) }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${ movieToShow.release.releaseCountry }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${ genreCounter() }</td>
              <td class="film-details__cell">
              ${ genresWrapSpan(movieToShow.genre) }</td>
            </tr>
          </table>

          <p class="film-details__film-description">${ movieToShow.description }</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${ activeButton(movieToShow.userDetails.watchlist) } film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${ activeButton(movieToShow.userDetails.alreadyWatched) } film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${ activeButton(movieToShow.userDetails.favorite) } film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ movieToShow.comments }</span></h3>

        <ul class="film-details__comments-list">
          ${ showComments(comments) }
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${ insertEmoji() }</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  </section>`);
};

export default class PopupView extends SmartView{
  comments = null;
  movie = null;
  emotion = null;
  commentText = null;
  totalComments = null;
  scrollPosition = 0;

  constructor (movieToShow, comments) {
    super();
    this.movie = movieToShow;
    this.totalComments = comments.length;
    this._data = PopupView.parseCommentToData(comments);
    this.restoreHandlers();
  }

  get template () {
    return createPopupTemplate(this.movie, this._data);
  }

  removeElement () {
    this.element.remove();
    super.removeElement();

    document.querySelector('body').classList.remove('hide-overflow');
  }

  parseEmotion = (clickedElement) => {
    const clickedParent = clickedElement.closest('label');
    const labelForAttribure = clickedParent.getAttribute('for');
    this.emotion = labelForAttribure.replace('emoji-', '');
  }

  setWatchlistCallback = (callback) => {
    this._callback.watchlist = callback;
  }

  setWatchCallback = (callback) => {
    this._callback.watch = callback;
  }

  setFavoriteCallback = (callback) => {
    this._callback.favorite = callback;
  }

  setCloseCallback = (callback) => {
    this._callback.close = callback;
  }

  setClickHandler = () => {
    this.element.addEventListener('click', this.#clickHandler);
  }

  setInputHandler = () => {
    const commentInputField = this.element.querySelector('.film-details__comment-input');
    commentInputField.addEventListener('input', this.#inputHandler);
  }

  setScrollPosition = () => {
    this.element.scrollTop = this.scrollPosition;
  }

  setScrollHandler = () => {
    this.element.addEventListener('scroll', this.#scrollHandler);
  }

  static parseCommentToData = (comments) => ([...comments,{
    emotion: this.emotion===null,
    comment: this.commentText===null}]);

  #scrollHandler = (evt) => {
    this.scrollPosition = evt.target.scrollTop;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    const clickedElement = evt.target;
    if(clickedElement.classList.contains ('film-details__control-button--favorite')) {
      this._callback?.favorite();
      clickedElement.classList.toggle('film-details__control-button--active');
    } else if (clickedElement.classList.contains ('film-details__control-button--watched')) {
      this._callback?.watch();
      clickedElement.classList.toggle('film-details__control-button--active');
    } else if (clickedElement.classList.contains ('film-details__control-button--watchlist')) {
      this._callback?.watchlist();
      clickedElement.classList.toggle('film-details__control-button--active');
    } else if (clickedElement.classList.contains ('film-details__close-btn')) {
      this._callback?.close();
    } else if (clickedElement.getAttribute('alt') === 'emoji') {
      this.parseEmotion(clickedElement);
      this.updateData(this.totalComments,'emotion',this.emotion, false);
    }
  }

  #inputHandler = (evt) => {
    this.commentText = evt.target.value;
    this.updateData(this.totalComments,'comment',this.commentText, true);
  }

  restoreHandlers = () => {
    this.setClickHandler();
    this.setInputHandler();
    this.setScrollHandler();
    this.setScrollPosition();
  }
}

