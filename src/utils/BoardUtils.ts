import type { IBoardConfig, Position } from '@type/global'

/**
 * BoardUtils provides utility methods for working with game boards,
 * such as calculating the center position and total number of cells.
 */
export class BoardUtils
{
  /**
   * Gets the center position of a board.
   * @param board Board configuration
   * @returns Center position as [x, y]
   */
  static getCenter(board: IBoardConfig): Position
  {
    return [
      Math.floor(board.width / 2),
      Math.floor(board.height / 2)
    ]
  }

  /**
   * Gets the total number of cells on a board.
   * @param board Board configuration
   * @returns Total cell count
   */
  static getTotalCells(board: IBoardConfig): number
  {
    return board.width * board.height
  }
}
