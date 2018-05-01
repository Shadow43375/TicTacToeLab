console.log("at least we are in the javascript file");

//inserts the body element into the DOM.
let body = document.querySelector('body');
let ticTacInterface = document.getElementById('ticTacInterface');


//constructor used to create a state object which keeps track of what is going on inside of a game instance. 
let GameState = function(numberOfCellsX, numberOfCellsY, numberInRowToWin, numberInColumnToWin, numberInDiagonalToWin) {
  
  if(numberInRowToWin === undefined) {
    numberInRowToWin = numberOfCellsX
  }
  if(numberInColumnToWin === undefined) {
    numberInColumnToWin = numberOfCellsY;
  }
  if(numberInDiagonalToWin === undefined) {
    if(numberOfCellsY > numberOfCellsX) {
      numberInDiagonalToWin = numberOfCellsY;      
    }
    else if(numberOfCellsX > numberOfCellsY) {
      numberInDiagonalToWin = numberOfCellsX;
    }
    else if(numberOfCellsX === numberOfCellsY) {
      numberInDiagonalToWin = numberOfCellsX;
    }
  }
  
  console.log("numberInRowToWin" + numberInRowToWin);
  console.log("numberInColumnToWin" + numberInColumnToWin);
  console.log("numberInDiagonalToWin" + numberInDiagonalToWin);
  
  this.numberOfCellsX = numberOfCellsX;
  this.numberOfCellsY = numberOfCellsY;
  //sets in place empty array which will store all of the rows in the grid--which are populated by cell objects.
  this.rows =[];
  // boolean value describes if the game is finished or not
  this.finished = false;
  // will store the eventual winner OR in some games the player that is currrently in the lead.
  this.winner = null;
  // an array where all of the player objects will be stored
  this.players = [];
  // an array which will function as a Queue to keep track of whoes turn it is currently
  this.playerQueue = [];
  // keeps a record of how many TOTAL cells are in the grid.
  this.totalCells = numberOfCellsX*numberOfCellsY;
  // keeps track of how many cells are filled currently.
  this.numberOfFilledCells = 1;
  //keeps track of what turn you are on.
  this.turn = 0;
  // for games where players will choose to play multiple rounds this keeps track of how many rounds have currently been played.
  this.round = 1;
  // the function which allows for the addition of new player objects to the list of players.
  this.addPlayer = function(newPlayerObject) {
    this.players.push(newPlayerObject);
    this.playerQueue.unshift(newPlayerObject);
  }
  
  //the function which allows for the removal of a player from both the list of players and from the playe queue.
  this.removePlayer = function(playerObject) {
    for(let i = 0; i<this.playerQueue.length; i++) {           
        if(this.playerQueue[i].name === playerObject.name) {
          this.playerQueue.splice(i, 1);
        }
    }
    for(let i = 0; i<this.players; i++) {
      if(this.players[i].name === playerObject.name) {
        this.players.spice(i, 1);
      }
    }
  }
  
  //a function which will return true if a player exists and false if it does not.
  this.playerExists = function(playerName) {
    for(let i = 0; i<this.players.length; i++) {
      if(this.players[i].name === playerName) {
        return true;
      }
    }
      return false;
  }
    
  //a functino which will return true if a certain color is already taken
    this.colorTaken = function(colorName) {
      for(let i = 0; i<this.players.length; i++) {
        if(this.players[i].color === colorName) {
          return true;
        }
      }
        return false;      
    }
  
  // a function which will place the current player in the queue at the back of the line and put the next up player in front.
  this.updateQueue = function() {
    let lastElement = this.playerQueue.length - 1;
    let playerBuffer = this.playerQueue[lastElement];
    this.playerQueue.pop();
    this.playerQueue.unshift(playerBuffer);
  }
  
  // convvience function that returns the currently active player
  this.getCurrentPlayer = function() {
    let lastElement = this.playerQueue.length - 1;
    return this.playerQueue[lastElement];
  }
  
  
  // a function which allows to print a list of all current players for troubleshooting purposes.
  this.printAllPlayers = function() {
    for(let i = 0; i<this.players.length; i++) {
      console.log(this.players[i]);
    }
  }

  // a function which allows one to print out the current queue for troubleshooting purposes.
  this.printQueue = function() {
    console.log(this.playerQueue);
  }
  
  //function which uses some criterea to determine if the game is over. IMPORTANT: this does NOT automatically end the game but merely returns that the game should or should not be over and allows the programmer to decide what course of action to take.
  this.checkIfOver = function(mostRecentPlayerColor, clickedCellName) {
    console.log(clickedCellName);
    // console.log("mostRecentPlayerColor = " + mostRecentPlayerColor);
    let numberInLine = 0;
    let numberInColumn = 0;
    let numberInDiagonal = 0;
    // incorrect names coming in which is leading to incorrect cordinates...
    // let cellXCordinate = Number(clickedCellName.match(/\d+/g)[0]) - 1;
    // let cellYCordinate = Number(clickedCellName.match(/\d+/g)[1]) - 1;
    
   //problem seems to be that there will only ever be TWO rows no matter what.
    
    var cellXCordinate = Number(clickedCellName.match(/\d+/g)[0]) - 1;
    var cellYCordinate = Number(clickedCellName.match(/\d+/g)[1]) - 1;
    
    
    //IMPORTANT: go through and try switch what is a column and row for the different cases below. Seemed to show promise for rows and columns but too complicated to try tonight for diagonal.  
    
    if(this.numberOfCellsX >= this.numberOfCellsY) {
      var numberOfRows = this.rows.length;
      var numberOfColumns = this.rows[0].length;  
    // need to find out if a player has managed to place numberInRowToWin cells in a row. 
      for(let i = 0; i < numberOfColumns; i++) {
          if(this.rows[cellYCordinate][i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
            numberInLine++;
          }
          else if(this.rows[cellYCordinate][i].newDiv.style.backgroundColor !== mostRecentPlayerColor) {
          break;
        }
        if(numberInLine === numberInRowToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
        }
      }
      

       //need to find out if a player has managed to place numberInColumnToWin cells in a column      
      for(let i = 0; i < numberOfRows; i++) {
          if(this.rows[i][cellXCordinate].newDiv.style.backgroundColor === mostRecentPlayerColor) {
            numberInColumn++;
          }
          else if(this.rows[i][cellXCordinate].newDiv.style.backgroundColor !== mostRecentPlayerColor) {
          break;
        }
        if(numberInColumn === numberInColumnToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
          }
      } 
    

    // below are four code sections that deal with detecting diagonals in the different quadrants relative to the most recently clicked cell.

    // console.log(this.rows[cellYCordinate][cellXCordinate].newDiv.name + " = " + this.rows[cellYCordinate][cellXCordinate].newDiv.style.backgroundColor);
    // top-left to down right diagonal check
    numberInDiagonal = 0;
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellYCordinate + i] === undefined || this.rows[cellYCordinate + i][cellXCordinate + i] === undefined) {
        break;
      }
      if(this.rows[cellYCordinate + i][cellXCordinate + i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
     
    // bottom right to top left diagonal check
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellYCordinate - 1 - i] === undefined || this.rows[cellYCordinate - 1 - i][cellXCordinate - 1 - i] === undefined) {
        break;
      }
      if(this.rows[cellYCordinate - 1 - i][cellXCordinate - 1 - i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
    

    //top-right to down left-diagonal check
    numberInDiagonal = 0;    
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellYCordinate + i] === undefined || this.rows[cellYCordinate + i][cellXCordinate - i] === undefined) {
        break;
      }
      if(this.rows[cellYCordinate + i][cellXCordinate - i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
    
    //bottom-right to top-left diagonal check
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellYCordinate - 1 - i] === undefined || this.rows[cellYCordinate - 1 - i][cellXCordinate + 1 + i] === undefined) {
        break;
      }
      if(this.rows[cellYCordinate - 1 - i][cellXCordinate + 1 + i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }      
   }
    
    else if(this.numberOfCellsX < this.numberOfCellsY) {
      // let buffer = numberInColumnToWin;
      // numberInColumnToWin = numberInRowToWin;
      // numberInRowToWin = buffer;
      var numberOfRows = this.rows[0].length;
      var numberOfColumns = this.rows.length;  
    // need to find out if a player has managed to place numberInRowToWin cells in a row. 
      for(let i = 0; i < numberOfColumns; i++) {
        if(this.rows[i][cellYCordinate].newDiv.style.backgroundColor === mostRecentPlayerColor) {
            numberInLine++;
          }
        else if(this.rows[i][cellYCordinate].newDiv.style.backgroundColor !== mostRecentPlayerColor) {
          break;
        }
        if(numberInLine === numberInRowToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
        }
      }
      

       //need to find out if a player has managed to place numberInColumnToWin cells in a column      
      for(let i = 0; i < numberOfRows; i++) {
          if(this.rows[cellXCordinate][i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
            numberInColumn++;
          }
        else if(this.rows[cellXCordinate][i].newDiv.style.backgroundColor !== mostRecentPlayerColor) {
          break;
        }
        if(numberInColumn === numberInColumnToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
          }
      } 
    

    // below are four code sections that deal with detecting diagonals in the different quadrants relative to the most recently clicked cell.

    // console.log(this.rows[cellYCordinate][cellXCordinate].newDiv.name + " = " + this.rows[cellYCordinate][cellXCordinate].newDiv.style.backgroundColor);
    // top-left to down right diagonal check
    numberInDiagonal = 0;
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellXCordinate + i] === undefined || this.rows[cellXCordinate + i][cellYCordinate + i] === undefined) {
        break;
      }
      if(this.rows[cellXCordinate + i][cellYCordinate + i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
     
    // bottom right to top left diagonal check
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellXCordinate - 1 - i] === undefined || this.rows[cellXCordinate - 1 - i][cellYCordinate - 1 - i] === undefined) {
        break;
      }
      if(this.rows[cellXCordinate - 1 - i][cellYCordinate - 1 - i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
    

    //top-right to down left-diagonal check
    numberInDiagonal = 0;    
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellXCordinate + i] === undefined || this.rows[cellXCordinate + i][cellYCordinate - i] === undefined) {
        break;
      }
      if(this.rows[cellXCordinate + i][cellYCordinate - i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
    
    //bottom-right to top-left diagonal check
    for(let i = 0; i<numberInDiagonalToWin; i++) {
      if(this.rows[cellXCordinate - 1 - i] === undefined || this.rows[cellXCordinate - 1 - i][cellYCordinate + 1 + i] === undefined) {
        break;
      }
      if(this.rows[cellXCordinate - 1 - i][cellYCordinate + 1 + i].newDiv.style.backgroundColor === mostRecentPlayerColor) {
        numberInDiagonal++;
      }
      if(numberInDiagonal === numberInDiagonalToWin) {
          this.winner = this.getCurrentPlayer().name;
          return true;
      }
    }
      
  }
    
    //the game ends in a tie if there are no more empty cells.
    if(this.numberOfFilledCells === this.totalCells) {
      this.winner = "Tie! There is no winner.";
      return true;
    }  
    
  }
}

//creates on object which stores information about each player.
let Player = function(playerName, playerColor) {
  this.name = playerName;
  this.color = playerColor;
  this.score = 0;
}




//constructor function for the grid. Contains helper function for creating individual cells.
let GridContainer = function(numberOfCellsX, numberOfCellsY) {

  let numberOfCells = numberOfCellsX*numberOfCellsY;
  let xCordinateOfCell = 1;
  let yCordinateOfCell = 1;
  let rowElement = [];
  
  // dynamically creates styling details for the container grid.
  let currentPlayerColor = gameState.getCurrentPlayer().color;
  document.getElementById('currentPlayerDisplay').innerHTML =  gameState.getCurrentPlayer().name;
  document.getElementById('currentPlayerDisplay').style.color =  currentPlayerColor;
  let dimensionsX = 100;
  let dimensionsY = 100;
  this.gridContainer = document.createElement("div");
  ticTacInterface.appendChild(this.gridContainer);
  this.gridContainer.style.width = String(dimensionsX) + "%";
  this.gridContainer.style.height = String(dimensionsY) + "%";
  this.gridContainer.style.display = "flex";
  if(numberOfCellsX>=numberOfCellsY) {
    this.gridContainer.style.flexDirection = "row";    
  }
  else if(numberOfCellsX<numberOfCellsY) {
    this.gridContainer.style.flexDirection = "column";    
  }

  this.gridContainer.style.alignContent = "center";
  this.gridContainer.style.alignItems = "center"
  this.gridContainer.style.flexWrap = "wrap"; 
  
  
  //funciton for setting the state of each of the cells.
  function clickCell() {     
    if(gameState.finished) {
      return;
    }
    if(this.cellState === "dead") {
      this.style.backgroundColor = currentPlayerColor;
      this.cellState = "alive"; 
      
      //checks to see if all the cells are full and declares the game over if it is.
      if(gameState.checkIfOver(currentPlayerColor, this.name)) {
        gameState.finished = true;
      }
    }
    else if(this.cellState === "alive") {
      // this.style.backgroundColor = "transparent";
      // this.cellState = "dead";
      return;
    }
    
    // checks to see if the game has been declared over earlier and officially ends the game if so.
    if(gameState.finished) {
      // gameState.winner = gameState.getCurrentPlayer().name;
      alert("game is over! The winner is " + gameState.winner);
      return
    }
    
      gameState.turn++;
      gameState.numberOfFilledCells++;
      gameState.updateQueue();
      currentPlayerColor = gameState.getCurrentPlayer().color;
      document.getElementById('currentPlayerDisplay').style.color =  currentPlayerColor;
      document.getElementById('currentPlayerDisplay').innerHTML =  gameState.getCurrentPlayer().name;
    return
  }
  
  
  // makes sure that the cells are highlighted when hovered over if and only if the cell is dead. If this were not checked for the then red cells would convert back blue when hovered over
  function hoverEffect() {
    if(this.cellState === "dead") {
      this.style.backgroundColor = "rgba(205, 253, 253, 0.8)"      
    }
  }
  
  // makes sure that the cells are DEhighlighted when DEhovered over if and only if the cell is dead. If this were not checked for then the red cells would convert to blue when the mouse DEhovers off of them.
  function hoverOffEffect() {
    if(this.cellState === "dead") {
      this.style.backgroundColor = "transparent";      
    }
  }
  
  // helper constructor function used to create a single cell. Cells can either be 'alive' or 'dead'.
  let Cell = function(width, height, color, name) {
    this.newDiv = document.createElement("div");
    // this.newDiv.style.alignSelf = 'center';
    this.newDiv.name = name;
    this.newDiv.cellState = "dead";
    this.newDiv.style.backgroundColor = "transparent";
    if(numberOfCellsY === numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsY + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsX + ")"; 
    }
    else if(numberOfCellsY > numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsY + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsY + ")";
      
    }
    else if(numberOfCellsY < numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsX + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsX + ")";      
    }
    this.newDiv.style.border = "1px black solid"
    this.newDiv.style.cursor = "pointer";
    this.newDiv.onclick = clickCell.bind(this.newDiv);
    this.newDiv.onmouseover = hoverEffect.bind(this.newDiv);
    this.newDiv.onmouseout  = hoverOffEffect.bind(this.newDiv);
  }

  // the interatinon logic which creates a grid of cell according to the variables passed in from outside of the GridContainer constructor function.
  for(let i = 0; i < numberOfCellsX; i++) {
    for(let j = 0; j < numberOfCellsY; j++) {
      let newSquareName = "("+ xCordinateOfCell+","+ yCordinateOfCell+")";
      console.log(newSquareName);
      let newSquare = new Cell(numberOfCellsX, numberOfCellsY, "rgb(16,217,239)", newSquareName); 
      this.gridContainer.appendChild(newSquare.newDiv);
      rowElement.push(newSquare);
      if(numberOfCellsX < numberOfCellsY) {
        if(yCordinateOfCell%numberOfCellsY === 0) {
            console.log("create row")
            gameState.rows.push(rowElement);
            rowElement = [];
            yCordinateOfCell = 0;
            xCordinateOfCell++;
          }
          yCordinateOfCell++;
}
      else {
          if(xCordinateOfCell%numberOfCellsX === 0) {
              console.log("create row");
              gameState.rows.push(rowElement);
              rowElement = [];
              xCordinateOfCell = 0;
              yCordinateOfCell++;
            }
            xCordinateOfCell++;       
      }
    }
  }
  
  // need to clear grid
  this.clearGrid = function() {
    ticTacInterface.removeChild(this.gridContainer);    
  }

} 

function resetGame() {
    newGridContainer.clearGrid();
    // gameState = new GameState(numberOfCellsX,     numberOfCellsY);
    gameState = new GameState(numberOfCellsX, numberOfCellsY, numberInRowToWin, numberInColumnToWin, numberInDiagonalToWin);
    gameState.addPlayer(player1);
    gameState.addPlayer(player2);
  
    newGridContainer = new GridContainer(numberOfCellsX, numberOfCellsY);  
}


//creates a new game state instance and also creates and adds new players to the game.
let numberOfCellsX = 3;
let numberOfCellsY = 3;
let numberInRowToWin = 3;
let numberInColumnToWin = 3;
let numberInDiagonalToWin = 3;
// let gameState = new GameState(numberOfCellsX, numberOfCellsY, numberInRowToWin, numberInColumnToWin, numberInDiagonalToWin);
let gameState = new GameState(numberOfCellsX, numberOfCellsY);
let player1 = new Player("Player1", "rgb(65, 205, 244)");
let player2 = new Player("Player2", "rgb(255, 71, 104)");

gameState.addPlayer(player1);
gameState.addPlayer(player2);
// gameState.addPlayer(player3);


// initalizes the grid of cells based on the parameters numberofCellsX and numberOfCellsY. IMPORTANT: newGridContainer needs to be declared AFTER gameState. The former uses the later in it's constructor function.
let newGridContainer = new GridContainer(numberOfCellsX, numberOfCellsY);

let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function(){
  resetGame();   
});

