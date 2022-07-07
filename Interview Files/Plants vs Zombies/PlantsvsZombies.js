const canvas = document.getElementById('canvas1');
const c = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 900;
const background = new Image();
background.src = 'Img/Background2.jpg';

// globalvariables
let gameOver = false;


const cellSize = 100;
const cellGap = 2;
let numberOfResourses = 1300;
let score = 0;
let frame = 0;
const frameInterval = 200;
const zombieFrame = 1024;
const zombie2Frame = 2048;

const Zombie1 = new Image();
Zombie1.src = 'Img/Zombies1.png';
let zombiex1 = 0;
let zombiey1 = 0;
const Zombie2 = new Image();
Zombie2.src = 'Img/Zombies2.png';
let zombiex2 = 0;
let zombiey2 = 0;
let enemiesInterval = 600;

const Tower = new Image();
Tower.src = 'Img/Tower.png';

let health = 100;

//Array variables
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPos = [];
const projectiles = [];
const resourses = [];

// mouse
const mouse = {
    x: 0,
    y: 0,
    width: 0.01,
    height: 0.01,
}
const canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})
canvas.addEventListener('mouseleave', function() {
    mouse.x = undefined;
    mouse.y = undefined;
})

// gameboard
const controlBar = {
    width: canvas.width,
    height: 50,
}
class Cell {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if(mouse.x && mouse.y && collision(this, mouse)) {
            c.strokeStyle = 'white';
            c.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid() {
    //Canvas width is 1200
    //Canvas height is 900
    for (let y = 100; y < canvas.height; y+= cellSize){
        for (let x = 0; x < canvas.width; x+= cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
// projectiles
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
    }
    update() {
        this.x += this.speed;
    }
    draw() {
        c.fillStyle = 'yellow';
        c.beginPath();
        c.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        c.fill();
    }
}
function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

// defenders
class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.health = health;
        this.maxHealth = this.health;
        this.interval = 0;
    }
    update() {
        if (this.shooting === true) {
            this.interval++;
            if (this.interval % 100 === 0) {
                projectiles.push(new Projectile(this.x + 80, this.y + 50));
            }
        }
    }
    draw() {
        // c.fillStyle = 'blue';
        // c.fillRect(this.x, this.y, this.width, this.height);
        c.drawImage(Tower, this.x, this.y, this.width, this.height)
        c.fillStyle = 'yellow';
        c.font = '40px Arial';
        c.fillText(Math.ceil(this.health), this.x + 10, this.y + 55);
    }
}
function handleDefenders() {
    for (let i = 0; i < defenders.length; i++){
        health += 0.0001;
        defenders[i].update();
        defenders[i].draw();
        if (enemyPos.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }

    }
}

document.addEventListener('click', function() {
    const gridPosX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPosY = mouse.y - (mouse.y % cellSize) + cellGap;
    if ( gridPosY < 100) return;
    const defenderCost = 100;
    for (let i = 0; i < defenders.length; i++){
        if (defenders[i].x === gridPosX && defenders[i].y === gridPosY) return;
    }
    if (numberOfResourses >= defenderCost) {
        defenders.push(new Defender(gridPosX, gridPosY));
        numberOfResourses -= defenderCost;
    }
})

//enemies
class Enemy1 {
    constructor(verticalPos) {
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        //different speed
        this.speed = Math.random() * 0.2 + 0.4;
        this.movemement = this.speed;
        //different health
        this.health = 100;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movemement;
            if (zombiex1 === 0 && zombiey1 === 0) {
                setTimeout(() => {
                    if (zombiex1 !== zombieFrame && zombiey1 !== zombieFrame) {
                        zombiex1 += zombieFrame;
                    }
                }, frameInterval);
                setTimeout(() => {
                    if (zombiex1 === zombieFrame && zombiey1 !== zombieFrame) {
                        zombiex1 -= zombieFrame;
                        zombiey1 += zombieFrame;
                    }
                }, frameInterval * 2);
                setTimeout(() => {
                    if (zombiex1 !== zombieFrame && zombiey1 === zombieFrame) {
                        zombiex1 += zombieFrame;
                    }
                }, frameInterval * 3);
                setTimeout(() => {
                    if (zombiex1 === zombieFrame && zombiey1 === zombieFrame) {
                        zombiex1 = 0;
                        zombiey1 = 0;
                    }
                }, frameInterval * 4);
            }
        }
    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = 'white';
        c.font = '40px Arial';
        c.fillText(Math.floor(this.health), this.x + 10, this.y);
        c.drawImage(Zombie1, zombiex1, zombiey1, 1024, 1024, this.x, this.y, cellSize, cellSize);
    }
}
class Enemy2 {
    constructor(verticalPos) {
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.6;
        this.movemement = this.speed;
        this.health = 200;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movemement;
            setTimeout(() => {
                if (zombiex2 === 0) zombiex2 += zombie2Frame;
            }, frameInterval);
            setTimeout(() => {
                if (zombiex2 === zombie2Frame) zombiex2 += zombie2Frame;
            }, frameInterval * 2);
            setTimeout(() => {
                if (zombiex2 === zombie2Frame * 2) zombiex2 += zombie2Frame;
            }, frameInterval * 3);
            setTimeout(() => {
                if (zombiex2 >= (zombie2Frame * 3)) {
                    zombiex2 = 0;
                }
            }, frameInterval * 4);
    }
    // }
    draw() {
        // c.fillStyle = 'orange';
        // c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = 'white';
        c.font = '40px Arial';
        c.fillText(Math.floor(this.health), this.x + 10, this.y);
        c.drawImage(Zombie2, zombiex2, zombiey2, 2048, 2048, this.x, this.y, cellSize, cellSize);

    }
}
class Enemy3 {
    constructor(verticalPos) {
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.8;
        this.movemement = this.speed;
        this.health = 300;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movemement;
    }
    draw() {
        c.fillStyle = 'yellow';
        c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = 'black';
        c.font = '40px Arial';
        c.fillText(Math.floor(this.health), this.x + 10, this.y + 55);
    }
}
class Enemy4 {
    constructor(verticalPos) {
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 1.0;
        this.movemement = this.speed;
        this.health = 440;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movemement;
    }
    draw() {
        c.fillStyle = '#21c70f';
        c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = 'black';
        c.font = '40px Arial';
        c.fillText(Math.floor(this.health), this.x + 10, this.y + 55);
    }
}
class Enemy5 {
    constructor(verticalPos) {
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.4 + 1.8;
        this.movemement = this.speed;
        this.health = 600;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movemement;
    }
    draw() {
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = 'black';
        c.font = '40px Arial';
        c.fillText(Math.floor(this.health), this.x + 10, this.y + 55);
    }
}
function handleEnemies(enemy) {
        for (let i = 0; i < enemies.length; i++){
            enemies[i].update();
            enemies[i].draw();
            if (enemies[i].x <= 0) gameOver = true;
            if (enemies[i] && enemies[i].health <= 0) {
                let gainedResourses = enemies[i].maxHealth/10;
                numberOfResourses += gainedResourses;
                const findEnemyPos = enemyPos.indexOf(enemies[i].y);
                enemyPos.splice(findEnemyPos, 1);
                enemies.splice(i, 1);
                i--;
                score += gainedResourses;
            }
        }
        if (frame % enemiesInterval === 0) {
            let verticalPos = ((Math.floor(Math.random() * (canvas.height/100 - 1)) + 1) * cellSize) + cellGap;
            enemies.push(new enemy(verticalPos));
            enemyPos.push(verticalPos);
            if (enemiesInterval >= 150) {
                enemiesInterval-= 5;
            }
        }
        for (let i = 0; i < defenders.length; i++){
            for (let j = 0; j < enemies.length; j++){
                if (defenders[i] && collision(defenders[i], enemies[j])) {
                    enemies[j].movemement = 0;
                    defenders[i].health -= 0.2;
                }
                if (defenders[i] && defenders[i].health <= 0) {
                    defenders.splice(i, 1);
                    i--;
                    enemies[j].movemement = enemies[j].speed;
                }
            }
        }
}


