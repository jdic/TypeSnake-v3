import type { Direction, IGameConfig, IGameState, Position, Range } from '@type/global'
import type { IPowerUpContext, PowerUp } from '@powerups/PowerUp'
import { GameStateService } from '@services/GameStateService'
import { PowerUpManager } from '@powerups/PowerUpManager'
import { GameConfigBuilder } from '@config/ConfigBuilder'
import { RenderService } from '@services/RenderService'
import { InputService } from '@services/InputService'
import { DEFAULT_SPEEDS } from '@config/defaults'
import { MathUtils } from '@utils/MathUtils'
import { Apple } from '@entities/Apple'
import { Snake } from '@entities/Snake'

/**
 * GameEngine is the core class that manages the game logic, including
 * the snake, apple, power-ups, rendering, and user input.
 * 
 * It provides methods to start, pause, restart, and stop the game,
 * as well as to update the game state and render the game board.
 */
export class GameEngine implements IPowerUpContext
{
  private config: IGameConfig
  private snake: Snake
  private apple: Apple
  private powerUpManager: PowerUpManager
  private inputService: InputService
  private renderService: RenderService
  private gameStateService: GameStateService
  
  private gameInterval: Timer | null = null
  private range: Range = 'regular'
  private currentBackgroundIcon: string
  private currentScorePerApple: number
  private currentUpdateTime: number

  constructor(config?: Partial<IGameConfig>)
  {
    this.config = config
      ? GameConfigBuilder.fromPartialConfig(config).build()
      : new GameConfigBuilder().build()

    this.currentBackgroundIcon = this.config.icons.background
    this.currentScorePerApple = this.config.game.scorePerApple
    this.currentUpdateTime = this.calculateUpdateTime()

    this.snake = new Snake(
      [Math.floor(this.config.board.width / 2), Math.floor(this.config.board.height / 2)],
      this.config.board.width,
      this.config.board.height
    )

    this.apple = new Apple(this.config.board.width, this.config.board.height)

    this.powerUpManager = new PowerUpManager(
      this.config.powerUps,
      this.config.board.width,
      this.config.board.height
    )

    this.inputService = new InputService()
    this.renderService = new RenderService(this.config.board, this.config.icons)

    const initialState: IGameState =
    {
      snake: this.snake.getSegments(),
      apple: this.apple.getPosition(),
      score: 0,
      powerUps: [],
      isGameOver: false,
      isPaused: false
    }

    this.gameStateService = new GameStateService(initialState)

    this.setupInput()
  }

  /**
   * Starts the game engine.
   * Initializes the input service, renders the initial game state, and starts the game loop.
   */
  start(): void
  {
    console.clear()

    this.inputService.initialize()
    this.render()
    this.startGameLoop()
  }

  /**
   * Toggles the pause state of the game.
   */
  togglePause(): void
  {
    const currentState = this.gameStateService.getState()

    this.gameStateService.setPaused(!currentState.isPaused)
    
    if (currentState.isPaused)
    {
      this.startGameLoop()
    }
    
    else
    {
      this.stopGameLoop()
    }
    
    this.render()
  }

  /**
   * Restarts the game.
   */
  restart(): void
  {
    this.stopGameLoop()

    const centerX = Math.floor(this.config.board.width / 2)
    const centerY = Math.floor(this.config.board.height / 2)
    
    this.snake.reset([centerX, centerY])
    this.apple.respawn(this.snake.getSegments())
    this.powerUpManager.clearAllPowerUps()

    this.gameStateService.reset(
    {
      snake: this.snake.getSegments(),
      apple: this.apple.getPosition()
    })

    this.range = 'regular'
    this.currentBackgroundIcon = this.config.icons.background
    this.currentScorePerApple = this.config.game.scorePerApple

    this.start()
  }

  /**
   * Stops the game engine.
   * Clears the game loop and destroys the input service.
   */
  stop(): void
  {
    this.stopGameLoop()
    this.inputService.destroy()
  }

  /**
   * Sets up the input handling for the game.
   */
  private setupInput(): void
  {
    this.inputService.onMovement((direction: Direction) =>
    {
      if (!this.gameStateService.isPaused() && !this.gameStateService.isGameOver())
      {
        this.snake.setDirection(direction)
      }
    })

    this.inputService.onKeyPress('space', () =>
    {
      if (!this.gameStateService.isGameOver())
      {
        this.togglePause()
      }
    })

    this.inputService.onKeyPress('r', () =>
    {
      this.restart()
    })
  }

  /**
   * Starts the game loop.
   */
  private startGameLoop(): void
  {
    if (this.gameInterval) return
    
    this.gameInterval = setInterval(() =>
    {
      this.update()
    }, this.currentUpdateTime)
  }

