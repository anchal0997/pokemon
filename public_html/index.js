/**
 * Created by AMANRAJ on 19/07/16.
 */

var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

GAME_WIDTH = 1280;
GAME_HEIGHT = 729;

var sprites = {};

sprites.player = new Image();
sprites.player.src = "assets/pika.png";

sprites.goal = new Image();
sprites.goal.src = "assets/ball.png";

sprites.enemy = [];
sprites.enemy[0] = new Image();
sprites.enemy[0].src = "assets/meow.png";
sprites.enemy[1] = new Image();
sprites.enemy[1].src = "assets/gengar.png";
sprites.enemy[2] = new Image();
sprites.enemy[2].src = "assets/drowsy.png";
sprites.enemy[3] = new Image();
sprites.enemy[3].src = "assets/bulbasaur.png";
sprites.enemy[4] = new Image();
sprites.enemy[4].src = "assets/eevee.png";
sprites.enemy[5] = new Image();
sprites.enemy[5].src = "assets/squirtle.png";
sprites.enemy[6] = new Image();
sprites.enemy[6].src = "assets/charizard.png";

var gameOver = false;
var level = 1;
var score = 0;
var highScore = 0;
var id;

var enemy = [
    {
        x : 120,
        y : 100,
        w : 70,
        h : 70,
        passed : false,
        speedY : 1
    },

    {
        x : 270,
        y : 50,
        w : 70,
        h : 70,
        passed : false,
        speedY : 1.5
    },

    {
        x : 420,
        y : 350,
        w : 70,
        h : 70,
        passed : false,
        speedY : 2
    },

    {
        x : 570,
        y : 200,
        w : 70,
        h : 70,
        passed : false,
        speedY : 2.5
    },

    {
        x : 720,
        y : 150,
        w : 70,
        h : 70,
        passed : false,
        speedY : 3
    },

    {
        x : 870,
        y : 250,
        w : 70,
        h : 70,
        passed : false,
        speedY : 3.5
    },

    {
        x : 1020,
        y : 300,
        w : 70,
        h : 70,
        passed : false,
        speedY : 4
    }
];

var player = {
    x : 10,
    y : GAME_HEIGHT / 2,
    w : 70,
    h : 70,
    speedX : 3,
    isMoving : false
};

var goal = {
    x : GAME_WIDTH - 75,
    y : GAME_HEIGHT / 2,
    w : 75,
    h : 75
};

canvas.addEventListener("mousedown", function () {
    player.isMoving = true;
});

canvas.addEventListener("mouseup", function () {
    player.isMoving = false;
});

canvas.addEventListener("touchstart", function () {
    player.isMoving = true;
});

canvas.addEventListener("touchend", function () {
    player.isMoving = false;
});

var isColliding = function (r1, r2) {
    var firstCond = Math.abs(r1.x - r2.x) <= Math.max(r1.w, r2.w);
    var secondCond = Math.abs(r1.y - r2.y) <= Math.max(r1.h, r2.h);
    if (firstCond && secondCond) {
        return true;
    }
    return false;
};

var check = function (r1, r2) {
    var cond = (r1.x + r1.w) >= (r2.x + r2.w);
    if (cond && !r2.passed) {
        r2.passed = true;
        return true;
    }
    return false;
};

var update = function () {
    //CHECK COLLISION
    enemy.forEach(function (element, index) {
        if (isColliding(player, element)) {
            let newID = {emailID : id, score : highScore};
            $.post('/updateScore', newID, function (data, status) {

            });
            alert("GAME OVER! \nYour score is : " + score);
            gameOver = true;
            window.location = "";
        }
    });

    //Check for collision between player and goal
    if (isColliding(player, goal)) {
        enemy.forEach(function (element, index) {
            element.speedY *= 2;
            element.passed =false;
        });
        player.x = 10;
        level++;
    }

    //Updates Score
    enemy.forEach(function (element, index) {
        if (check(player, element)) {
            if (score == highScore) {
                highScore++;
            }
            score++;;
        }
    });

    //Move the enemies
    enemy.forEach(function (element, index) {
        element.y += element.speedY;
        if (element.y >= GAME_HEIGHT - 75 || element.y <= 0) {
            element.speedY *= -1;
        }
    });

    //Check for moving player
    if (player.isMoving == true) {
        player.x += player.speedX;
    }
};

var draw = function () {
    //CLEAR SCREEN
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //DRAW ENEMYS
    enemy.forEach(function (element, index) {
        ctx.drawImage(sprites.enemy[index], element.x, element.y, element.w, element.h);
    });

    //DRAW PLAYER
    ctx.drawImage(sprites.player, player.x, player.y, player.w, player.h);

    //DRAW GOAL
    ctx.drawImage(sprites.goal ,goal.x, goal.y, goal.w, goal.h);

    $("#level").html("Level : " + level);

    $("#highscore").html("High Score : " + highScore);

    $("#scoreboard").html("Score :" + score);
};

var render = function () {
    draw();
    update();
    if (!gameOver) {
        window.requestAnimationFrame(render);
    }
};

$("#submit").click(function () {
    if ($("#emailid").val() != "") {
        id = $("#emailid").val();
        let newID = {emailID: id};
        $.post('/add', newID, function (data, status) {

        });

        $.post('/showScore', newID, function (data, status) {
            for (user of data) {
                highScore = user.score;
            }
        });

        $("#details").css("display", "none");
        render();
    }
});

$("#leaderboard").click(function () {
    gameOver = true;
    $("#details").css("display", "none");
    $.post('/leaderboard', function (data, status) {
        $("#board").css("display", "block");
        $("#board").html('');
        for (let member of data) {
            $("#board").append('<li>' + member.emailID + ' : ' + member.score + '</li>');
        }
        $("#board").append('<button id="continue" onclick="home()">GO TO HOME</button>');
    });
});

function home() {
    gameOver = false;
    window.location = "";
}