// ------------------- Game Over Scene -------------------
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0; // Get final score from GameScene
  }

  preload() {
    this.load.image("replay_btn", "replay_btn.png"); // Game Over image
  }

  create() {

    this.cameras.main.setBackgroundColor("rgba(146, 202, 78, 1)");
    // --- Responsive Game Over Image (Replay Button) ---
    this.gameOverImage = this.add.image(this.scale.width / 2, this.scale.height * 0.5,"replay_btn");

    let n_f = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 0.4 :0.2;
    const maxWidth = this.scale.width * n_f;
    const maxHeight = this.scale.height * n_f;

    const scaleX = maxWidth / this.gameOverImage.width;
    const scaleY = maxHeight / this.gameOverImage.height;
    const scale = Math.min(scaleX, scaleY);

    this.gameOverImage.setScale(scale);
    this.gameOverImage.setOrigin(0.5, 0.5);

    // --- Make Image Interactive ---
    this.gameOverImage.setInteractive({ useHandCursor: true });

    // Save original scale for hover effect
    const originalScale = scale;
    const hoverScale = scale * 1.1; // scale up by 10%

    // Hover over: scale up
    this.gameOverImage.on("pointerover", () => {
      this.gameOverImage.setScale(hoverScale);
    });

    // Hover out: return to normal scale
    this.gameOverImage.on("pointerout", () => {
      this.gameOverImage.setScale(originalScale);
    });

    // Click: restart game
    this.gameOverImage.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // --- Responsive Score Text ---
    let m = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 0.09 :0.03;
    this.scoreText = this.add.text(this.scale.width / 2, this.scale.height * 0.2, `Your Score is ${this.finalScore}.`, {
      fontSize: `${Math.floor(this.scale.width * m)}px`,
      fill: "#ff0000",
      fontFamily: "Arial",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // --- Responsive Restart Instruction ---
    let m_another = (this.sys.game.device.os.android || this.sys.game.device.os.iOS) ? 0.05 :0.03;
    this.restartText = this.add.text(this.scale.width / 2, this.scale.height * 0.3, "Click on replay Button to play again.", {
      fontSize: `${Math.floor(this.scale.width * m_another)}px`,
      fill: "#ff0000",
      fontFamily: "Arial",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Restart with SPACE key too
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });

    // --- Handle Window Resize ---
    this.scale.on("resize", this.resize, this);
  }

  // --- Resize Handler Function ---
  resize(gameSize) {
    const { width, height } = gameSize;

    // Scale button again (keep aspect ratio)
    const maxWidth = width * 0.6;
    const maxHeight = height * 0.4;

    const scaleX = maxWidth / this.gameOverImage.width;
    const scaleY = maxHeight / this.gameOverImage.height;
    const scale = Math.min(scaleX, scaleY);

    this.gameOverImage.setScale(scale);
    this.gameOverImage.setPosition(width / 2, height * 0.3);

    // Resize texts
    this.scoreText.setFontSize(Math.floor(width * 0.05));
    this.scoreText.setPosition(width / 2, height * 0.5);

    this.restartText.setFontSize(Math.floor(width * 0.03));
    this.restartText.setPosition(width / 2, height * 0.65);
  }
}
