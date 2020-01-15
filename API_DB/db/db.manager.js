let fs = require("fs");
let json = require("./db.json");

// guarda los cambios en la db
let save = () => {
  fs.writeFile("./db/db.json", JSON.stringify(json), err => {
    if (err) throw err;
  });
}
// devuelve un array con todos los elementos de la tabla
let getTable = (tableName) => {
  return json[tableName];
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
    if (!entry.id) {
      entry.id = books.length; // Asumiendo que se mantiene el orden
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

let addBook = (id) => {
  getTable("books").forEach(book => {
    if (book.id == id) {
      book["inventory"] += 1;
    }
  });
  save();
}

let deleteBook = id => {
  getTable("books").forEach(book => {
    if (book.id == id) {
      if (book.inventory > 0) {
        book["inventory"] -= 1;
        console.log(`book ${id} inventory-=1`);
      }
      if (book.inventory == 0) {
        console.log(`book ${id} deleted`);
        json["books"].splice(id - 1, 1);
      }
    }
  });
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

let howMuchLoans = (Bid) => {
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