let rightPosition = 0;
let imgBlockPositon = 0;
let direction = "right";
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;
let hit = false;
let jump = false;
let fall = false;
let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
let f1WallArray = [
  [-10, -1],
  [14, 32],
  [41, 54],
  [64, 75],
  [92, 105],
  [119, 129],
];
let f2WallArray = [[54, 63]];
let isWallRight = false;
let isWallLeft = false;
let maxLives = 6;
let lives = 6;
let heartsArray = [];
let isRightSide = false;
let isLeftSide = false;
let wasHeroHit = false;
let heroStep = 3;

let hero = document.querySelector(".hero");
let heroBlock = document.querySelector(".hero_block");
heroBlock.style.bottom = "62px";
let canvas = document.querySelector(".canvas");
let fsBtn = document.querySelector(".FullScrin");
let jumpBlock = document.querySelector(".jump_block");
let hitBlock = document.querySelector(".hit_block");
let info = document.querySelector(".info");
let bgCanvas = document.querySelector(".bg");
let finalTimerTxt = document.querySelector(".final-timer-text");
let restart = document.querySelector(".restart");

let heroX = Math.round(
  (Number.parseInt(window.getComputedStyle(heroBlock).left) + 32) / 32
);
let heroY = Math.round(
  Number.parseInt(window.getComputedStyle(heroBlock).bottom) / 32
);

hero.onclick = (event) => {
  event.preventDefault();
};
fsBtn.onclick = () => {
  if (document.fullscreen) {
    fsBtn.src = "./img/fullscreen.png";
    document.exitFullscreen();
  } else {
    fsBtn.src = "./img/cancel.png";
    canvas.requestFullscreen();
  }
};
restart.onclick = () => {
  window.document.location.reload();
};

jumpBlock.onclick = () => {
  rightPosition = 0;
  jump = true;
};
hitBlock.onclick = () => {
  rightPosition = 0;
  hit = true;
};

const moveWorldLeft = () => {
  objectsArray.map((elem, index) => {
    elem.style.left = Number.parseInt(elem.style.left) - 32 + "px";
  });
  tileArray.map((elem) => {
    elem[0] = elem[0] - 1;
  });
  enemiesArray.map((elem) => elem.moveLeft());
  f1WallArray.map((el) => {
    el[0] -= 1;
    el[1] -= 1;
  });
  f2WallArray.map((el) => {
    el[0] -= 1;
    el[1] -= 1;
  });
};
const moveWorldRight = () => {
  objectsArray.map((elem, index) => {
    elem.style.left = Number.parseInt(elem.style.left) + 32 + "px";
  });
  tileArray.map((elem) => {
    elem[0] = elem[0] + 1;
  });
  enemiesArray.map((elem) => elem.moveRight());
  f1WallArray.map((el) => {
    el[0] += 1;
    el[1] += 1;
  });
  f2WallArray.map((el) => {
    el[0] += 1;
    el[1] += 1;
  });
};

