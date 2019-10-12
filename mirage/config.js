import { Response } from 'ember-cli-mirage';

export default function() {
  this.namespace = 'api'; // make this `/api`, for example, if your API is namespaced
  this.timing = 400; // delay for each request, automatically set to 0 during testing
  this.logging = true;
  /**
   * Authentication
   */
  this.post('/users/login', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    return schema.users.findBy({ email: attrs.email });
  });

  /**
   * User registration
   */
  // this.post('/users', (schema, request) => {});

  /**
   * Get current user
   */
  this.get('/user', (schema, request) => {
    if (request.requestHeaders.authorization === 'Token auth-token') {
      return schema.users.findBy({ email: 'email@example.com' });
    } else {
      return new Response(401, {}, {});
    }
  });

  this.get('/articles', (schema, request) => {
    const params = request.queryParams;
    if (params.author) {
      const { author } = params;

      return schema.articles.all().filter(article => article.author.username === author);
    } else if (params.favorited) {
      /**
       * TODO: Currently there is no way to identify articles favorited by different profiles.
       * This could cause some confusion and difficulty in testing.
       *
       * Consider creating a model that contains an array of favorite articles per user.
       */
      const { favorited } = params;

      return schema.articles.all().filter(article => article.favorited && article.author.id !== favorited);
    } else {
      const allArticles = schema.articles.all(),
        limit = parseInt(params.limit),
        page = parseInt(params.offset) / limit,
        start = page * limit,
        end = start + limit,
        newArticles = allArticles.models.slice(start, end),
        newSchema = {};
      newSchema.articles = newArticles;
      newSchema.articlesCount = allArticles.length;

      return newSchema;
    }
  });

  /**
   * Get feed articles
   */
  // this.get('/articles/feed', (schema, request) => {});

  /**
   * Create article
   */
  // this.post('/articles', (schema, request) => {});

  /**
   * Get an article by ID
   */
  this.get('/articles/:slug', (schema, request) => {
    const slug = request.params.slug;
    const article = schema.articles.findBy({
      slug,
    });
    return article;
  });

  /**
   * Update an article by ID
   */
  // this.put('/articles/:slug', (schema, request) => {});

  /**
   * Delete an article by ID
   */
  this.delete('/articles/:slug', (schema, request) => {
    const slug = request.params.slug;
    const article = schema.articles.findBy({
      slug,
    });

    return article.destroy();
  });

  /**
   * Favorite an article by ID
   */
  this.post('/articles/:slug/favorite', (schema, request) => {
    const slug = request.params.slug;
    const article = schema.articles.findBy({
      slug,
    });

    return article.update({
      favorited: true,
      favoritesCount: article.favoritesCount + 1,
    });
  });

  /**
   * Unfavorite an article by ID
   */
  this.delete('/articles/:slug/favorite', (schema, request) => {
    const slug = request.params.slug;
    const article = schema.articles.findBy({
      slug,
    });

    return article.update({
      favorited: false,
      favoritesCount: article.favoritesCount - 1,
    });
  });

  /**
   * Get an article's comments
   */
  this.get('/articles/:slug/comments', (schema, request) => {
    const slug = request.params.slug;
    const article = schema.articles.findBy({ slug });
    const comments = schema.comments.where({
      articleId: article.id,
    });
    return comments;
  });

  /**
   * Create an article's comment
   */
  this.post('/articles/:slug/comments', (schema, request) => {
    const slug = request.params.slug;
    const message = JSON.parse(request.requestBody).message;
    const article = schema.articles.findBy({ slug });
    const user = schema.users.first();
    const author = schema.profiles.findBy({ username: user.username });

    return schema.comments.create({
      message,
      article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author,
    });
  });

  /**
   * Delete an article's comment
   */
  this.delete('/articles/:slug/comments/:id', (schema, request) => {
    const id = request.params.id;
    const comment = schema.comments.find(id);

    return comment.destroy();
  });

  this.get('/tags', () => {
    return {
      tags: ['emberjs', 'tomster', 'wycats', 'tomdale', 'ember-cli', 'training', 'dragons'],
    };
  });

  this.get('/profiles/:username', (schema, request) => {
    const username = request.params.username;

    return schema.profiles.findBy({ username });
  });

  this.post('/profiles/:username/follow', (schema, request) => {
    const username = request.params.username;
    const profile = schema.profiles.findBy({ username });

    return profile.update({
      following: true,
    });
  });

  this.delete('/profiles/:username/follow', (schema, request) => {
    const username = request.params.username;
    const profile = schema.profiles.findBy({ username });

    return profile.update({
      following: false,
    });
  });
}
