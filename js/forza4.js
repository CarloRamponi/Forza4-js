"use strict";


class GameBoard {

  constructor(width, height) {

    this.width = width;
    this.height = height;
    this.moves = 0;

    //inizializzo boards e heights
    this.board = [];
    this.heights = [];
    for(var i = 0; i < width; i++) {
      this.heights[i] = 0;
      this.board[i] = [];
      for(var j = 0; j < height; j++) {
        this.board[i][j] = 0;
      }
    }

  }

  isWinningMove(col) {
    var player = 1 + this.moves % 2; //1 o 2

    // vertical alignments
    if(this.heights[col] >= 3
        && this.board[col][this.heights[col]-1] == player
        && this.board[col][this.heights[col]-2] == player
        && this.board[col][this.heights[col]-3] == player)
      return true;

    for(var dy = -1; dy <=1; dy++) {    // In verticale ci spositamo linearmente o sulle due diagonali
      var nb = 0;                       // numero pedine allineate
      for(var dx = -1; dx <=1; dx += 2) // guarda a sinistra e poi a destra
        for(var x = col+dx, y = this.heights[col]+dx*dy; x >= 0 && x < this.width && y >= 0 && y < this.height && this.board[x][y] == player; nb++) {
          x += dx;
          y += dx*dy;
        }
      if(nb >= 3) return true; // se ce ne sono almeno 3 (esclusa quella che vorrei inserire)
                               // restituisco true
    }
    return false; //altrimenti false
  }

  canPlay(col) {
    return (this.heights[col] < this.height);
  }

  play(col) {
    this.board[col][this.heights[col]] = 1 + this.moves % 2;
    this.heights[col]++;
    this.moves++;
  }

  unplay(col) {
    this.moves--;
    this.heights[col]--;
    this.board[col][this.heights[col]] = 0;
  }

  isDraw() {
    return this.moves == (this.width*this.height)
  }

}

class Solver {

  static solve(board) {

    for(x = 0; x < board.width; x++) { // controlla se posso vincere in una mossa
      if(board.canPlay(x) && board.isWinningMove(x)) {
        return x;
      }
    }

    var bestMove = -1;
    var best = -(board.width * board.height); //il massimo

    for(var x = 0; x < board.width; x++) { // calcolo il punteggio di tutte le possibili mosse
      if(board.canPlay(x)) {
        // console.log("Trying to play " + x);
        board.play(x);                 // Ora è il turno dell'avversario.
        var score = -Solver.solve_rec(board, -board.width*board.height/2, board.width*board.height/2, 12);  // quindi ritorno il punteggio di questo stato cambiato di segno
        // var score = -Solver.solve_rec(board, -1, 1);  // quindi ritorno il punteggio di questo stato cambiato di segno
        board.unplay(x);
        if(score > best) { // tengo traccia del migliore.
          best = score;
          bestMove = x;
        } else if (score == best) { //se sono uguali lo prendo in modo casuale
          if(Math.floor(Math.random() * 2 != 0)) {
            best = score;
            bestMove = x;
          }
        }
      }
    }

    return bestMove;
  }

  /*
    Punteggio 0: non ci sono mosse da fare
    Punteggio positivo: numero di mosse necessarie per vincere (nel caso in cui l'avversario non possa vincere la prossima mossa)
    Punteggio negativo: numero di mosse necessarie perchè l'avversario vinca

    maxMoves: il numero di mosse da prevedere
  */
  static solve_rec(board, alpha, beta, maxMoves) {

    debugger;

    if(maxMoves <= 0 || board.isDraw()) { // check for draw game
       return 0;
    }

    for(var x = 0; x < board.width; x++) { // check if current player can win next move
      if(board.canPlay(x) && board.isWinningMove(x)) {
         return (board.width*board.height + 1 - board.moves) / 2;
      }
    }

    var max = (board.width * board.height - 1 - board.moves) / 2;

    if(beta > max) {
      beta = max;                     // there is no need to keep beta above our max possible score.
      if(alpha >= beta) {
        return beta;  // prune the exploration if the [alpha;beta] window is empty.
      }
    }

    for(var x = 0; x < board.width; x++) {
      if(board.canPlay(x)) {
        board.play(x);
        var score = -Solver.solve_rec(board, -beta, -alpha, maxMoves-1);
        board.unplay(x);

        if(score >= beta) {
          return score;
        }

        if(score > alpha) {
          alpha = score;
        }
      }
    }

    return alpha;

  }

}

class Game {

  constructor(width, height) {
    this.board = new GameBoard(width, height);
    this.width = width;
    this.height = height;
    this.win = false;
    this.buttonsEnabled = true;
  }

  enableButtons(b) {
    this.buttonsEnabled = b;
  }

  static pvp(player1, player2, width, height) {
    var game = new Game(width, height);
    game.player1 = player1;
    game.player2 = player2;
    game.mode = 0;
    return game;
  }

  static pvb(player, width, height){
    var game = new Game(width, height);
    game.player1 = player;
    game.player2 = "Bot";
    game.mode = 1;
    return game;
  }

