import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GraphEngine } from './GraphEngine';
import { Bar } from './types';
import { FormsModule } from '@angular/forms';
import { generateRandomVariablesSum } from './utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  isSettingsOpen: boolean = true;
  isQuestionModalOpen: boolean = false;
  graphEngine: GraphEngine = new GraphEngine();
  canvas: HTMLCanvasElement;
  intervals: any = [];
  timeouts: any = [];
  ctx: CanvasRenderingContext2D;
  bars: Bar[] = [];

  // Quantidade inicial de barras
  barsQuantity: number = 100;

  // Quantidade de variáveis aleatórias que serão somadas
  variablesQuantity: number = 1;

  // Tempo em segundos que o código irá ficar distribuindo tamanhos aleatoriamente entre as barras
  randomDistributionTimeoutSeconds: number = 5;

  // Velocidade da distribuição
  speedSelected = "1x";

  get canvasWidth() {
    return this.ctx?.canvas.width || 0;
  }

  get canvasHeight() {
    return this.ctx?.canvas.height || 0;
  }

  get speed() {
    switch (this.speedSelected) {
      case "0.5x":
        return 160;
      case "1x":
        return 40;
      case "2x":
        return 10;
      default:
        return 40;
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef!.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.updateCanvasSize();
    this.generateBars();
    this.run();
  }

  generateBars() {
    const canvasSize = { width: this.canvasWidth, height: this.canvasHeight };
    this.bars = this.graphEngine.generateBars(this.barsQuantity, canvasSize);
  }

  updateCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    return { width: this.ctx.canvas.width, height: this.ctx.canvas.height }
  }

  update() {
    const canvasSize = this.updateCanvasSize();
    this.graphEngine.updateBarsSize(this.bars, canvasSize);
  }

  draw() {
    this.drawBackground(this.ctx);
    this.drawBars(this.ctx);
  }

  /* Aumenta o height das barras de forma aleatória durante X segundos */
  runRandomDistribution() {
    this.clearIntervals();
    this.clearTimeouts();
    this.generateBars();

    const variablesQuantity = this.variablesQuantity;

    /* Quantas alterações irão ocorrer ao mesmo tempo em cada intervalo */
    const bundleSize = Math.max(this.bars.length / this.speed, 1);
    /* Tempo em milissegundos que as alterações de height acontecem */
    const changeHeightInterval = 1;

    let intervalInMs = this.bars.length <= 10 ? 10 : changeHeightInterval;
    
    this.intervals.push(setInterval(() => {
      for (let i = 0; i < bundleSize; i++) {
        const randomIndex = generateRandomVariablesSum(variablesQuantity, 0, this.bars.length - 1);
        this.bars[randomIndex].height += 10;
      }
    }, intervalInMs));

    this.timeouts.push(setTimeout(() => {
      this.clearIntervals();
    }, this.randomDistributionTimeoutSeconds * 1000));
  }

  run() {
    this.update();
    this.draw();

    window.requestAnimationFrame(this.run.bind(this));
  }

  drawBars(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#2f81f7";
    
    this.bars.forEach(bar => {
      ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
    });
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  clearIntervals() {
    this.intervals.forEach((interval_id: any) => window.clearInterval(interval_id));
  }

  clearTimeouts() {
    this.timeouts.forEach((timeout_id: any) => window.clearTimeout(timeout_id));
  }

  changeBarsQuantity(event: any) {
    const newBarsQuantity = parseInt(event.target.value);

    if (!isNaN(newBarsQuantity)) {
      this.barsQuantity = newBarsQuantity;
    }
  }

  closeQuestionModalWhenClickOutside(event: any) {
    try {
      if (event.target.classList.contains('question-modal')) {
        this.isQuestionModalOpen = false; 
      }
    } catch(e) {}
  }
}
