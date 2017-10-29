function generateWinningNumber() {
	return Math.floor(Math.random()*100 + 1);
}

function shuffle(array) {
  var m = array.length;
  var t;
  var i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	var result = this.playersGuess - this.winningNumber;
	if (result < 0) {
		result = result*(-1);
	}
	return result;
}

Game.prototype.isLower = function() {
	if (this.playersGuess < this.winningNumber) {
		return true;
	}
	return false;
}

Game.prototype.playersGuessSubmission = function(num) {
	if (num < 1 || num > 100 || typeof(num) !== 'number') {
		throw "That is an invalid guess.";
	}
	else {
		this.playersGuess = num;
		return this.checkGuess();
	}	
}

Game.prototype.checkGuess = function() {

	if (this.playersGuess === this.winningNumber) {
		return 'You Win!';
	}
	else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
		return 'You have already guessed that number.';
	}
	else {
		this.pastGuesses.push(this.playersGuess);
	}	
	if (this.pastGuesses.length === 5) {
		return 'You Lose.';
	}
	else if (this.difference() < 10) {
		return 'You\'re burning up!';
	}
	else if (this.difference() < 25) {
		return 'You\'re lukewarm.';
	}
	else if (this.difference() < 50) {
		return 'You\'re a bit chilly.';
	}
	else if (this.difference() < 100) {
		return 'You\'re ice cold!';
	}
}

function newGame() {
	return new Game();
}

Game.prototype.provideHint = function() {
	return shuffle([this.winningNumber,generateWinningNumber(),generateWinningNumber()]);
}

//JQUERY

function makeAGuess(game) {
	var guess = $('#player-input').val();
	$('#player-input').val('');
	var output = game.playersGuessSubmission(Number(guess));
	console.log(output);
	$('#headers h1').text(output);
	//duplicate handler	
	if (output === 'You have already guessed that number.') {
		$('#instructions').text('Guess again!');
	}
	//add guess to guess list
	else {
		var guessBox = $('#guess-list .empty').first();
		guessBox.text(guess);
		guessBox.removeClass('empty');
		if (output === 'You Win!' || output === 'You Lose.') {
			$('#instructions').text('Press the reset button to play again!');
			$('#submit, #hint').attr('disabled','disabled');
		}
		else {
			if (game.isLower()) {
				$('#instructions').text('Guess higher!');
			}
			else {
				$('#instructions').text('Guess lower!');
			}	
		}
	}	
}

$(document).ready(function() {

	var game = new Game();

	$('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(e) {
    	if (event.which == 13) {
    		makeAGuess(game);
    	}
    })

    $('#hint').click(function(e) {
    	var hintArr = game.provideHint();
    	$('#big-title')
    	.text('The winning number is ' + hintArr[0] + ', ' + hintArr[1] + ', or ' + hintArr[2]);
    })

    $('#reset').click(function(e) {
    	$('#submit, #hint').attr('disabled',false);
    	$('.guess').text('-');
    	$('.guess').addClass('empty');
    	$('#big-title').text('Play the Guessing Game!');
    	$('#instructions').text('Guess a number between 1 and 100 to begin');
    	game = new Game();
    })

});




