import { Movement, type Direction } from '@type/global'
import * as readline from 'readline'

/**
 * InputService handles keyboard input for the game.
 * 
 * It allows for key press events to be registered and processed,
 * enabling control over the game through keyboard interactions.
 */
export class InputService
{
  private keyHandlers: Map<string, () => void> = new Map()
  private isInitialized = false

  /**
   * Initializes the input service.
   */
  initialize(): void
  {
    if (this.isInitialized) return

    readline.emitKeypressEvents(process.stdin)

    if (process.stdin.isTTY)
    {
      process.stdin.setRawMode(true)
    }

    process.stdin.on('keypress', (_, key) =>
    {
      if (key && key.name)
      {
        const handler = this.keyHandlers.get(key.name)

        if (handler) handler()

        if (String(key.name).toLowerCase() === 'c' && key.ctrl)
        {
          process.exit(0)
        }
      }
    })

    this.isInitialized = true
  }

  /**
   * Registers a key press handler for a specific key.
   * 
   * @param key - The key to listen for.
   * @param handler - The function to call when the key is pressed.
   */
  onKeyPress(key: string, handler: () => void): void
  {
    this.keyHandlers.set(key, handler)
  }

  /**
   * Registers handlers for movement keys.
   * 
   * This method maps movement keys to their corresponding directions.
   * It allows for easy control of the game character's movement.
   * 
   * @param onDirectionChange - Callback function to handle direction changes.
   */
  onMovement(onDirectionChange: (direction: Direction) => void): void
  {
    const movements: Record<Movement, Direction> =
    {
      [Movement.Up]: [0, -1],
      [Movement.Down]: [0, 1],
      [Movement.Left]: [-1, 0],
      [Movement.Right]: [1, 0],
    }

    Object.entries(movements).forEach(([key, direction]) =>
    {
      this.onKeyPress(key, () => onDirectionChange(direction))
    })
  }

  /**
   * Clears all registered key handlers.
   */
  clearHandlers(): void
  {
    this.keyHandlers.clear()
  }

  /**
   * Destroys the input service.
   * This method cleans up the input service by removing all handlers and resetting the state.
   */
  destroy(): void
  {
    if (this.isInitialized && process.stdin.isTTY)
    {
      process.stdin.setRawMode(false)
    }

    this.clearHandlers()
    this.isInitialized = false
  }
}
