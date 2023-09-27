const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express ();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

// pktwallet settings
const rpcUser = 'USER';
const rpcPass = 'PASSWORD';
const api = 'http://127.0.0.1';
const apiPort = 64763;

function makeRequest(method, params) {
    const credentials = Buffer.from(`${rpcUser}:${rpcPass}`, 'utf-8').toString('base64');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
    };
    const url = `${api}:${apiPort}`;
    const body = {
        'jsonrpc':'1.1',
        'method': method,
        'params': params || []
    };
    return fetch(url, { 
        method: 'POST', 
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
        return data;
    });
}

app.post('/', (request, response) => {
    makeRequest(request.body.method, request.body.params)
    .then(res => response.send((res)))
    .catch(err => {
        console.log(err);
        response.status(500).send({ error: err });
    });
 });