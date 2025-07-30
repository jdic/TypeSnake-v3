import type { IBoardConfig, IGameState, IIconsConfig, Position } from '../types/global'

export class RenderService
{
  private board: IBoardConfig
  private icons: IIconsConfig

  constructor(board: IBoardConfig, icons: IIconsConfig)
  {
    this.board = board
    this.icons = icons
  }

  render(gameState: IGameState): void
  {
    this.clearScreen()
    this.drawBoard(gameState)
    this.drawUI(gameState)
  }
  
  updateIcons(icons: IIconsConfig): void
  {
    this.icons = { ...this.icons, ...icons }
  }

  updateBoard(board: IBoardConfig): void
  {
    this.board = board
  }

  private clearScreen(): void
  {
    process.stdout.write('\x1b[H\x1b[2J')
  }

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
