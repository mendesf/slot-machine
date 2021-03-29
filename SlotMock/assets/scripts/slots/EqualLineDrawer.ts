import RandomHelper from '../RandomHelper';

export default class EqualLineDrawer {
  static readonly max = 3;

  private static drawHowManyEqualLines(): number {
    const allLinesStart = 0;
    const twoLinesStart = 7;
    const singleLineStart = 17;
    const noLineStart = 50;

    const ranges = new Array<number>(100)
      .fill(EqualLineDrawer.max, allLinesStart, twoLinesStart)
      .fill(2, twoLinesStart, singleLineStart)
      .fill(1, singleLineStart, noLineStart)
      .fill(0, noLineStart);

    const index = RandomHelper.getRandomInt(0, ranges.length);

    return ranges[index];
  }

  static draw(): Set<number> {
    const count = EqualLineDrawer.drawHowManyEqualLines();
    const equalLines = new Set<number>();

    while (equalLines.size < count) {
      const line = RandomHelper.getRandomInt(0, EqualLineDrawer.max);
      equalLines.add(line);
    }

    return equalLines;
  }
}
