// ------------------- Game Scene -------------------
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "player.png");
    this.load.image("enemy1", "enemy1.png");
    this.load.image("enemy2", "Enemy.png");

    this.load.audio("audio", "audio.mp3");

    this.load.spritesheet("explosion", "explosion.png", {
        frameWidth: 96,  // depends on your sprite sheet
        frameHeight: 93,
      });

  }

  create() {
    this.score = 0;

    this.playerHealth = 100;
    this.maxHealth = 100;

    let sh = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 5 :20;
    let sw = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 200 :200;
    this.healthBarBg = this.add.rectangle(20, this.scale.height / 2, sh, sw, 0x444444).setOrigin(0.5);
    this.healthBar = this.add.rectangle(20, this.scale.height / 2 + 100, sh, sw, 0x00ff00).setOrigin(0.5, 1);
    
    // Play audio on loop
    this.saudio = this.sound.add("audio", { loop: false, volume: 1.0 });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 15 }),
      frameRate: 25,
      repeat: 0,
      hideOnComplete: true, // removes it after playing
    });


// Enable multi-touch (2 fingers minimum)
this.isMobile = this.sys.game.device.input.touch;
this.input.addPointer(1);



if (this.isMobile) {

  // --- Joystick visuals ---
  this.joyBase = this.add.circle(
    100,
    this.scale.height - 120,
    60,
    0x000000,
    0.3
  ).setScrollFactor(0).setDepth(10);

  this.joyThumb = this.add.circle(
    100,
    this.scale.height - 75,
    25,
    0xffffff,
    0.5
  ).setScrollFactor(0).setDepth(11);

  // --- Make joystick interactive ---
  this.joyBase.setInteractive(
    new Phaser.Geom.Circle(0, 0, 60),
    Phaser.Geom.Circle.Contains
  );
  this.joyThumb.setInteractive();

  // --- Joystick state ---
  this.joyVector = new Phaser.Math.Vector2(0, 0);
  this.joyActive = false;
  this.joyPointerId = null;

  // --- Shoot button ---
  this.shootBtn = this.add.circle(
    this.scale.width - 70,
    this.scale.height - 75,
    30,
    0xff0000,
    0.6
  ).setDepth(10).setInteractive();

  this.shootingMobile = false;




  // --- Store original thumb position ---
this.joyThumbStart = { x: this.joyThumb.x, y: this.joyThumb.y };

// --- Touch start on joystick ---
this.input.on("pointerdown", (p) => {
  if (p.x < this.scale.width / 2) {
    this.joyActive = true;
    this.joyPointerId = p.id;
  }
});

// --- Touch move (drag joystick) ---
this.input.on("pointermove", (p) => {
  if (this.joyActive && p.id === this.joyPointerId) {
    const dx = p.x - this.joyBase.x;
    const dy = p.y - this.joyBase.y;
    const length = Math.min(60, Math.sqrt(dx * dx + dy * dy));

    const angle = Math.atan2(dy, dx);
    this.joyThumb.x = this.joyBase.x + Math.cos(angle) * length;
    this.joyThumb.y = this.joyBase.y + Math.sin(angle) * length;

    this.joyVector.set(Math.cos(angle), Math.sin(angle));
  }
});

// --- Touch end — RESET POSITION ---
this.input.on("pointerup", (p) => {
  if (p.id === this.joyPointerId) {
    this.joyActive = false;
    this.joyPointerId = null;

    // **⬇ RESET THUMB POSITION HERE**
    this.joyThumb.x = this.joyThumbStart.x;
    this.joyThumb.y = this.joyThumbStart.y;
    this.joyVector.set(0, 0);
  }
});



















}





