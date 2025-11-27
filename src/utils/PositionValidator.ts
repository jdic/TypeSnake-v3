import type { IBoardConfig, Position } from '@type/global'
import { MathUtils } from './MathUtils'

/**
 * PositionValidator provides methods to validate and generate positions
 * on a game board, ensuring they are within bounds and not occupied.
 */
export class PositionValidator
{
  private readonly board: IBoardConfig

  constructor(board: IBoardConfig)
  {
    this.board = board
  }

  /**
   * Generates a valid position that is not occupied by any of the provided positions.
   *
   * @param occupiedPositions - An array of positions that are currently occupied.
   * @param maxAttempts - The maximum number of attempts to find a valid position.
   * @returns A valid position as a tuple [x, y], or null if no valid position is found.
   */
  generateValidPosition(occupiedPositions: Position[] = [], maxAttempts?: number): Position | null
  {
    const attempts = maxAttempts ?? this.board.width * this.board.height
    let attemptCount = 0

    while (attemptCount < attempts)
    {
      const position = MathUtils.getRandomPosition(this.board.width, this.board.height)

      if (!this.isPositionOccupied(position, occupiedPositions))
      {
        return position
      }

      attemptCount++
    }

    return null
  }

  /**
   * Checks if a given position is occupied by any of the provided positions.
   *
   * @param position - The position to check as a tuple [x, y].
   * @param occupiedPositions - An array of positions that are currently occupied.
   * @returns True if the position is occupied, false otherwise.
   */
  isPositionOccupied(position: Position, occupiedPositions: Position[]): boolean
  {
    return occupiedPositions.some((occupiedPosition) =>
    {
      return MathUtils.positionsEqual(position, occupiedPosition)
    })
  }

  /**
   * Validates if a position is within the bounds of the board.
   *
   * @param position - The position to validate as a tuple [x, y].
   * @returns True if the position is valid, false otherwise.
   */
  isValidPosition(position: Position): boolean
  {
    const [x, y] = position

    return x >= 0 && x < this.board.width &&
      y >= 0 && y < this.board.height
  }

  /**
   * Wraps a position around the board dimensions.
   *
   * @param position - The position to wrap as a tuple [x, y].
   * @returns The wrapped position as a tuple [x, y].
   */
  getCenteredPosition(): Position
  {
    return [
      Math.floor(this.board.width / 2),
      Math.floor(this.board.height / 2)
    ]
  }

  /**
   * Wraps a position around the board dimensions.
   * This is useful for implementing a toroidal board where moving off one edge
   * brings the player to the opposite edge.
   *
   * @param position - The position to wrap as a tuple [x, y].
   * @returns A wrapped position as a tuple [x, y].
   */
  wrapPosition(position: Position): Position
  {
    return MathUtils.wrapPosition(position, this.board.width, this.board.height)
  }
}
