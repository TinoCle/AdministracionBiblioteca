const valid = require('../validators/validator');
const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

get = async (resp, path) => {
  let promise = new Promise((res, rej) => {
    http.get(`http://localhost:7070${path}`, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        console.log(`GET ${path} OK`);
        res(JSON.parse(data));
      });
    }).on('error', (err) => {
      console.log(`GET ${path} INTERNAL SERVER ERROR`);
      resp.status(500).json({ message: 'Internal server error.' });
      res(500);
    });
  });
  let result = await promise;
  return result;
}

post = (res, body, path, method) => {
  if (!body) {
    body = {}
  }
  const dataToWrite = JSON.stringify(body);
  const options = {
    host: 'localhost',
    port: 7070,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataToWrite)
    }
  };
  let data = '';
  const req = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    let statusCode = response.statusCode;
    response.on('end', () => {
      if (
        statusCode === 201 ||
        statusCode === 200 ||
        statusCode === 204 ||
        statusCode === 404
      ) {
        res.status(statusCode).json(JSON.parse(data));
      }
      else {
        res.status(500).json({ message: 'Internal server error.' });
      }
    });
  });

  req.on('error', e => {
    res.status(500).json({ message: 'Internal server error.' });
  });

  // Write data to request body
  req.write(dataToWrite);
  req.end();
}

login = async (body) => {
  const dataToWrite = JSON.stringify(body);
  const options = {
    host: 'localhost',
    port: 7070,
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataToWrite)
    }
  };
  let data = '';
  let promise = new Promise((res, rej) => {
    const req = http.request(options, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });
      let statusCode = response.statusCode;
      response.on('end', () => {
        if (statusCode === 200) {
          res(JSON.parse(data));
        }
        else {
          res(99);
        }
      });
    });

    req.on('error', e => {
      res(-1);
    });

    // Write data to request body
    req.write(dataToWrite);
    req.end();
  });
  let result = await promise;
  return result;
}

