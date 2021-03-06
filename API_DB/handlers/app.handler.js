// TinoQL® 1.1
let db = require('../db/db.manager');
let time = require('../lib/time');

module.exports = {
    /////////////////////////////////// PARTNERS ///////////////////////////////////////
    getPartners: (req, res) => {
        console.log('SELECT * FROM partners');
        res.status(200).json(db.getPartners());
    },
    getPartner: (req, res) => {
        let id = req.params.id;
        console.log(`SELECT * FROM partners WHERE ID=${id}`);
        res.status(200).json(db.getPartner(id));
    },
    addPartner: (req, res) => {
        console.log(`INSERT INTO partners VALUES(${req.body.name},${req.body.surname})`);
        let response = db.addEntry("accounts", req.body)
        if (response) {
            res.status(201).json({ message: 'Created.' });
        } else {
            res.status(400).json({ message: 'Email on use.' });
        }
    },
    deletePartner: (req, res) => {
        let id = req.params.id;
        console.log(`DELETE * FROM partners WHERE id=${id}`);
        db.deletePartner(id);
        res.status(204).json({ message: 'Deleted.' });
    },
    /////////////////////////////////// BOOKS ///////////////////////////////////////
    getBooks: (req, res) => {
        console.log('SELECT * FROM books');
        res.status(200).json(db.getTable('books'));
    },
    getBook: (req, res) => {
        let id = req.params.id;
        console.log(`SELECT * FROM books WHERE ID=${id}`);
        res.status(200).json(db.getBook(id));
    },
    addBook: (req, res) => {
        let { id } = req.body;
        db.addBook(id);
        console.log(`UPDATE books SET inventory=inventory+1 WHERE id=${id}`);
        res.status(201).json({ message: 'Book added to collection.' });
    },
    createBook: (req, res) => {
        let { title } = req.body;
        let { author } = req.body;
        let { id } = req.body;
        let { inventory } = req.body;
        console.log(`INSERT INTO books VALUES(${title},${author},${inventory},${id})`);
        db.addEntry("books", { title: title, author: author, inventory: inventory ? inventory : 1, id: id });
        res.status(201).json({ message: 'Created.' });
    },
    deleteBook: (req, res) => {
        let id = req.params.id;
        console.log(`DELETE * FROM books WHERE id=${id}`);
        db.deleteBook(id, req.body.all);
        res.status(204).json({ message: 'Deleted.' });
    },
    modifyBook: (req, res) => {
        let id = req.params.id;
        let {title} = req.body;
        let {author} = req.body;
        if (db.modifyBook(id, title, author)) {
            res.status(200).json({ message: 'Modified.' });
        } else {
            res.status(404).json({ message: 'Not found.' });
        }
    },
    /////////////////////////////////// LOANS ///////////////////////////////////////
    getLoans: (req, res) => {
        console.log('SELECT * FROM loans');
        res.status(200).json(db.getTable('loans'));
    },
    howMuchLoans: (req, res) => {
        let id = req.params.id;
        res.status(200).json({ loans: db.howMuchLoans(id) });
    },
    hasDebt: (req, res) => {
        let id = req.params.id;
        res.status(200).json({ debt: db.hasDebt(id, time.getTime()) });
    },
    lent: (req, res) => {
        let {Pid} = req.body;
        let {Bid} = req.body;
        console.log(`Partner ${Pid} lent book ${Bid}`);
        db.lentBook(Pid, Bid, time.getTime(10));
        res.status(200).json({ message: "Book lent.", expiration_date: time.getTime(10) });
    },
    isLoan: (req, res) => {
        let Pid = req.params.Pid;
        let Bid = req.params.Bid;
        res.status(200).json({ isLoan: db.isLoan(Pid, Bid) });
    },
    returnBook: (req, res) => {
        let {Pid} = req.body;
        let {Bid} = req.body;
        db.returnBook(Pid, Bid, time.getTime());
        res.status(200).json({ message: "Book returned." });
    },
    authenticate: (req, res) => {
        let {email} = req.body;
        let {password} = req.body;
        let response = db.match(email, password);
        if (response != -1) {
            console.log(`AUTHENTICATE ${email} OK`);
            res.status(200).json({ message: "Authenticated.", role: response.role, id: response.id });
        } else {
            console.log(`AUTHENTICATE ${email} NOT FOUND`);
            res.status(404).send();
        }
    }
}