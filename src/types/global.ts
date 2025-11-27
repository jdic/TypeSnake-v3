export type PowerUpType = 'magnet' | 'slowMotion' | 'bonus' | 'invincibility' | 'teleport' | 'boost' | 'freeze'
export type Difficulty = 'easy' | 'medium' | 'high' | 'custom'
export type Range = 'regular' | 'expanded'
export type Position = [number, number]
export type Direction = Position

export enum Movement
{
  Up = 'up',
  Left = 'left',
  Right = 'right',
  Down = 'down'
}

export interface IBoardConfig
{
  width: number
  height: number
}

export interface IGameSettings
{
  difficulty: Difficulty
  scorePerApple: number
  expandedRange: number
  updateTime?: number
  allowCheats?: boolean
}

export interface IPowerUpSettings
{
  enabled: boolean
  probability: number
  duration?: number
}

export interface IPowerUpConfig
{
  slowMotion: IPowerUpSettings
  bonus: IPowerUpSettings
  magnet: IPowerUpSettings
  invincibility: IPowerUpSettings
  teleport: IPowerUpSettings
  boost: IPowerUpSettings
  freeze: IPowerUpSettings
}

export interface IIconsConfig
{
  background: string
  snake: string
  apple: string
  magnet: string
  slowMotion: string
  bonus: string
  invincibility: string
  teleport: string
  boost: string
  freeze: string
}

export interface IGameConfig
{
  board: IBoardConfig
  game: IGameSettings
  powerUps: IPowerUpConfig
  icons: IIconsConfig
}

export interface IPowerUp
{
  position: Position
  type: PowerUpType
  createdAt: number
}

export interface IActivePowerUp
{
  type: PowerUpType
  startTime: number
  duration: number
}

export interface IGameState
{
  snake: Position[]
  apple: Position
  score: number
  powerUps: IPowerUp[]
  isGameOver: boolean
  isPaused: boolean
  activePowerUps: IActivePowerUp[]
}

export interface ISpeedConfig
{
  easy: number
  medium: number
  high: number
}

export interface IBoardDimensions
{
  width: number
  height: number
}