const checkTail = () => {
  updateHeroPosition();
  let isFalling = true;
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i][0] === heroX && tileArray[i][1] + 1 === heroY) {
      isFalling = false;
    }
  }
  if (isFalling) {
    // info.textContent = info.textContent + ", falling";
    fall = true;
  } else {
    // info.textContent = info.textContent + ",not falling";
    fall = false;
  }
};
const fallHandler = () => {
  hero.style.top = `-195px`;
  heroBlock.style.bottom = `${Number.parseInt(heroBlock.style.bottom) - 32}px`;
  checkTail();
};
const updateHeroPosition = () => {
  heroX = Math.floor(
    (Number.parseInt(window.getComputedStyle(heroBlock).left) + 22) / 32
  );
  heroY = Math.round(
    Number.parseInt(window.getComputedStyle(heroBlock).bottom) / 32
  );
  // info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
};
const checkRightWallColl = () => {
  isWallRight = false;
  isWallLeft = false;
  if (heroY === 1) {
    f1WallArray.map((el) => {
      if (heroX === el[0] - 2) {
        isWallRight = true;
      }
    });
  } else if (heroY === 5) {
    f2WallArray.map((el) => {
      if (heroX === el[0] - 2) {
        isWallRight = true;
      }
    });
  }
};
const checkLeftWallColl = () => {
  isWallRight = false;
  isWallLeft = false;
  if (heroY === 1) {
    f1WallArray.map((el) => {
      if (heroX === el[1]) {
        isWallLeft = true;
      }
    });
  } else if (heroY === 5) {
    f2WallArray.map((el) => {
      if (heroX === el[1]) {
        isWallLeft = true;
      }
    });
  }
};
const rightHandler = () => {
  if (!fall) {
    if (!isRightSide && !isWallRight) {
      hero.style.transform = "scale(1,1)";
      rightPosition = rightPosition + 1;
      imgBlockPositon = imgBlockPositon + 1;
      if (rightPosition > 7) {
        rightPosition = 0;
      }
      hero.style.left = `-${rightPosition * 61.4}px`;
      hero.style.top = `-130.5px`;
      heroBlock.style.left = `${imgBlockPositon * heroStep}px`;

      checkTail();
      wasHeroHit = false;
      moveWorldLeft();
      checkRightWallColl();
    }
  } else {
    fallHandler();
  }
};
const leftHandler = () => {
  if (!fall) {
    if (!isLeftSide && !isWallLeft) {
      hero.style.transform = "scale(-1,1)";

      rightPosition = rightPosition + 1;
      imgBlockPositon = imgBlockPositon - 1;
      if (rightPosition > 5) {
        rightPosition = 0;
      }
      hero.style.left = `${-800 + rightPosition * 61.4}px`;
      hero.style.top = `-130.5px`;
      heroBlock.style.left = `${imgBlockPositon * heroStep}px`;

      checkTail();
      wasHeroHit = false;
      moveWorldRight();
      checkLeftWallColl();
    }
  } else {
    fallHandler();
  }
};
const standHandler = () => {
  switch (direction) {
    case "right": {
      hero.style.transform = "scale(1,1)";
      hero.style.left = `-${rightPosition * 61.4}px`;
      if (rightPosition > 6) {
        rightPosition = 0;
      }

      break;
    }
    case "left": {
      hero.style.transform = "scale(-1,1)";
      hero.style.left = `${-800 + rightPosition * 61.4}px`;
      if (rightPosition > 6) {
        rightPosition = 0;
      }
      // clearInterval(timer);
      break;
    }
  }

  rightPosition = rightPosition + 1;
  hero.style.top = `0px`;
  checkTail();
};
const hitHandler = () => {
  switch (direction) {
    case "right": {
      hero.style.transform = "scale(1,1)";

      hero.style.left = `${0 - rightPosition * 61.4}px`;
      if (rightPosition > 4) {
        rightPosition = 0;
        hit = false;
        wasHeroHit = true;
      }

      break;
    }
    case "left": {
      hero.style.transform = "scale(-1,1)";
      hero.style.left = `${-800 + rightPosition * 61.4}px`;
      if (rightPosition > 4) {
        rightPosition = 0;
        hit = false;
        wasHeroHit = true;
      }

      break;
    }
  }
  rightPosition = rightPosition + 1;

  hero.style.top = `-256px`;
};
const jumpHandler = () => {
  isWallLeft = false;
  isWallRight = false;
  switch (direction) {
    case "right": {
      hero.style.transform = "scale(1,1)";
      hero.style.left = `-${rightPosition * 61.4}px`;
      if (rightPosition > 6) {
        rightPosition = 0;
        jump = false;
        heroBlock.style.bottom = `${
          Number.parseInt(heroBlock.style.bottom) + 160
        }px`;
        imgBlockPositon = imgBlockPositon + 20;
        heroBlock.style.left = `${imgBlockPositon * heroStep}px`;
      }

      break;
    }
    case "left": {
      hero.style.transform = "scale(-1,1)";
      hero.style.left = `${-800 + rightPosition * 61.4}px`;
      if (rightPosition > 6) {
        rightPosition = 0;
        jump = false;
        heroBlock.style.bottom = `${
          Number.parseInt(heroBlock.style.bottom) + 160
        }px`;
        imgBlockPositon = imgBlockPositon - 20;
        heroBlock.style.left = `${imgBlockPositon * heroStep}px`;
      }

      break;
    }
  }

  rightPosition = rightPosition + 1;
  hero.style.top = `-195px`;
};
let onTouchStart = (event) => {
  const isButtonJump = event.target.closest(".jump_block");
  const isButtonHit = event.target.closest(".hit_block");
  if (isButtonJump || isButtonHit) {
    return;
  }
  clearInterval(timer);
  x = event.type === "mousedown" ? event.screenX : event.touches[0].clientX;
  timer = setInterval(() => {
    if (x > halfWidth) {
      direction = "right";
      rightHandler();
    } else {
      direction = "left";
      leftHandler();
    }
  }, 80);
};
let onTouchEnd = (event) => {
  clearInterval(timer);
  lifeCycle();
};
function handleKeyDown(event) {
  if (!event.repeat) {
    clearInterval(timer);
    timer = setInterval(() => {
      if (event.code === "KeyA") {
        direction = "left";
        isWKeyPressed = true;
        requestAnimationFrame(() => leftHandler());
      } else if (event.code === "KeyD") {
        direction = "right";
        isWKeyPressed = true;
        requestAnimationFrame(() => rightHandler());
      } else if (event.code === "Space") {
        rightPosition = 0;
        isWKeyPressed = true;
        lifeCycle();

        jump = true;
      } else if (event.code === "KeyJ") {
        rightPosition = 0;
        isWKeyPressed = true;
        lifeCycle();

        hit = true;
      }
    }, 80);
  }
}
function handleKeyUp(event) {
  if (event.code === "KeyA" || event.code === "KeyD") {
    isWKeyPressed = false;
    lifeCycle();
  }
}

