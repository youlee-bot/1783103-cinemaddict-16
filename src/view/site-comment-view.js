import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import AbstractView from './abstract-view';

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

export default class CommentView extends AbstractView{
  #content = null;

  constructor (content) {
    super();
    this.#content = content;
  }

  get template () {
    return createCommentTemplate(this.#content);
  }
}
