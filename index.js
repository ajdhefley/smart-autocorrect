const fs = require('fs');

/**
 * 
 * @param {string[][]} keyMatrix 
 * @param {string} letter
 * @returns {number[]}
 **/
function getKeyboardLocation(keyMatrix, letter) {
    let location = null;

    keyMatrix.forEach((rowLetters, rowIndex) => {
        rowLetters.forEach((rowLetter, letterIndex) => {
            if (rowLetter == letter.toLowerCase()) {
                location = [rowIndex, letterIndex];
            }
        });
    });

    return location;
}

/**
 * Determine the distance between two keys on this keyboard.
 * 
 * @param {string[][]} keyMatrix
 * @param {string} key1 
 * @param {string} key2
 * @returns {number} 
 **/
function getKeyDistance(keyMatrix, key1, key2) {
    if (key1 == key2) {
        return 0;
    }
    else {
        let key1_location = getKeyboardLocation(keyMatrix, key1);
        let key2_location = getKeyboardLocation(keyMatrix, key2);

        if (key1_location == null || key2_location == null) {
            return 0;
        }

        let row_term = Math.abs(key1_location[0] - key2_location[0]);
        let col_term = Math.abs(key1_location[1] - key2_location[1]);
        return Math.sqrt(Math.pow(row_term, 2) + Math.pow(col_term, 2));
    }
}

/**
 * @param {string} firstLetter 
 * @returns {string}
 **/
function readDictionaryFile(firstLetter) {
    if (/^[a-z]$/.test(firstLetter) == false) {
        throw new Error('Letter not recognized');
    }

    return fs.readFileSync(`./dictionary/words-${firstLetter}`, 'utf8');
}

/**
 * Gets an array of suggested words based on input word, if it is misspelled.
 * 
 * @param {string} input - The word to spellcheck.
 * @param {string[][]} keyMatrix - The matrix of keys from which distances are determined.
 * @param {number} maxDistance - The max distance allowed.
 * @returns {string[]}
 **/
function getSuggestions(input, keyMatrix, maxDistance) {
    let data = readDictionaryFile(input[0]);
    let suggested = [];
    let words = data.split('\n');   

    words.forEach((word) => {
        if (input.length == word.length) {
            let keyDistance = 0;

            for (let i = 0; i < word.length; i++) {
                keyDistance += getKeyDistance(keyMatrix, input[i], word[i]);
            }

            if (keyDistance <= maxDistance) {
                suggested.push({ Word: word, Distance: keyDistance });
            }
        }

        // TODO: allow compound words (if word is made up of multiple recognized words with no mistyped letters, return no alternative suggestions)
        // TODO: compare words of differing lengths
        // TODO: affect proximal probability of current letter mismatch based on previously typed letter
    });

    return suggested
        .sort((a, b) => a.Distance - b.Distance)
        .map((suggestion) => suggestion.Word);
};

function SpellChecker() {
}
SpellChecker.getSuggestions = getSuggestions;

module.exports = SpellChecker;