function energyadd() {
let myResource = new Resourse();

    // if (!document.getElementById('energy')) {
        const energy = document.createElement("div");
        energy.classList.add('energy');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        const span4 = document.createElement('span');
        energy.appendChild(span1);
        energy.appendChild(span2);
        energy.appendChild(span3);
        energy.appendChild(span4);
    for (let i = 0; i < resourses.length; i++) {
        energy.setAttribute('id', 'energy' + resourses[i].x + '_' + resourses[i].y);
        energy.style.marginTop = ((resourses[i].y) + ((window.innerHeight - canvas.height) / 2)) + 'px';
        energy.style.marginLeft = ((resourses[i].x) + ((window.innerWidth - canvas.width) / 2)) + 'px';
        energy.style.position = 'absolute';
    }
        document.body.appendChild(energy);

    // }
}

// resourses
const amounts = [20, 30, 40, 50];
class Resourse {
    constructor() {
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.x = Math.random() * (canvas.width - (cellSize/2));
        this.y = Math.random() * (canvas.height - this.height);
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    }
    draw() {
        // energyadd(this.x, this.y, this.width, this.height);
        // c.fillRect(this.x, this.y, this.width, this.height);
        // c.fillStyle = 'yellow';
        // c.font = '40px Arial';
        // c.fillText(this.amount, this.x, this.y + 40)
        // console.log('x is ' + this.x, 'y is ' + this.y);
    }
}
let resourseInt = Math.floor(Math.random() * 100000 + 200);
let energyCounter = 1;

