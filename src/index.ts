import { Game,Position } from './ChessGame'

let game = new Game()
let position1 = new Position(1,1)
let position2 = new Position(2,3)

let moveTrace = game.createMoveTrace(position1,position2)

for(const position of moveTrace) {
    console.log('File: ' + position.getFile() + ' Rank: ' + position.getRank())
}