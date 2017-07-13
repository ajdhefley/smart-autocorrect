//////////////// REQUIRE ////////////////

const express = require('express');
const path = require('path');

const Keyboard = require('./keyboard');
const Spellcheck = require('./spellcheck');

////////////////////////////////////////////////




//////////////// KEYBOARDS ////////////////

var KEY_QUERTY = new Keyboard(
    [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l' ],
    [ 'z', 'x', 'c', 'v', 'b', 'n', 'm' ]
);

var KEY_DVORAK = new Keyboard(
    [ 'p', 'y', 'f', 'g', 'c', 'r', 'l' ],
    [ 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's' ],
    [ 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z' ]
);

////////////////////////////////////////////////




//////////////// APP ////////////////

var app = express();

app.get('/', function (req, res)
{
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/check', function (req, res)
{
    Spellcheck.check(req.query.word, 2, KEY_QUERTY, function (suggested)
    {
        for (let i = 0; i < suggested.length; i++)
        {
            suggested[i] = suggested[i].word;
        }

        res.status(200);
        res.send(suggested);
    });
});

app.listen(8000);

////////////////////////////////////////////////