document.addEventListener("mousedown", onTouchStart);
document.addEventListener("touchstart", onTouchStart);
document.addEventListener("mouseup", onTouchEnd);
document.addEventListener("touchend", onTouchEnd);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

const lifeCycle = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    if (hit) {
      hitHandler();
    } else if (jump) {
      jumpHandler();
    } else if (fall) {
      fallHandler();
    } else {
      standHandler();
    }
  }, 100);
};
const createTile = (x, y = 1) => {
  let tile = document.createElement("img");
  tile.src = "assets/1 Tiles/Tile_02.png";

  tile.className = "tile";
  tile.style.left = x * 32 + "px";
  tile.style.bottom = y * 32 + "px";
  canvas.appendChild(tile);
  objectsArray.push(tile);
  tileArray.push([x, y]);
};
const createTileGrow = (x, y = 0) => {
  let tileGrow = document.createElement("img");
  tileGrow.src = "assets/1 Tiles/Tile_12.png";
  tileGrow.className = "tile_grow";
  tileGrow.style.left = x * 32 + "px";
  tileGrow.style.bottom = y * 32 + "px";
  canvas.appendChild(tileGrow);
  objectsArray.push(tileGrow);
};
const createTilePlatform = (startX, endX, floor) => {
  for (let xPos = startX - 1; xPos < endX; xPos++) {
    createTile(xPos, floor);
  }
};
const createTilesGrowBlock = (startX, endX, floor) => {
  for (let yPos = 0; yPos < floor; yPos++) {
    for (let xPos = startX - 1; xPos < endX; xPos++) {
      createTileGrow(xPos, yPos);
    }
  }
};
const addTiles = (i) => {
  createTile(i);
  createTileGrow(i);
};
class Lever {
  leverImg;
  x;
  y;
  updateTimer;
  finalTimer;
  time;
  dir;
  finalImg;
  opacity;

  constructor() {
    this.x = heroX - 20;
    this.y = heroY;
    this.finalImg = null;
    this.finalImg = objectsArray.filter((elem) => {
      return elem.outerHTML.split('"')[1] === "assets/3 Objects/Stones/1.png";
    })[0];
    console.log(this.finalImg);

    this.leverImg = document.createElement("img");
    this.leverImg.src = "assets/lever.png";
    this.leverImg.style.position = "absolute";
    this.leverImg.style.left = this.x * 32 + "px";
    this.leverImg.style.bottom = this.y * 32 + "px";
    this.leverImg.style.width = 46 + "px";
    this.leverImg.style.height = 46 + "px";
    canvas.appendChild(this.leverImg);
    enemiesArray.push(this);

    this.time = 25;
    this.dir = true;
    this.opacity = 1;
    this.updateTimer = setInterval(() => {
      if (heroX === this.x + 1 && heroY === this.y) {
        this.leverImg.style.display = "none";
        clearInterval(this.updateTimer);
        new Cutscene(["Скорее к финишу"]);
      }
      this.animate();
    }, 100);

    this.finalTimer = setInterval(() => {
      if (this.time <= 0) {
        finalTimerTxt.textContent = "Game Over";
        clearInterval(this.finalTimer);
      } else {
        finalTimerTxt.textContent = `${this.time}`;
        this.time--;
        if (heroX === Number.parseInt(this.finalImg.style.left) / 32) {
          new Terminal();
          clearInterval(this.finalTimer);
        }
      }
    }, 1000);
  }
  animate() {
    this.dir ? (this.opacity += 0.5) : (this.opacity -= 0.5);
    this.leverImg.style.opacity = 1 / this.opacity;
    if (this.opacity <= 1 || this.opacity >= 5) this.dir = !this.dir;
  }
  moveLeft() {
    this.leverImg.style.left =
      Number.parseInt(this.leverImg.style.left) - 32 + "px";
    this.x -= 1;
  }
  moveRight() {
    this.leverImg.style.left =
      Number.parseInt(this.leverImg.style.left) + 32 + "px";
    this.x += 1;
  }
}

