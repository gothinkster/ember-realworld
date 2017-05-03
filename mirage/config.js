import { Response } from 'ember-cli-mirage';

export default function() {
  // this is awkward, ideally we would be doing this via the proxy.
  // this.urlPrefix = 'https://conduit.productionready.io'; // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = 'api'; // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

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

  this.get('/articles');
}
