export default function() {
  this.urlPrefix = 'https://conduit.productionready.io'; // make this `http://localhost:8080`, for example, if your API is on a different server
  this.namespace = 'api'; // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.post('/users/login', (schema, request) => {
    // {
    //   "user":{
    //     "email": "jake@jake.jake",
    //     "password": "jakejake"
    //   }
    // }

    const attrs = JSON.parse(request.requestBody).user;
    return schema.db.users.findBy({ email: attrs.email });
  });
}