class Cutscene {
  text;
  block;
  p;
  nextBtn;
  skipBtn;
  page;
  constructor(text) {
    this.text = text;
    this.page = 0;
    this.block = document.createElement("div");
    this.block.className = "cutscene";
    this.block.style.position = "absolute";
    this.block.style.left = "10%";
    this.block.style.zIndex = 1000;
    this.block.style.bottom = "10vh";
    this.block.style.width = "80%";
    this.block.style.height = "80vh";
    this.block.style.backgroundColor = "#38002c";
    this.block.style.border = "5px solid #8babbf";

    this.appendP();
    this.appendNext();
    this.appendSkip();
    this.setText(this.text[this.page]);
    canvas.appendChild(this.block);
  }

  appendP() {
    this.p = document.createElement("p");
    this.p.style.position = "absolute";
    this.p.style.left = "10%";
    this.p.style.top = "4vh";
    this.p.style.width = "80%";
    this.p.style.color = "#8babbf";
    this.p.style.fontSize = "8pt";
    this.p.style.lineHeight = "1.5";
    this.block.appendChild(this.p);
    this.p.onclick = () => {
      this.nextBtn.style.display = "block";
      clearInterval(this.timer);
      this.p.textContent = this.text[this.page];
    };
  }
  appendNext() {
    this.nextBtn = document.createElement("button");
    this.setButtonStyle(this.nextBtn, "Next");
    this.nextBtn.style.display = "none";
    this.nextBtn.style.right = 0;
    this.nextBtn.onclick = () => {
      if (this.page < this.text.length - 1) {
        this.page++;
        this.setText(this.text[this.page]);
        this.nextBtn.style.display = "none";
      } else {
        this.block.style.display = "none";
      }
    };
    this.block.appendChild(this.nextBtn);
  }
  appendSkip() {
    this.skipBtn = document.createElement("button");
    this.setButtonStyle(this.skipBtn, "Skip");
    this.skipBtn.style.left = 0;
    this.skipBtn.onclick = () => {
      this.block.style.display = "none";
      console.log("sdf");
    };
    this.block.appendChild(this.skipBtn);
  }
  setButtonStyle(button, tile) {
    button.style.position = "absolute";
    button.style.bottom = 0;
    button.style.backgroundColor = "#8babbf";
    button.style.color = "#38002c";
    button.textContent = tile;
    button.style.fontSize = "15pt";
    button.style.margin = "10pt";
    button.style.padding = "10pt";
  }
  setText(text) {
    if (this.page === this.text.length - 1) this.nextBtn.textContent = "Go";
    let txt = "";
    let targetTxt = text;
    let pos = 0;
    this.timer = setInterval(() => {
      if (pos <= targetTxt.length - 1) {
        txt += targetTxt[pos];
        this.p.textContent = txt;
        pos++;
      } else {
        clearInterval(this.timer);
        this.nextBtn.style.display = "block";
      }
    }, 20);
    this.p.textContent = text;
  }
}
class Terminal extends Cutscene {
  btnBlock;
  mainStrLength;
  password;
  constructor() {
    let text = "Вводи пароль :";
    super([text]);
    this.password = "1123";
    this.mainStrLength = text.length;
    this.btnBlock = document.createElement("div");
    this.btnBlock.style.position = "absolute";
    this.btnBlock.style.left = "33%";
    this.btnBlock.style.bottom = "10vh";
    this.btnBlock.style.width = "33%";
    this.block.appendChild(this.btnBlock);
    this.skipBtn.textContent = "Clear";
    this.nextBtn.textContent = "Enter";
    this.createNumButton();
    this.skipBtn.onclick = () => {
      if (this.p.textContent.length > this.mainStrLength) {
        let str = "";
        for (let i = 0; i < this.p.textContent.length - 1; i++) {
          str += this.p.textContent[i];
        }
        this.p.textContent = str;
      }
    };
    this.nextBtn.onclick = () => {
      if (this.p.textContent.length === this.mainStrLength + 4) {
        let str = "";
        for (
          let i = this.p.innerText.length - 4;
          i < this.p.textContent.length;
          i++
        ) {
          str += this.p.textContent[i];
        }
        if (str === this.password) {
          this.block.style.display = "none";
          finalTimerTxt.textContent = "You win !";
          heroBlock.style.display = "none";
        } else {
          this.p.innerText = "пароль не верный, пробуй ещё : ";
          this.mainStrLength = this.p.innerText.length + 1;
        }
      }
    };
  }
  createNumButton() {
    for (let i = 1; i <= 9; i++) {
      let btn = document.createElement("button");
      this.setButtonStyle(btn, `${i}`);

      btn.style.left =
        i <= 3
          ? `${(i - 1) * 33}%`
          : i <= 6
          ? `${(i - 4) * 33}%`
          : `${(i - 7) * 33}%`;
      btn.style.bottom = i <= 3 ? "36vh" : i <= 6 ? "18vh" : 0;
      btn.onclick = (even) => {
        if (this.p.textContent.length < this.mainStrLength + 4) {
          this.p.textContent += even.target.textContent;
        }
      };
      this.btnBlock.appendChild(btn);
    }
  }
}
class Enemy {
  ATTACK = "attack";
  DEATH = "death";
  HURT = "hurt";
  IDLE = "idle";
  WALK = "walk";

