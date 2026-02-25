import * as PIXI from 'pixi.js';

export class PixiGame {
  private app: PIXI.Application;
  private container: HTMLElement;
  private readonly onMultiplierUpdate?: (multiplier: number) => void;
  private isInitialized: boolean = false;
  private isDestroyed: boolean = false;
  private resizeHandler?: () => void;
  
  // Visual elements
  private textMultiplier!: PIXI.Text;
  private rocket!: PIXI.Graphics;
  private trajectory!: PIXI.Graphics;
  
  // Game state
  private timeElapsed: number = 0;
  private isRunning: boolean = false;
  private currentMultiplier: number = 1.0;
  private readonly onTick = (ticker: PIXI.Ticker) => this.update(ticker);

  constructor(container: HTMLElement, onMultiplierUpdate?: (multiplier: number) => void) {
    this.container = container;
    this.onMultiplierUpdate = onMultiplierUpdate;
    this.app = new PIXI.Application();
  }

  // Initialize Pixi application and setup scene
  public async init() {
    if (this.isDestroyed || this.isInitialized) return;

    await this.app.init({
      resizeTo: this.container,
      background: '#0B0C10',
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    if (this.isDestroyed) {
      return;
    }

    this.container.appendChild(this.app.canvas);
    this.buildScene();

    // Add resize handler to keep text centered
    this.resizeHandler = () => {
      if (this.isInitialized && !this.isDestroyed && this.textMultiplier) {
        const w = this.app.screen.width;
        const h = this.app.screen.height;
        this.textMultiplier.position.set(w / 2, h / 2);
      }
    };
    window.addEventListener('resize', this.resizeHandler);

    this.app.ticker.add(this.onTick);
    this.isInitialized = true;
  }

  private buildScene() {
    // Initialize trajectory line
    this.trajectory = new PIXI.Graphics();
    this.app.stage.addChild(this.trajectory);

    // Create rocket (moving object)
    this.rocket = new PIXI.Graphics();
    const scale = this.getScale();
    this.rocket.poly([0, -15 * scale, 10 * scale, 10 * scale, -10 * scale, 10 * scale]);
    this.rocket.fill(0x00f0ff);
    this.app.stage.addChild(this.rocket);

    // Create multiplier text display
    const fontSize = 64 * scale;
    this.textMultiplier = new PIXI.Text({
      text: 'x1.00',
      style: {
        fontFamily: 'Inter, monospace',
        fontSize: fontSize,
        fill: '#00f0ff',
        fontWeight: 'bold',
        dropShadow: {
            color: '#00f0ff',
            blur: 15 * scale,
            distance: 0,
            alpha: 0,
            angle: 0
        },
      },
    });
    this.textMultiplier.anchor.set(0.5);
    this.textMultiplier.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.app.stage.addChild(this.textMultiplier);

    this.resetVisuals();
  }

  // Calculate responsive scale based on screen size
  private getScale(): number {
    const minDimension = Math.min(this.app.screen.width, this.app.screen.height);
    return Math.max(0.5, Math.min(1.5, minDimension / 600));
  }

  private update(ticker: PIXI.Ticker) {
    if (!this.isInitialized || !this.isRunning) return;

    // Cap deltaTime to prevent large jumps when tab loses focus
    const maxDeltaMS = Math.min(ticker.deltaMS, 100); 
    const dt = maxDeltaMS / 1000;

    this.timeElapsed += dt;

    // Calculate multiplier using quadratic formula
    const t = this.timeElapsed;
    this.currentMultiplier = 1 + t * 0.6 + Math.pow(t, 2) * 0.08;
    this.onMultiplierUpdate?.(this.currentMultiplier);

    this.updateVisuals();
  }

  // Update visual positions based on current multiplier
  private updateVisuals() {
    if (!this.isInitialized || this.isDestroyed) return;

    const w = this.app.screen.width;
    const h = this.app.screen.height;
    const scale = this.getScale();

    this.textMultiplier.text = `x${this.currentMultiplier.toFixed(2)}`;

    const startX = w * 0.1;
    const startY = h * 0.9;
    const endX = w * 0.9;
    const endY = h * 0.1;
    
    // Rocket moves diagonally from bottom-left to top-right based on multiplier progress
    const maxMultiplier = 10.0;
    const progress = Math.min((this.currentMultiplier - 1) / (maxMultiplier - 1), 1);

    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    this.rocket.position.set(currentX, currentY);
    this.rocket.rotation = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;

    this.trajectory.clear();
    this.trajectory.moveTo(startX, startY);
    this.trajectory.lineTo(currentX, currentY);
    this.trajectory.stroke({ width: 4 * scale, color: 0x00f0ff, alpha: 0.5 });
  }

  // Start game - reset visuals and begin multiplier growth
  public startGame() {
    if (!this.isInitialized || this.isDestroyed) return;

    this.resetVisuals();
    this.isRunning = true;
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  // Display crash state with red text
  public crashGame(crashMultiplier: number) {
    if (!this.isInitialized || this.isDestroyed) return;

    this.isRunning = false;
    this.currentMultiplier = crashMultiplier;
    const scale = this.getScale();
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    this.textMultiplier.text = `CRASHED\nx${this.currentMultiplier.toFixed(2)}`;
    this.textMultiplier.style.fill = '#ef4444';
    this.textMultiplier.style.fontSize = 64 * scale;
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#ef4444' };
    this.textMultiplier.position.set(w / 2, h / 2);
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  // Display cashout state with green text
  public cashOutGame(cashoutMultiplier: number) {
    if (!this.isInitialized || this.isDestroyed) return;

    this.isRunning = false;
    this.currentMultiplier = cashoutMultiplier;
    const scale = this.getScale();
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    this.textMultiplier.text = `x${this.currentMultiplier.toFixed(2)}`;
    this.textMultiplier.style.fill = '#22c55e';
    this.textMultiplier.style.fontSize = 64 * scale;
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#22c55e' };
    this.textMultiplier.position.set(w / 2, h / 2);
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  // Reset all visuals to initial state
  public resetVisuals() {
    this.timeElapsed = 0;
    this.currentMultiplier = 1.0;
    this.isRunning = false;

    if (!this.isInitialized || this.isDestroyed) return;
    
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    const startX = w * 0.1;
    const startY = h * 0.9;
    this.rocket.position.set(startX, startY);
    this.rocket.rotation = Math.PI / 4;
    
    this.trajectory.clear();
    
    this.textMultiplier.text = 'x1.00';
    this.textMultiplier.style.fill = '#00f0ff';
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#00f0ff' };
    this.textMultiplier.position.set(w / 2, h / 2);
  }

  // Clean up Pixi resources
  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (!this.isInitialized) return;

    // Remove resize handler
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    this.app.ticker.remove(this.onTick);
    this.app.destroy();
    this.isInitialized = false;
  }
}