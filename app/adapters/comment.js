import ApplicationAdapter from './application';

export default class AuthorAdapter extends ApplicationAdapter {
  endpoint(id) {
    return `${this.host}/articles/${id}/comments`;
  }

  urlForCreateRecord(modelName, snapshot) {
    return this.endpoint(snapshot.record.article.content.id);
  }

  urlForDeleteRecord(id, modelName, snapshot) {
    return `${this.endpoint(snapshot.record.article.content.id)}/${id}`;
  }

  urlForQuery(query) {
    return this.endpoint(query.article_id);
  }
}
