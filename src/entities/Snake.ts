import type { Direction, Position } from '../types/global'
import { MathUtils } from '../utils/MathUtils'

/**
 * Represents a Snake entity in the game.
 * The Snake can move, grow, and check for collisions with itself or other entities.
 */
export class Snake
{
  private segments: Position[]
  private direction: Direction
  private readonly boardWidth: number
  private readonly boardHeight: number

  constructor(initialPosition: Position, boardWidth: number, boardHeight: number)
  {
    this.segments = [initialPosition]
    this.direction = [0, -1]
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
  }

  /**
   * Returns the current position of the Snake's head.
   * 
   * @return The position of the Snake's head as a tuple [x, y].
   */
  getHead(): Position
  {
    return this.segments[0]!
  }

  /**
   * Returns the current segments of the Snake.
   * 
   * @return An array of positions representing the Snake's segments.
   */
  getSegments(): Position[]
  {
    return [...this.segments]
  }

  /**
   * Returns the current direction of the Snake.
   * 
   * @return The direction of the Snake as a tuple [dx, dy].
   */
  getDirection(): Direction
  {
    return [...this.direction] as Direction
  }

  /**
   * Sets the direction of the Snake.
   * It prevents the Snake from reversing direction if it has more than one segment.
   * 
   * @param newDirection - The new direction to set as a tuple [dx, dy].
   */
  setDirection(newDirection: Direction): void
  {
    if (this.segments.length > 1)
    {
      const oppositeDirection: Direction = [-this.direction[0], -this.direction[1]]

      if (MathUtils.positionsEqual(newDirection, oppositeDirection))
      {
        return
      }
    }

    this.direction = newDirection
  }

  /**
   * Moves the Snake in its current direction.
   * It adds a new head segment and removes the tail segment.
   * 
   * @return The position of the removed tail segment as a tuple [x, y].
   */
  move(): Position
  {
    const head = this.getHead()

    const newHead: Position =
    [
      head[0] + this.direction[0],
      head[1] + this.direction[1]
    ]

    const wrappedHead = MathUtils.wrapPosition(newHead, this.boardWidth, this.boardHeight)
    this.segments.unshift(wrappedHead)

    const tail = this.segments.pop()!

    return tail
  }

  /**
   * Grows the Snake by adding a new segment at the tail position.
   * 
   * @param tailPosition - The position of the tail segment to add as a new segment.
   */
  grow(tailPosition: Position): void
  {
    this.segments.push(tailPosition)
  }

  /**
   * Checks if the Snake has collided with itself.
   * 
   * @return True if the Snake has collided with itself, false otherwise.
   */
  checkSelfCollision(): boolean
  {
    const head = this.getHead()

    return this.segments.slice(1).some((segment) =>
    {
      return MathUtils.positionsEqual(head, segment)
    })
  }

  /**
   * Checks if the Snake occupies a specific position.
   * 
   * @param position - The position to check as a tuple [x, y].
   * @return True if the Snake occupies the specified position, false otherwise.
   */
  occupiesPosition(position: Position): boolean
  {
    return this.segments.some((segment) =>
    {
      return MathUtils.positionsEqual(segment, position)
    })
  }

  /**
   * Returns the length of the Snake.
   * 
   * @return The number of segments in the Snake.
   */
  getLength(): number
  {
    return this.segments.length
  }

  /**
   * Resets the Snake to its initial state.
   * 
   * @param initialPosition - The initial position of the Snake's head as a tuple [x, y].
   */
  reset(initialPosition: Position): void
  {
    this.segments = [initialPosition]
    this.direction = [0, -1]
  }
}
