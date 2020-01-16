let fs = require("fs");
let json = require("./db.json");

// guarda los cambios en la db
let save = () => {
  fs.writeFile("./db/db.json", JSON.stringify(json), err => {
    if (err) throw err;
  });
}
// devuelve un array con todos los elementos de la tabla
let getTable = tableName => {
  return json[tableName];
}

let getPartners = id => {
  let partners = [];
  getTable("accounts").forEach(partner => {
    partners.push({
      id: partner.id,
      name: partner.name,
      surname: partner.surname,
      role: partner.role
    });
  });
  return partners;
}

// nos dice si existe el partner
// sirve para validar antes de realizar otra acción
let getPartner = (id) => {
  let partner = {};
  getTable("accounts").forEach(entry => {
    if (entry.id == id) {
      partner.id = entry.id;
      partner.name = entry.name;
      partner.surname = entry.surname;
    }
  });
  if (partner.name) {
    return partner;
  } else {
    return null;
  }
}

// agrega un elemento a una tabla
let addEntry = (tableName, entry) => {
  if (tableName == "books") {
    let books = getTable("books");
    if (!entry.inventory) {
      entry.inventory = 1;
    } else {
      entry.inventory = parseInt(entry.inventory, 10); // viene como string
    }
    if (!entry.id) {
      let IDs = books.map(a => a.id);
      let id = 0;
      while (IDs.includes(id)) {
        id++;
      }
      entry.id = id;
    }
  }
  json[tableName].push(entry);
  save();
}

let deletePartner = id => {
  let i = 0;
  getTable("accounts").forEach(entry => {
    if (entry.id == id) {
      json["accounts"].splice(i, 1);
    }
    i++;
  });
  save();
}

let getBook = id => {
  let found = null;
  getTable("books").forEach(book => {
    if (book.id == id) {
      found = book;
    }
  });
  return found;
}

let addBook = id => {
  getTable("books").forEach(book => {
    if (book.id == id) {
      book["inventory"] += 1;
    }
  });
  save();
}

let deleteBook = (id, all) => {
  let books = getTable("books");
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      if (all) {
        json["books"].splice(i, 1);
        console.log(`Book ${id} deleted`);
        break;
      } else {
        books[i].inventory -= 1;
        console.log(`Book ${id} deleted a copy`);
        if (books[i].inventory == 0) {
          json["books"].splice(i, 1);
          console.log(`Book ${id} deleted`);
        }
      }
    }
  }
  save();
}

let modifyBook = (id, title, author) => {
  let found = false;
  getTable("books").forEach(book => {
    if (book.id == id) {
      book.title = title;
      book.author = author;
      found = true;
    }
  });
  save();
  return found;
}

// booleano que indica si se le venció una deuda a un partner
let hasDebt = (id, time) => {
  let debt = false;
  getTable("loans").forEach(loan => {
    if (loan.partner == id) {
      console.log(`${loan.expiration_date} < ${time} = ${loan.expiration_date < time}`);
    }
    if (loan.partner == id && loan.expiration_date < time) {
      debt = true;
    }
  });
  return debt;
}

let lentBook = (Pid, Bid, expiration) => {
  getTable("books").forEach(book => {
    if (book.id == Bid) {
      book.inventory -= 1;
    }
  });
  addEntry("loans", { partner: Pid, book: Bid, expiration_date: expiration });
  save();
}

let returnBook = (Pid, Bid) => {
  let i = 0;
  getTable("loans").forEach(loan => {
    if (loan.partner == Pid && loan.book == Bid) {
      json["loans"].splice(i, 1);
    }
    i++;
  });
  getTable("books").forEach(book => {
    if (book.id == Bid) {
      book.inventory += 1;
    }
  });
  save();
}

let howMuchLoans = Bid => {
  let r = 0;
  getTable("loans").forEach(loan => {
    if (loan.book == Bid) {
      r++;
    }
  });
  return r;
}

let isLoan = (Pid, Bid) => {
  let r = false;
  getTable("loans").forEach(loan => {
    if (loan.partner == Pid && loan.book == Bid) {
      r = true;
    }
  });
  return r;
}

let match = (email, pass) => {
  let r = {};
  getTable("accounts").forEach(account => {
    if (account.email == email && account.password == pass) {
      r.role = account.role;
      r.id = account.id;
    }
  });
  if (r.role == null) {
    return -1
  } else {
    return r;
  }
}

module.exports = {
  getTable,
  getPartner,
  getPartners,
  addEntry,
  deletePartner,
  getBook,
  addBook,
  deleteBook,
  modifyBook,
  hasDebt,
  lentBook,
  returnBook,
  isLoan,
  howMuchLoans,
  match
}