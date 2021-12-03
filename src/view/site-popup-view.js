import { readyComments, readyContent } from '../mock/generator';
import { minsToHours } from '../mock/utils';
import dayjs from 'dayjs';
import { genresWrapSpan } from '../site-utils';
import { createCommentTemplate } from './site-comment-view';

export const createPopupTemplate = (movieId) => {

  const showComments = (movie) => {
    let movieComments = '';
    for (const index of readyComments) {
      if (index.movieId===movie) {
        movieComments += createCommentTemplate(index);
      }
    }
    return movieComments;
  };

  const genreCounter = () => {
    if (readyContent[movieId].genre.length > 1) {
      return ('s');
    } else {
      return ('');
    }
  };

  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${ readyContent[movieId].poster }" alt="">

          <p class="film-details__age">${ readyContent[movieId].ageRating }+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${ readyContent[movieId].title }</h3>
              <p class="film-details__title-original">${ readyContent[movieId].alternativeTitle }</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${ readyContent[movieId].totalRating }</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${ readyContent[movieId].director }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${ readyContent[movieId].writers }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${ readyContent[movieId].actors }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${ dayjs(readyContent[movieId].release.date).format('DD MMMM YYYY') }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${ minsToHours(readyContent[movieId].runtime) }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${ readyContent[movieId].release.releaseCountry }</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${ genreCounter() }</td>
              <td class="film-details__cell">
              ${ genresWrapSpan(readyContent[movieId].genre) }</td>
            </tr>
          </table>

          <p class="film-details__film-description">${ readyContent[movieId].description }</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ readyContent[movieId].comments }</span></h3>

        <ul class="film-details__comments-list">
          ${ showComments(movieId) }
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

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
