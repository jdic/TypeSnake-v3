import type { Position } from '@type/global'

/**
 * MathUtils provides utility functions for mathematical operations
 * related to the game, such as generating random positions, calculating distances,
 * and checking conditions.
 */
export class MathUtils
{
  /**
   * Generates a random position within the specified board dimensions.
   * 
   * @param maxWidth - The maximum width of the board.
   * @param maxHeight - The maximum height of the board.
   * @returns A random position represented as a tuple [x, y].
   */
  static getRandomPosition(maxWidth: number, maxHeight: number): Position
  {
    const getRandom = (max: number): number => Math.floor(Math.random() * max)

    return [getRandom(maxWidth), getRandom(maxHeight)]
  }

  /**
   * Calculates the Manhattan distance between two positions.
   * 
   * @param pos1 - The first position as a tuple [x, y].
   * @param pos2 - The second position as a tuple [x, y].
   * @returns The Manhattan distance between the two positions.
   */
  static manhattanDistance(pos1: Position, pos2: Position): number
  {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])
  }

  /**
   * Checks if two positions are equal.
   * 
   * @param pos1 - The first position as a tuple [x, y].
   * @param pos2 - The second position as a tuple [x, y].
   * @returns True if the positions are equal, false otherwise.
   */
  static positionsEqual(pos1: Position, pos2: Position): boolean
  {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1]
  }

  /**
   * Checks if a target position is within a specified range of a center position.
   * 
   * @param centerPos - The center position as a tuple [x, y].
   * @param targetPos - The target position as a tuple [x, y].
   * @param range - The range within which the target position should be checked.
   * @returns True if the target position is within the range of the center position, false otherwise.
   */
  static isInRange(centerPos: Position, targetPos: Position, range: number): boolean
  {
    const checkRange = (a: number, b: number): boolean => Math.abs(a - b) <= range

    return checkRange(centerPos[0], targetPos[0]) && checkRange(centerPos[1], targetPos[1])
  }

  /**
   * Wraps a position around the board dimensions.
   * This is useful for implementing a toroidal board where moving off one edge
   * brings the player to the opposite edge.
   * 
   * @param position - The position to wrap as a tuple [x, y].
   * @param boardWidth - The width of the board.
   * @param boardHeight - The height of the board.
   * @returns A wrapped position as a tuple [x, y].
   */
  static wrapPosition(position: Position, boardWidth: number, boardHeight: number): Position
  {
    const normalize = (pos: number, limit: number): number => (pos + limit) % limit

    return [normalize(position[0], boardWidth), normalize(position[1], boardHeight)]
  }

  /**
   * Generates a random integer between two values, inclusive.
   * 
   * @param min - The minimum value (inclusive).
   * @param max - The maximum value (inclusive).
   * @returns A random integer between min and max.
   */
  static randomBetween(min: number, max: number): number
  {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Determines if an event should happen based on a given probability.
   * 
   * @param probability - The probability of the event occurring (0 to 1).
   * @returns True if the event should happen, false otherwise.
   */
  static shouldHappen(probability: number): boolean
  {
    return Math.random() < probability
  }
}
