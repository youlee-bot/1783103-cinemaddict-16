import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { createElement } from '../render';

const createCommentTemplate = (content) => (`<li class="film-details__comment">
<span class="film-details__comment-emoji">
  <img src="./images/emoji/${ content.emotion }.png" width="55" height="55" alt="emoji-puke">
</span>
<div>
  <p class="film-details__comment-text">${ content.comment }</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${content.author }</span>
    <span class="film-details__comment-day">${dayjs(content.date, 'dd').fromNow() }</span>
    <button class="film-details__comment-delete">Delete</button>
  </p>
</div>
</li>`);

export default class CommentView {
  #element = null;
  #content = null;

  constructor (content) {
    this.#content = content;
  }

  get element () {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createCommentTemplate(this.#content);
  }

  removeElement() {
    this.#element = null;
  }
}
