import { SIZE_SQUARE } from '../environment';
import Coordinate from '../interfaces/coordinate';
import Position from '../interfaces/position';

export default class CoordinateHelper {
  static getPosition(coordinate: Coordinate) {
    const horizontal = Math.floor(coordinate.x / SIZE_SQUARE) + 1;
    const vertical = -Math.floor(coordinate.y / SIZE_SQUARE) + 8;
    return {
      horizontal,
      vertical,
    } as Position;
  }

  static getCoordinate(position: Position) {
    const x = (position.horizontal - 1) * SIZE_SQUARE + SIZE_SQUARE / 2;
    const y = -position.vertical * SIZE_SQUARE + SIZE_SQUARE / 2 + +import.meta.env.VITE_SIZE_BOARD;
    return {
      x,
      y,
    } as Coordinate;
  }
}
