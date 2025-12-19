// ------------------- Game Over Scene -------------------
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    // Get final score from GameScene
    this.finalScore = data.score || 0;
  }

  create() {
    // --- Responsive Game Over Image ---
    this.gameOverImage = this.add.image(this.scale.width / 2, this.scale.height * 0.3, "gameOver");

    // Scale image to 50% of screen width while keeping aspect ratio
    const desiredWidth = this.scale.width * 0.5;
    const scaleRatio = desiredWidth / this.gameOverImage.width;
    this.gameOverImage.setScale(scaleRatio);
    this.gameOverImage.setOrigin(0.5, 0.5);

    // --- Responsive Score Text ---
    this.scoreText = this.add.text(this.scale.width / 2, this.scale.height * 0.5, `Score: ${this.finalScore}`, {
      fontSize: `${Math.floor(this.scale.width * 0.05)}px`, // 5% of screen width
      fill: "#ffffff",
      fontFamily: "Arial",
    });
    this.scoreText.setOrigin(0.5, 0.5);

    // --- Responsive Restart Instruction ---
    this.restartText = this.add.text(this.scale.width / 2, this.scale.height * 0.65, "Press SPACE to Restart", {
      fontSize: `${Math.floor(this.scale.width * 0.03)}px`, // 3% of screen width
      fill: "#ff0000",
      fontFamily: "Arial",
    });
    this.restartText.setOrigin(0.5, 0.5);

    // Restart the game on SPACE key press
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });

    // --- Handle Window Resize ---
    this.scale.on("resize", this.resize, this);
  }

  // --- Resize Handler Function ---
  resize(gameSize) {
    const { width, height } = gameSize;

    // --- Resize and reposition the image ---
    const desiredWidth = width * 0.5;
    const scaleRatio = desiredWidth / this.gameOverImage.width;
    this.gameOverImage.setScale(scaleRatio);
    this.gameOverImage.setPosition(width / 2, height * 0.3);

    // --- Resize and reposition score text ---
    this.scoreText.setFontSize(Math.floor(width * 0.05));
    this.scoreText.setPosition(width / 2, height * 0.5);

    // --- Resize and reposition restart instruction ---
    this.restartText.setFontSize(Math.floor(width * 0.03));
    this.restartText.setPosition(width / 2, height * 0.65);
  }
}