  play(col) {

    if(!this.win && this.buttonsEnabled){

        if(this.board.canPlay(col)) {

          dismissError();

          document.getElementById("cell"+col+this.board.heights[col]).innerHTML = (this.board.moves % 2 == 0)? "<img src='img/rosso.png'>" : "<img src='img/giallo.png'>";

          if(this.board.isWinningMove(col)) {

            this.win = true;
            if(this.mode == 0) {
              displayWin((this.board.moves % 2 == 0)? this.player1 : this.player2);
            } else {
              if(this.board.moves % 2 == 0) {
                displayWin(this.player1);
              } else {
                displayLose();
              }
            }
            this.board.play(col);

          } else {

            this.board.play(col);

            if(this.board.isDraw()) {
              displayDraw();
            } else {

              if(this.mode == 0) {

                document.getElementById("turn").innerText = (this.board.moves % 2 == 0)? this.player1 : this.player2;
                document.getElementById("turn").className = (this.board.moves % 2 == 0)? "text-danger" : "text-warning";

              } else if (this.board.moves % 2 == 1){

                this.enableButtons(false);

                var solution = Solver.solve(gameObj.board);
                console.log("Solution: " + solution);
                this.enableButtons(true);
                this.play(solution);

              }
            }

          }
        } else {
          displayError("Colonna piena!");
        }
    }

  }

  draw() {

    document.getElementById("player1header").innerText = this.player1;
    document.getElementById("player2header").innerText = this.player2;

    if(this.mode == 1) {
      var disclaimer = document.createElement("p");
      disclaimer.innerHTML = "Inizi tu, quindi dovresti vincere :) (<a href='https://en.wikipedia.org/wiki/Connect_Four#Mathematical_solution' target='_blank'>Mathematical solution</a>)"
      document.getElementById("header").appendChild(disclaimer);
    }

    document.getElementById("turn").innerText = this.player1;
    document.getElementById("turn").className = "text-danger";

    var table = document.getElementById("table");

    for(var i = 0; i < this.height; i++) {
      var row = table.insertRow(0); //0 lo inserisce all'inizio
      for(var j = 0; j < this.width; j++) {
        var cell = row.insertCell(-1); //-1 lo inserisce alla fine
        cell.id = "cell" + j + i;
        cell.innerHTML = "<img src='img/vuoto.png'>"
      }
    }

    var buttonsRow = table.insertRow(0);
    for(var i = 0; i < this.width; i++) {
      var buttonCell = buttonsRow.insertCell(-1);

      var button = document.createElement("button");
      button.setAttribute("col", i);

      button.classList.add("btn");
      button.classList.add("btn-default");
      button.style.width = "50px";
      button.style.height = "50px";
      button.style.fontSize = "25px";
      button.innerHTML = "↓";

      button.addEventListener("click", function() {
        gameObj.play(parseInt(this.getAttribute("col")));
      });

      buttonCell.appendChild(button);

    }

  }

}

function dismissError() {
  document.getElementById("error").innerHTML="";
}

function displayError(err) {
  var string = "<div class='alert alert-dismissible alert-danger'>\
                  <button type='button' class='close' data-dismiss='alert' onclick='dismissError()'>&times;</button>" + err + "\
              </div>";
  document.getElementById("error").innerHTML=string;
}

function displayDraw() {
  var string = "<div class='alert alert-dismissible alert-warning'>\
                  <button type='button' class='close' data-dismiss='alert' onclick='location.reload()'>&times;</button>\
                  Mi dispiace, nessuno ha vinto. <a onclick='location.reload()'>Rigioca!</a>\
              </div>";
  document.getElementById("error").innerHTML=string;
}

function displayWin(player) {
  var string = "<div class='alert alert-dismissible alert-success'>\
                  <button type='button' class='close' data-dismiss='alert' onclick='location.reload()'>&times;</button>\
                  Ha vinto <strong>" + player + "</strong>, Complimenti!<br><a onclick='location.reload()'>Rigioca!</a>\
              </div>";
  document.getElementById("error").innerHTML=string;
}

function displayLose() {
  var string = "<div class='alert alert-dismissible alert-danger'>\
                  <button type='button' class='close' data-dismiss='alert' onclick='location.reload()'>&times;</button>\
                  Mi dispiace! Hai perso<br><a onclick='location.reload()'>Riprova!</a>\
              </div>";
  document.getElementById("error").innerHTML=string;
}

var gameObj;

function initPvP(){
    player1 = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;

    if(player1=="" || player2 ==""){
      displayError("I <strong>campi</strong> non possono essere <strong>vuoti</strong>!!!");
    } else {
      dismissError();
      document.getElementById("first_page").style.display = "none";
      document.getElementById("second_page").style.display = "block";
      gameObj = Game.pvp(player1, player2, 7, 6);
      gameObj.draw();
    }
}

function initPvB(){
    player = document.getElementById("player").value;

    if(player==""){
      displayError("Il nome del giocatore non può essere <strong>vuoto</strong>!!!");
    } else {
      dismissError();
      document.getElementById("first_page").style.display = "none";
      document.getElementById("second_page").style.display = "block";
      gameObj = Game.pvb(player, 7, 6); //più grande è troppo lento
      gameObj.draw();
    }
}
