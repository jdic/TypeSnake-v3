import type { Position } from '../types/global'
import { MathUtils } from '../utils/MathUtils'

/**
 * Represents an Apple entity in the game.
 * The Apple can respawn at a new position on the board.
 */
export class Apple
{
  private position: Position
  private readonly boardWidth: number
  private readonly boardHeight: number

  constructor(boardWidth: number, boardHeight: number)
  {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    this.position = this.generateNewPosition()
  }

  /**
   * Returns the current position of the Apple.
   * 
   * @return The position of the Apple as a tuple [x, y].
   */
  getPosition(): Position
  {
    return [...this.position] as Position
  }

  /**
   * Respawns the Apple at a new position.
   * It ensures that the new position does not overlap with any occupied positions.
   * 
   * @param occupiedPositions - An array of positions that are currently occupied.
   */
  respawn(occupiedPositions: Position[] = []): void
  {
    let newPosition: Position
    let attempts = 0

    const maxAttempts = this.boardWidth * this.boardHeight

    do
    {
      newPosition = this.generateNewPosition()
      attempts++
    }

    while (
      attempts < maxAttempts &&
      occupiedPositions.some((_position) => MathUtils.positionsEqual(_position, newPosition))
    )

    this.position = newPosition
  }

  /**
   * Checks if the Apple is at a specific position.
   * 
   * @param position - The position to check against the Apple.
   * @return True if the Apple is at the specified position, otherwise false.
   */
  isAtPosition(position: Position): boolean
  {
    return MathUtils.positionsEqual(this.position, position)
  }

  /**
   * Generates a new random position for the Apple.
   * 
   * @return A new position as a tuple [x, y].
   */
  private generateNewPosition(): Position
  {
    return MathUtils.getRandomPosition(this.boardWidth, this.boardHeight)
  }
}
