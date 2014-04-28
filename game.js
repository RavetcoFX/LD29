var game = new Phaser.Game(420, 600, Phaser.AUTO, 'ld29-beneath', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.spritesheet('char', 'res/diver.png', 128, 51, 2);
    game.load.image('wall_h', 'res/wall_hor.png');
}

var charDiver;
var wall;
var depth = 0;
var isGameOver = false;

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;
    
    var diverCollisionGroup = game.physics.p2.createCollisionGroup();
    var wallsCollisionGroup = game.physics.p2.createCollisionGroup();
    
    game.physics.p2.updateBoundsCollisionGroup();

    game.stage.backgroundColor = '#8BC3F2'; //Nice blue

    charDiver = game.add.sprite(120, 210, 'char');
    charDiver.animations.add('swim');
    charDiver.animations.play('swim', 5, true);
    charDiver.anchor.setTo(0.5, 0.5);
    charDiver.smoothed = false;
    game.physics.p2.enable(charDiver, true);
    charDiver.body.allowRotation = false;
    //charDiver.body.setSize(80, 20, 0, 0);
    charDiver.scale.setTo(0.7, 0.7);

    walls = game.add.group();
    walls.enableBody = true;
    walls.createMultiple(50, 'wall_h', 0, false);
    game.physicsBodyType = Phaser.Physics.P2JS;

}

setInterval(function () {
    depth++;
}, 1000);
setInterval(function () {
    addRowWalls();
}, 1000);

function update() {

    charDiver.rotation = game.physics.arcade.moveToPointer(charDiver, 1, game.input.activePointer, 1000);
    game.physics.arcade.collide(charDiver, walls, null, null, this);

    if (charDiver.x > game.width - 24) { //right side
        charDiver.x = game.width - 24;
    }
    if (charDiver.x < 24) { //left side
        charDiver.x = 24;
    }
    if (charDiver.y > game.height - 24) { //Bottom
        charDiver.y = game.height - 24;
    }

    if (charDiver.y < 24) { //Top edge
        charDiver.kill();
    }

    if (!charDiver.alive) {
        alert("Game Over");
        restartGame();
    }

}

function createOneWall(x, y) {

    var wall = this.walls.getFirstDead();
    wall.checkWorldBounds = true;
    wall.reset(x, y);
    wall.body.setRectangle(64, 32);
    wall.body.setCollisionGroup(wallsCollisionGroup);
    panda.body.collides([DiverCollisionGroup]);
    wall.body.velocity.y = -400;
    wall.scale.setTo(2, 1);
    wall.outOfBoundsKill = true;
    wall.body.immovable = true;

}

function addRowWalls() {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
        if (i != hole && i != hole + 1) {
            createOneWall(i * 60, game.height);
        }
    }
}

function render() {

    //game.debug.spriteInfo(charDiver, 10, 20);
    game.debug.text("Depth: " + depth, 10, 20);
    game.debug.body(charDiver);
    //game.debug.spriteBounds(walls);

}

function restartGame() {
    walls.distroy();
    create();
}
