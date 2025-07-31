import type { IBoardConfig, IGameState, IIconsConfig, Position, PowerUpType } from '@type/global'

/**
 * RenderService is responsible for rendering the game state to the console.
 * It handles the drawing of the game board, UI elements, and updates based on the game state.
 * It can also update icons and board configurations dynamically.
 */
export class RenderService
{
  private board: IBoardConfig
  private icons: IIconsConfig

  constructor(board: IBoardConfig, icons: IIconsConfig)
  {
    this.board = board
    this.icons = icons
  }

  /**
   * Renders the entire game state to the console.
   * It clears the screen, draws the board, and updates the UI with the current game state.
   * 
   * @param gameState - The current state of the game to render.
   */
  render(gameState: IGameState): void
  {
    this.clearScreen()
    this.drawBoard(gameState)
    this.drawUI(gameState)
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
   * Clears the console screen.
   * This is useful for refreshing the display without cluttering the output.
   */
  private clearScreen(): void
  {
    process.stdout.write('\x1b[H\x1b[2J')
  }

  /**
   * Draws the game board based on the current game state.
   * It iterates through each position on the board and determines what to render (apple, snake, power-ups, etc.).
   * 
   * @param gameState - The current state of the game to render.
   */
  private drawBoard(gameState: IGameState): void
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

    process.stdout.write(boardString)
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
   * Draws the UI elements such as score, snake length, and active power-ups.
   * It formats the display to fit within the board's width and updates dynamically.
   * 
   * @param gameState - The current state of the game to render in the UI.
   */
  private drawUI(gameState: IGameState): void
  {
    const text = `🏆 ${gameState.score} - 📏 ${gameState.snake.length}`
    const activepowerUpsIcons = this.getActivePowerUpsDisplay(gameState.activePowerUps)

    const totalWidth = this.board.width * 2
    const rightMargin = activepowerUpsIcons.length
    const availableSpace = totalWidth - text.length - rightMargin
    const spacing = Math.max(1, availableSpace)

    const bottomLine = text + ' '.repeat(spacing) + activepowerUpsIcons

    process.stdout.write(`\n${bottomLine}\n`)

    this.drawGamesStatusMessages(gameState)
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

    this.drawUI(gameState)
  }

  /**
   * Returns a string representation of the active power-ups for display.
   * It maps the active power-up types to their corresponding icons.
   * 
   * @param activePowerUps - An array of active power-up types.
   * @returns A string of icons representing the active power-ups.
   */
  private getActivePowerUpsDisplay(activePowerUps: PowerUpType[]): string
  {
    if (activePowerUps.length === 0)
    {
      return ''
    }

    return activePowerUps
      .map((powerUpType) => this.icons[powerUpType])
      .join(' ')
  }

  /**
   * Draws the game status messages based on the current game state.
   * It displays messages for game over, pause, and other relevant status updates.
   * 
   * @param gameState - The current state of the game.
   */
  private drawGamesStatusMessages(gameState: IGameState): void
  {
    const messages: string[] = []

    if (gameState.isGameOver)
    {
      messages.push('GAME OVER')
      messages.push('Press Ctrl+C to quit')
    }

    else if (gameState.isPaused)
    {
      messages.push('PAUSED')
    }

    const boardWidth = this.board.width * 2

    messages.forEach((message) =>
    {
      const padding = Math.max(0, Math.floor((boardWidth - message.length) / 2))
      const centeredMessage = ' '.repeat(padding) + message

      process.stdout.write(`\n${centeredMessage}`)
    })

    if (messages.length > 0)
    {
      process.stdout.write('\n')
    }
  }
}
