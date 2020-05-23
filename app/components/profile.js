import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CommentComponent extends Component {
  @service session;
}