  startX;
  state;
  animateChang;
  lives;
  posX;
  posY;
  img;
  block;
  blockSize;
  spritePos;
  spriteMaxPos;
  timer;
  sourcePath;
  dir;
  stop;
  massege;
  constructor(x, y, src, massege = "", isLast = false) {
    this.isLast = isLast;
    this.massege = massege;
    this.posX = x + this.getStartPos(6);
    this.startX = x;
    this.posY = y;
    this.blockSize = 48;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.sourcePath = src;
    this.state = this.IDLE;
    this.animateChang = false;
    this.dir = 1;
    this.stop = false;
    this.lives = 30;
    this.createImg();
    this.changeAnimated(this.WALK);
    enemiesArray.push(this);
    this.lifeCycle();
  }
  createImg() {
    this.block = document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.overflow = "hidden";
    this.block.style.left = this.posX * 32 + "px";
    this.block.style.bottom = this.posY * 32 + "px";
    this.block.style.width = this.blockSize + "px";
    this.block.style.height = this.blockSize + "px";

    this.img = document.createElement("img");
    this.img.src = this.sourcePath + "Idle.png";
    this.img.style.position = "absolute";
    this.img.style.left = 0;
    this.img.style.bottom = 0;
    this.img.style.width = this.blockSize * 4;
    this.img.style.height = this.blockSize;
    this.block.appendChild(this.img);
    canvas.appendChild(this.block);
  }
  lifeCycle() {
    this.timer = setInterval(() => {
      if (this.animateChang) {
        this.animateChang = false;
        switch (this.state) {
          case this.ATTACK: {
            this.setAttack();
            break;
          }
          case this.DEATH: {
            this.setDeath();
            break;
          }
          case this.HURT: {
            this.setHurt();
            break;
          }
          case this.IDLE: {
            this.setIdle();
            break;
          }
          case this.WALK: {
            this.setWalk();
            break;
          }
        }
      }

      this.spritePos++;
      this.checkCollide();
      if (!this.stop) {
        this.move();
      } else {
        if (this.state != this.DEATH) {
          if (this.state != this.HURT) {
            this.changeAnimated(this.ATTACK);
          }
        }
      }

      this.animate();
    }, 120);
  }
  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        lives--;
        updateHearts();
      }
      if (this.state === this.HURT) {
        this.changeAnimated(this.ATTACK);
        if (this.dir > 0) {
          this.spritePos = 1;
        }
      }
      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSide = false;
        isLeftSide = false;
        if (this.dir > 0) {
          this.spritePos = 5;
        }
        if (this.massege) {
          new Cutscene([this.massege]);
          if (this.isLast) new Lever();
        }
      }
    }
    this.img.style.left = -(this.spritePos * this.blockSize) + "px";
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.spriteMaxPos = 5;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.spriteMaxPos = 5;
  }
  setHurt() {
    this.img.src = this.sourcePath + "Hurt.png";
    this.spriteMaxPos = 1;
  }
  setIdle() {
    this.img.src = this.sourcePath + "Idle.png";
    this.spriteMaxPos = 3;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.spriteMaxPos = 5;
  }
  changeAnimated(StateStr) {
    this.state = StateStr;
    this.animateChang = true;
  }
  move() {
    if (this.posX > this.startX + 5) {
      this.dir *= -1;
      this.img.style.transform = "scale(-1,1)";
    } else if (this.posX <= this.startX) {
      this.dir = Math.abs(this.dir);
      this.img.style.transform = "scale(1,1)";
    }
    this.posX += this.dir;
    this.block.style.left = this.posX * 32 + "px";
  }
  checkHurt() {
    if (wasHeroHit) {
      if (this.lives <= 10) {
        wasHeroHit = false;
        this.changeAnimated(this.DEATH);
      } else {
        wasHeroHit = false;
        this.changeAnimated(this.HURT);
        this.showHurt();
        this.lives -= 10;
      }
    }
  }
  checkCollide() {
    if (heroY == this.posY) {
      if (heroX == this.posX) {
        this.checkHurt();
        isRightSide = true;
        this.stop = true;
      } else if (heroX == this.posX + 1) {
        this.checkHurt();
        isLeftSide = true;
        this.stop = true;
      } else {
        isRightSide = false;
        isLeftSide = false;
        this.stop = false;
        this.changeAnimated(this.WALK);
      }
    } else {
      isRightSide = false;
      isLeftSide = false;
      this.stop = false;
      this.changeAnimated(this.WALK);
    }
  }
  showHurt() {
    let pos = 0;
    let text = document.createElement("p");
    text.textContent = "-10";
    text.style.position = "absolute";
    text.style.left =
      this.dir < 0
        ? Number.parseInt(this.block.style.left) + 20 + "px"
        : Number.parseInt(this.block.style.left) + 5 + "px";
    text.style.bottom = Number.parseInt(this.block.style.bottom) + 32 + "px";
    let hurtTimer = setInterval(() => {
      text.style.bottom = Number.parseInt(text.style.bottom) + 16 + "px";
      pos++;
      if (pos > 3) {
        clearInterval(hurtTimer);
        text.style.display = "none";
      }
    }, 100);
    canvas.appendChild(text);
  }
  moveRight() {
    this.startX += 1;
    this.posX += 1;
    if (this.stop || this.state === this.DEATH) {
      this.block.style.left =
        Number.parseInt(this.block.style.left) + 32 + "px";
    }
    console.log();
  }
  moveLeft() {
    this.startX -= 1;
    this.posX -= 1;
    if (this.stop || this.state === this.DEATH) {
      this.block.style.left =
        Number.parseInt(this.block.style.left) - 32 + "px";
    }
  }
  getStartPos(max) {
    let rand = Math.floor(Math.random() * max);
    return rand;
  }
}
class Enemy1 extends Enemy {
  constructor(x, y, massege, isLast) {
    super(x, y, "assets/Enemies/1/", massege, isLast);
  }
}
class Enemy2 extends Enemy {
  constructor(x, y, massege) {
    super(x, y, "assets/Enemies/2/", massege);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.spriteMaxPos = 5;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.spriteMaxPos = 5;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.spriteMaxPos = 3;
  }
}
class Enemy5 extends Enemy {
  constructor(x, y, massege) {
    super(x, y, "assets/Enemies/5/", massege);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.spriteMaxPos = 3;
  }
}
class Enemy6 extends Enemy {
  isShoot;
  bullet;
  bulletX;
  constructor(x, y, massege) {
    super(x, y, "assets/Enemies/6/", massege);
    this.bullet = document.createElement("img");
    this.bullet.src = this.sourcePath + "Ball1.png";
    this.bullet.style.position = "absolute";
    this.bullet.style.left = this.block.style.left;
    this.bullet.style.transform = "scale(1.5)";
    this.bullet.style.bottom =
      Number.parseInt(this.block.style.bottom) + 13 + "px";
    this.bullet.style.display = "none";
    canvas.appendChild(this.bullet);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.spriteMaxPos = 3;
  }
  checkCollide() {
    if (heroY == this.posY) {
      this.stop = true;
      if (heroX > this.posX) {
        this.dir = 1;
        this.img.style.transform = "scale(1,1)";
      } else {
        this.dir = -1;
        this.img.style.transform = "scale(-1,1)";
      }
      if (heroX == this.posX) {
        this.checkHurt();
        isRightSide = true;
        // this.stop = true;
      } else if (heroX == this.posX + 1) {
        this.checkHurt();
        isLeftSide = true;
        // this.stop = true;
      } else {
        isRightSide = false;
        isLeftSide = false;
        // this.stop = false;
        this.changeAnimated(this.WALK);
      }
    } else {
      isRightSide = false;
      isLeftSide = false;
      this.stop = false;
      this.changeAnimated(this.WALK);
    }
  }
  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        if (!this.isShoot) this.shoot();
      }
      if (this.state === this.HURT) {
        this.changeAnimated(this.ATTACK);
        if (this.dir > 0) {
          this.spritePos = 1;
        }
      }
      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSide = false;
        isLeftSide = false;
        if (this.dir > 0) {
          this.spritePos = 5;
        }
        if (this.massege) new Cutscene([this.massege]);
      }
    }
    if (this.isShoot && this.state == this.ATTACK) {
      this.bulletFunc();
    } else {
      this.bullet.style.display = "none";
    }
    this.img.style.left = -(this.spritePos * this.blockSize) + "px";
  }
  shoot() {
    this.isShoot = true;
    this.bullet.style.display = "block";
    if (this.dir > 0) {
      this.bulletX = this.posX + 2;
    } else {
      this.bulletX = this.posX + 1;
    }
  }
  bulletFunc() {
    this.dir > 0 ? (this.bulletX += 1) : (this.bulletX -= 1);
    this.bullet.style.left = this.bulletX * 32 + "px";
    if (this.bulletX === heroX && this.posY === heroY) {
      this.isShoot = false;
      this.bullet.style.display = "none";
      lives--;
      updateHearts();
    }
    if (this.dir > 0) {
      if (this.bulletX > this.posX + 6) {
        this.isShoot = false;
        this.bullet.style.display = "none";
      }
    } else {
      if (this.bulletX < this.posX - 5) {
        this.isShoot = false;
        this.bullet.style.display = "none";
      }
    }
  }
}
class Heart {
  img;
  x;
  constructor(x, src) {
    this.x = x + 1;
    this.img = document.createElement("img");
    this.img.src = src;
    this.img.style.position = "absolute";
    this.img.style.left = this.x * 32 + "px";
    this.img.style.bottom = (window.screen.height / 32 - 2) * 32;
    this.img.style.width = 32 + "px";
    this.img.style.height = 32 + "px";
    canvas.appendChild(this.img);
  }
}
class HeartEmpty extends Heart {
  constructor(x) {
    super(x, "img/heart.png");
  }
}
class HeartRed extends Heart {
  constructor(x) {
    super(x, "img/heartRed.png");
  }
}

