import { TextDocument, Position, Range } from 'vscode';

export class CursorScanner {
  constructor(readonly document: TextDocument, readonly position: Position) { }

  getWordUntilCursor(regexp: RegExp): string | undefined {
    const range = this.getWordRange(regexp);

    if (range) {
      const newRange = range.with(range.start, this.position);

      return this.document.getText(newRange);
    }
  }

  getWord(regexp: RegExp): string | undefined {
    const range = this.getWordRange(regexp);

    if (range) {
      return this.document.getText(range);
    }
  }

  charBeforeWord(regexp: RegExp): string | undefined {
    const range = this.getWordRange(regexp);

    if (range) {
      return this.charAtRelative(range.start.character - this.position.character - 1);
    }
  }

  get charBefore(): string {
    return this.charAtRelative(-1);
  }

  private getWordRange(regexp: RegExp): Range | undefined {
		return this.document.getWordRangeAtPosition(this.position, regexp);
  }

  private charAtRelative(n: number): string {
    return this.document.getText(this.getCharRange(n));
  }

  private getCharRange(n: number): Range {
    return new Range(this.relativePosition(n), this.relativePosition(n + 1));
  }

  private relativePosition(n: number): Position {
		return this.position.with(this.position.line, this.position.character + n);
  }
}