if (this.isMobile) {

  this.input.on("pointerdown", (p) => {
    // LEFT side → joystick
    if (p.x < this.scale.width / 2 && this.joyPointerId === null) {
      this.joyPointerId = p.id;
      this.joyActive = true;
    }
  });

  this.input.on("pointermove", (p) => {
    if (!this.joyActive || p.id !== this.joyPointerId) return;

    const dx = p.x - this.joyBase.x;
    const dy = p.y - this.joyBase.y;

    const dist = Math.min(50, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);

    this.joyThumb.x = this.joyBase.x + Math.cos(angle) * dist;
    this.joyThumb.y = this.joyBase.y + Math.sin(angle) * dist;

    this.joyVector.set(
      Math.cos(angle) * (dist / 50),
      Math.sin(angle) * (dist / 50)
    );
  });

  this.input.on("pointerup", (p) => {
    if (p.id === this.joyPointerId) {
      this.joyPointerId = null;
      this.joyActive = false;
      this.joyThumb.x = this.joyBase.x;
      this.joyThumb.y = this.joyBase.y;
      this.joyVector.set(0, 0);
    }
  });

  // Shoot button events
  this.shootBtn.on("pointerdown", () => {
    this.shootingMobile = true;
  });

  this.shootBtn.on("pointerup", () => {
    this.shootingMobile = false;
  });

  this.shootBtn.on("pointerout", () => {
    this.shootingMobile = false;
  });
}





















    // Responsive score text
    const fontSize = Math.round(this.scale.width * 0.03); // 3% of width
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: `${fontSize}px`,
      fontStyle: "bold",
      fill: "#32d7d7",
    });

    // Player
    let s_player = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 1.2 :1.4;
    this.player = this.add
      .image(this.cameras.main.width / 2, this.cameras.main.height - 150, "player")
      .setScale(s_player);

    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    // Enemy groups
    this.enemies1 = this.physics.add.group();
    this.enemies2 = this.physics.add.group();

    // Bullet groups
    this.playerBullets = this.physics.add.group({ maxSize: 200 });
    this.enemyBullets = this.physics.add.group({ maxSize: 200 });

    this.lastFired = 0;

    // Player bullets vs enemies
    this.physics.add.overlap(this.playerBullets, this.enemies1, (bullet, enemy) => {
      bullet.destroy();
      this.saudio.play();
      const explosion = this.add.sprite(enemy.x, enemy.y, "explosion");
      explosion.play("explode");
      explosion.on("animationcomplete", () => explosion.destroy());
      enemy.destroy();
      this.addScore(5);
    });

    this.physics.add.overlap(this.playerBullets, this.enemies2, (bullet, enemy) => {
      bullet.destroy();
      const explosion = this.add.sprite(enemy.x, enemy.y, "explosion");
      explosion.play("explode");
      explosion.on("animationcomplete", () => explosion.destroy());
      enemy.destroy();
      this.addScore(5);
    });

    this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
      bullet.destroy();
      this.playerHealth -= 20;
      this.updateHealthBar();
      if (this.playerHealth <= 0) {
        this.endGame();
      }
    });

    // Player vs enemies → Game Over
    this.physics.add.overlap(this.player, this.enemies1, () => {
      this.endGame();
    });

    this.physics.add.overlap(this.player, this.enemies2, () => {
      this.endGame();
    });

    // Spawn enemies
    this.time.addEvent({
      delay: 750,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Enemy shooting (enemy2 shoots downward)
    this.time.addEvent({
      delay: 800,
      callback: () => {
        this.enemies2.getChildren().forEach((enemy) => {
          this.shootBullet(this.enemyBullets, this, enemy.x, enemy.y + 25, 600, 0xff0000);
        });
      },
      loop: true,
    });
  }

  // 🟢 Add score method
  addScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }

  // 🟢 End game method
  endGame() {
    this.player.destroy();
    this.scene.start("GameOverScene", { score: this.score });
  }

  // 🟢 Spawn enemies with wave movement
  spawnEnemy() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    let e;

    if (Math.random() < 0.5) {
      e = this.enemies1.create(x, -50, "enemy1").setScale(1.5);
      e.rotationSpeed = 0.18;
      e.speedY = 180;
      e.waveAmp = 180;
      e.waveFreq = 2;
    } else {
      e = this.enemies2.create(x, -50, "enemy2").setScale(1.5);
      e.rotationSpeed = 0;
      e.speedY = 160;
      e.waveAmp = 200;
      e.waveFreq = 3;
    }

    e.baseX = x;
    e.spawnTime = this.time.now;
  }

  // 🟢 Bullet function (used by player & enemies)
  shootBullet(group, scene, x, y, velocityY = -600, color = 0xffa500) {
    const key = `bullet_${color.toString(16)}`;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(color, 1);
      g.fillRect(0, 0, 7, 7);
      g.generateTexture(key, 7, 7);
    }

    const bullet = group.get(x, y, key);

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      scene.physics.world.enable(bullet);
      bullet.body.allowGravity = false;
      bullet.setVelocityY(velocityY);
    }

    return bullet;
  }

  updateHealthBar() {
  let h_player = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 1 :1;
  const healthRatio = Phaser.Math.Clamp(this.playerHealth / this.maxHealth, 0, 1);
  this.healthBar.setScale(h_player, healthRatio);
  if (healthRatio > 0.6) {
    this.healthBar.fillColor = 0x00ff00; // green
  } else if (healthRatio > 0.3) {
    this.healthBar.fillColor = 0xffff00; // yellow
  } else {
    this.healthBar.fillColor = 0xff0000; // red
  }
}


  update(time, delta) {
   this.playerSpeedDesktop = 25;
   this.playerSpeedMobile = 350;

    const speed = this.isMobile
  ? this.playerSpeedMobile
  : this.playerSpeedDesktop;




// Desktop
if (!this.isMobile) {
  if (this.cursors.left.isDown) this.player.x -= speed;
  if (this.cursors.right.isDown) this.player.x += speed;
  if (this.cursors.up.isDown) this.player.y -= speed;
  if (this.cursors.down.isDown) this.player.y += speed;

}

// Mobile joystick
if (this.isMobile && this.joyVector) {
  this.player.x += this.joyVector.x * speed * (delta / 1000);
  this.player.y += this.joyVector.y * speed * (delta / 1000);
}





    

    // Player movement
    // if (this.cursors.left.isDown) this.player.x -= speed;
    // if (this.cursors.right.isDown) this.player.x += speed;
    // if (this.cursors.up.isDown) this.player.y -= speed;
    // if (this.cursors.down.isDown) this.player.y += speed;

    // Keep player inside screen
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.player.width / 2,
      this.scale.width - this.player.width / 2
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.player.height / 2,
      this.scale.height - this.player.height / 2
    );




    // Fire player bullets
    // if (this.sKey.isDown && time > this.lastFired) {
    //   this.shootBullet(this.playerBullets, this, this.player.x, this.player.y - 30, -750, 0xffa500);
    //   this.lastFired = time + 250; // cooldown 200ms
    // }