let gameSettingsButton = document.getElementById("gameSettingsButton");
gameSettingsButton.addEventListener('click', function() {
  document.getElementById("overlay").classList.remove("hidden"); 
});

let overlayExitIcon = document.getElementById("overlayExitIcon");
overlayExitIcon.addEventListener('click', function() {
//sets the overlay to hidden to exit out of the game settings menu
      document.getElementById("overlay").classList.add('hidden');
//the following lines of code ensure that the user can fiddle with values for the different fields but unless they are entered then closing out of the menu will not save them.
      document.getElementById("gridDimensionsFieldX").value = numberOfCellsX;
      document.getElementById("gridDimensionsFieldY").value = numberOfCellsY;
      document.getElementById("RowsToWinField").value = numberInRowToWin;
      document.getElementById("ColumnsToWinField").value = numberInColumnToWin;
      document.getElementById("DiagonalToWinField").value = numberInDiagonalToWin;
});

let generateGameButton = document.getElementById('generateGameButton');
generateGameButton.addEventListener('click', function() {
  if(Number(document.getElementById("gridDimensionsFieldX").value) !== 0) {
  numberOfCellsX = Number(document.getElementById("gridDimensionsFieldX").value);    
  }
if(Number(document.getElementById("gridDimensionsFieldY").value) !== 0) {
  numberOfCellsY = Number(document.getElementById("gridDimensionsFieldY").value);  
}
if(Number(document.getElementById("RowsToWinField").value) !== 0) {
  numberInRowToWin = Number(document.getElementById("RowsToWinField").value);  
}
else {
  numberInRowToWin = undefined;
}
if(Number(document.getElementById("ColumnsToWinField").value) !== 0) {
  numberInColumnToWin = Number(document.getElementById("ColumnsToWinField").value);  
}
else {
  numberInColumnToWin = undefined;
}
if(Number(document.getElementById("DiagonalToWinField").value) !== 0) {
  numberInDiagonalToWin = Number(document.getElementById("DiagonalToWinField").value);
}
else {
  numberInDiagonalToWin = undefined;
}

document.getElementById("overlay").classList.add('hidden');    
resetGame(); 
});

let addNewPlayerButton = document.getElementById('addNewPlayerButton');
addNewPlayerButton.addEventListener('click', function() {
  let newPlayerName =   document.getElementById('newPlayerNameField').value
  let newPlayerColor = document.getElementById('newPlayerColorField').value;
  if(!gameState.playerExists(newPlayerName) && !gameState.colorTaken(newPlayerColor)) {
    let newPlayer = new Player(newPlayerName, newPlayerColor);
    gameState.addPlayer(newPlayer);    
  }
});
