import { minsToHours } from '../site-utils';
import dayjs from 'dayjs';
import { genresWrapSpan } from '../site-utils';
import { render, RenderPosition } from '../render';
import SmartView from './smart-view';

const SHAKE_ANIMATION_TIMEOUT = 600;

const createPopupTemplate = (movieToShow, comments) => {

  const genreCounter = () => (movieToShow.genre.length > 1)?'s':'';

  const activeButton = (status) => (status)?'film-details__control-button--active':'';

  const lastComment = comments[comments.length-1];

  const insertEmoji = () => {
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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ movieToShow.commentsIds.length }</span></h3>

        <ul class="film-details__comments-list">
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${ insertEmoji() }</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${ lastComment.isDisabled ? 'disabled' : ''}></textarea>
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
  #commentsElements = null;
  removeObservers = null;

  constructor (movieToShow, comments, removeObservers) {
    super();
    this.movie = movieToShow;
    this._data = this.parseCommentToData(comments);
    this.restoreHandlers();
    this.renderComments();
    this.setEscapeHandler();
    this.removeObservers = removeObservers;
  }

  get template () {
    return createPopupTemplate(this.movie, this._data);
  }

  removeElement () {
    this.element.remove();
    super.removeElement();
    document.querySelector('body').classList.remove('hide-overflow');
  }

  renderComments = () => {
    const commentsArea = this.element.querySelector('.film-details__comments-list');
    const countsCommentsElement = this.element.querySelector('.film-details__comments-count');
    commentsArea.innerHTML = '';
    countsCommentsElement.innerText = this.#commentsElements.size;
    this.#commentsElements.forEach((comment) => {
      render(commentsArea, comment, RenderPosition.AFTERBEGIN);
    });
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

  setSubmitCallback = (callback) => {
    this._callback.submit = callback;
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

  setSubmitHandler = () => {
    document.addEventListener('keypress', this.#submitHandler);
  }

  setEscapeHandler = () => {
    document.addEventListener('keydown', this.#escapeHandler);
  }

  parseCommentToData = (comments) => {
    const arrayOfComments = [];
    this.#commentsElements = comments;
    comments.forEach((comment) => {
      arrayOfComments.push(comment.content);
    });

    return ([...arrayOfComments, {
      emotion: this.emotion,
      comment: this.commentText,
      isDisabled: false, }]);
  }

  setStateDisable = () => {
    this.updateData((this._data.length-1),'isDisabled',true, false);
  }

  setStateEnable = () => {
    this.updateData((this._data.length-1),'isDisabled',false, false);
  }

  shake() {
    const elementToShake = this.element.querySelector('.film-details__add-emoji-label');
    elementToShake.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      this.setStateEnable();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  #escapeHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.removeElement();
    }
  }

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
      this.removeObservers();
    } else if (clickedElement.getAttribute('alt') === 'emoji') {
      this.parseEmotion(clickedElement);
      this.updateData((this._data.length-1),'emotion',this.emotion, false);
    }
  }

  #inputHandler = (evt) => {
    this.commentText = evt.target.value;
    this.updateData((this._data.length-1),'comment',this.commentText, true);
  }

  #resetCommentInput = () => {
    const form = this.element.querySelector('.film-details__inner');
    form.reset();
    this.emotion = '';
    const emojiElement = this.element.querySelector('.film-details__add-emoji-label img');
    emojiElement?.remove();
  }

  #submitHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();
      const comment = {
        text: this.commentText,
        emoji: this.emotion,
      };
      this._callback?.submit(comment);
      this.#resetCommentInput();
    }
  }

  restoreHandlers = () => {
    this.setClickHandler();
    this.setInputHandler();
    this.setScrollHandler();
    this.setScrollPosition();
    this.setSubmitHandler();
  }

  static isOpenPoupView = () => (document.querySelector('.film-details'));
}

