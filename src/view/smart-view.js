import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (element,field, update, justUpdating) => {
    if (update) {
      this._data[element][field] = update;
    }

    if (justUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers = () => {

  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();


    const newElement = this.element;
    this.renderComments();
    parent.appendChild(newElement);
    this.restoreHandlers();
  }
}
