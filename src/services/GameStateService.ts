import type { IGameState, Position } from '@type/global'

/**
 * GameStateService manages the state of the game, including
 * the snake, apple, score, power-ups, and game status.
 * 
 * It provides methods to update and retrieve the current state,
 * reset the game, and check if the game is over or paused.
 */
export class GameStateService
{
  private state: IGameState

  constructor(initialState: IGameState)
  {
    this.state = { ...initialState }
  }

  /**
   * Returns the current game state.
   * 
   * This method provides a snapshot of the game's current status, including
   * the snake's position, apple's position, score, and power-ups.
   */
  getState(): IGameState
  {
    return { ...this.state }
  }

  /**
   * Updates the snake's position in the game state.
   * 
   * @param snake - The new position of the snake as an array of positions.
   */
  updateSnake(snake: Position[]): void
  {
    this.state.snake = [...snake]
  }

  /**
   * Updates the apple's position in the game state.
   * 
   * @param position - The new position of the apple.
   */
  updateApple(position: Position): void
  {
    this.state.apple = [...position] as Position
  }

  /**
   * Updates the score in the game state.
   * Ensures that the score does not go below zero.
   * 
   * @param score - The new score to set.
   */
  updateScore(score: number): void
  {
    this.state.score = Math.max(0, score)
  }

  /**
   * Increments the score by a specified number of points.
   * This method is used when the snake eats an apple or collects a bonus.
   * 
   * @param points - The number of points to add to the score.
   */
  incrementScore(points: number): void
  {
    this.state.score += points
  }

  /**
   * Updates the power-ups in the game state.
   * This method replaces the current list of power-ups with a new one.
   * 
   * @param powerUps - An array of power-ups to set in the game state.
   */
  updatePowerUps(powerUps: any[]): void
  {
    this.state.powerUps = [...powerUps]
  }

  /**
   * Sets the game over state.
   * This method marks the game as over and can also pause the game.
   * 
   * @param isPaused - If true, the game will be paused instead of marked as over.
   */
  setGameOver(isPaused: boolean): void
  {
    this.state.isPaused = isPaused
  }

  /**
   * Sets the paused state of the game.
   * 
   * @param isPaused - If true, the game will be paused.
   */
  setPaused(isPaused: boolean): void
  {
    this.state.isPaused = isPaused
  }

  /**
   * Checks if the game is over.
   * Returns true if the game is marked as over, otherwise false.
   */
  isGameOver(): boolean
  {
    return this.state.isGameOver
  }

  /**
   * Checks if the game is paused.
   * Returns true if the game is currently paused, otherwise false.
   */
  isPaused(): boolean
  {
    return this.state.isPaused
  }

  /**
   * Resets the game state to its initial configuration.
   * This method clears the current state and sets it to the provided initial state.
   * 
   * @param initialState - The initial state to reset the game to.
   */
  reset(initialState: Partial<IGameState>): void
  {
    this.state =
    {
      snake: initialState.snake || [[10, 10]],
      apple: initialState.apple || [5, 5],
      score: 0,
      powerUps: [],
      isGameOver: false,
      isPaused: false,
      ...initialState,
    }
  }

  /**
   * Clones the current game state.
   * This method creates a deep copy of the current state, allowing for state snapshots.
   */
  clone(): IGameState
  {
    return JSON.parse(JSON.stringify(this.state))
  }
}
