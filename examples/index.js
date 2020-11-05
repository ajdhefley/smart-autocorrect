const express = require('express');
const path = require('path');
const SpellChecker = require('../');

let keyboardQuerty = [
    [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l' ],
    [ 'z', 'x', 'c', 'v', 'b', 'n', 'm' ]
];

let keyboardDvorak = [
    [ 'p', 'y', 'f', 'g', 'c', 'r', 'l' ],
    [ 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's' ],
    [ 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z' ]
];

express()
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    })
    .get('/check', (req, res) => {
        let suggestedWords = SpellChecker.getSuggestions(req.query.word, keyboardQuerty, 2);
        res.send(suggestedWords);
        res.status(200);
    })
    .listen(8000);