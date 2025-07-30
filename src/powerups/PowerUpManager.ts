import { BonusStrategy, MagnetStrategy, SlowMotionStrategy,  InvincibilityStrategy, TeleportStrategy, BoostStrategy, FreezeStrategy } from '@powerups/PowerUpStrategies'
import type { PowerUpType, Position, IPowerUpConfig, IPowerUpSettings } from '@type/global'
import { PowerUp, type IPowerUpStrategy } from '@powerups/PowerUp'
import { MathUtils } from '@utils/MathUtils'

/**
 * Factory class for creating power-ups.
 * It maps power-up types to their corresponding strategies.
 */
export class PowerUpFactory
{
  /**
   * Maps power-up types to their strategies.
   * Each strategy is a function that returns an instance of IPowerUpStrategy.
   */
  private static strategyMap: Record<PowerUpType, (duration: number) => IPowerUpStrategy> =
  {
    magnet: (duration) => new MagnetStrategy(duration),
    slowMotion: (duration) => new SlowMotionStrategy(duration),
    bonus: (duration) => new BonusStrategy(duration),
    invincibility: (duration) => new InvincibilityStrategy(duration),
    teleport: (duration) => new TeleportStrategy(),
    boost: (duration) => new BoostStrategy(duration),
    freeze: (duration) => new FreezeStrategy(duration)
  }

  /**
   * Creates a power-up instance based on the provided position and type.
   * It uses the strategy map to determine the appropriate strategy for the power-up type.
   * 
   * @param position - The position of the power-up on the board.
   * @param type - The type of the power-up.
   * @param duration - The duration of the power-up effect.
   */
  static createPowerUp(position: Position, type: PowerUpType, duration = 2000): PowerUp
  {
    const strategy = this.strategyMap[type](duration)

    return new PowerUp(position, type, strategy)
  }

  /**
   * Returns a list of available power-up types.
   * 
   * @return An array of power-up types that can be created.
   */
  static getAvailableTypes(): PowerUpType[]
  {
    return Object.keys(this.strategyMap) as PowerUpType[]
  }
}

/**
 * Manager class for handling power-ups in the game.
 * It allows for generating, adding, removing, and managing active power-ups.
 */
export class PowerUpManager
{
  private activePowerUps: PowerUp[] = []
  private config: IPowerUpConfig
  private boardWidth: number
  private boardHeight: number

  constructor(config: IPowerUpConfig, boardWith: number, boardHeight: number)
  {
    this.config = config
    this.boardWidth = boardWith
    this.boardHeight = boardHeight
  }

  /**
   * Generates random power-ups based on the configuration and current occupied positions.
   * It ensures that new power-ups do not overlap with existing ones.
   * 
   * @param occupiedPositions - An array of positions that are currently occupied by other game elements.
   * @return An array of newly generated power-ups.
   */
  generateRandomPowerUps(occupiedPositions: Position[] = []): PowerUp[]
  {
    const newPowerUps: PowerUp[] = []
    
    for (const [type, settings] of Object.entries(this.config) as [PowerUpType, IPowerUpSettings][])
    {
      if (settings.enabled && MathUtils.shouldHappen(settings.probability))
      {
        const position = this.getValidPosition(occupiedPositions)

        if (position)
        {
          const powerUp = PowerUpFactory.createPowerUp(position, type, settings.duration)

          newPowerUps.push(powerUp)
          occupiedPositions.push(position)
        }
      }
    }

    return newPowerUps
  }

  /**
   * Adds a power-up to the active list if it does not already exist.
   * 
   * @param powerUp - The power-up to be added.
   */
  addPowerUp(powerUp: PowerUp): void
  {
    const existingIndex = this.activePowerUps.findIndex((p) => p.type === powerUp.type)

    if (existingIndex !== -1)
    {
      return
    }

    this.activePowerUps.push(powerUp)
  }

  /**
   * Removes a power-up from the active list by its type.
   * 
   * @param type - The type of the power-up to be removed.
   * @returns The removed power-up if found, otherwise null.
   */
  removePowerUp(type: PowerUpType): PowerUp | null
  {
    const index = this.activePowerUps.findIndex((p) => p.type === type)

    if (index !== -1)
    {
      return this.activePowerUps.splice(index, 1)[0]!
    }

    return null
  }

  /**
   * Finds a power-up by its position.
   * Returns the power-up if found, otherwise returns null.
   * 
   * @param position - The position to search for the power-up.
   * @returns The found power-up or null if not found.
   */
  findPowerUpAtPosition(position: Position): PowerUp | null
  {
    return this.activePowerUps.find((p) =>
    {
      return MathUtils.positionsEqual(p.position, position)
    }) || null
  }

  /**
   * Returns all active power-ups.
   * 
   * @return An array of currently active power-ups.
   */
  getActivePowerUps(): PowerUp[]
  {
    return [...this.activePowerUps]
  }

  /**
   * Clears all active power-ups.
   */
  clearAllPowerUps(): void
  {
    this.activePowerUps = []
  }

  /**
   * Updates the power-up configuration.
   * This allows for dynamic changes to the power-up settings during the game.
   * 
   * @param config - The new power-up configuration to apply.
   */
  updateConfig(config: IPowerUpConfig): void
  {
    this.config = config
  }

  /**
   * Returns the current power-up configuration.
   * 
   * @return The current power-up configuration.
   */
  private getValidPosition(occupiedPositions: Position[]): Position | null
  {
    let attempts = 0
    const maxAttempts = this.boardWidth * this.boardHeight

    while (attempts < maxAttempts)
    {
      const position = MathUtils.getRandomPosition(this.boardWidth, this.boardHeight)

      if (!occupiedPositions.some((p) => MathUtils.positionsEqual(p, position)))
      {
        return position
      }

      attempts++
    }

    return null
  }
}
