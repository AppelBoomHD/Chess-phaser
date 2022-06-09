const NUM_SQUARES = 8;
const MAX_PIECE_SIZE = 1850;
export const SIZE_SQUARE = +import.meta.env.VITE_SIZE_BOARD / NUM_SQUARES;
export const SIZE_PIECE = +import.meta.env.VITE_SIZE_BOARD / MAX_PIECE_SIZE * +import.meta.env.VITE_SIZE_PIECE;
export enum PIECE_NAME {
    PAWN = 'pawn',
    ROOK = 'rook',
    KNIGHT_LEFT = 'knight_left',
    KNIGHT_RIGHT = 'knight_right',
    BISHOP = 'bishop',
    QUEEN = 'queen',
    KING = 'king'
}