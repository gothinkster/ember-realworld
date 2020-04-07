import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service session;
  @service router;

  queryParams = ['tag', 'feed', 'page'];
  tag = null;
  feed = null;
  page = 1;
}