const addHearts = () => {
  for (let i = 0; i < maxLives; i++) {
    let heartEmpty = new HeartEmpty(i);
    let heartRed = new HeartRed(i);
    heartsArray.push(heartRed);
  }
};
const updateHearts = () => {
  if (lives < 1) {
    lives = 1;
  }
  for (let i = 0; i < lives; i++) {
    heartsArray[i].img.style.display = "block";
  }
  for (let i = lives; i < maxLives; i++) {
    heartsArray[i].img.style.display = "none";
  }
};
const createBackImg = (i) => {
  let img = document.createElement("img");
  img.src = "assets/2Background/Background.png";
  img.style.position = "absolute";
  img.style.left = i * window.screen.width - 32 + "px";
  img.style.bottom = 32 + "px";
  img.style.width = window.screen.width + "px";
  bgCanvas.appendChild(img);
  objectsArray.push(img);
};
const addBackImg = () => {
  for (let i = 0; i < 5; i++) {
    createBackImg(i);
  }
};
const createImgEl = (src, x, y) => {
  let img = document.createElement("img");
  img.src = src;
  img.style.position = "absolute";
  img.style.left = x * 32 + "px";
  img.style.bottom = y * 32 + "px";
  img.style.transform = "scale(2,2) translate(-25%,-25%)";
  bgCanvas.appendChild(img);
  objectsArray.push(img);
};
function createGrassImages(basePath, level, ranges, callback) {
  for (let i = 0; i < 119; i++) {
    for (const range of ranges) {
      if (i >= range[0] && i <= range[1]) {
        createImgEl(`${basePath}Grass/1.png`, i, level);
        break;
      }
    }
  }
}

