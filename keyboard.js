function getLetterLocation(keyboard, l)
{
    let location = {};

    for (let i = 0; i < keyboard.rows.length; i++)
    {
        for (let j = 0; j < keyboard.rows[i].length; j++)
        {
            if (keyboard.rows[i][j] === l)
            {
                return { row: i, letter: j };
            }
        }
    }

    return {};
}

class Keyboard
{
    constructor(...rows)
    {
        this.rows = [];

        for (let i = 0; i < rows.length; i++)
        {
            if (Array.isArray(rows[i]))
            {
                this.rows.push(rows[i]);
            }
        }

        Object.freeze(this);
    }

    /**
     * Determine the distance (proximal) between two keys on keyboard.
     * 
     * @param {string} l1 
     * @param {string} l2 
     */
    proximal(l1, l2)
    {
        if (l1 === l2)
        {
            return 0;
        }
            
        let self = this;
        let l1_location = getLetterLocation(this, l1);

        for (let i = 0; i < this.rows.length; i++)
        {
            for (let j = 0; j < this.rows[i].length; j++)
            {
                if (l2 === this.rows[i][j])
                {
                    let row_term = Math.abs(l1_location.row - i);
                    row_term = Math.pow(row_term, 2);
                    let letter_term = Math.abs(l1_location.letter - j);
                    letter_term = Math.pow(letter_term, 2);
                    let proximal = Math.sqrt(row_term + letter_term);
                    return proximal;
                }
            }
        }

        return -1;
    }
}

module.exports = Keyboard;