module.exports = {
  /////////////////////////////////// ACCOUNTS ///////////////////////////////////////
  listAllPartners: async (req, res) => {
    let partners = await get(res, `/partners`);
    if (partners != 500) {
      res.status(200).json(partners);
    }
  },
  getPartner: async (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let partner = await get(res, `/partners/${id}`);
      console.log("partner found: " + partner);
      if (partner != 500) {
        if (partner) {
          res.status(200).json(partner);
        } else {
          res.status(404).json({ message: "The partner doesn't exist." });
        }
      }
    } else {
      console.log(`GET /partners/${id} INVALID ID`);
      res.status(400).json({ message: 'Invalid id.' });
    }
  },
  addPartner: async (req, res) => {
    let { name } = req.body;
    let { surname } = req.body;
    let { id } = req.body;
    if (valid.string(name) && valid.string(surname) && valid.id(id)) {
      let partner = await get(res, `/partners/${id}`);
      if (partner != 500) {
        if (partner) {
          console.log(`POST /partners/${id} CONFLICT`);
          res.status(409).json({ message: "The partner already exist." });
        } else {
          console.log(`POST /partners/${id} NEW`);
          post(res, req.body, `/partners`, 'POST');
        }
      }
    } else {
      console.log(`POST /partners/${id} INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  deletePartner: async (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let existance = await get(res, `/partners/${id}`);
      if (existance != 500) {
        if (existance) {
          post(res, null, `/partners/${id}`, 'DELETE');
        } else {
          console.log(`DELETE /partners/${id} NOT FOUND`);
          res.status(404).json({ message: "The partner doesn't exist" });
        }
      }
    } else {
      console.log(`DELETE /partners/${id} INVALID ID`);
      res.status(400).json({ message: "Invalid id." });
    }
  },
  ///////////////////////////////////////// BOOKS ////////////////////////////////////
  listAllBooks: async (req, res) => {
    let books = await get(res, `/books`);
    if (books != 500) {
      res.status(200).json(books);
    }
  },
  getBook: async (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let book = await get(res, `/books/${id}`);
      if (book != 500) {
        if (book) {
          res.status(200).json(book);
        } else {
          res.status(404).json({ message: "The book doesn't exist." });
        }
      }
    } else {
      console.log(`GET /books/${id} INVALID ID`);
      res.status(400).json({ message: 'Invalid id.' });
    }
  },
  addBook: async (req, res) => {
    let { title } = req.body;
    let { author } = req.body;
    let { id } = req.body;

    if (valid.string(title) && valid.string(author) && valid.id(id)) {
      let book = await get(res, `/books/${id}`);
      if (book != 500) {
        if (book) {
          console.log(`POST /books/${id} +1`);
          post(res, req.body, `/books`, 'POST');
        } else {
          console.log(`POST /books/${id} NEW`);
          post(res, req.body, `/newBook`, 'POST');
        }
      }
    } else {
      console.log(`POST /books/${id} INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  deleteBook: async (req, res) => {
    let id = req.params.id;
    if (valid.id(id)) {
      let book = await get(res, `/books/${id}`);
      let loans = await get(res, `/loans/${id}`);
      if (book != 500 && loans != 500) {
        if (book) {
          loans = loans.loans;
          if (book.inventory > loans || loans == 0) {
            post(res, null, `/books/${id}`, 'DELETE');
          } else {
            console.log(`DELETE /books/${id} HAS LOANS`);
            res.status(403).json({ message: "The book has loans." });
          }
        } else {
          console.log(`DELETE /books/${id} NOT FOUND`);
          res.status(404).json({ message: "The book doesn't exist" });
        }
      }
    } else {
      console.log(`DELETE /books/${id} INVALID ID`);
      res.status(400).json({ message: "Invalid id." });
    }
  },
  modifyBook: async (req, res) => {
    let id = req.params.id;
    let {title} = req.body;
    let {author} = req.body;
    await post(res, {title: title, author: author}, `/books/${id}`, 'PUT');
  },
  ///////////////////////////////////////// LOANS ////////////////////////////////////
  listAllLoans: async (req, res) => {
    let loans = await get(res, `/loans`);
    if (loans != 500) {
      res.status(200).json(loans);
    }
  },
  lentBook: async (req, res) => {
    let { Bid } = req.body;
    let { Pid } = req.body;
    console.log(`Trying to lent book: ${Bid}, partner: ${Pid}`);
    if (valid.id(Pid) && valid.id(Bid)) {
      let book = await get(null, `/books/${Bid}`);
      let partner = await get(null, `/partners/${Pid}`);
      let debt = await get(null, `/debt/${Pid}`);
      debt = debt.debt;
      let isLoan = await get(null, `/isLoan/${Bid}/${Pid}`);
      isLoan = isLoan.isLoan;
      if (
        book != 500 &&
        partner != 500 &&
        debt != 500 &&
        isLoan != 500
      ) {
        if (book) {
          if (book.inventory > 0) {
            if (partner) {
              if (!debt) {
                if (!isLoan) {
                  post(res, { Bid: Bid, Pid: Pid }, `/loans/lent`, 'POST');
                  console.log(`POST /loans/lent OK`);
                } else {
                  console.log(`POST /loans/lent ALREADY LENT`);
                  res.status(400).json({ message: "The partner has already lent that book." });
                }
              } else {
                console.log(`POST /loans/lent OVERDUE DEBTS`);
                res.status(400).json({ message: "The partner has overdue debts." });
              }
            } else {
              console.log(`POST /loans/lent PARTNER NOT FOUND`);
              res.status(404).json({ message: "The partner doesn't exist." });
            }
          } else {
            console.log(`POST /loans/lent EMPTY`);
            res.status(404).json({ message: "The inventory of this book is empty." });
          }
        } else {
          console.log(`POST /loans/lent BOOK NOT FOUND`);
          res.status(404).json({ message: "The book doesn't exist." });
        }
      }
    } else {
      console.log(`POST /loans/lent INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  returnBook: async (req, res) => {
    let { Bid } = req.body;
    let { Pid } = req.body;
    if (valid.id(Pid) && valid.id(Bid)) {
      let book = await get(null, `/books/${Bid}`);
      let partner = await get(null, `/partners/${Pid}`);
      let isLoan = await get(null, `/isLoan/${Bid}/${Pid}`);
      isLoan = isLoan.isLoan;
      if (
        book != 500 &&
        partner != 500 &&
        isLoan != 500
      ) {
        if (book) {
          if (partner) {
            if (isLoan) {
              console.log(`POST /loans/return OK`);
              post(res, { Bid: Bid, Pid: Pid }, '/loans/return', 'POST');
            } else {
              console.log(`POST /loans/return NO LOAN`);
              res.status(404).json({ message: "The partner doesn't have that book." });
            }
          } else {
            console.log(`POST /loans/return PARTNER NOT FOUND`);
            res.status(404).json({ message: "The partner doesn't exist." });
          }
        } else {
          console.log(`POST /loans/return BOOK NOT FOUND`);
          res.status(404).json({ message: "The book doesn't exist" });
        }
      }
    } else {
      console.log(`POST /loans/return INVALID DATA`);
      res.status(400).json({ message: "Invalid data." });
    }
  },
  ///////////////////////////////////////// TIME ////////////////////////////////////
  // OUT OF SERVICE
  // modifyTime: (req, res) => {
  //   let { days } = req.body;
  //   if (valid.id(days)) {
  //     post(res, { days: days }, '/modifyTime', 'POST');
  //   } else {
  //     res.status(400).json({ message: 'Invalid value.' });
  //   }
  // },
  ///////////////////////////////////////// ACCOUNTS ////////////////////////////////////
  login: async (req, res) => {
    let { email } = req.body;
    let { password } = req.body;
    let response = await login({ email: email, password: password });
    if (response == -1) {
      res.status(500).json({ message: 'Internal server error.' })
    } else if (response == 99) {
      console.log(`LOGIN ${email} NOT FOUND`);
      res.status(404).json({ message: 'Not found.' });
    } else {
      console.log(`LOGIN ${email} OK`);
      const payload = {
        check: true
      };
      const token = jwt.sign(payload, config.key, {
        expiresIn: "30m"
      });
      response.token = token;
      res.status(200).json(response);
    }
  }
}