const addDecorEl = (f1, f2, f3) => {
  let basePath = "assets/3 Objects/";

  createImgEl(basePath + "Trees/3.png", 4, f1);
  createImgEl(basePath + "Willows/2.png", 35, f1);
  createImgEl(basePath + "Stones/4.png", 78, f1);
  createImgEl(basePath + "Willows/3.png", 116, f1);
  createImgEl(basePath + "Willows/3.png", 65, f2);

  createImgEl(basePath + "Stones/5.png", 16, f3);
  createImgEl(basePath + "Boxes/5.png", 38, f1);
  createImgEl(basePath + "Boxes/1.png", 80, f3);

  createImgEl(basePath + "Boxes/4.png", 43, f2);
  createImgEl(basePath + "Boxes/4.png", 89, f1);
  createImgEl(basePath + "Boxes/3.png", 82, f3);
  createImgEl(basePath + "Boxes/3.png", 78, f3);
  createImgEl(basePath + "Pointers/1.png", 102, f3);
  createImgEl(basePath + "Stones/1.png", 116, f1);

  createImgEl(basePath + "Boxes/4.png", 22, f2);
  createImgEl(basePath + "Ridges/5.png", 26, f2);
  createImgEl(basePath + "Ridges/1.png", 95, f2);
  createImgEl(basePath + "Ridges/3.png", 99, f2);
  createImgEl(basePath + "Pointers/1.png", 45, f2);
  createImgEl(basePath + "Ridges/1.png", 49, f2);

  // Grass lvl1
  createGrassImages(basePath, f1, [[0, 118]]);

  // Grass lvl2
  createGrassImages(basePath, f2, [
    [15, 31],
    [42, 54],
    [60, 74],
    [92, 104],
  ]);

  // Grass lvl3
  createGrassImages(basePath, f3, [
    [8, 19],
    [54, 62],
    [75, 86],
    [99, 110],
  ]);
};

