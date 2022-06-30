const fileSize = 8
const rankSize = 8
type Color = 'Black' | 'White'
enum File {
    'A' = 1,
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H'
}
enum Rank {
    'r1' = 1,
    'r2',
    'r3',
    'r4',
    'r5',
    'r6',
    'r7',
    'r8'
}

class Player {
    public pieces: Piece[]
    constructor(
        private color: Color,
        pieces: Piece[],
    ) {
        this.pieces = pieces
    }

    removePiece(piece: Piece) {
        let index = this.pieces.indexOf(piece)
        if(index) {
            this.pieces.splice(index,1);
        } else {
            throw "Function may have been used for the wrong player!"
        }
    }

    getColor() {
        return this.color
    }
}

export class Game {
    protected pieces = Game.makePieces()


    private playerWhite: Player
    private playerBlack: Player


    constructor() {
        this.playerWhite = new Player('White',this.pieces.splice(0,15))
        this.playerBlack = new Player('Black',this.pieces.splice(16,31))
    }

    private static makeBoard() {
        let ret = new Map<Position, Piece>()
        for (let i = 0; i < fileSize; i++) {
            for (let j = 0; j < rankSize; j++) {
                let position = new Position(i,j)
            }
        }
    }
    private static makePieces() {
        return[
            //16 Player White Pieces
            new King('White',File.E, 1),
            new Queen('White', File.D, 1),
            new Bishop('White',File.C, 1),
            new Bishop('White',File.F, 1),
            new Knight('White',File.B,1),
            new Knight('White',File.G,1),
            new Rook('White',File.A,1),
            new Rook('White',File.H,1),
            new Pawn('White',File.A,2),
            new Pawn('White',File.B,2),
            new Pawn('White',File.C,2),
            new Pawn('White',File.D,2),
            new Pawn('White',File.E,2),
            new Pawn('White',File.F,2),
            new Pawn('White',File.G,2),
            new Pawn('White',File.H,2),

            //16 Player Black Pieces
            new King('Black',File.E, 8),
            new Queen('Black', File.D, 8),
            new Bishop('Black',File.C, 8),
            new Bishop('Black',File.F, 8),
            new Knight('Black',File.B,8),
            new Knight('Black',File.G,8),
            new Rook('Black',File.A,8),
            new Rook('Black',File.H,8),
            new Pawn('Black',File.A,7),
            new Pawn('Black',File.B,7),
            new Pawn('Black',File.C,7),
            new Pawn('Black',File.D,7),
            new Pawn('Black',File.E,7),
            new Pawn('Black',File.F,7),
            new Pawn('Black',File.G,7),
            new Pawn('Black',File.H,7),
        ]
    }
    private static getPlayerPieceByPosition(player: Player, position: Position) {
        for (const piece of player.pieces) {
            if(piece.position == position) {
                return piece
            }
        }
        return undefined
    }


    private static isPositionOccupiedByPlayer(player: Player, position: Position) {
        for (const piece of player.pieces) {
            if(piece.position == position) {
                return piece
            }
        }
        return false
    }

    isPositionOccupied(position: Position) {
        for (const piece of this.pieces) {
            if(piece.position == position) {
                return piece
            }
        }
        return false
    }

    isMoveObstructed(fromPosition: Position,toPosition: Position, game: Game) {
        let distance = fromPosition.distanceFrom(toPosition)
        if(distance.file == distance.rank) {

        }
    }

    movePlayerPieceTo(player: Player, piecePosition: Position, position: Position) {
        let piece = Game.getPlayerPieceByPosition(player,piecePosition)
        if(piece?.canMoveTo(position)) {
            let opponent = player.getColor() == "White" ? this.playerBlack : this.playerWhite
            let opponentPiece = Game.isPositionOccupiedByPlayer(opponent,position)
            if(opponentPiece) {
                opponent.removePiece(opponentPiece)
            } else if(Game.isPositionOccupiedByPlayer(player,position)) {
                console.log("Player cannot strike his own pieces!")
            }
            piece?.moveTo(position)
        }
    }

    * createMoveTrace(fromPosition: Position, toPosition: Position) {
        let currentPosition = fromPosition
        let distance = fromPosition.distanceFrom(toPosition)
        let fileMove = fromPosition.getFile() < toPosition.getFile() ? 1 : fromPosition.getFile() == toPosition.getFile() ? 0 : -1
        let rankMove = fromPosition.getRank() < toPosition.getRank() ? 1 : fromPosition.getFile() == toPosition.getFile() ? 0 : -1
        let absDistance = distance.file > distance.rank ? distance.file : distance.rank
        if(!(distance.file/distance.rank == 1 || distance.file/distance.rank == 0)) {
            console.log(
                "Move{%s%d to %s%d} is not possible",
                File[fromPosition.getFile()],fromPosition.getRank(),
                File[toPosition.getFile()],toPosition.getRank())
            return
        }
        for (let i = 0; i < absDistance + 1; i++) {
            yield currentPosition
            currentPosition = new Position(currentPosition.getFile() + fileMove, currentPosition.getRank() + rankMove)
        }

    }

    public static printBoard(board: Piece[]) {
        for(const piece of board) {
            console.log(piece)
        }
    }
}

abstract class Piece {
    public position: Position
    constructor(
        private readonly color: Color,
        file: File,
        rank: Rank
    ) {
        this.position = new Position(file,rank)
    }


    moveTo(position: Position) {
        this.position = position
    }
    abstract canMoveTo(position: Position): boolean


}

export class Position{
    constructor(
        private file: File,
        private rank: Rank
    ) {}
    distanceFrom(position: Position) {
        return {
            rank: Math.abs(position.rank - this.rank),
            file: Math.abs(position.file - this.file)
        }
    }
    getFile() {
        return this.file
    }
    getRank() {
        return this.rank
    }
}

class King extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return distance.rank < 2 && distance.file < 2
    }
}
class Queen extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return distance.rank == distance.file || distance.rank == 0 || distance.file == 0
    }
}
class Bishop extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return distance.rank == distance.file
    }
}
class Knight extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return (distance.rank == 2 && distance.file == 1) || (distance.file == 2 && distance.rank == 1)
    }
}
class Rook extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return (distance.rank == 0) != (distance.file == 0)
    }

}
class Pawn extends Piece {
    canMoveTo(position: Position): boolean {
        let distance = this.position.distanceFrom(position)
        return distance.rank < 2 && distance.file < 2
    }

}
