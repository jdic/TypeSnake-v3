import { DEFAULT_CONFIG } from '@config/defaults'
import type { IGameConfig } from '@type/global'

/**
 * A builder class for creating and modifying game configurations.
 * It allows setting various game parameters and building a complete configuration object.
 */
export class GameConfigBuilder
{
  private config: IGameConfig

  constructor()
  {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  }

  /**
   * Sets the difficulty level of the game.
   * 
   * @param difficulty - The difficulty level to set, e.g., 'easy', 'medium', 'hard'.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setDifficulty(difficulty: IGameConfig['game']['difficulty']): this
  {
    this.config.game.difficulty = difficulty

    return this
  }

  /**
   * Sets the size of the game board.
   * 
   * @param width - The width of the board.
   * @param height - The height of the board.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setBoardSize(width: number, height: number): this
  {
    this.config.board.width = width
    this.config.board.height = height

    return this
  }

  /**
   * Sets the score awarded for each apple collected.
   * 
   * @param score - The score to set for each apple.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setScorePerApple(score: number): this
  {
    this.config.game.scorePerApple = score

    return this
  }

  /**
   * Sets the update time for the game loop.
   * 
   * @param time - The update time in milliseconds.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setUpdateTime(time: number): this
  {
    this.config.game.updateTime = time

    return this
  }

  /**
   * Enables or disables a specific power-up type.
   * 
   * @param type - The type of power-up to enable or disable.
   * @param enabled - Whether to enable the power-up (default is true).
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  enablePowerUp(type: keyof IGameConfig['powerUps'], enabled: boolean = true): this
  {
    this.config.powerUps[type].enabled = enabled

    return this
  }

  /**
   * Sets the probability of a specific power-up appearing.
   * 
   * @param type - The type of power-up to set the probability for.
   * @param probability - The probability value between 0 and 1.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setPowerUpProbability(type: keyof IGameConfig['powerUps'], probability: number): this
  {
    this.config.powerUps[type].probability = Math.max(0, Math.min(1, probability))

    return this
  }

  /**
   * Sets the icon for a specific game element.
   * 
   * @param iconType - The type of icon to set.
   * @param icon - The icon string to set.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setIcon(iconType: keyof IGameConfig['icons'], icon: string): this
  {
    this.config.icons[iconType] = icon

    return this
  }

  /**
   * Sets the expanded range for the game.
   * 
   * @param range - The expanded range value.
   * @returns The current instance of GameConfigBuilder for method chaining.
   */
  setExpandedRange(range: number): this
  {
    this.config.game.expandedRange = Math.max(1, range)

    return this
  }

  /**
   * Builds and returns the complete game configuration object.
   * 
   * @returns The complete game configuration as an IGameConfig object.
   */
  build(): IGameConfig
  {
    return JSON.parse(JSON.stringify(this.config))
  }

  /**
   * Creates a GameConfigBuilder instance from a partial configuration object.
   * 
   * @param partialConfig - The partial configuration object to use.
   * @returns A new instance of GameConfigBuilder.
   */
  static fromPartialConfig(partialConfig: Partial<IGameConfig>): GameConfigBuilder
  {
    const builder = new GameConfigBuilder()
    
    if (partialConfig.board)
    {
      if (partialConfig.board.width)
      {
        builder.config.board.width = partialConfig.board.width
      }

      if (partialConfig.board.height)
      {
        builder.config.board.height = partialConfig.board.height
      }
    }

    if (partialConfig.game)
    {
      if (partialConfig.game.difficulty)
      {
        builder.config.game.difficulty = partialConfig.game.difficulty
      }

      if (partialConfig.game.scorePerApple)
      {
        builder.config.game.scorePerApple = partialConfig.game.scorePerApple
      }

      if (partialConfig.game.updateTime)
      {
        builder.config.game.updateTime = partialConfig.game.updateTime
      }

      if (partialConfig.game.expandedRange)
      {
        builder.config.game.expandedRange = partialConfig.game.expandedRange
      }
    }

    if (partialConfig.powerUps)
    {
      Object.entries(partialConfig.powerUps).forEach(([key, value]) =>
      {
        const powerUpKey = key as keyof IGameConfig['powerUps']
  
        if (value.enabled !== undefined)
        {
          builder.config.powerUps[powerUpKey].enabled = value.enabled
        }

        if (value.probability !== undefined)
        {
          builder.config.powerUps[powerUpKey].probability = value.probability
        }

        if (value.duration !== undefined)
        {
          builder.config.powerUps[powerUpKey].duration = value.duration
        }
      })
    }

    if (partialConfig.icons)
    {
      Object.entries(partialConfig.icons).forEach(([key, value]) =>
      {
        const iconKey = key as keyof IGameConfig['icons']

        builder.config.icons[iconKey] = value
      })
    }

    return builder
  }
}
