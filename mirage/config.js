import { Response } from 'ember-cli-mirage';

export default function() {
  this.namespace = 'api'; // make this `/api`, for example, if your API is namespaced
  this.timing = 400; // delay for each request, automatically set to 0 during testing

  this.post('/users/login', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    return schema.users.findBy({ email: attrs.email });
  });

  this.get('/user', (schema, request) => {
    if (request.requestHeaders.authorization === 'Token auth-token') {
      return schema.users.findBy({ email: 'email@example.com' });
    } else {
      return new Response(401, {}, {});
    }
  });

  this.get('/articles', (schema, request) => {
    let allArticles = schema.articles.all(),
      params = request.queryParams,
      limit = parseInt(params.limit),
      page = parseInt(params.offset) / limit,
      start = page * limit,
      end = start + limit,
      newArticles = allArticles.models.slice(start, end),
      newSchema = {};
    newSchema.articles = newArticles;
    newSchema.articlesCount = allArticles.length;

    return newSchema;
  });

  this.get('/tags', () => {
    return {
      tags: ['emberjs', 'tomster', 'wycats', 'tomdale', 'ember-cli']
    };
  });
}
