import type { IGameConfig, ISpeedConfig } from '@type/global'

export const DEFAULT_SPEEDS: ISpeedConfig =
{
  easy: 1000,
  medium: 250,
  high: 70
}

export const DEFAULT_CONFIG: IGameConfig =
{
  board:
  {
    width: 20,
    height: 20
  },
  game:
  {
    difficulty: 'easy',
    scorePerApple: 5,
    expandedRange: 1
  },
  powerUps:
  {
    magnet:
    {
      enabled: false,
      probability: 0.4,
      duration: 2000
    },
    slowMotion:
    {
      enabled: false,
      probability: 0.2,
      duration: 2000
    },
    bonus:
    {
      enabled: false,
      probability: 0.5,
      duration: 2000
    },
    invincibility:
    {
      enabled: false,
      probability: 0.15,
      duration: 3000
    },
    teleport:
    {
      enabled: false,
      probability: 0.2,
      duration: 0
    }
  },
  icons:
  {
    background: '⬜️',
    snake: '🐍',
    apple: '🍎',
    magnet: '🧲',
    slowMotion: '🧊',
    bonus: '🍐',
    invincibility: '👻',
    teleport: '🕳️'
  }
}
