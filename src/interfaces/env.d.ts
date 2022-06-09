interface ImportMetaEnv {
    readonly VITE_SIZE_BOARD: string
    readonly VITE_SIZE_PIECE: string
    readonly VITE_COLOR_LINE: string
    readonly VITE_COLOR_BLACK_SQUARE: string
    readonly VITE_COLOR_WHITE_SQUARE: string
    readonly VITE_COLOR_TINT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}