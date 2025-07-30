import type { IPowerUpContext, IPowerUpStrategy } from './PowerUp'

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
   */
  remove(context: IPowerUpContext): void
  {
    context.setRange('regular')
  }

  /**
   * Returns the duration of the magnet effect.
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
  private intervalId: any = null

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
  private intervalId: any = null

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
   */
  getDuration(): number
  {
    return this.duration
  }
}
