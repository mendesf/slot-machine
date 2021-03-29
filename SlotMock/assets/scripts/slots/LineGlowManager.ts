import EqualLineDrawer from './EqualLineDrawer';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LineGlowManager extends cc.Component {
  @property({ type: cc.Prefab, visible: true })
  glowPrefab: cc.Prefab = null;

  private canvas: cc.Node;

  private reels: Array<cc.Node> = [];

  private lineGlows: Array<cc.Node> = [];

  private glowDistance = 0;

  onLoad(): void {
    this.reels = this.node.children;
    this.glowDistance = this.calculateDistance();
    this.canvas = cc.find('Canvas');
  }

  private calculateDistance(): number {
    const tiles = this.reels[0].getChildByName('In').children;
    const highestY = Math.max(...tiles.map(tile => tile.y));
    const tileHeight = tiles[0].height;

    const rate = (tiles.length - 1) / 2;

    const paddingY = highestY / rate - tileHeight;

    return tileHeight + paddingY;
  }

  addLineGlow(equalLines: Set<number>): void {
    if (equalLines.size > 0) {
      this.reels.forEach(reel => {
        const parentY = this.node.y;
        let y = parentY + this.glowDistance;

        for (let lineIndex = 0; lineIndex <= EqualLineDrawer.max; lineIndex += 1) {
          if (equalLines.has(lineIndex)) {
            const glow = cc.instantiate(this.glowPrefab);
            const position = new cc.Vec3(reel.position.x, y);

            glow.setPosition(position);
            this.canvas.addChild(glow);
            this.lineGlows.push(glow);
          }

          y -= this.glowDistance;
        }
      });
    }
  }

  removeLineGlow(): void {
    this.lineGlows.forEach(glow => this.canvas.removeChild(glow));
  }
}
