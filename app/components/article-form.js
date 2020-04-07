import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ArticleFormComponent extends Component {
  @service store;
  @service router;

  @tracked article = null;
  @tracked rawTagList = '';

  constructor() {
    super(...arguments);
    if (this.args.article) {
      this.article = this.args.article;
      this.rawTagList = this.article.tagList.join(' ');
    } else {
      this.article = this.store.createRecord('article');
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.article.isNew) {
      this.store.unloadRecord(this.article);
    } else if (this.article.hasDirtyAttributes) {
      if (
        window.confirm("You haven't saved your changes. Are you sure you want to leave the page?")
      ) {
        this.article.rollbackAttributes();
      }
    }
  }

  get buttonIsDisabled() {
    return !this.article.hasDirtyAttributes || this.article.isSaving;
  }

  @action
  async processTags(e) {
    e.preventDefault();
    let tags = this.rawTagList.split(' ');

    // TODO - I'd like to do the following but it doesn't work and I need to use #set. why?
    // this.article.tagList = tags;

    this.article.set('tagList', tags);
  }

  @action
  async publishArticle() {
    try {
      await this.article.save();
      this.router.transitionTo('articles.article', this.article);
    } catch {
      // Catch article validation exceptions
    }
  }
}
