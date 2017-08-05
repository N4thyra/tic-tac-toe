$(() => {

  const BOARD     = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];

  const PLAYER   = 'X',
        COMPUTER = 'O';

  // check if game is over
  function isOver(newBoard){
    // horizontal
    for(let i = 0; i < 3; i++){
      if(newBoard[i][0] !== ' ' &&
         newBoard[i][0] === newBoard[i][1] &&
         newBoard[i][0] === newBoard[i][2])
      return newBoard[i][0]
    }
    // vertical
    for(let j = 0; j < 3; j++){
      if(newBoard[0][j] !== ' ' &&
        newBoard[0][j] === newBoard[1][j] &&
        newBoard[0][j] === newBoard[2][j])
      return newBoard[0][j]
    }
    // diagonal bottom to right
    if(newBoard[2][0] !== ' ' &&
       newBoard[2][0] === newBoard[1][1] &&
       newBoard[2][0] === newBoard[0][2])
    return newBoard[2][0];
    // diagonal left to right
    if(newBoard[0][0] !== ' ' &&
       newBoard[0][0] === newBoard[1][1] &&
       newBoard[0][0] === newBoard[2][2])
    return newBoard[0][0];

    // is there a space?
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(newBoard[i][j] === ' ') return false
      }
    }
    return null
  }

  function computerPlays(){
    return minmax(BOARD, 0, COMPUTER);
  }

  function minmax(newBoard, depth, player) {
    const isGameOver = isOver(newBoard);
    if(isGameOver === false) {
      const values = [];
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          const boardCopy = _.cloneDeep(newBoard);
          if(newBoard[i][j] !== ' ') continue;
          boardCopy[i][j] = player;
          const value = minmax(boardCopy, depth + 1, (player === PLAYER) ? COMPUTER : PLAYER);
          values.push({
            cost: value,
            cell: {
              i,
              j
            }
          });
        }
      }

      if(player === COMPUTER) {
        const max = _.maxBy(values, (v) => {
          return v.cost;
        });
        if (depth === 0) {
          return max.cell;
        } else {
          return max.cost;
        }
      } else {
        const min = _.minBy(values, (v) => {
          return v.cost;
        });
        if (depth === 0) {
          return min.cell;
        } else {
          return min.cost;
        }
      }


    } else if(isGameOver === null){
      return 0;
    } else if(isGameOver === PLAYER) {
      return depth - 10;
    } else if(isGameOver === COMPUTER) {
      return 10-depth;
    }
  }

  $('.col').on('click', function(){
    let isEmpty = $(this).html();
    let gameStatus = isOver(BOARD);

    if(!isEmpty && !gameStatus) {
      const i = $(this).data('i');
      const j = $(this).data('j');

      BOARD[i][j] = PLAYER;
      $(this).html(PLAYER);
      gameStatus = isOver(BOARD);

      if(gameStatus || gameStatus === null){

      } else {
        const AI = computerPlays();
        BOARD[AI.i][AI.j] = COMPUTER;
        $(`.col[data-i="${AI.i}"][data-j="${AI.j}"]`).html(COMPUTER);
        console.log(BOARD);
      }
      gameStatus = isOver(BOARD);
      if(gameStatus) {
        console.log('Game over', gameStatus);
        for(let i = 0; i < 9; i++){
          if($('.col')[i].innerHTML === gameStatus){
            $('.col')[i].classList.add('winner');
            $('button').text(gameStatus + "'s wins - Retry");
          }
        }
      } else if(gameStatus === null) {
        console.log('It is a draw');
        for(let i = 0; i < 9; i++){
          $('.col')[i].classList.add('draw');
        }
        $('button').text("It's a draw - Retry");
      }
    } else {
      if(gameStatus || gameStatus === null){
        resetBoard();
      } else {
        console.log('Invalid Action!');
      }
    }

  });

  $('button').on('click', () => {
    resetBoard();
  });

  function resetBoard(){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        BOARD[i][j] = ' ';
      }
    }
    $('.col').html('');
    $('.winner').removeClass('winner');
    $('.draw').removeClass('draw');
    $('button').text("Restart!");
    resetGame = false;
  }

});