let express = require('express');
let app = express();
let bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
// this headers allow the browser to interact with this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});

require('./routes/app.routes')(app);

app.listen(5555, () => console.log('API started on port 5555'));