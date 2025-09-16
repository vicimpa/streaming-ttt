const values = ['x', 'o'] as const;
export type GameValue = (typeof values)[number];
export type GameItem = { id: string, value: GameValue; };

export class Game {
  step = 0;
  map: (GameItem | null)[] = Array.from({ length: 9 }, () => null);
  readonly winner: ReturnType<Game['_getWinner']> = null;

  get isEnd() {
    return this.step > 8 || !!this.winner;
  }

  private _get(x: number, y: number) {
    return this.map[x + y * 3];
  }

  private _getWinner() {
    const $ = this._get.bind(this);

    for (let i = 0; i < 3; i++) {
      if (
        $(i, 0)
        && $(i, 0)?.value === $(i, 1)?.value
        && $(i, 1)?.value === $(i, 2)?.value
      ) return { winner: $(i, 0)!, line: [$(i, 0)!, $(i, 1)!, $(i, 2)!] as const };
    }

    for (let j = 0; j < 3; j++) {
      if (
        $(0, j)
        && $(0, j)?.value === $(1, j)?.value
        && $(1, j)?.value === $(2, j)?.value
      ) return { winner: $(0, j)!, line: [$(0, j)!, $(1, j)!, $(2, j)!] as const };
    }

    if (
      $(0, 0)
      && $(0, 0)?.value === $(1, 1)?.value
      && $(1, 1)?.value === $(2, 2)?.value
    ) return { winner: $(0, 0)!, line: [$(0, 0)!, $(1, 1)!, $(2, 2)!] as const };

    if (
      $(0, 2)
      && $(0, 2)?.value === $(1, 1)?.value
      && $(1, 1)?.value === $(2, 0)?.value
    ) return { winner: $(0, 2)!, line: [$(0, 2)!, $(1, 1)!, $(2, 0)!] as const };

    return null;
  }

  getValue(i: number) {
    return this.map[i - 1] ?? null;
  }

  setValue(i: number, id: string) {
    if (this.map[i - 1])
      return;

    const value = values[this.step++ % 2];
    this.map[i - 1] = { id, value };
    Object.assign(this, { winner: this._getWinner() });
  }
}