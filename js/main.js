const body = document.querySelector('body');
const menu = document.querySelector('.menu');
const menuButtons = menu.querySelectorAll('button');
const panelResponseEl = document.querySelector('.panel-response');
const panelErrorEl = document.querySelector('.panel-error');
const panelHelpEl = document.querySelector('.panel-help');
const panelParametersEl = document.querySelector('.panel-parameters');
const parameterInputsEl = document.querySelector('.parameter-inputs');
const btnAddParameter = document.querySelector('.btn-add-parameter');
const btnExecute = document.querySelector('#btn-execute');
let selectedMethod;
let includeParams;

// node api settings
const api = 'http://127.0.0.1';
const apiPort = 3000;

function makeRequest(method, params) {
    const headers = {
        'Content-Type': 'application/json',
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
    .catch(err => {
        console.log(err)
    });
}

function prepareOutput() {
    panelResponseEl.textContent = '';
    panelErrorEl.textContent = '';
    panelHelpEl.textContent = '';        
    parameterInputsEl.innerHTML = '';
    panelParametersEl.querySelector('textarea').value = '';
    panelParametersEl.querySelector('select').value = 'string';
}

function processResponse(res, isHelp) {
    body.classList.remove('has-error');
    
    if (res.error !== null) {
        if (res.error.cause?.errno == -61) {
            panelResponseEl.textContent = 'There was an error. Is pktwallet running?';
        } else {
            panelResponseEl.textContent = 'There was an error';
        }          
        body.classList.add('has-error');
        panelErrorEl.textContent = JSON.stringify(res.error, null, 4);
        return;
    }
    if (isHelp) {
        panelHelpEl.textContent = res.result;
        return;
    }
    if (typeof res.result == 'string') {
        panelResponseEl.textContent = res.result;
        return;
    }
    panelResponseEl.textContent = JSON.stringify(res.result, null, 4);
}

function callMethod(method, includeParams) {
    makeRequest(method, includeParams ? getParameters() : [])
    .then(res => processResponse(res));
    makeRequest('help', [method])
    .then(res => processResponse(res, true));
}

function getHelp(method) {
    makeRequest('help', [method])
    .then(res => processResponse(res, true));
}

menu.addEventListener('click', e => {
    if (e.target && e.target.tagName == 'BUTTON') {
        selectedMethod = e.target.dataset.method;
        includeParams = (typeof e.target.dataset.params != 'undefined' && e.target.dataset.params == 'true');

        menuButtons.forEach(button => button.classList.remove('active'));
        e.target.classList.add('active');

        prepareOutput();

        btnExecute.classList.remove('disabled');
        getHelp(selectedMethod);
    }
});

btnAddParameter.addEventListener('click', e => {
    parameterInputsEl.insertAdjacentHTML('beforeend', `
        <div class="parameter-input">
            <textarea class="form-control" placeholder="parameter"></textarea>
            <select>
                <option value="string">string</option>
                <option value="numeric">numeric</option>
                <option value="array">array</option>
            </select>
        </div>
    `);
});

btnExecute.addEventListener('click', e => {
    makeRequest(selectedMethod, includeParams ? getParameters() : [])
    .then(res => processResponse(res));
});

function getParameters() {
    const params = [];
    panelParametersEl.querySelectorAll('textarea').forEach(el => {
        if (el.value !== '' && el.value.trim() !== '') {
            const argType = el.nextElementSibling.value;
            if (argType == 'numeric') {
                params.push(parseInt(el.value));
            } else if (argType == 'array') {
                params.push(JSON.parse(el.value));
            } else {
                params.push(el.value);
            }
        }
    });

    return params;
}