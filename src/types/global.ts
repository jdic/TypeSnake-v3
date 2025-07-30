export type Difficulty = 'easy' | 'medium' | 'high' | 'custom'
export type Position = [number, number]
export type Direction = Position
export type PowerUpType = 'magnet' | 'slowMotion' | 'bonus'
export type Range = 'regular' | 'expanded'

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
}

export interface IIconsConfig
{
  background: string
  snake: string
  apple: string
  magnet: string
  slowMotion: string
  bonus: string
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

export interface IGameState
{
  snake: Position[]
  apple: Position
  score: number
  powerUps: IPowerUp[]
  isGameOver: boolean
  isPaused: boolean
}

export interface ISpeedConfig
{
  easy: number
  medium: number
  high: number
}
