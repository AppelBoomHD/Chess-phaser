import { Scene } from "phaser";
import { PIECE_NAME, SIZE_SQUARE } from "../../environment";
import { CoordinateHelper } from "../../helpers/coordinateHelper";
import { Position } from "../../interfaces/position";

export abstract class Base {
  private static id = 0;
  private static group: Phaser.GameObjects.Group;

  private scene: Scene;
  private _fullname: string;
  private _white: boolean;
  private _position: Position;
  private _gameObject: Phaser.GameObjects.Image;

  constructor(scene: Scene, name: PIECE_NAME, white: boolean, position: Position) {
    this.scene = scene;
    this._position = position;
    this._fullname = `${name}_${white ? 'white' : 'black'}`;
    this._white = white;
    const coordinate = this.coordinate
    this._gameObject = this.scene.add.sprite(coordinate.x, coordinate.y, this.fullname).setName(`${Base.id++}`);
  }

  public get fullname(): string {
    return this._fullname;
  }

  public get white(): boolean {
    return this._white;
  }

  public get position(): Position {
    return this._position;
  }

  public get gameObject(): Phaser.GameObjects.Image {
    return this._gameObject;
  }

  public get coordinate() {
    return CoordinateHelper.getCoordinate(this._position);
  }

  abstract possibleMovements(): Position[]

  move() {
    const newPosition = CoordinateHelper.getPosition({ x: this._gameObject.x, y: this._gameObject.y });
    if (this.checkPosition(newPosition)) {
      this._position = newPosition;
      this.changeCoordinate();
      return true;
    }
    this.changeCoordinate();
    return false;
  }

  select() {
    this._gameObject.setTint(+import.meta.env.VITE_COLOR_TINT);
    Base.group = this.scene.add.group();
    const positions = this.possibleMovements();
    for (const position of positions) {
      const coordinate = CoordinateHelper.getCoordinate({ horizontal: position.horizontal, vertical: position.vertical });
      Base.group.add(this.scene.add.rectangle(coordinate.x, coordinate.y, SIZE_SQUARE, SIZE_SQUARE, +import.meta.env.VITE_COLOR_TINT, 0.25))
    }
  }

  deselect() {
    this._gameObject.clearTint();
    Base.group.destroy(true);
  }

  protected checkInbounds(position: Position) {
    if (position.horizontal <= 8 && position.horizontal >= 1 && position.vertical <= 8 && position.vertical >= 1) {
      return true;
    }
    return false;
  }

  private changeCoordinate() {
    const newCoordinate = this.coordinate;
    this._gameObject.setPosition(newCoordinate.x, newCoordinate.y);
  }

  private checkPosition(position: Position) {
    const locations = this.possibleMovements();
    return locations.some((location) =>
      location.vertical === position.vertical && location.horizontal === position.horizontal
    );
  }
}
