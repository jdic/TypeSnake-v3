import type { Position, PowerUpType, Range } from '@type/global'

export interface IPowerUpContext
{
  setRange(range: Range): void

  setUpdateTime(time: number): void
  getUpdateTime(): number

  setBackgroundIcon(icon: string): void
  getBackgroundIcon(): string

  setScorePerApple(score: number): void
  getScorePerApple(): number

  setInvincible(invincible: boolean): void
  isInvincible(): boolean

  teleportSnake(): void

  setGameFrozen(frozen: boolean): void
  isGameFrozen(): boolean

  getBoardDimensions(): { width: number, height: number }

  redraw(): void
  clearInterval(): void
  setInterval(callback: () => void, time: number): void
}

export interface IPowerUpStrategy
{
  apply(context: IPowerUpContext): void
  remove?(context: IPowerUpContext): void
  getDuration(): number
}

/**
 * Represents a power-up in the game.
 * Each power-up has a position, type, creation time, and a strategy for its effects.
 * The strategy defines how the power-up is applied and removed from the game context.
 */
export class PowerUp
{
  public readonly position: Position
  public readonly type: PowerUpType
  public readonly createdAt: number

  private strategy: IPowerUpStrategy

  constructor(position: Position, type: PowerUpType, strategy: IPowerUpStrategy)
  {
    this.position = position
    this.type = type
    this.createdAt = Date.now()
    this.strategy = strategy
  }

  /**
   * Applies the power-up strategy to the provided context.
   * This method invokes the strategy's apply method, which defines the power-up's effects.
   */
  apply(context: IPowerUpContext): void
  {
    this.strategy.apply(context)
  }

  /**
   * Removes the power-up strategy from the provided context.
   * If the strategy has a remove method, it will be called to clean up the effects of the power-up.
   */
  remove(context: IPowerUpContext): void
  {
    if (this.strategy.remove)
    {
      this.strategy.remove(context)
    }
  }

  /**
   * Returns the duration of the power-up effect.
   * This is defined by the strategy associated with the power-up.
   */
  getDuration(): number
  {
    return this.strategy.getDuration()
  }
}
