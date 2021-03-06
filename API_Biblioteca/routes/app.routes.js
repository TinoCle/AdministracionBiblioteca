const handler = require('../handlers/app.handler');
const securedRoute = require('../middleware/token').secureRoute;

module.exports = app => {
  app.get('/partners', securedRoute, (req, res) => handler.listAllPartners(req, res));
  app.get('/partners/:id', securedRoute, (req, res) => handler.getPartner(req, res));
  app.post('/partners', securedRoute, (req, res) => handler.addPartner(req, res));
  app.delete('/partners/:id', (req, res) => handler.deletePartner(req, res));
  app.get('/books/', securedRoute, (req, res) => handler.listAllBooks(req, res));
  app.get('/books/:id', (req, res) => handler.getBook(req, res));
  app.post('/books/', securedRoute, (req, res) => handler.addBook(req, res));
  app.put('/books/:id', securedRoute, (req, res) => handler.modifyBook(req, res));
  app.delete('/books/:id', (req, res) => handler.deleteBook(req, res));
  app.get('/loans/', securedRoute, (req, res) => handler.listAllLoans(req, res));
  app.post('/loans/lent', securedRoute, (req, res) => handler.lentBook(req, res));
  app.post('/loans/return', securedRoute, (req, res) => handler.returnBook(req, res));
  // app.post('/time/', (req, res) => handler.modifyTime(req, res));
  app.post('/login', (req, res) => handler.login(req, res));
}