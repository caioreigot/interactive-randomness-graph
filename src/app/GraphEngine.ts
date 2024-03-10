import { Bar, BidimensionalSize } from "./types";

export class GraphEngine {

  private initialBarHeight = 40;
  private noGapQuantity: number = 400;

  getGraphGap(barsQuantity: number) {
    // Por padrão é 4 pixels
    let graphGap: number = 4;

    if (barsQuantity >= 200 && barsQuantity < 300) {
      graphGap = 2;
    } else if (barsQuantity >= 300 && barsQuantity < this.noGapQuantity) {
      graphGap = 1;
    } else if (barsQuantity >= this.noGapQuantity) {
      graphGap = 0;
    }

    return graphGap;
  }

  generateBars(quantity: number, canvasSize: BidimensionalSize) {
    const bars: Bar[] = [];
    const graphGap = this.getGraphGap(quantity);

    for (let i = 0; i < quantity; i++) {
      // this.barsGap * (quantity - 1) é a quantidade de gaps que terão (ex: com duas barras, há apenas um gap, com três barras, há dois gaps...)
      const usableWidth = canvasSize.width - (graphGap * (quantity - 1))
      let barWidth = usableWidth / quantity;
      let currentX = bars[i - 1] ? (bars[i - 1].x + barWidth + graphGap) : barWidth * i;
      
      bars.push({
        width: barWidth,
        height: this.initialBarHeight,
        x: currentX,
        y: canvasSize.height - this.initialBarHeight,
      });
    }

    return bars;
  }

  updateBarsSize(bars: Bar[], canvasSize: BidimensionalSize) {
    const graphGap = this.getGraphGap(bars.length);

    bars.forEach((bar, i) => {
      // graphGap * (quantity - 1) é a quantidade de gaps que terão (ex: com duas barras, há apenas um gap, com três barras, há dois gaps...)
      const usableWidth = canvasSize.width - (graphGap * (bars.length - 1))
      let barWidth = usableWidth / bars.length;
      let currentX = bars[i - 1] ? (bars[i - 1].x + barWidth + graphGap) : barWidth * i;

      bar.width = barWidth;
      bar.height = Math.min(bar.height, canvasSize.height - (canvasSize.height / 100));
      bar.x = currentX;
      bar.y = canvasSize.height - bar.height;
    });
  }
}