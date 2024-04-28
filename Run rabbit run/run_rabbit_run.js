window.onload = function() {
    const canvas = document.getElementById("game");
    const context = canvas.getContext("2d");

    // Game settings
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 400;

    let speed = 10;
    let gameRunning = true;
    let previousTime = 0;






    //SCREEN RATIO





    //allow scaling according to screen
    let scaleRatio = 1; //null?

    function screen_settings() {
        scaleRatio = getScaleRatio();
        canvas.width = GAME_WIDTH * scaleRatio;
        canvas.height = GAME_HEIGHT * scaleRatio;
    }

    // Calculate scale ratio based on screen size
    function getScaleRatio() {
        const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
        const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
            return screenWidth / GAME_WIDTH;
        } else {
            return screenHeight / GAME_HEIGHT;
        }
    }







    //ANIMATIONS


    

    // Animation settings
    const animations = {
        walk: [],
        jump: [],
        crouch: [],
    };

    //animation frames
    animations.jump.push(new Image());
    animations.jump[0].src = './img/jump1.png';
    animations.jump.push(new Image());
    animations.jump[1].src = './img/jump2.png';
    animations.crouch.push(new Image());
    animations.crouch[0].src = './img/duck.png';


    // Animation speed in ms
    const animationSpeed = 25; //lower=more fps
    let currentFrame = 0; 
    let currentAnimation = 'walk'; 

    //rabbit walking animation images
    loadAnimationFrames('walk', 18, [
        './img/walk1.png', './img/walk1.png', './img/walk1.png',
        './img/walk2.png', './img/walk2.png', './img/walk2.png', 
        './img/walk3.png', './img/walk3.png', './img/walk3.png',
        './img/walk4.png', './img/walk4.png', './img/walk4.png', 
        './img/walk5.png', './img/walk5.png', './img/walk5.png',
        './img/walk6.png', './img/walk6.png', './img/walk6.png',
    ]);

    //animate the rabbit
    function loadAnimationFrames(animationName, frameCount, framePaths) {
        for (let i = 1; i <= frameCount; i++) {
            const frame = new Image();
            frame.src = framePaths[i - 1]; 
            animations[animationName].push(frame);
        }
    }









    //RABBIT




    // Rabbit settings
    const RABBIT_WIDTH = 80;
    const RABBIT_HEIGHT = 80;
    const RABBIT_START_X = 50;
    const RABBIT_START_Y = GAME_HEIGHT - RABBIT_HEIGHT - 50;

    let rabbit = {
        x: RABBIT_START_X,
        y: RABBIT_START_Y,
        width: RABBIT_WIDTH,
        height: RABBIT_HEIGHT,
        isJumping: false,
        isDucking: false,
        velocityY: 0,
        //so that the rabbit cannot jump while jumping
        jumpAllowed: true,
    };

    //rabbit animation
    function drawRabbit() {
        const scaledX = rabbit.x * scaleRatio;
        let scaledY = rabbit.y * scaleRatio;
        const scaledWidth = rabbit.width * scaleRatio;
        const scaledHeight = rabbit.height * scaleRatio;

        let currentImage;

        if (currentAnimation === 'jump') {
            //going up animation
            if (rabbit.velocityY < 0) {
                currentImage = animations.jump[0];
            } else {
                //falling down animation
                currentImage = animations.jump[1];
            }
        } else if (currentAnimation === 'crouch') {
            //crouching animation
            currentImage = animations.crouch[0];
            //rabbit becomes smaller in size
            scaledY = (RABBIT_START_Y + RABBIT_HEIGHT / 2) * scaleRatio;
        } else {
            currentImage = animations[currentAnimation][currentFrame];
        }

        //create the rabbit
        context.drawImage(currentImage, scaledX, scaledY, scaledWidth, scaledHeight);
    }


    function handleRabbitJump() {
        if (rabbit.isJumping) {
            // make rabbit go up
            rabbit.y += rabbit.velocityY;
    
            // make rabbit go down once reach a spefic num
            if (rabbit.velocityY < 10) {
                rabbit.velocityY += 0.6;
            }
    
            //if rabbit landed
            if (rabbit.y >= RABBIT_START_Y) {
                rabbit.y = RABBIT_START_Y;
                rabbit.isJumping = false;
                rabbit.jumpAllowed = true;
                currentAnimation = 'walk';
            }
        }
    }








    //OBSTACLE





    // Obstacle settings
    const OBSTACLE_SPEED = speed;
    const OBSTACLE_SPAWN_RATE = 2000; // Time in milliseconds between obstacle spawns

    //list of objects
    let obstacles = [];

    const obstacleTypes = {
        biglrock: {
            image: './img/top1.png',
            width: 350,
            height: 312,
            startY: 0 
        },
        biglrock2: {
            image: './img/top1.png',
            width: 300,
            height: 312,
            startY: 0 
        },
        smallrock: {
            image: './img/top2.png',
            width: 150,
            height: 312,
            startY: 0
        },
        smallrock2: {
            image: './img/top2.png',
            width: 200,
            height: 312,
            startY: 0
        },
        monster: {
            image: './img/ground1.png',
            width: 225,
            height: 125,
            startY: GAME_HEIGHT - 170 
        },
        monster2: {
            image: './img/ground1.png',
            width: 125,
            height: 125,
            startY: GAME_HEIGHT - 170 
        },
        monster3: {
            image: './img/ground1.png',
            width: 125,
            height: 100,
            startY: GAME_HEIGHT - 150 
        },
        fire: {
            image: './img/ground2.png',
            width: 150,
            height: 150,
            startY: GAME_HEIGHT - 150 
        },
        fire2: {
            image: './img/ground2.png',
            width: 200,
            height: 150,
            startY: GAME_HEIGHT - 150 
        },
        fire3: {
            image: './img/ground2.png',
            width: 220,
            height: 150,
            startY: GAME_HEIGHT - 150 
        },
    };



    //create object
    function createObstacle(type = null) {
        //randomize object
        const types = Object.keys(obstacleTypes);
        type = types[Math.floor(Math.random() * types.length)];
    
        //get properties of the specified obstacle type
        const obstacleProps = obstacleTypes[type];
    
        // create obstacle object
        const obstacle = {
            x: GAME_WIDTH,
            y: obstacleProps.startY,
            width: obstacleProps.width,
            height: obstacleProps.height,
            image: new Image(),
        };
    
 
        obstacle.image.src = obstacleProps.image;
        obstacles.push(obstacle);
    }
    

    //object creation time
    setInterval(() => createObstacle(), OBSTACLE_SPAWN_RATE);

    //object create
    function drawObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            const scaledX = obstacle.x * scaleRatio;
            const scaledY = obstacle.y * scaleRatio;
            const scaledWidth = obstacle.width * scaleRatio;
            const scaledHeight = obstacle.height * scaleRatio;

            context.drawImage(obstacle.image, scaledX, scaledY, scaledWidth, scaledHeight);

            //object move
            obstacle.x -= OBSTACLE_SPEED;

            //if hit by object
            if (checkCollision(rabbit, obstacle)) {
                endGame();
                return;
            }
        }
    }
    

    function checkCollision(rabbit, obstacle) {
        //pading so the hitbox is reasonable
        const padding = 20;
    
        //padding calcuations
        const rabbitRight = rabbit.x + rabbit.width - padding;
        const rabbitLeft = rabbit.x + padding;
        const rabbitBottom = rabbit.y + rabbit.height - padding;
        const rabbitTop = rabbit.y + padding;
    
        const obstacleRight = obstacle.x + obstacle.width - padding;
        const obstacleLeft = obstacle.x + padding;
        const obstacleBottom = obstacle.y + obstacle.height - padding;
        const obstacleTop = obstacle.y + padding;
    
        //if rabbit hits object
        if (rabbitRight > obstacleLeft && rabbitLeft < obstacleRight &&
            rabbitBottom > obstacleTop && rabbitTop < obstacleBottom) {
            return true;
        }
    
        return false;
    }


    






    //BACKGROUND







    // Background settings
    const backgroundImg = new Image();
    backgroundImg.src = "./img/background.png"; 
    let background_X = 0;
    let backgroundSpeed = speed;


    //background animation
    function drawBackground() {
        const scaledWidth = GAME_WIDTH * scaleRatio;
        const scaledHeight = GAME_HEIGHT * scaleRatio;

        context.drawImage(backgroundImg, background_X, 0, scaledWidth, scaledHeight);
        context.drawImage(backgroundImg, background_X + scaledWidth, 0, scaledWidth, scaledHeight);

        background_X -= backgroundSpeed * scaleRatio;
        if (background_X <= -scaledWidth) {
            background_X = 0;
        }
    }




    // keybinds
    function handleInput(event) {
        if ((event.code === "Space" || event.code === "ArrowUp") && rabbit.jumpAllowed) {
            rabbit.isJumping = true;
            rabbit.velocityY = -13;
            rabbit.jumpAllowed = false;
            currentAnimation = 'jump';
        } else if (event.code === "ArrowDown" && !rabbit.isJumping) {
            rabbit.isDucking = true;
            // Reduce the rabbit's height to half
            rabbit.height = RABBIT_HEIGHT / 2; 
            //crouch to on ground
            rabbit.y = RABBIT_START_Y + (RABBIT_HEIGHT - rabbit.height);
            currentAnimation = 'crouch';
        }
    }

    function handleInputRelease(event) {
        if (event.code === "ArrowDown" && rabbit.isDucking) {
            //stop ducking
            rabbit.isDucking = false;
            rabbit.height = RABBIT_HEIGHT;
            rabbit.y = RABBIT_START_Y;
            currentAnimation = 'walk';
        }
    }

    //event listener for keybinds
    document.addEventListener('keydown', handleInput);
    document.addEventListener('keyup', handleInputRelease);

 






    //START END RESTART







    //Gameover screen
    function endGame() {
        gameRunning = false;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'red';
        context.font = 'bold 50px Courier New';
        context.textAlign = 'center';
        context.textBaseline = 'middle'; // Set text baseline to middle
        context.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
        context.font = '25px Courier New';
        context.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 20);
        document.addEventListener('keydown', handleRestart);
    }


    //Restart function by enter
    function handleRestart(event) {
        if (event.code === 'Enter') {
            document.removeEventListener('keydown', handleRestart);
            restartGame();
        }
    }


    function restartGame() {
        gameRunning = true;

        //reset everything so no crashes
        rabbit.x = RABBIT_START_X;
        rabbit.y = RABBIT_START_Y;
        rabbit.velocityY = 0;
        rabbit.isJumping = false;
        rabbit.isDucking = false;
        rabbit.jumpAllowed = true;
        currentAnimation = 'walk';
        currentFrame = 0;
        obstacles = [];
        backgroundX = 0;

        //start game loop
        requestAnimationFrame(gameLoop);
    }






    //MAIN LOOP


   


    //Game loop
    function gameLoop(currentTime) {
        //check if game over
        if (!gameRunning) {
            return; 
        }
    
        const frameTime = currentTime - previousTime;
    
        if (frameTime > animationSpeed) {
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            drawBackground();
            drawRabbit();
            drawObstacles();
            handleRabbitJump();
    
            //frame per frame
            currentFrame = (currentFrame + 1) % animations[currentAnimation].length;
            previousTime = currentTime;
        }
    
        // Continue game loop
        requestAnimationFrame(gameLoop);
    }

    screen_settings();
    requestAnimationFrame(gameLoop);

    //event resize
    window.addEventListener('resize', screen_settings);
};
