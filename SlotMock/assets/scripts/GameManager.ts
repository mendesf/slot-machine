import SlotShuffler, { ShufflingResult } from './slots/SlotShuffler';
import Machine from './slots/Machine';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property({ type: cc.Node })
  machine: cc.Node = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result: ShufflingResult = null;

  private machineScript: Machine;

  onLoad(): void {
    this.machineScript = this.machine.getComponent('Machine');
  }

  start(): void {
    this.machineScript.createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machineScript.spinning === false) {
      this.block = false;
      this.machineScript.spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machineScript.lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<ShufflingResult> {
    const { numberOfReels } = this.machineScript;
    const result = new SlotShuffler().shuffle(numberOfReels);

    return new Promise<ShufflingResult>(resolve => {
      setTimeout(() => {
        resolve(result);
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machineScript.stop(resultRelayed);
  }
}
