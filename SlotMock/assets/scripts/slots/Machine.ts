import { ShufflingResult } from './SlotShuffler';
import Aux from '../SlotEnum';
import LineGlowManager from './LineGlowManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Node)
  public button: cc.Node = null;

  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  private reels = [];

  public spinning = false;

  private lineGlowManager: LineGlowManager = null;

  onLoad(): void {
    this.lineGlowManager = this.getComponent(LineGlowManager);
  }

  createMachine(): void {
    this.node.destroyAllChildren();
    this.reels = [];

    let newReel: cc.Node;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);
      this.node.addChild(newReel);
      this.reels[i] = newReel;

      const reelScript = newReel.getComponent('Reel');
      reelScript.shuffle();
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  spin(): void {
    this.lineGlowManager.removeLineGlow();

    this.spinning = true;
    this.button.getChildByName('Label').getComponent(cc.Label).string = 'STOP';

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');

      if (i % 2) {
        theReel.spinDirection = Aux.Direction.Down;
      } else {
        theReel.spinDirection = Aux.Direction.Up;
      }

      theReel.doSpin(0.03 * i);
    }
  }

  lock(): void {
    this.button.getComponent(cc.Button).interactable = false;
  }

  stop(result: ShufflingResult = null): void {
    const promises: Array<Promise<void>> = [];
    const rngMod = Math.random() / 2;

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const promise = new Promise<void>(resolve => {
        const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
        const theReel = this.reels[i].getComponent('Reel');

        setTimeout(() => {
          theReel.readyStop(result.slots[i]);
          resolve();
        }, spinDelay * 1000);
      });

      promises.push(promise);
    }

    const waitingTime = 500;

    Promise.all(promises).then(() => {
      setTimeout(() => {
        this.spinning = false;
        this.button.getComponent(cc.Button).interactable = true;
        this.button.getChildByName('Label').getComponent(cc.Label).string = 'SPIN';
        this.lineGlowManager.addLineGlow(result.equalLines);
      }, waitingTime);
    });
  }
}
