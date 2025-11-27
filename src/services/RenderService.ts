import type { IActivePowerUp, IBoardConfig, IGameState, IIconsConfig, Position } from '@type/global'

/**
 * RenderService is responsible for rendering the game state to the console.
 * It handles the drawing of the game board, UI elements, and updates based on the game state.
 * It can also update icons and board configurations dynamically.
 * Uses frame buffering to reduce flicker/parpadeo.
 */
export class RenderService
{
  private board: IBoardConfig
  private icons: IIconsConfig
  private previousFrame: string = ''
  private isFirstRender: boolean = true
  private overlayMessage: string = ''

  constructor(board: IBoardConfig, icons: IIconsConfig)
  {
    this.board = board
    this.icons = icons
  }

  /**
   * Renders the entire game state to the console.
   * It clears the screen only on first render, then moves the cursor to the home position.
   * Only writes to the console if the frame has changed, reducing flicker.
   *
   * @param gameState - The current state of the game to render.
   */
  render(gameState: IGameState): void
  {
    const currentFrame = this.buildFrame(gameState)

    if (this.isFirstRender || currentFrame !== this.previousFrame)
    {
      if (this.isFirstRender)
      {
        this.clearScreen()
        this.isFirstRender = false
      }

      else
      {
        process.stdout.write('\x1b[H')
      }

      process.stdout.write(currentFrame)

      this.previousFrame = currentFrame
    }
  }

  /**
   * Forces a complete re-render by clearing the previous frame.
   * This ensures the next render will be displayed regardless of frame comparison.
   *
   * @param gameState - The current state of the game to render.
   */
  forceRender(gameState: IGameState): void
  {
    this.previousFrame = ''
    this.clearScreen()
    this.isFirstRender = true
    this.render(gameState)
  }

  /**
   * Updates the icons used for rendering the game.
   * It merges the new icons with the existing ones.
   *
   * @param icons - An object containing new icon configurations.
   */
  updateIcons(icons: IIconsConfig): void
  {
    this.icons = { ...this.icons, ...icons }
  }

  /**
   * Updates the game board configuration.
   * It allows changing the dimensions of the board dynamically.
   *
   * @param board - The new board configuration to apply.
   */
  updateBoard(board: IBoardConfig): void
  {
    this.board = board
  }

  /**
   * Sets a temporary overlay message to be displayed in the UI area.
   */
  setOverlayMessage(message: string): void
  {
    this.overlayMessage = message
  }

  /**
   * Clears the console screen.
   * This is useful for refreshing the display without cluttering the output.
   */
  private clearScreen(): void
  {
    process.stdout.write('\x1b[H\x1b[2J')
  }

  /**
   * Builds the complete frame in memory before rendering.
   * This reduces flicker by preparing everything before writing to stdout.
   *
   * @param gameState - The current state of the game to render.
   * @returns Complete frame as a string.
   */
  private buildFrame(gameState: IGameState): string
  {
    let frame = ''

    frame += this.buildBoard(gameState)
    frame += this.buildUI(gameState)

    return frame
  }

  /**
   * Builds the game board as a string based on the current game state.
   * It iterates through each position on the board and determines what to render (apple, snake, power-ups, etc.).
   *
   * @param gameState - The current state of the game to render.
   * @returns The board as a string.
   */
  private buildBoard(gameState: IGameState): string
  {
    let boardString = ''

    for (let y = 0; y < this.board.height; y++)
    {
      let row = ''

      for (let x = 0; x < this.board.width; x++)
      {
        const position: Position = [x, y]

        row += this.getCellIcon(position, gameState)
      }

      boardString += row + '\n'
    }

    return boardString
  }

  /**
   * Determines the icon to render at a specific position based on the game state.
   * It checks for apples, power-ups, and snake segments to decide which icon to use.
   *
   * @param position - The position on the board to check.
   * @param gameState - The current state of the game.
   * @returns The icon string to render at the specified position.
   */
  private getCellIcon(position: Position, gameState: IGameState): string
  {
    const [x, y] = position

    if (gameState.apple[0] === x && gameState.apple[1] === y)
    {
      return this.icons.apple
    }

    const powerUp = gameState.powerUps.find((p) =>
    {
      return p.position[0] === x && p.position[1] === y
    })

    if (powerUp)
    {
      return this.icons[powerUp.type]
    }

    const isSnakeSegment = gameState.snake.some((segment) =>
    {
      return segment[0] === x && segment[1] === y
    })

    if (isSnakeSegment)
    {
      return this.icons.snake
    }

    return this.icons.background
  }

