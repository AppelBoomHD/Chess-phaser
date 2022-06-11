import { Scene } from "phaser";
import { PIECE_NAME } from "../../environment";
import { CoordinateHelper } from "../../helpers/coordinateHelper";
import { Position } from "../../interfaces/position";

export abstract class Base {
  private static id = 0;
  private _fullname: string;
  private _white: boolean;
  private _position: Position;
  private _gameObject: Phaser.GameObjects.Image;

  constructor(scene: Scene, name: PIECE_NAME, white: boolean, position: Position) {
    this._position = position;
    this._fullname = `${name}_${white ? 'white' : 'black'}`;
    this._white = white;
    const coordinate = this.coordinate
    this._gameObject = scene.add.sprite(coordinate.x, coordinate.y, this.fullname).setName(`${Base.id++}`);
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
  }

  deselect() {
    this._gameObject.clearTint();
  }

  protected checkInbounds(position: Position) {
    if (position.horizontal <= 8 && position.horizontal >= 1 && position.vertical <= 8 && position.vertical >= 1) {
      return true;
    }
    return false;
  }

  protected checkdiagonalSpace() {
    var possiblepositions = [];
    const possiblePostion = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    var i = 1;
    while (this.checkInbounds(possiblePostion)) {
      possiblePostion.horizontal = possiblePostion.horizontal + i
      possiblePostion.vertical = possiblePostion.vertical + i
      if (this.checkInbounds(possiblePostion)) {
        possiblepositions.push(possiblePostion)
      }
      i++
    }
    i = 1;

    var possiblePostion1 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    while (this.checkInbounds(possiblePostion1)) {
      possiblePostion1 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
      possiblePostion1.horizontal = possiblePostion1.horizontal - i
      possiblePostion1.vertical = possiblePostion1.vertical - i
      if (this.checkInbounds(possiblePostion1)) {
        possiblepositions.push(possiblePostion1)
      }
      i++
    }
    i = 1;
    var possiblePostion2 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    while (this.checkInbounds(possiblePostion2)) {
      possiblePostion2 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
      possiblePostion2.horizontal = possiblePostion2.horizontal + i
      possiblePostion2.vertical = possiblePostion2.vertical - i
      if (this.checkInbounds(possiblePostion2)) {
        possiblepositions.push(possiblePostion2)
      }
      i++
    }
    i = 1
    var possiblePostion3 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    while (this.checkInbounds(possiblePostion3)) {
      possiblePostion3 = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
      possiblePostion3.horizontal = possiblePostion3.horizontal - i;
      possiblePostion3.vertical = possiblePostion3.vertical + i;
      if (this.checkInbounds(possiblePostion3)) {
        possiblepositions.push(possiblePostion3)
      }
      i++
    }
    return possiblepositions;
  }

  protected checkStraightSpace() {
    var possiblepositions = [];
    var possiblePosition = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    var i = 1;
    while (this.checkInbounds(possiblePosition)) {
      possiblePosition.horizontal + i
      if (this.checkInbounds(possiblePosition)) {
        possiblepositions.push(possiblePosition)
      }
      i++;
    }
    var possiblePosition = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    var i = 1;
    while (this.checkInbounds(possiblePosition)) {
      possiblePosition.vertical + i
      if (this.checkInbounds(possiblePosition)) {
        possiblepositions.push(possiblePosition)
      }
      i++;
    }
    var possiblePosition = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    var i = 1;
    while (this.checkInbounds(possiblePosition)) {
      possiblePosition.horizontal - i
      if (this.checkInbounds(possiblePosition)) {
        possiblepositions.push(possiblePosition)
      }
      i++;
    }
    var possiblePosition = { horizontal: this.position.horizontal, vertical: this.position.vertical } as Position;
    var i = 1;
    while (this.checkInbounds(possiblePosition)) {
      possiblePosition.horizontal - i
      if (this.checkInbounds(possiblePosition)) {
        possiblepositions.push(possiblePosition)
      }
      i++;
    }
    return possiblepositions;
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
