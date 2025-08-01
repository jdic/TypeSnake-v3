/**
 * Utility class for managing timers (timeouts and intervals).
 * 
 * Provides a centralized way to handle timer cleanup and management.
 */
export class TimeManager
{
  private timeouts: Set<Timer> = new Set()
  private intervals: Set<Timer> = new Set()

  /**
   * Sets a timeout and returns its ID.
   * 
   * @param callback - The function to call after the delay.
   * @param delay - The delay in milliseconds.
   * @returns The ID of the timeout.
   */
  setTimeout(callback: () => void, delay: number): Timer
  {
    const timeoutId = setTimeout(() =>
    {
      this.timeouts.delete(timeoutId)

      callback()
    }, delay)

    this.timeouts.add(timeoutId)

    return timeoutId
  }

  /**
   * Sets an interval and returns its ID.
   * 
   * @param callback - The function to call on each interval.
   * @param interval - The interval duration in milliseconds.
   * @returns The ID of the interval.
   */
  setInterval(callback: () => void, interval: number): Timer
  {
    const intervalId = setInterval(callback, interval)

    this.intervals.add(intervalId)

    return intervalId
  }

  /**
   * Clears a interval by its ID.
   * 
   * @param intervalId - The ID of the interval to clear.
   */
  clearInterval(intervalId: Timer): void
  {
    if (this.intervals.has(intervalId))
    {
      clearInterval(intervalId)
      this.intervals.delete(intervalId)
    }
  }

  /**
   * Clears all active timeouts and intervals.
   */
  clearAll(): void
  {
    this.timeouts.forEach((id) => clearTimeout(id))
    this.intervals.forEach((id) => clearInterval(id))

    this.timeouts.clear()
    this.intervals.clear()
  }

  /**
   * Gets the count of active timeouts and intervals.
   * 
   * @returns An object containing the count of active timeouts and intervals.
   */
  getActiveCount(): { timeouts: number, intervals: number }
  {
    return {
      timeouts: this.timeouts.size,
      intervals: this.intervals.size
    }
  }
}
