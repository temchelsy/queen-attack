
// declare variables we would be using
let firstQueen,
    secondQueen,
    errorBox = document.querySelector('.error-messages'),
    successBox = document.querySelector('.success'),
    failureBox = document.querySelector('.failure'),
    clickCount = 0;


// create the chessboard dynamically
const createBoardLayout = () => {

    let board = document.querySelector('.board-layout'),
        table = document.createElement('div');
        table.className = 'table';

    for (let i = 1; i < 9; i++) {

        let div = document.createElement('div');
        div.className = `row row${i}`;

        for (let j = 1; j < 9; j++) {

            let button = document.createElement('button');

            if (i % 2 === j % 2) {
                button.className = 'white square';
                button.id = `square${i}${j}`;
            } else {
                button.className = 'black square';
                button.id = `square${i}${j}`;
            }

            div.appendChild(button);

        }

        table.appendChild(div);
    }

    board.appendChild(table);
};

// for a successful vertical attack, both queens must be in the same column
const verticalAttack = (q1, q2) => {
    let q1Column = 'column' + q1.slice(-1);
    let q2Column = 'column' + q2.slice(-1);
    return q1Column === q2Column;
};

// for a successful diagonal attack, both queens must be on the same diagonal
const diagonalAttack = (q1, q2) => {
    let q1Row = q1.slice(0, 1),
        q1Column = q1.slice(-1);

    let q2Row = q2.slice(0, 1),
        q2Column = q2.slice(-1);

    return Math.abs(q1Row - q2Row) === Math.abs(q1Column - q2Column);
};

// for a successful horizontal attack, both queens must be on the same row
const horizontalAttack = (q1, q2) => {
    let q1Row = 'row' + q1.slice(0, 1);
    let q2Row = 'row' + q2.slice(0, 1);
    return q1Row === q2Row;
};

const canAttack = () => {
    document.querySelector('.container').style.background = 'palegreen';

    successBox.style.display = 'flex';
    successBox.innerHTML = `<p>yes; an attack is possible</p>`;

    // congratulatory audio
    let audio = document.querySelector('#applause');
    audio.play();
};

const cannotAttack = () => {
    document.querySelector('.container').style.background = 'salmon';

    failureBox.style.display = 'flex';
    failureBox.style.color = 'red';
    failureBox.innerHTML = `<p>no; an attack isn't possible</p>`;

    // reject audio
    let audio = document.querySelector('#rejected');
    audio.play();
};

// check for attacks and show result
function checkAttack(firstQueen, secondQueen) {

    // enable the CHECK button
    let checkButton = document.querySelector('#checkBtn');
    checkButton.removeAttribute('disabled');

    checkButton.addEventListener('click', (e => {

        e.preventDefault();
        errorBox.style.display = 'none';

        if ( !verticalAttack(firstQueen, secondQueen) && !horizontalAttack(firstQueen, secondQueen)
            && !diagonalAttack(firstQueen, secondQueen) ) {

            return cannotAttack();

        }

        return canAttack();

    }));

}


// listen for any click at all;
document.addEventListener('click', (e => {

    e.preventDefault();

    let square = e.target.id, // the square that is clicked
        squareID = square.replace('square', ''); // strip the 'square' and leave the integer for maths processing

    errorBox.textContent = '';

    // condition to assign values to each queen
    if (square.includes('square')) {

        if (clickCount === 0) {

            firstQueen = squareID; // set queen 1 to the value of the first box
            document.getElementById(square).style.background = 'yellow';

        } else if (clickCount === 1) {

            secondQueen = squareID;

            if (secondQueen === firstQueen) {

                errorBox.style.border = '2px solid red';
                errorBox.innerHTML = `<p>place the second queen on a different square</p>`;
                clickCount--;

            } else {
                errorBox.style.border = '2px solid black';
                document.getElementById(square).style.background = 'green';
            }


        } else if (clickCount > 1) {

            errorBox.style.border = '2px solid red';
            errorBox.textContent = 'you cannot have more than two queens';

        }

        clickCount++;

        // when both queens have values, check for possible attacks
        if (firstQueen && secondQueen) {
            return checkAttack(firstQueen, secondQueen);
        }

    } else if (square.includes('resetBtn')) {
        clickCount = 0;
        document.querySelector('#checkBtn').setAttribute('disabled', 'true');
        window.location = window.location

    } else {

        if (!firstQueen || !secondQueen) {

            errorBox.style.border = '2px solid red';
            errorBox.innerHTML = `<p>please click inside <br> the chess board</p>`;
        }

    }


}), false);

const startApp = () => {
    createBoardLayout();
};


startApp();
