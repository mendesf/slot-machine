import EqualLineDrawer from './EqualLineDrawer';
import SymbolDrawer from './SymbolDrawer';

export interface ShufflingResult {
  equalLines: Set<number>;
  slots: Array<Array<number>>;
}
export default class SlotShuffler {
  private equalLines: Set<number>;

  private symbolsAlreadyDrawn: Set<number>;

  private reset(): void {
    this.symbolsAlreadyDrawn = new Set<number>();
    this.equalLines = EqualLineDrawer.draw();
  }

  private addEqualLines(slots: Array<Array<number>>): void {
    this.equalLines.forEach(line => {
      const symbol = SymbolDrawer.draw(this.symbolsAlreadyDrawn);
      slots.forEach(slot => slot.splice(line, 1, symbol));
      this.symbolsAlreadyDrawn.add(symbol);
    });
  }

  private addRandomLines(slots: Array<Array<number>>): void {
    return slots.forEach(slot => {
      const randomSymbols = new Set<number>(this.symbolsAlreadyDrawn);

      for (let lineIndex = 0; lineIndex < EqualLineDrawer.max; lineIndex += 1) {
        if (!this.equalLines.has(lineIndex)) {
          slot.splice(lineIndex, 1, SymbolDrawer.draw(randomSymbols));
        }
      }
    });
  }

  private createSlots(length: number): Array<Array<number>> {
    const slots = new Array<Array<number>>(length);

    for (let slotIndex = 0; slotIndex < length; slotIndex += 1) {
      slots.fill(new Array<number>(EqualLineDrawer.max), slotIndex, slotIndex + 1);
    }

    return slots;
  }

  shuffle(slotsLength: number): ShufflingResult {
    this.reset();

    const slots = this.createSlots(slotsLength);
    this.addEqualLines(slots);
    this.addRandomLines(slots);

    const equalLines = new Set<number>(this.equalLines);

    return { equalLines, slots };
  }
}
