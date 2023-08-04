/////////////
//const declares variables when you dont want to the change its value
const gravity = .5
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //its gonna be a 2d game

//resize canvas
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //makes black rectangle as background

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'
})

const shop = new Sprite({
    position:{
        x:601,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale:2.75,
    framesMax :6
})

const player = new fighter({
    position:{
    x:20,
    y:0
},velocity:{
    x:0,
    y:0
},
offset:{
    x:0,
    y:0
},
imageSrc:'./img/EVil Wizard 2/Sprites/Idle.png',
framesMax :8,
scale:2.2,
offset:{
    x:215,
    y:217
},
sprites:{
    idle:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Idle.png',
        framesMax: 8,
    },
    run:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Run.png',
        framesMax: 8,
    },
    jump:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Jump.png',
        framesMax: 2,
    },
    fall:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Fall.png',
        framesMax: 2,
    },
    attack1:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Attack1.png',
        framesMax: 8,
    },
    takeHit:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Take hit.png',
        framesMax: 3,
    },
    death:{
        imageSrc:'./img/EVil Wizard 2/Sprites/Death.png',
        framesMax: 7,
    }

},
    attackBox:{
        offset:{
            x:143,y:30
        },
        width:147,
        height:50 
    }
}) //creates new object of class


const enemy = new fighter({
    position:{
    x:950,
    y:100
},velocity:{
    x:0,
    y:0
},
offset:{
    x:-50,
    y:0
},
color:'blue',

imageSrc:'./img/kenji/Idle.png',
framesMax :4,
scale:2.2,
offset:{
    x:215,
    y:132
},
sprites:{
    idle:{
        imageSrc:'./img/kenji/Idle.png',
        framesMax: 4,
    },
    run:{
        imageSrc:'./img/kenji/Run.png',
        framesMax: 8,
    },
    jump:{
        imageSrc:'./img/kenji/Jump.png',
        framesMax: 2,
    },
    fall:{
        imageSrc:'./img/kenji/Fall.png',
        framesMax: 2,
    },
    attack1:{
        imageSrc:'./img/kenji/Attack1.png',
        framesMax: 4,
    },
    takeHit:{
        imageSrc:'./img/kenji/Take hit.png',
        framesMax: 3
    },
    death:{
        imageSrc:'./img/kenji/Death.png',
        framesMax: 7,
    }
},

attackBox:{
    offset:{
        x:-175,y:60
    },
    width:150,
    height:50
}

}) //creates new object of class


console.log(player)

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate) //what function you want to loop over and over
    c.fillStyle = 'black' //so we could see the red rectangles, without this, the bckground would of been also red
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    
    //player movement
    
    if(keys.a.pressed && player.lastKey =='a'){
        player.velocity.x = -3
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKey =='d'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    //jumping
    if(keys.w.pressed && player.lastKey =='w'){
        player.velocity.y = -10
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }
    
    
    /*
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }
    */


    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey =='ArrowLeft'){
        enemy.velocity.x = -7
        enemy.switchSprite('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey =='ArrowRight'){
        enemy.velocity.x = 4
        enemy.switchSprite('run')
    }
    else{
        enemy.switchSprite('idle')
    }
    //jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }
    
    //detect collision
    if(rectangularCollision( { rectangle1: player,rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4){
        enemy.takeHit()
        //enemy.health-=5 //additional damage 
        player.isAttacking = false
        
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    //if player misses hit
    if(player.isAttacking && player.framesCurrent ===4){
        player.isAttacking = false
    }

    //where player gets hit
    if(rectangularCollision( { rectangle1: enemy,rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent===2){
        player.takeHit() 
        //player.health-=10   how much more damage would it do
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //if player misses hit
    if(enemy.isAttacking && enemy.framesCurrent ===2){
        enemy.isAttacking = false
    }

    //end game based on health
    if(enemy.health <=0 || player.health <=0){
        determineWinner({player,enemy, timerId})
    }
}
animate()

window.addEventListener('keydown',(event)=>{
    if(!player.dead){
        switch(event.key){
            //Players Controls
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                
            break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            break
            case 'w':
                //velocity y is decrease
                //if (!w.repeat) { return }
            keys.w.pressed = true
            player.lastKey = 'w'
            

            //player.velocity.y = -15
            break
            case ' ':
                player.attack() 
                break
        }
    }
    

        if(!enemy.dead){
            switch(event.key){
                //Enemys controls
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
            enemy.velocity.y = -15
            break
            case 'ArrowDown':
                enemy.attack()
                
            break
            }
        }
        

})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false

        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break

        
    }

    switch(event.key){
        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        
    }
    
})

//prvents game to move the computers screen by moving arrows
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);