const addEnemies = () => {
  let enemy1 = new Enemy1(9, 9);
  let enemy2 = new Enemy6(19, 5, "Первая цифра - 1");
  let enemy3 = new Enemy5(44, 5, "Вторая цифра - 1");
  let enemy4 = new Enemy2(79, 1, "Третья цифра - 2");
  let enemy5 = new Enemy1(
    79,
    9,
    "Последняя цифра - 3 . Пора искать рычаг и сваливать",
    true
  );
  let enemy6 = new Enemy6(93, 5);
  let enemy7 = new Enemy2(110, 1);
};

const buildLvl = () => {
  let floor1 = 0;
  let floor2 = 4;
  let floor3 = 8;

  addDecorEl(floor1 + 1, floor2 + 1, floor3 + 1);

  createTilePlatform(0, 14, floor1);
  createTilePlatform(33, 41, floor1);
  createTilePlatform(76, 91, floor1);
  createTilePlatform(106, 169, floor1);

  createTilePlatform(15, 32, floor2);
  createTilePlatform(42, 53, floor2);
  createTilePlatform(64, 75, floor2);
  createTilePlatform(92, 105, floor2);

  createTilePlatform(8, 20, floor3);
  createTilePlatform(54, 63, floor3);
  createTilePlatform(75, 87, floor3);
  createTilePlatform(99, 111, floor3);

  createTilesGrowBlock(15, 32, floor2);
  createTilesGrowBlock(42, 53, floor2);
  createTilesGrowBlock(64, 75, floor2);
  createTilesGrowBlock(92, 105, floor2);

  createTilesGrowBlock(54, 63, floor3);
  addEnemies();
};
const addStartGame = () => {
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.bottom = 0;
  div.style.left = 0;
  div.style.width = "100%";
  div.style.height = "100vh";
  div.style.backgroundColor = "#38002c";
  div.style.display = "grid";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  canvas.appendChild(div);
  let btn = document.createElement("button");
  btn.textContent = "play";
  btn.style.padding = "20px";
  btn.style.fontSize = "30pt";
  btn.style.backgroundColor = "#8babbf";
  btn.style.color = "#38003c";
  btn.style.padding = "none";
  btn.onclick = () => {
    div.style.display = "none";
    fsBtn.src = "./img/cancel.png";
    canvas.requestFullscreen();
    let cutscene = new Cutscene([
      `После неудачной попытки выследить похитетелей своей девушки, Адам был пойман недображелателями. Они решили протестировать на герое недавно украденную сверхсекретную разработку. В результате - сознание Адама было заключено в виртуальный плен. Все это время друзья героя искали его и спустя несколько дней, наконец-то смогли выйти с ним на связь.`,
      `Оказалось, что из виртуального мира можно сбежать - дверь находиться за одним из фонтанов в конце первого уровня. Но, чтобы ее открыть нужно найти спрятанный рычаг и ввести код пароля. Пароль состоит из 4 чисел. Цифры пароля находятся внутри тщательно охраняемых деревянных ящиков (по одной в каждом).Что касается рычага - он спрятан на втором уровне, куда у Адама нет доступа. `,
      `К счастью друзья нашли способ похитить его. Но, поскольку опасность слышком велика, они передадут рычаг, только когда станут известны все цифры пароля.Когда появится рычаг у Адама будет 15 секунд чтобы найти его, подбежать к фонтану и ввести пароль. Если герой не успеет - местонохождение его друзей будет обнаружено недоброжелателями.`,
    ]);
  };
  div.appendChild(btn);
};
const start = () => {
  addBackImg();
  lifeCycle();
  buildLvl();
  addHearts();
  updateHearts();
  addStartGame();
};

// start();

function check(a, x) {
  if (a.find(x)) {
    console.log("da");
  }
}
check([101, 45, 75, 105, 99, 107], 107);
