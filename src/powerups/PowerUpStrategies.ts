import { BasePowerUpStrategy, InstantPowerUpStrategy } from './BasePowerUpStrategy'
import type { IPowerUpContext } from '@powerups/PowerUp'

/**
 * Strategy for the Magnet power-up.
 * This power-up allows the snake to attract apples from a distance.
 * It applies a range effect that pulls apples towards the snake for a specified duration.
 * After the duration, it resets the range to regular.
 */
export class MagnetStrategy extends BasePowerUpStrategy
{
  constructor(duration: number = 2000)
  {
    super(duration)
  }

  protected override applyEffect(context: IPowerUpContext): void
  {
    context.setRange('expanded')
  }

  protected override removeEffect(context: IPowerUpContext): void
  {
    context.setRange('regular')
  }
}

/**
 * Strategy for the Slow Motion power-up.
 * This power-up slows down the game speed for a specified duration.
 * It temporarily increases the update time, making the game run slower.
 * After the duration, it resets the update time to its original value.
 */
export class SlowMotionStrategy extends BasePowerUpStrategy
{
  private orignalUpdateTime: number = 0

  constructor(duration: number = 2000)
  {
    super(duration)
  }

  protected override applyEffect(context: IPowerUpContext): void
  {
    this.orignalUpdateTime = context.getUpdateTime()

    const newUpdateTime = this.orignalUpdateTime + 200

    context.clearInterval()
    context.setInterval(() => {}, newUpdateTime)
  }

  protected override removeEffect(context: IPowerUpContext): void
  {
    context.clearInterval()
    context.setInterval(() => {}, this.orignalUpdateTime)
  }
}

/**
 * Strategy for the Bonus power-up.
 * 
 * This power-up temporarily increases the score per apple and changes the background icon.
 * 
 * It applies a flashing effect to the background icon for a specified duration.
 * 
 * After the duration, it resets the background icon and score per apple to their original values.
 */
export class BonusStrategy extends BasePowerUpStrategy
{
  private originalBackgroundIcon: string = ''
  private originalScorePerApple: number = 0
  private intervalId: Timer | null = null

  constructor(duration: number = 2000)
  {
    super(duration)
  }

  /**
   * Applies the bonus effect by changing the background icon and score per apple.
   * It sets an interval to flash the background icon for the duration of the power-up.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override applyEffect(context: IPowerUpContext): void
  {
    this.originalBackgroundIcon = context.getBackgroundIcon()
    this.originalScorePerApple = context.getScorePerApple()

    context.setScorePerApple(15)

    this.intervalId = this.timeManager.setInterval(() =>
    {
      const currentIcon = context.getBackgroundIcon()
      const newIcon = currentIcon === '🟦' ? '⬜' : '🟦'

      context.setBackgroundIcon(newIcon)
      context.redraw()
    }, context.getUpdateTime())
  }

  /**
   * Removes the bonus effect by resetting the background icon and score per apple.
   * It clears the flashing interval.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override removeEffect(context: IPowerUpContext): void
  {
    if (this.intervalId)
    {
      this.timeManager.clearInterval(this.intervalId)
      this.intervalId = null
    }

    context.setBackgroundIcon(this.originalBackgroundIcon)
    context.setScorePerApple(this.originalScorePerApple)
    context.redraw()
  }
}

/**
 * Strategy for the Invincibility power-up.
 * This power-up grants the snake invincibility for a specified duration.
 * While invincible, the snake cannot be harmed by collisions with itself or walls.
 */
export class InvincibilityStrategy extends BasePowerUpStrategy
{
  constructor(duration: number = 3000)
  {
    super(duration)
  }

  /**
   * Applies the invincibility effect by setting the snake to be invincible.
   * It uses a timeout to remove the invincibility after the specified duration.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override applyEffect(context: IPowerUpContext): void
  {
    context.setInvincible(true)
  }

  /**
   * Removes the invincibility effect by resetting the snake's invincibility status.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override removeEffect(context: IPowerUpContext): void
  {
    context.setInvincible(false)
  }
}

/**
 * Strategy for the Boost power-up.
 * This power-up temporarily increases the game speed by reducing the update time.
 * It applies a faster update interval for a specified duration.
 * After the duration, it resets the update time to its original value.
 */
export class BoostStrategy extends BasePowerUpStrategy
{
  private originalUpdateTime: number = 0

  constructor(duration: number = 2000)
  {
    super(duration)
  }

  /**
   * Applies the boost effect by reducing the update time.
   * It sets a new interval to increase the game speed.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override applyEffect(context: IPowerUpContext): void
  {
    this.originalUpdateTime = context.getUpdateTime()

    const newUpdateTime = Math.max(30, this.originalUpdateTime - 100)

    context.clearInterval()
    context.setInterval(() => {}, newUpdateTime)
  }

  /**
   * Removes the boost effect by resetting the update time to its original value.
   * It clears the interval set during the boost.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override removeEffect(context: IPowerUpContext): void
  {
    context.clearInterval()
    context.setInterval(() => {}, this.originalUpdateTime)
  }
}

/**
 * Strategy for the Teleport power-up.
 * This power-up allows the snake to teleport to a random position on the board.
 * It does not have a duration, as it applies the teleport effect immediately.
 */
export class TeleportStrategy extends InstantPowerUpStrategy
{
  /**
   * Applies the teleport effect by moving the snake to a random position on the board.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override applyInstantEffect(context: IPowerUpContext): void
  {
    context.teleportSnake()
  }
}

/**
 * Strategy for the Freeze power-up.
 * This power-up temporarily freezes the game, preventing any movements or actions.
 * It applies a freeze effect for a specified duration.
 * After the duration, it unfreezes the game.
 */
export class FreezeStrategy extends BasePowerUpStrategy
{
  constructor(duration: number = 1500)
  {
    super(duration)
  }

  /**
   * Applies the freeze effect by setting the game to a frozen state.
   * It uses a timeout to unfreeze the game after the specified duration.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override applyEffect(context: IPowerUpContext): void
  {
    context.setGameFrozen(true)
  }

  /**
   * Removes the freeze effect by unfreezing the game.
   * 
   * @param context - The context in which the power-up is applied.
   */
  protected override removeEffect(context: IPowerUpContext): void
  {
    context.setGameFrozen(false)
  }
}
