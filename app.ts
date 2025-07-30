import { GameConfigBuilder, GameEngine } from './src'

const config = new GameConfigBuilder()
  .setDifficulty('high')
  .setBoardSize(25, 20)
  .setScorePerApple(10)
  .enablePowerUp('magnet', true)
  .enablePowerUp('slowMotion', true)
  .enablePowerUp('bonus', true)
  .enablePowerUp('invincibility')
  .enablePowerUp('teleport')
  .enablePowerUp('boost')
  .enablePowerUp('freeze')
  .setIcon('background', '⬛')
  .setExpandedRange(1)
  .build()

const game = new GameEngine(config)

process.on('SIGINT', () =>
{
  console.log('\nBye')
  game.stop()
  process.exit(0)
})

process.on('SIGTERM', () =>
{
  game.stop()
  process.exit(0)
})

game.start()
