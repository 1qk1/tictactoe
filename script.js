$(document).ready(function () {
    var winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    var playerScore = 0;
    var botScore = 0;
    var xoro = ["X", "O"];
    var board = [0, 1, 2,
        3, 4, 5,
        6, 7, 8];
    var botMove = "";
    var playerMove = "";
    $("td").on("click", function (val) {
        if ($(this).hasClass("unclickable")) { return; }
        $("#cellN" + $(this).data("value") + "s").text(playerMove).fadeIn("fast");
        $(this).addClass("unclickable");
        board[$(this).data("value")] = playerMove;
        if (emptyIndeces(board) !== false) {
            makeBotMove();
        }
        checkForWinners(board);
    });
    $("#choose > button").on("click", function () {
        playerMove = $(this).data("value");
        botMove = xoro[(xoro.indexOf(playerMove) + 1) % 2];
        $("#choose").css("display", "none");
        $("table").css("display", "inline-block");
        if (playerMove == "O") {
            makeBotMove(4);
        }
    });
    $("#winscreen > button").on("click", function () {
        initialize();
        $("table").fadeIn("slow");
    });
    $("#resetBtn").on("click", function () {
        playerScore = 0;
        botScore = 0;
        updateScores();
    });
    function initialize() {
        board = [0, 1, 2,
            3, 4, 5,
            6, 7, 8];
        $("td").removeClass("unclickable");
        $("td > span").text("");
    }
    function emptyIndeces(board2) {
        return board2.filter(function (val) { return typeof val == "number" });
    }
    function makeBotMove() {
        if (arguments[0]) {
            var bestMmove = arguments[0];
        } else {
            var bestMmove = minimax(board, botMove).index;
            if (bestMmove == undefined) { return; }
        }
        $("#cellN" + bestMmove + "s").text(botMove).fadeIn("fast");
        $("#cellN" + bestMmove).addClass("unclickable");
        board[bestMmove] = botMove;
        checkForWinners(board);
    }
    function minimax(newBoard, player) {
        var availSpots = emptyIndeces(newBoard);
        if (winning(newBoard, botMove)) {
            return { score: 1 };
        } else if (winning(newBoard, playerMove)) {
            return { score: -1 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
            if (player == botMove) {
                var result = minimax(newBoard, playerMove);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, botMove);
                move.score = result.score;
            }
            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }
        var bestMove;
        if (player === botMove) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    function winning(board, player) {
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    }
    function checkForWinners(board) {
        if (board.filter(function(val){
            return typeof val == "string";
        })){
        for (var i = winningCombinations.length - 1; i >= 0; i--) {
            if (board[winningCombinations[i][0]] == board[winningCombinations[i][1]] && board[winningCombinations[i][1]] == board[winningCombinations[i][2]]) {
                if (board[winningCombinations[i][0]] == playerMove) {
                    playerScore+=0.5;
                    win("player");
                } else if (board[winningCombinations[i][0]] == botMove) {
                    botScore+=0.5;
                    win("bot");
                }
            }
        }
        if (emptyIndeces(board) == false) {
            win("draw");
        }
    }
    }
    function win(who) {
        if (who == "player") {
            $("#winscreen > h3").text("Player Wins!");
        } else if (who == "bot") {
            $("#winscreen > h3").text("Bot Wins!");
        } else if (who == "draw") {
            $("#winscreen > h3").text("It's a draw!");
        }
        $("td").addClass("unclickable");
        setTimeout(() => {
            initialize();
            updateScores();
            showWinScreen();
        }, 1000);
    }
    function showWinScreen() {
        $("table").fadeOut("fast");
        $("#winscreen").fadeIn("slow");
    }
    function updateScores() {
        $("#playerScores").text(playerScore);
        $("#botScores").text(botScore);
    }
});