import { PositionValidator } from '@utils/PositionValidator'
import type { IBoardConfig, Position } from '@type/global'
import { MathUtils } from '@utils/MathUtils'

/**
 * Represents an Apple entity in the game.
 * The Apple can respawn at a new position on the board.
 */
export class Apple
{
  private position: Position
  private positionValidator: PositionValidator

  constructor(board: IBoardConfig)
  {
    this.positionValidator = new PositionValidator(board)
    this.position = this.generateNewPosition()
  }

  /**
   * Returns the current position of the Apple.
   * 
   * @returns The position of the Apple as a tuple [x, y].
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
    const newPosition = this.positionValidator.generateValidPosition(occupiedPositions)

    if (newPosition)
    {
      this.position = newPosition
    }

    else
    {
      this.position = this.generateNewPosition()
    }
  }

  /**
   * Checks if the Apple is at a specific position.
   * 
   * @param position - The position to check against the Apple.
   * @returns True if the Apple is at the specified position, otherwise false.
   */
  isAtPosition(position: Position): boolean
  {
    return MathUtils.positionsEqual(this.position, position)
  }

  /**
   * Generates a new random position for the Apple.
   * 
   * @returns A new position as a tuple [x, y].
   */
  private generateNewPosition(): Position
  {
    return this.positionValidator.generateValidPosition() || [0, 0]
  }
}
