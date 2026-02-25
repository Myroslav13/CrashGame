import * as PIXI from 'pixi.js';

export class PixiGame {
  private app: PIXI.Application;
  private container: HTMLElement;
  private readonly onMultiplierUpdate?: (multiplier: number) => void;
  private isInitialized: boolean = false;
  private isDestroyed: boolean = false;
  
  // Візуальні елементи
  private textMultiplier!: PIXI.Text;
  private rocket!: PIXI.Graphics;
  private trajectory!: PIXI.Graphics;
  
  // Внутрішній стан рушія
  private timeElapsed: number = 0;
  private isRunning: boolean = false;
  private currentMultiplier: number = 1.0;
  private readonly onTick = (ticker: PIXI.Ticker) => this.update(ticker);

  constructor(container: HTMLElement, onMultiplierUpdate?: (multiplier: number) => void) {
    this.container = container;
    this.onMultiplierUpdate = onMultiplierUpdate;
    this.app = new PIXI.Application();
  }

  // Ініціалізація Pixi
  public async init() {
    if (this.isDestroyed || this.isInitialized) return;

    await this.app.init({
      resizeTo: this.container, // Адаптивний розмір [cite: 53]
      background: '#0B0C10',    // Простий темний фон [cite: 13]
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    if (this.isDestroyed) {
      return;
    }

    this.container.appendChild(this.app.canvas);
    this.buildScene();

    // Використання Pixi Ticker для обробки часу 
    this.app.ticker.add(this.onTick);
    this.isInitialized = true;
  }

  private buildScene() {
    // 1. Лінія траєкторії 
    this.trajectory = new PIXI.Graphics();
    this.app.stage.addChild(this.trajectory);

    // 2. Ракета (Рухомий об'єкт) 
    this.rocket = new PIXI.Graphics();
    // Малюємо простий неоновий трикутник (ракету)
    this.rocket.poly([0, -15, 10, 10, -10, 10]);
    this.rocket.fill(0x00f0ff);
    this.app.stage.addChild(this.rocket);

    // 3. Текст множника 
    this.textMultiplier = new PIXI.Text({
      text: 'x1.00',
      style: {
        fontFamily: 'Inter, monospace',
        fontSize: 64,
        fill: '#00f0ff', // Неоновий синій
        fontWeight: 'bold',
        dropShadow: {
            color: '#00f0ff',
            blur: 15,
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

  // Головний ігровий цикл
  private update(ticker: PIXI.Ticker) {
    if (!this.isInitialized || !this.isRunning) return;

    // Обмеження deltaTime для запобігання стрибкам, коли вкладка втрачає фокус 
    // Максимум 100ms (0.1s) за кадр
    const maxDeltaMS = Math.min(ticker.deltaMS, 100); 
    const dt = maxDeltaMS / 1000; // переводимо в секунди [cite: 23]

    this.timeElapsed += dt;

    // Розрахунок множника за формулою [cite: 24]
    const t = this.timeElapsed;
    this.currentMultiplier = 1 + t * 0.6 + Math.pow(t, 2) * 0.08;
    this.onMultiplierUpdate?.(this.currentMultiplier);

    this.updateVisuals();
  }

  private updateVisuals() {
    if (!this.isInitialized || this.isDestroyed) return;

    const w = this.app.screen.width;
    const h = this.app.screen.height;

    // Округлення до 2 знаків після коми [cite: 25]
    this.textMultiplier.text = `x${this.currentMultiplier.toFixed(2)}`;

    // Обчислення координат: ракета летить з лівого нижнього кута в правий верхній
    // Масштабуємо t для X (швидкість по горизонталі) та multiplier для Y (висота)
    const startX = w * 0.1;
    const startY = h * 0.9;
    
    // Плавне візуальне зростання [cite: 41]
    const currentX = startX + (this.timeElapsed * 40); 
    // Y йде вгору (віднімаємо від висоти екрану)
    const currentY = startY - ((this.currentMultiplier - 1) * 30); 

    this.rocket.position.set(currentX, currentY);
    this.rocket.rotation = Math.atan2(-((this.currentMultiplier - 1) * 30), 40) + Math.PI / 2;

    // Малюємо траєкторію
    this.trajectory.clear();
    this.trajectory.moveTo(startX, startY);
    this.trajectory.lineTo(currentX, currentY);
    this.trajectory.stroke({ width: 4, color: 0x00f0ff, alpha: 0.5 });
  }

  // --- API для виклику з React / Ігрового Рушія ---

  public startGame() {
    if (!this.isInitialized || this.isDestroyed) return;

    this.resetVisuals();
    this.isRunning = true;
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  public crashGame(crashMultiplier: number) {
    if (!this.isInitialized || this.isDestroyed) return;

    this.isRunning = false;
    this.currentMultiplier = crashMultiplier;
    this.textMultiplier.text = `CRASHED\nx${this.currentMultiplier.toFixed(2)}`;
    this.textMultiplier.style.fill = '#ef4444'; // Червоний колір [cite: 55]
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#ef4444' };
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  public cashOutGame(cashoutMultiplier: number) {
    if (!this.isInitialized || this.isDestroyed) return;

    this.isRunning = false;
    this.currentMultiplier = cashoutMultiplier;
    this.textMultiplier.text = `x${this.currentMultiplier.toFixed(2)}`;
    this.textMultiplier.style.fill = '#22c55e'; // Зелений колір
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#22c55e' };
    this.onMultiplierUpdate?.(this.currentMultiplier);
  }

  public resetVisuals() {
    this.timeElapsed = 0;
    this.currentMultiplier = 1.0;
    this.isRunning = false;

    if (!this.isInitialized || this.isDestroyed) return;
    
    const startX = this.app.screen.width * 0.1;
    const startY = this.app.screen.height * 0.9;
    this.rocket.position.set(startX, startY);
    this.rocket.rotation = Math.PI / 4;
    
    this.trajectory.clear();
    
    this.textMultiplier.text = 'x1.00';
    this.textMultiplier.style.fill = '#00f0ff';
    this.textMultiplier.style.dropShadow = { ...this.textMultiplier.style.dropShadow, color: '#00f0ff' };
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (!this.isInitialized) return;

    this.app.ticker.remove(this.onTick);
    this.app.destroy();
    this.isInitialized = false;
  }
}