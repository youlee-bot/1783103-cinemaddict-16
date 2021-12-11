import AbstractView from './abstract-view';

const createUserRatingTemplate = () => (`<section class="header__profile profile">
<p class="profile__rating">Movie Buff</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`);

export default class RatingView extends AbstractView{
  get template() {
    return createUserRatingTemplate();
  }
}
