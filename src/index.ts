// Global types
export * from './types/global'

// Core classes
export { GameConfigBuilder } from './config/ConfigBuilder'
export { DEFAULT_CONFIG, DEFAULT_SPEEDS } from './config/defaults'

// Entities
export { Snake } from './entities/Snake'
export { Apple } from './entities/Apple'

// Power-ups
export { PowerUp } from './powerups/PowerUp'
export { PowerUpFactory, PowerUpManager } from './powerups/PowerUpManager'
export { MagnetStrategy, SlowMotionStrategy, BonusStrategy, InvincibilityStrategy, TeleportStrategy, BoostStrategy, FreezeStrategy } from './powerups/PowerUpStrategies'

// Services
export { InputService } from './services/InputService'
export { RenderService } from './services/RenderService'
export { GameStateService } from './services/GameStateService'

// Core
export { GameEngine } from './core/GameEngine'

// Utils
export { MathUtils } from './utils/MathUtils'
