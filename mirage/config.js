import { Response } from 'ember-cli-mirage';
import { isBlank, isPresent } from '@ember/utils';

export const validateUserUsername = (username = '') => {
  const errors = [];

  username = username.trim();

  if (isBlank(username)) {
    errors.push("can't be blank");
  }

  if (username.length < 0) {
    errors.push('is too short (minimum is 1 character)');
  }

  if (username.length > 20) {
    errors.push('is too long (maximum is 20 characters)');
  }

  return errors;
};

export const validateUserEmail = (email = '') => {
  const errors = [];

  email = email.trim();

  if (isBlank(email)) {
    errors.push("can't be blank");
  }

  return errors;
};

export const validateArticleTitle = (title = '') => {
  const errors = [];

  title = title.trim();

  if (isBlank(title)) {
    errors.push("can't be blank");
  }

  if (title.length < 0) {
    errors.push('is too short (minimum is 1 character)');
  }

  if (title.length > 200) {
    errors.push('is too long (maximum is 200 characters)');
  }

  return errors;
};

export const validateArticleBody = (body = '') => {
  const errors = [];

  body = body.trim();

  if (isBlank(body)) {
    errors.push("can't be blank");
  }

  return errors;
};

export const validateArticleDescription = (description = '') => {
  const errors = [];

  description = description.trim();

  if (isBlank(description)) {
    errors.push("can't be blank");
  }

  if (description.length < 0) {
    errors.push('is too short (minimum is 1 character)');
  }

  if (description.length > 500) {
    errors.push('is too long (maximum is 500 characters)');
  }

  return errors;
};

export default function () {
  this.namespace = ''; // make this `/api`, for example, if your API is namespaced
  this.timing = 400; // delay for each request, automatically set to 0 during testing

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
  this.post('/users', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).user;
    return schema.users.findBy({ email: attrs.email });
  });

  /**
   * Get current user
   */
  this.get('/user', (schema, request) => {
    const { authorization } = request.requestHeaders;
    if (authorization) {
      const [authType, token] = request.requestHeaders.authorization.split(' ');

      if (authType === 'Token' && token) {
        const user = schema.users.findBy({ token });

        if (user) {
          return user;
        }
      }
    }

    return new Response(401, {}, {});
  });

  /**
   * Update current user
   */
  this.put('/user', (schema, request) => {
    const body = JSON.parse(request.requestBody);
    const { user: userData } = body;
    const { email, username } = userData;
    const user = schema.users.find(username);

    const errors = {
      username: validateUserUsername(username),
      email: validateUserEmail(email),
    };

    const filteredErrors = Object.entries(errors).reduce((acc, [key, arr]) => {
      if (arr.length) {
        acc[key] = arr;
      }
      return acc;
    }, {});

    if (Object.keys(filteredErrors).length) {
      return new Response(422, {}, { errors: filteredErrors });
    }

    /**
     * Look up profile by the user's old username in order to update it.
     */
    const profile = schema.profiles.findBy({ username: user.username });
    profile.update(userData);

    return user.update(userData);
  });

  this.get('/articles', (schema, request) => {
    const params = request.queryParams;
    if (params.author) {
      const { author } = params;

      return schema.articles.all().filter((article) => article.author.username === author);
    } else if (params.favorited) {
      /**
       * TODO: Currently there is no way to identify articles favorited by different profiles.
       * This could cause some confusion and difficulty in testing.
       *
       * Consider creating a model that contains an array of favorite articles per user.
       */
      const { favorited } = params;

      return schema.articles
        .all()
        .filter((article) => article.favorited && article.author.id !== favorited);
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
  this.post('/articles', (schema, request) => {
    const {
      article: { title, body, description, tagList },
    } = JSON.parse(request.requestBody);
    const errors = {
      title: validateArticleTitle(title),
      description: validateArticleDescription(description),
      body: validateArticleBody(body),
    };

    const filteredErrors = Object.entries(errors).reduce((acc, [key, arr]) => {
      if (arr.length) {
        acc[key] = arr;
      }
      return acc;
    }, {});

    if (Object.keys(filteredErrors).length) {
      return new Response(422, {}, { errors: filteredErrors });
    }

    return this.create('article', {
      title,
      body,
      description,
      tagList: tagList.filter(isPresent).invoke('trim'),
    });
  });

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
  this.put('/articles/:slug', (schema, request) => {
    const slug = request.params.slug;
    const {
      article: { title, body, description, tagList },
    } = JSON.parse(request.requestBody);
    const errors = {
      title: validateArticleTitle(title),
      description: validateArticleDescription(description),
      body: validateArticleBody(body),
    };

    const filteredErrors = Object.entries(errors).reduce((acc, [key, arr]) => {
      if (arr.length) {
        acc[key] = arr;
      }
      return acc;
    }, {});

    if (Object.keys(filteredErrors).length) {
      return new Response(422, {}, { errors: filteredErrors });
    }

    return schema.articles
      .findBy({
        slug,
      })
      .update({
        title,
        body,
        description,
        tagList: tagList.filter(isPresent).invoke('trim'),
      });
  });

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
