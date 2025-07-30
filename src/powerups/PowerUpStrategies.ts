import type { IPowerUpContext, IPowerUpStrategy } from '@powerups/PowerUp'

/**
 * Strategy for the Magnet power-up.
 * This power-up allows the snake to attract apples from a distance.
 * It applies a range effect that pulls apples towards the snake for a specified duration.
 * After the duration, it resets the range to regular.
 */
export class MagnetStrategy implements IPowerUpStrategy
{
  private duration: number

  constructor(duration: number = 2000)
  {
    this.duration = duration
  }

  /**
   * Applies the magnet effect by setting the range to 'expanded'.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    context.setRange('expanded')

    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the magnet effect by resetting the range to 'regular'.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    context.setRange('regular')
  }

  /**
   * Returns the duration of the magnet effect.
   * 
   * @returns The duration of the magnet effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }
}

/**
 * Strategy for the Slow Motion power-up.
 * This power-up slows down the game speed for a specified duration.
 * It temporarily increases the update time, making the game run slower.
 * After the duration, it resets the update time to its original value.
 */
export class SlowMotionStrategy implements IPowerUpStrategy
{
  private duration: number
  private originalUpdateTime: number = 0
  private intervalId: Timer | null  = null

  constructor(duration: number = 2000)
  {
    this.duration = duration
  }

  /**
   * Applies the slow motion effect by increasing the update time.
   * It sets a new interval to slow down the game speed.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    this.originalUpdateTime = context.getUpdateTime()

    const newUpdateTime = this.originalUpdateTime + 200

    context.clearInterval()
    context.setInterval(() => {}, newUpdateTime)
    
    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the slow motion effect by resetting the update time to its original value.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext)
  {
    context.clearInterval()
    context.setInterval(() => {}, this.originalUpdateTime)
  }

  /**
   * Returns the duration of the slow motion effect.
   * 
   * @returns The duration of the slow motion effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration    
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
export class BonusStrategy implements IPowerUpStrategy
{
  private duration: number
  private originalBackgroundIcon: string = ''
  private originalScorePerApple: number = 0
  private intervalId: Timer | null = null

  constructor(duration: number = 2000)
  {
    this.duration = duration
  }

  /**
   * Applies the bonus effect by changing the background icon and score per apple.
   * It sets an interval to flash the background icon for the duration of the power-up.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    this.originalBackgroundIcon = context.getBackgroundIcon()
    this.originalScorePerApple = context.getScorePerApple()

    context.setScorePerApple(15)

    this.intervalId = setInterval(() =>
    {
      const currentIcon = context.getBackgroundIcon()
      const newIcon = currentIcon === '🟦' ? '⬜' : '🟦'

      context.setBackgroundIcon(newIcon)
      context.redraw()
    }, context.getUpdateTime())

    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the bonus effect by resetting the background icon and score per apple.
   * It clears the flashing interval.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    if (this.intervalId)
    {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    context.setBackgroundIcon(this.originalBackgroundIcon)
    context.setScorePerApple(this.originalScorePerApple)
    context.redraw()
  }

  /**
   * Returns the duration of the bonus effect.
   * 
   * @returns The duration of the bonus effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }
}

/**
 * Strategy for the Invincibility power-up.
 * This power-up grants the snake invincibility for a specified duration.
 * While invincible, the snake cannot be harmed by collisions with itself or walls.
 */
export class InvincibilityStrategy implements IPowerUpStrategy
{
  private duration: number

  constructor(duration: number = 3000)
  {
    this.duration = duration
  }

  /**
   * Applies the invincibility effect by setting the snake to be invincible.
   * It uses a timeout to remove the invincibility after the specified duration.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    context.setInvincible(true)
    
    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the invincibility effect by resetting the snake's invincibility status.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    context.setInvincible(false)
  }

  /**
   * Returns the duration of the invincibility effect.
   * 
   * @returns The duration of the invincibility effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }
}

/**
 * Strategy for the Boost power-up.
 * This power-up temporarily increases the game speed by reducing the update time.
 * It applies a faster update interval for a specified duration.
 * After the duration, it resets the update time to its original value.
 */
export class BoostStrategy implements IPowerUpStrategy
{
  private duration: number
  private originalUpdateTime: number = 0

  constructor(duration: number = 2000)
  {
    this.duration = duration
  }

  /**
   * Applies the boost effect by reducing the update time.
   * It sets a new interval to increase the game speed.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    this.originalUpdateTime = context.getUpdateTime()

    const newUpdateTime = Math.max(30, this.originalUpdateTime - 100)

    context.clearInterval()
    context.setInterval(() => {  }, newUpdateTime)

    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the boost effect by resetting the update time to its original value.
   * It clears the interval set during the boost.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    context.clearInterval()
    context.setInterval(() => {  }, this.originalUpdateTime)
  }

  /**
   * Returns the duration of the boost effect.
   * 
   * @returns The duration of the boost effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }
}

/**
 * Strategy for the Teleport power-up.
 * This power-up allows the snake to teleport to a random position on the board.
 * It does not have a duration, as it applies the teleport effect immediately.
 */
export class TeleportStrategy implements IPowerUpStrategy
{
  constructor()
  {

  }

  /**
   * Applies the teleport effect by moving the snake to a random position on the board.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    context.teleportSnake()
  }

  /**
   * Removes the teleport effect.
   * Since teleportation is instantaneous, this method does not perform any action.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(): void
  {

  }

  /**
   * Returns the duration of the teleport effect.
   * Since teleportation is instantaneous, it returns zero.
   * 
   * @returns The duration of the teleport effect in milliseconds.
   */
  getDuration(): number
  {
    return 0
  }
}

/**
 * Strategy for the Freeze power-up.
 * This power-up temporarily freezes the game, preventing any movements or actions.
 * It applies a freeze effect for a specified duration.
 * After the duration, it unfreezes the game.
 */
export class FreezeStrategy implements IPowerUpStrategy
{
  private duration: number

  constructor(duration: number = 1500)
  {
    this.duration = duration
  }

  /**
   * Applies the freeze effect by setting the game to a frozen state.
   * It uses a timeout to unfreeze the game after the specified duration.
   * 
   * @param context - The context in which the power-up is applied.
   */
  apply(context: IPowerUpContext): void
  {
    context.setGameFrozen(true)

    setTimeout(() =>
    {
      this.remove(context)
    }, this.duration)
  }

  /**
   * Removes the freeze effect by unfreezing the game.
   * 
   * @param context - The context in which the power-up is applied.
   */
  remove(context: IPowerUpContext): void
  {
    context.setGameFrozen(false)
  }

  /**
   * Returns the duration of the freeze effect.
   * 
   * @returns The duration of the freeze effect in milliseconds.
   */
  getDuration(): number
  {
    return this.duration
  }
}
