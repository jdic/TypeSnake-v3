import type { IBoardConfig, IGameState, IIconsConfig, Position } from '@type/global'

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
   * Draws the UI elements such as score, length, and game status.
   * It displays the current score, length of the snake, and game status (game over or paused).
   * 
   * @param gameState - The current state of the game to render the UI.
   */
  private drawUI(gameState: IGameState): void
  {
    console.log(`Score: ${gameState.score}`)
    console.log(`Length: ${gameState.snake.length}`)

    if (gameState.isGameOver)
    {
      console.log('\nGAME OVER')
      console.log('Press Ctrl+C to exit')
    }

    if (gameState.isPaused)
    {
      console.log('\nPAUSED')
    }
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
}
