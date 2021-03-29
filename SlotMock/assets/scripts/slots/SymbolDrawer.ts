import RandomHelper from '../RandomHelper';

export default class SymbolDrawer {
  static readonly count = 30;

  static draw(symbols: Set<number>): number {
    const symbol = RandomHelper.getRandomInt(0, SymbolDrawer.count);
    if (symbols.has(symbol)) {
      return this.draw(symbols);
    }

    return symbol;
  }
}
