const fs = require('fs');
const Keyboard = require('./keyboard');

function dictionary(letter)
{
    let alpha = /^[a-z]$/;
    if ( !alpha.test(letter) )
    {
        throw new Error('Letter not recognized');
    }

    return `./dictionary/words-${letter}`;
}

function purge_duds(list)
{
    for (let i = 0; i < list.length; i++) 
    {
        if (list[i].dud && list.length > 1)
        {
            list.splice(i, 1);
        }
    }

    return list;
}

function sort_proximals(list)
{
    return list.sort(function (a, b)
    {
        return a.proximal - b.proximal;
    });
}


class Spellcheck
{
    /**
     * Return an array of suggested words based on (misspelled) input word.
     * 
     * @param {string} input - word to spellcheck
     * @param {number} proximal_tolerance - number of mismatches allowed
     * @param {Keyboard} keyboard - arrangement of letters to base mismatches on
     * @param {function} callback - function to run after
     */
    static check(input, proximal_tolerance, keyboard, callback)
    {
        if (keyboard instanceof Keyboard == false)
        {
            throw new Error('Keyboard not recognized');
        }

        try
        {
            let dic_file = dictionary(input[0]);

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

                        suggested = purge_duds(suggested);

                        // Ensure that at least one word is suggested. If better
                        // alternatives are found later, initial dud will be removed.
                        if ((matches && proximal_score <= proximal_tolerance) || suggested.length == 0)
                        {
                            let word_obj = { word: word, proximal: proximal_score };
                            if (suggested.length === 0)
                            {
                                word_obj.dud = true;
                            }

                            suggested.push(word_obj);
                        }
                    }

                    // TODO: allow compound words (if word is made up of multiple recognized words with no mistyped letters, return no alternative suggestions)
                    // TODO: compare words of differing lengths
                    // TODO: affect proximal probability of current letter mismatch based on previously typed letter
                });

                suggested = sort_proximals(suggested);

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