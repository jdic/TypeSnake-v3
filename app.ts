import { GameConfigBuilder, GameEngine } from './src'

const config = new GameConfigBuilder()
  .setDifficulty('high')
  .setBoardSize(25, 20)
  .setScorePerApple(10)
  .enablePowerUp('magnet')
  .enablePowerUp('slowMotion')
  .enablePowerUp('bonus')
  .enablePowerUp('invincibility')
  .enablePowerUp('teleport')
  .enablePowerUp('boost')
  .enablePowerUp('freeze')
  .setIcon('background', '⬛')
  .setExpandedRange(1)
  .setAllowCheats(true)
  .build()

const game = new GameEngine(config)

game.start()
