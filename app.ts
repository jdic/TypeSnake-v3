import { GameConfigBuilder, GameEngine } from './src'

const config = new GameConfigBuilder()
  .setDifficulty('high')
  .setBoardSize(25, 20)
  .setScorePerApple(10)
  .enablePowerUp('magnet', true)
  .setPowerUpProbability('magnet', 0.3)
  .enablePowerUp('slowMotion', true)
  .setPowerUpProbability('slowMotion', 0.2)
  .enablePowerUp('bonus', true)
  .setPowerUpProbability('bonus', 0.4)
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
