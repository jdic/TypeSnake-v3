import type { IGameState, IPowerUp, Position, PowerUpType } from '@type/global'

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
   * 
   * @returns The current game state as an IGameState object.
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
  updatePowerUps(powerUps: IPowerUp[]): void
  {
    this.state.powerUps = [...powerUps]
  }

  /**
   * Updates the active power-ups in the game state.
   * This method replaces the current list of active power-ups with a new one.
   * 
   * @param activePowerUps - An array of active power-up types to set in the game state.
   */
  updateActivePowerUps(activePowerUps: PowerUpType[])
  {
    this.state.activePowerUps = [...activePowerUps]
  }

  /**
   * Adds a new active power-up to the game state.
   * This method ensures that the power-up type is not already active.
   * 
   * @param powerUpType - The type of power-up to add as active.
   */
  addActivePowerUp(powerUpType: PowerUpType): void
  {
    if (!this.state.activePowerUps.includes(powerUpType))
    {
      this.state.activePowerUps.push(powerUpType)
    }
  }

  /**
   * Removes an active power-up from the game state.
   * This method will remove the specified power-up type if it exists in the active list.
   * 
   * @param powerUpType - The type of power-up to remove from active status.
   */
  removeActivePowerUp(powerUpType: PowerUpType): void
  {
    const index = this.state.activePowerUps.indexOf(powerUpType)

    if (index > -1)
    {
      this.state.activePowerUps.splice(index, 1)
    }
  }

  /**
   * Sets the game over state.
   * This method marks the game as over.
   * 
   * @param isGameOver - If true, the game will be marked as over.
   */
  setGameOver(isGameOver: boolean): void
  {
    this.state.isGameOver = isGameOver
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
   * 
   * @returns True if the game is over, false otherwise.
   */
  isGameOver(): boolean
  {
    return this.state.isGameOver
  }

  /**
   * Checks if the game is paused.
   * Returns true if the game is currently paused, otherwise false.
   * 
   * @returns True if the game is paused, false otherwise.
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
      activePowerUps: [],
      ...initialState,
    }
  }

  /**
   * Clones the current game state.
   * This method creates a deep copy of the current state, allowing for state snapshots.
   * 
   * @returns A deep copy of the current game state.
   */
  clone(): IGameState
  {
    return JSON.parse(JSON.stringify(this.state))
  }
}