if (
  (this.sKey.isDown || this.shootingMobile) &&
  time > this.lastFired
) {
  this.shootBullet(
    this.playerBullets,
    this,
    this.player.x,
    this.player.y - 30,
    -750,
    0xffa500
  );
  this.lastFired = time + 250;
}













    // Destroy off-screen bullets
    this.playerBullets.getChildren().forEach((b) => {
      if (b.active && (b.y < -50 || b.y > this.scale.height + 50)) b.destroy();
    });

    this.enemyBullets.getChildren().forEach((b) => {
      if (b.active && (b.y < -50 || b.y > this.scale.height + 50)) b.destroy();
    });

    // Enemy movement (wave + rotation)
    this.enemies1.getChildren().forEach((enemy) => {
      const t = (time - enemy.spawnTime) / 1000;
      enemy.y += enemy.speedY * (delta / 1000);
      enemy.x = enemy.baseX + Math.sin(t * enemy.waveFreq) * enemy.waveAmp;
      enemy.rotation += enemy.rotationSpeed;
      if (enemy.y > this.scale.height + 50) enemy.destroy();
    });

    this.enemies2.getChildren().forEach((enemy) => {
      const t = (time - enemy.spawnTime) / 1000;
      enemy.y += enemy.speedY * (delta / 1000);
      enemy.x = enemy.baseX + Math.sin(t * enemy.waveFreq) * enemy.waveAmp;
      if (enemy.y > this.scale.height + 50) enemy.destroy();
    });
  }
}