function handleResourses() {
    if (resourseInt <= 0) {
        resourses.push(new Resourse);
        resourseInt = Math.floor(Math.random() * 100000 + 200);
        energyadd();
    } else {
        resourseInt -= 200;
    }
    for (let i = 0; i < resourses.length; i++) {
        resourses[i].draw();
        if (resourses[i] && mouse.x && mouse.y && collision(mouse, resourses[i])) {
            let ORBS = document.getElementsByClassName('energy');
            for (let j = 0; j < ORBS.length; j++){
                if (ORBS[j].style.marginLeft === ((resourses[i].x) + ((window.innerWidth - canvas.width) / 2)) + 'px') {
                    ORBS[j].remove();
                }
            }
            numberOfResourses += resourses[i].amount;
            resourses.splice(i, 1);
            i--;
        }
    }
}




// class Enemy {
//     constructor(verticalPos, width, height) {
//         this.x = canvas.width;
//         this.y = verticalPos;
//         this.width = width;
//         this.height = height;
//         this.speed = Math.random() * 0.2 + 0.4;
//         this.movemement = this.speed;
//         this.health = 100;
//         this.maxHealth = this.health;

//     }
//     update() {
//         this.x -= this.movemement;
//             if (zombiex1 === 0 && zombiey1 === 0) {
//                 setTimeout(() => {
//                     if (zombiex1 !== zombieFrame && zombiey1 !== zombieFrame) {
//                         zombiex1 += zombieFrame;
//                     }
//                 }, frameInterval);
//                 setTimeout(() => {
//                     if (zombiex1 === zombieFrame && zombiey1 !== zombieFrame) {
//                         zombiex1 -= zombieFrame;
//                         zombiey1 += zombieFrame;
//                     }
//                 }, frameInterval * 2);
//                 setTimeout(() => {
//                     if (zombiex1 !== zombieFrame && zombiey1 === zombieFrame) {
//                         zombiex1 += zombieFrame;
//                     }
//                 }, frameInterval * 3);
//                 setTimeout(() => {
//                     if (zombiex1 === zombieFrame && zombiey1 === zombieFrame) {
//                         zombiex1 = 0;
//                         zombiey1 = 0;
//                     }
//                 }, frameInterval * 4);
//             }
//         }
//     draw() {
//         // c.fillStyle = 'red';
//         // c.fillRect(this.x, this.y, this.width, this.height);
//         c.fillStyle = 'white';
//         c.font = '40px Arial';
//         c.fillText(Math.floor(this.health), this.x + 10, this.y);
//         c.drawImage(Zombie1, zombiex1, zombiey1, this.width, this.height, this.x, this.y, cellSize, cellSize);
//     }
// }













// utilities


function handleGameStatus() {
    c.fillStyle = 'red';
    c.font = '40px Arial';
    c.fillText('Score: ' + score, 900, 40);
    c.fillText('Resourses: ' + numberOfResourses, 10, 40);
    if (gameOver) {
        c.fillStyle = 'black';
        c.font = '100px Arial';
        c.fillText('GAME OVER', canvas.width/4 - 50, canvas.height/2);
    }
}

function animate() {
    const FirstEnemy = Enemy1;
    const SecondEnemy = Enemy2;
    const ThirdEnemy = Enemy3;
    const FourthEnemy = Enemy4;
    const FifthEnemy = Enemy5;
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'black';
    c.drawImage(background, 0, 0, canvas.width, canvas.height + 100);
    c.fillRect(0, 0, controlBar.width, controlBar.height);
    handleGameGrid();
    handleDefenders();
    if (frame < 25000) {
        handleEnemies(FirstEnemy);
        enemiesInterval = 600;
    }
    if (frame > 10000) {
        handleEnemies(SecondEnemy);
        enemiesInterval = 700;
    }
    if (frame > 20000) {
        handleEnemies(ThirdEnemy);
        enemiesInterval = 800;
    }
    if (frame > 30000) {
        handleEnemies(FourthEnemy);
        enemiesInterval = 900;
    }
    if (frame > 40000) {
        handleEnemies(FifthEnemy);
        enemiesInterval = 900;
    }
    handleProjectiles();

    
    if (!gameOver) requestAnimationFrame(animate);
    handleResourses();
    frame++;
    handleGameStatus();
}
animate();
function collision(first, second) {
    if (!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true
    }
}

// window.addEventListener('resize', function() {
//     canvasPosition = canvas.getBoundingClientRect();
// })