  /**
   * Builds the UI elements as a string.
   * It formats the display to fit within the board's width and updates dynamically.
   *
   * @param gameState - The current state of the game to render the UI.
   * @returns The UI as a string.
   */
  private buildUI(gameState: IGameState): string
  {
    const text = `🏆 ${gameState.score} - 📏 ${gameState.snake.length}`
    const activepowerUpsIcons = this.getActivePowerUpsDisplay(gameState.activePowerUps)

    const totalWidth = this.board.width * 2
    const rightMargin = activepowerUpsIcons.length
    const availableSpace = totalWidth - text.length - rightMargin
    const spacing = Math.max(1, availableSpace)

    const bottomLine = text + ' '.repeat(spacing) + activepowerUpsIcons

    let ui = `\n${bottomLine}\n`

    if (this.overlayMessage)
    {
      const boardWidth = this.board.width * 2
      const padding = Math.max(0, Math.floor((boardWidth - this.overlayMessage.length) / 2))
      ui += ' '.repeat(padding) + this.overlayMessage + '\n'
    }

    ui += this.buildGameStatusMessages(gameState)

    return ui
  }

  /**
   * Renders a partial update of the game state.
   * It updates only the changed positions on the board, which is more efficient for frequent updates.
   *
   * @param gameState - The current state of the game to render.
   * @param changedPositions - An array of positions that have changed since the last render.
   */
  renderPartial(gameState: IGameState, changedPositions: Position[]): void
  {
    changedPositions.forEach((position) =>
    {
      const [x, y] = position
      const icon = this.getCellIcon(position, gameState)

      process.stdout.write(`\x1b[${y + 1};${x + 1}H${icon}`)
    })

    process.stdout.write(this.buildUI(gameState))
  }

  /**
   * Builds the active power-ups display as a string.
   * Power-ups that are about to expire will blink.
   *
   * @param activePowerUps - Array of active power-ups with timing information.
   * @returns String of power-up icons.
   */
  private getActivePowerUpsDisplay(activePowerUps: IActivePowerUp[]): string
  {
    if (activePowerUps.length === 0)
    {
      return ''
    }

    const currentTime = Date.now()

    return activePowerUps
      .map((activePowerUp) =>
      {
        const elapsedTime = currentTime - activePowerUp.startTime
        const remainingTime = activePowerUp.duration - elapsedTime
        const blinkThreshold = activePowerUp.duration * 0.25

        if (remainingTime <= blinkThreshold && remainingTime > 0)
        {
          const blinkCycle = Math.floor(currentTime / 250) % 2 === 0

          return blinkCycle ? this.icons[activePowerUp.type] : ' '
        }

        return this.icons[activePowerUp.type]
      })
      .join(' ')
  }

  /**
   * Builds the game status messages as a string.
   * It displays messages for game over, pause, and other relevant status updates.
   *
   * @param gameState - The current state of the game.
   * @returns The status messages as a string.
   */
  private buildGameStatusMessages(gameState: IGameState): string
  {
    const boardWidth = this.board.width * 2
    let statusString = ''

    const getPadding = (length: number): number =>
    {
      return Math.max(0, Math.floor((boardWidth - length) / 2))
    }

    if (gameState.isGameOver)
    {
      const gameOverMessage = 'GAME OVER'
      const quitMessage = 'Press Ctrl+C to quit'

      const gameOverPadding = getPadding(gameOverMessage.length)
      const quitPadding = getPadding(quitMessage.length)

      statusString += '\n' + ' '.repeat(gameOverPadding) + gameOverMessage
      statusString += '\n' + ' '.repeat(quitPadding) + quitMessage
    }

    else if (gameState.isPaused)
    {
      const pausedMessage = 'PAUSED'
      const padding = getPadding(pausedMessage.length)

      statusString += '\n' + ' '.repeat(padding) + pausedMessage
      statusString += '\n' + ' '.repeat(boardWidth)
    }

    else
    {
      statusString += '\n' + ' '.repeat(boardWidth)
      statusString += '\n' + ' '.repeat(boardWidth)
    }

    statusString += '\n'

    return statusString
  }
}
