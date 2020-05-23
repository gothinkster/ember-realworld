import Component from '@glimmer/component';

export default class PaginationComponent extends Component {
  get pages() {
    if (!this.args.total) {
      return [];
    }
    let pages = Math.ceil(this.args.total / this.args.perPage);
    return Array.from(Array(pages).keys()).map((_, index) => index + 1);
  }
}
