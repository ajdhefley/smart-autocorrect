const fs = require('fs');
const Keyboard = require('./keyboard');

class Spellcheck
{
    static dictionary(letter)
    {
        let reg = /^[a-z]$/;
        if ( !reg.test(letter) )
        {
            throw new Error('Letter not recognized');
        }

        return `./dictionary/words-${letter}`;
    }

    // word: word to spellcheck
    // proximal_tolerance: number of mismatches allowed
    // keyboard: arrangement of letters to base mismatches on
    // callback: function to run after
    static check(input, proximal_tolerance, keyboard, callback)
    {
        if (keyboard instanceof Keyboard == false)
        {
            throw new Error('Keyboard not recognized');
        }

        try
        {
            let dic_file = Spellcheck.dictionary(input[0]);

            fs.readFile(dic_file, 'utf8', function (err, data)
            {
                let words = data.split('\n');
                let suggested = [];

                words.forEach(function (word)
                {
                    if (input.length === word.length)
                    {
                        let matches = true;
                        let proximal_score = 0;

                        for (let i = 0; i < word.length; i++)
                        {
                            let l1 = input[i].toLowerCase();
                            let l2 = word[i].toLowerCase();
                            let proximal = keyboard.proximal(l1, l2);

                            if (proximal > proximal_tolerance)
                            {
                                matches = false;
                            }

                            proximal_score += proximal;
                        }

                        // Ensure that at least one word is suggested.
                        if ((matches && proximal_score <= proximal_tolerance) || suggested.length == 0)
                        {
                            suggested.push({ word: word, proximal: proximal_score });
                        }
                    }

                    // TODO: compare words of differing lengths
                    // TODO: affect proximal probability of current letter mismatch based on previously typed letter
                });

                suggested.sort(function (a, b)
                {
                    return a.proximal - b.proximal;
                });

                if (typeof (callback) === 'function')
                {
                    callback(suggested);
                }
            });
        }
        catch (ex)
        {
            throw ex;
        }
    };
};

Object.freeze(Spellcheck);

module.exports = Spellcheck;