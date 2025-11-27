import type { IPowerUpContext, IPowerUpStrategy } from '@powerups/PowerUp'
import { TimeManager } from '@utils/TimeManager'

/**
 * Abstract base class for power-up strategies that have a duration.
 *
 * Handles common timer management and provides template methods for apply/remove logic.
 */
export abstract class BasePowerUpStrategy implements IPowerUpStrategy
{
  protected timeManager = new TimeManager()
  protected readonly duration: number

  constructor(duration: number)
  {
    this.duration = duration
  }

  /**
   * Applies the power-up effect and sets a timer to remove it after the duration.
   *
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    this.applyEffect(context)

    if (this.duration > 0)
    {
      this.timeManager.setTimeout(() =>
      {
        this.remove(context)
      }, this.duration)
    }
  }

  /**
   * Removes the power-up effect and clears all timers.
   *
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    this.removeEffect(context)
    this.timeManager.clearAll()
  }

  /**
   * Gets the duration of the power-up.
   *
   * @returns The duration in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }

  /**
   * Abstract method to apply the specific power-up effect.
   * Must be implemented by subclasses.
   *
   * @param context - The context in which the power-up is applied.
   */
  protected abstract applyEffect(context: IPowerUpContext): void

  /**
   * Abstract method to remove the specific power-up effect.
   * Must be implemented by subclasses.
   *
   * @param context - The context in which the power-up is applied.
   */
  protected abstract removeEffect(context: IPowerUpContext): void
}

/**
 * Base class for power-up strategies that don't have a duration (instant effects).
 */
export abstract class InstantPowerUpStrategy implements IPowerUpStrategy
{
  /**
   * Applies the instant power-up effect.
   *
   * @param context The power-up context
   */
  apply(context: IPowerUpContext): void
  {
    this.applyInstantEffect(context)
  }

  /**
   * No-op for instant power-ups since they don't have ongoing effects.
   *
   * @param context The power-up context
   */
  remove(context: IPowerUpContext): void
  {
    if (context)
    {
      // Instant power-ups don't need removal
    }
  }

  /**
   * Returns 0 for instant power-ups since they don't have duration.
   *
   * @returns 0
   */
  getDuration(): number
  {
    return 0
  }

  /**
   * Template method for applying the instant effect.
   * Subclasses must implement this method.
   *
   * @param context The power-up context
   */
  protected abstract applyInstantEffect(context: IPowerUpContext): void
}
