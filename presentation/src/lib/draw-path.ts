// SVG path builder
export class PathBuilder {
  private path: string[] = [];
  private initialPath: string[] = [];
  private startX: number = 0;
  private startY: number = 0;

  moveTo(x: number, y: number) {
    this.path.push(`M${x},${y}`);
    this.initialPath.push(`M${x},${y}`);
    this.startX = x;
    this.startY = y;
    return this;
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.path.push(`Q${cpx},${cpy},${x},${y}`);
    this.initialPath.push(
      `Q${this.startX},${this.startY},${this.startX},${this.startY}`,
    );
    return this;
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ) {
    this.path.push(`C${cp1x},${cp1y},${cp2x},${cp2y},${x},${y}`);
    this.initialPath.push(
      `Q${this.startX},${this.startY},${this.startX},${this.startY},${this.startX},${this.startY}`,
    );
    return this;
  }

  lineTo(x: number, y: number) {
    this.path.push(`L${x},${y}`);
    this.initialPath.push(`L${this.startX},${this.startY}`);
    return this;
  }

  closePath() {
    this.path.push("Z");
    this.initialPath.push("Z");
    return this;
  }

  buildInitialPath() {
    return this.initialPath.join(" ");
  }

  build() {
    return this.path.join(" ");
  }
}
