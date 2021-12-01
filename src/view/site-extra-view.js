import { createItemTemplate } from './site-item-view';

export const createExtraTemplate = () => (`<section class="films-list films-list--extra">
<h2 class="films-list__title">Top rated</h2>

<div class="films-list__container">
  ${ createItemTemplate(1) }
  ${ createItemTemplate(2) }
</div>
</section>`);
