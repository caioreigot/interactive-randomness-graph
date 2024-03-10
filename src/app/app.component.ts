import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GraphEngine } from './GraphEngine';
import { Bar } from './types';
import { generateRandomNumber, generateTwoRandomSum } from './utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  graphEngine: GraphEngine = new GraphEngine();
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bars: Bar[] = [];

  // Quantidade inicial de barras
  barsQuantity: number = 100;

  // Tempo em segundos que o código irá ficar distribuindo tamanhos aleatoriamente entre as barras
  randomDistributionTimeoutSeconds: number = 10;

  get canvasWidth() {
    return this.ctx?.canvas.width || 0;
  }

  get canvasHeight() {
    return this.ctx?.canvas.height || 0;
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef!.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.updateCanvasSize();
    this.generateBars();
    this.run();

    this.runRandomDistribution();
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
    /* Quantas alterações irão ocorrer ao mesmo tempo em cada intervalo */
    const bundleSize = Math.max(this.bars.length / 20, 1);
    /* Tempo em milissegundos que as alterações de height acontecem */
    const changeHeightInterval = 1;
    
    const interval_id = setInterval(() => {
      for (let i = 0; i < bundleSize; i++) {
        // TO DO: Escolher (pelo parâmetro da função) quantos números aleatórios serão somados
        const randomIndex = generateTwoRandomSum(0, this.bars.length - 1);
        this.bars[randomIndex].height += 10;
      }
    }, changeHeightInterval);
    
    setTimeout(() => {
      window.clearInterval(interval_id);
    }, this.randomDistributionTimeoutSeconds * 1000);
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
}