  /**
   * Stops the game loop.
   */
  private stopGameLoop(): void
  {
    if (this.gameInterval)
    {
      clearInterval(this.gameInterval)

      this.gameInterval = null
    }
  }

  /**
   * Updates the game state.
   */
  private update(): void
  {
    if (this.gameStateService.isPaused() || this.gameStateService.isGameOver())
    {
      return
    }

    const tailPosition = this.snake.move()

    if (this.snake.checkSelfCollision())
    {
      this.gameOver()
      return
    }

    const head = this.snake.getHead()
    let hasEaten = false

    if (this.isInRange(head, this.apple.getPosition()))
    {
      this.eatApple(tailPosition)
      hasEaten = true
    }

    const powerUpAtPosition = this.powerUpManager.findPowerUpAtPosition(head)

    if (powerUpAtPosition && this.isInRange(head, powerUpAtPosition.position))
    {
      this.eatPowerUp(powerUpAtPosition, tailPosition)
      hasEaten = true
    }

    if (!hasEaten) {  }

    this.updateGameState()
    this.render()
  }

  /**
   * Eats the apple and updates the game state.
   * 
   * @param tailPosition - The position of the snake's tail.
   */
  private eatApple(tailPosition: Position): void
  {
    this.snake.grow(tailPosition)
    this.gameStateService.incrementScore(this.currentScorePerApple)

    const occupiedPositions =
    [
      ...this.snake.getSegments(),
      ...this.powerUpManager.getActivePowerUps().map((p) => p.position)
    ]
    this.apple.respawn(occupiedPositions)
 
    const newPowerUps = this.powerUpManager.generateRandomPowerUps(occupiedPositions)

    newPowerUps.forEach((powerUp) =>
    {
      this.powerUpManager.addPowerUp(powerUp)
    })
  }

  /**
   * Eats a power-up and applies its effect.
   * 
   * @param powerUp - The power-up to be consumed.
   * @param tailPosition - The position of the snake's tail.
   */
  private eatPowerUp(powerUp: PowerUp, tailPosition: Position): void
  {
    this.snake.grow(tailPosition)

    powerUp.apply(this)

    this.powerUpManager.removePowerUp(powerUp.type)
  }

  /**
   * Handles the game over state.
   * Stops the game loop and renders the final game state.
   */
  private gameOver(): void
  {
    this.gameStateService.setGameOver(true)
    this.stopGameLoop()
    this.render()
  }

  /**
   * Checks if two positions are in range.
   * 
   * @param pos1 - The first position.
   * @param pos2 - The second position.
   * @returns True if the positions are in range, false otherwise.
   */
  private isInRange(pos1: Position, pos2: Position): boolean
  {
    if (this.range === 'regular')
    {
      return MathUtils.positionsEqual(pos1, pos2)
    }
    
    else
    {
      return MathUtils.isInRange(pos1, pos2, this.config.game.expandedRange)
    }
  }

  /**
   * Updates the game state.
   */
  private updateGameState(): void
  {
    this.gameStateService.updateSnake(this.snake.getSegments())
    this.gameStateService.updateApple(this.apple.getPosition())
    this.gameStateService.updatePowerUps(this.powerUpManager.getActivePowerUps())
  }

  /**
   * Renders the current game state.
   */
  private render(): void
  {
    const currentIcons =
    {
      ...this.config.icons,
      background: this.currentBackgroundIcon
    }

    this.renderService.updateIcons(currentIcons)
    this.renderService.render(this.gameStateService.getState())
  }

  private calculateUpdateTime(): number
  {
    if (this.config.game.difficulty !== 'custom')
    {
      return DEFAULT_SPEEDS[this.config.game.difficulty]
    }

    return this.config.game.updateTime || DEFAULT_SPEEDS.easy
  }

  // START Implementation of IPowerUpContext methods

  setRange(range: Range): void
  {
    this.range = range
  }

  getUpdateTime(): number
  {
    return this.currentUpdateTime
  }

  setUpdateTime(time: number): void
  {
    this.currentUpdateTime = time
  }

  setBackgroundIcon(icon: string): void
  {
    this.currentBackgroundIcon = icon
  }

  getBackgroundIcon(): string
  {
    return this.currentBackgroundIcon
  }

  setScorePerApple(score: number): void
  {
    this.currentScorePerApple = score
  }

  getScorePerApple(): number
  {
    return this.currentScorePerApple
  }

  redraw(): void
  {
    this.render()
  }

  clearInterval(): void
  {
    this.stopGameLoop()
  }

  setInterval(callback: () => void, time: number): void
  {
    this.stopGameLoop()

    this.gameInterval = setInterval(() =>
    {
      this.update()
    }, time)
  }

  // END Implementation of IPowerUpContext methods
}
