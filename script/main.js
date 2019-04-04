/* ----------------------
           CONFIG
 ---------------------- */
const config = {
    width: window.innerWidth,
    height: window.innerHeight / 2,
    type: Phaser.AUTO,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade:{
            gravity :{ y: 0},
            // debug: true
        }
    },
    backgroundColor : '#4141a1',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)
/* ----------------------
        VARIABLES
 ---------------------- */
const paddle = {width: 14, height: 100, speed: 400}
const mainball = { speed: 400}
let player1, player2, ball





function preload(){
    this.load.image('paddle','images/paddle.png')
    this.load.image('ball','images/ball.png')
}



let keyZ, keyS, keyUp, keyDown
function create(){

    player1 = new Player(this, 'left')
    player2 = new Player(this, 'right')
    ball = new Ball(this)
    
    keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    this.physics.add.collider(ball.ball, player1.paddles, () => {
        ball.accelerate()
    })
    this.physics.add.collider(ball.ball, player2.paddles, () => {
        ball.accelerate()
    })
}


function update(){
    if(keyZ.isDown){
        player1.toTop()
    }else if(keyS.isDown){
        player1.toBottom()
    }

    if(keyUp.isDown){
        player2.toTop()
    }else if(keyDown.isDown){
        player2.toBottom()
    }

    if(ball.ball.body.blocked.left){
        player2.win()
        ball.init()
    }else if(ball.ball.body.blocked.right){
        player1.win()
        ball.init()
    }

    if(player1.points >= 3 || player2.points >= 3){
        initGame()
    }
}

//CLASS PLAYER
class Player{
    constructor(self, side){
        this.paddles = this.createPaddle(self, side)
        this.points = 0
        this.text = this.createText(self, side)
    }

    init(){
        this.points = 0
        this.updateText()
        let y = game.canvas.height / 2
        this.paddles.setY(y)
    }
    
    createText(self, side){
      let textConfig = {
          x: game.canvas.width / 6, 
          y: game.canvas.height / 2,
          text: this.points,
          style: {
              fontSize: '120px',
              fontFamily: 'Arial',
              color: '#ffffff40',
              fontStyle: 'italic'
          }
      }

      if(side == 'right'){
          textConfig.x = game.canvas.width / 4 * 3
      }
      let text = self.make.text(textConfig)
      return text
    }


    updateText(){
        this.text.setText(this.points)
    }

    createPaddle(self, side){
        let y = game.canvas.height / 2, x
        if(side == 'left'){
            x = paddle.width / 2
        }
        else if(side == 'right'){
            x = game.canvas.width - paddle.width / 2
        }
        
        let paddles= self.physics.add.image(x,y, 'paddle')
        paddles.body.collideWorldBounds = true
        paddles.body.immovable = true
        return paddles

    
    }
    toTop(){
        this.paddles.setVelocity(0, -paddle.speed)
    }
    toBottom(){
        this.paddles.setVelocity(0, paddle.speed)
    }
    win(){
        this.points++
        this.updateText()
    }
}

// CLASS BALL
class Ball{
    constructor(self){
        this.ball = this.createBall(self)
        this.init()
    }
    init(){
        let x = game.canvas.width / 2
        let y = game.canvas.height / 2
        this.ball.setX(x)
        this.ball.setY(y)

        let ball_speed_square = Math.pow(mainball.speed, 2)
        let velocity_x =random(ball_speed_square / 3, ball_speed_square)
        let velocity_y =ball_speed_square - velocity_x

        velocity_x = Math.sqrt(velocity_x)
        velocity_y = Math.sqrt(velocity_y)

        let rand_bool_x = Math.random() >= 0.5
        let rand_bool_y = Math.random() >= 0.5

        if(rand_bool_x){
            velocity_x = -velocity_x
        }
        if(rand_bool_y){
            velocity_y = -velocity_y
        }
        

        this.ball.setVelocity(velocity_x, velocity_y)
    }
    createBall(self, side){
        let x = game.canvas.width / 2
        let y = game.canvas.height / 2
        
        let ball= self.physics.add.image(x,y, 'ball')
        ball.body.collideWorldBounds = true
        ball.setBounce(1)
        return ball
    
    }
    accelerate(){
        let offset = Math.floor (mainball.speed / 7)
        let velocity = this.ball.body.velocity

        velocity.x += (velocity.x > 0) ? offset : -offset
        velocity.y += (velocity.y > 0) ? offset : -offset

        this.ball.setVelocity(velocity.x, velocity.y)
    }
}
    


function random(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

function initGame(){
    ball.init()
    player1.init()
    player2.init()
}

