document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const grid = 30;
    const tetrominoes = [
        [],
        [ // I
            [1, 1, 1, 1],
        ],
        [ // O
            [2, 2],
            [2, 2]
        ],
        [ // T
            [0, 3, 0],
            [3, 3, 3]
        ],
        [ // S
            [0, 4, 4],
            [4, 4, 0]
        ],
        [ // Z
            [5, 5, 0],
            [0, 5, 5]
        ],
        [ // J
            [6, 0, 0],
            [6, 6, 6]
        ],
        [ // L
            [0, 0, 7],
            [7, 7, 7]
        ]
    ];

    let playfield = Array.from({ length: 20 }, () => Array(10).fill(0));
    let gameOver = false;

    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'black';
        context.lineWidth = 0.5;

        for (let x = 0; x <= canvas.width; x += grid) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }

        for (let y = 0; y <= canvas.height; y += grid) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
    }

    function drawPlayfield() {
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                if (playfield[row][col]) {
                    context.fillStyle = getColor(playfield[row][col]);
                    context.fillRect(col * grid, row * grid, grid, grid);
                    context.strokeRect(col * grid, row * grid, grid, grid);
                }
            }
        }
    }

    function getColor(value) {
        const colors = [
            null, 'cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'
        ];
        return colors[value];
    }

    function drawTetromino(tetromino) {
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {
                    context.fillStyle = getColor(tetromino.matrix[row][col]);
                    context.fillRect(
                        (tetromino.col + col) * grid,
                        (tetromino.row + row) * grid,
                        grid,
                        grid
                    );
                    context.strokeRect(
                        (tetromino.col + col) * grid,
                        (tetromino.row + row) * grid,
                        grid,
                        grid
                    );
                }
            }
        }
    }

    function generateTetromino() {
        const tetrominoIndex = Math.floor(Math.random() * (tetrominoes.length - 1)) + 1;
        const matrix = tetrominoes[tetrominoIndex];
        const col = Math.floor(playfield[0].length / 2) - Math.floor(matrix[0].length / 2);
        return {
            matrix: matrix,
            row: 0,
            col: col
        };
    }

    function rotate(matrix) {
        const N = matrix.length;
        const result = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - j - 1][i])
        );
        return result;
    }

    function canMove(matrix, row, col) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] && (playfield[row + r] && playfield[row + r][col + c]) !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function merge(playfield, tetromino) {
        tetromino.matrix.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value) {
                    playfield[tetromino.row + r][tetromino.col + c] = value;
                }
            });
        });
    }

    function clearLines() {
        for (let row = playfield.length - 1; row >= 0; ) {
            if (playfield[row].every(cell => cell !== 0)) {
                playfield.splice(row, 1);
                playfield.unshift(Array(10).fill(0));
            } else {
                row--;
            }
        }
    }

    let currentTetromino = generateTetromino();

    function update() {
        if (gameOver) {
            context.fillStyle = 'black';
            context.font = '40px Arial';
            context.fillText('Game Over', canvas.width / 4, canvas.height / 2);
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawPlayfield();
        drawTetromino(currentTetromino);

        if (!canMove(currentTetromino.matrix, currentTetromino.row + 1, currentTetromino.col)) {
            merge(playfield, currentTetromino);
            clearLines();
            currentTetromino = generateTetromino();
            if (!canMove(currentTetromino.matrix, currentTetromino.row, currentTetromino.col)) {
                gameOver = true;
            }
        } else {
            currentTetromino.row++;
        }
        setTimeout(update, 500);
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            if (canMove(currentTetromino.matrix, currentTetromino.row, currentTetromino.col - 1)) {
                currentTetromino.col--;
            }
        } else if (event.key === 'ArrowRight') {
            if (canMove(currentTetromino.matrix, currentTetromino.row, currentTetromino.col + 1)) {
                currentTetromino.col++;
            }
        } else if (event.key === 'ArrowUp') {
            const rotatedMatrix = rotate(currentTetromino.matrix);
            if (canMove(rotatedMatrix, currentTetromino.row, currentTetromino.col)) {
                currentTetromino.matrix = rotatedMatrix;
            }
        } else if (event.key === 'ArrowDown') {
            const rotatedMatrix = rotate(currentTetromino.matrix);
            if (canMove(rotatedMatrix, currentTetromino.row, currentTetromino.col)) {
                currentTetromino.matrix = rotatedMatrix;
            }
        }
    });

    update();
});
