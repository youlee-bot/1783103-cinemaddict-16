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

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();
    prevElement.remove();

    const newElement = this.element;
    parent.appendChild(newElement);
    this.restoreHandlers();
  }
}
