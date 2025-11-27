import type { IPowerUpContext } from '@powerups/PowerUp'

interface ToggleCheat
{
  id: string
  apply: (ctx: IPowerUpContext) => void
  remove?: (ctx: IPowerUpContext) => void
  instant?: boolean
}

export class CheatService
{
  private readonly normalize = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  private readonly cheats: Record<string, ToggleCheat>
  private active: Set<string> = new Set()

  private originals:
  {
    updateTime?: number
    scorePerApple?: number
    backgroundIcon?: string
    range?: string
  } = {}

  constructor()
  {
    this.cheats = {}

    const register = (codes: string[], cheat: Omit<ToggleCheat, 'id'> & { id?: string }) =>
    {
      const id = cheat.id || codes[0]!

      codes.forEach((code) =>
      {
        this.cheats[this.normalize(code)] = { id, ...cheat }
      })
    }

    // Invincibility toggle
    register(['SNEKGODMODE', 'GODMODE'],
    {
      apply: (ctx) => ctx.setInvincible(true),
      remove: (ctx) => ctx.setInvincible(false)
    })

    // Speed x2 toggle
    register(['ZOOMIES'],
    {
      apply: (ctx) =>
      {
        if (!this.originals.updateTime) this.originals.updateTime = ctx.getUpdateTime()
        const newTime = Math.max(30, Math.floor(ctx.getUpdateTime() / 2))
        ctx.clearInterval(); ctx.setInterval(() => {}, newTime)
      },
      remove: (ctx) =>
      {
        if (this.originals.updateTime)
        {
          ctx.clearInterval(); ctx.setInterval(() => {}, this.originals.updateTime)
          this.originals.updateTime = undefined
        }
      }
    })

    // Slow motion toggle
    register(['CHILLPILL', 'CHILL'],
    {
      apply: (ctx) =>
      {
        if (!this.originals.updateTime) this.originals.updateTime = ctx.getUpdateTime()
        const newTime = ctx.getUpdateTime() + 200
        ctx.clearInterval(); ctx.setInterval(() => {}, newTime)
      },
      remove: (ctx) =>
      {
        if (this.originals.updateTime)
        {
          ctx.clearInterval(); ctx.setInterval(() => {}, this.originals.updateTime)
          this.originals.updateTime = undefined
        }
      }
    })

    // Teleport instant one-shot
    register(['YEETME', 'YEET-ME', 'YEET'],
    {
      apply: (ctx) => ctx.teleportSnake(),
      instant: true
    })

    // Resurrection instant one-shot
    register(['ILLBEBACK', 'ILL-BE-BACK', 'TERMINATOR'],
    {
      apply: (ctx) =>
      {
        if (ctx.isGameOver())
        {
          ctx.setGameOver(false)
          ctx.teleportSnake()
          ctx.resumeGame()
          ctx.redraw()
        }
      },
      instant: true
    })

    // Bonus score
    register(['GIMMELOOT', 'LOOT'],
    {
      apply: (ctx) =>
      {
        if (!this.originals.scorePerApple) this.originals.scorePerApple = ctx.getScorePerApple()
        if (!this.originals.backgroundIcon) this.originals.backgroundIcon = ctx.getBackgroundIcon()
        ctx.setScorePerApple(25)
        ctx.setBackgroundIcon('🟨')
        ctx.redraw()
      },
      remove: (ctx) =>
      {
        if (this.originals.scorePerApple) ctx.setScorePerApple(this.originals.scorePerApple)
        if (this.originals.backgroundIcon) ctx.setBackgroundIcon(this.originals.backgroundIcon)
        ctx.redraw()
        this.originals.scorePerApple = undefined
        this.originals.backgroundIcon = undefined
      }
    })

    // Magnet range toggle
    register(['MAGNETO'],
    {
      apply: (ctx) =>
      {
        if (!this.originals.range) this.originals.range = 'regular'
        ctx.setRange('expanded')
      },
      remove: (ctx) =>
      {
        ctx.setRange('regular')
        this.originals.range = undefined
      }
    })

    // Freeze toggle
    register(['FREEZE', 'ICEAGE'],
    {
      apply: (ctx) => ctx.setGameFrozen(true),
      remove: (ctx) => ctx.setGameFrozen(false)
    })

    // Rremove all active cheats and restore originals instant
    register(['NUKECHEATS', 'NUKE', 'RESETCHEATS'],
    {
      apply: (ctx) =>
      {
        for (const id of Array.from(this.active))
        {
          const cheatDef = Object.values(this.cheats).find(c => c.id === id)
          cheatDef?.remove?.(ctx)
        }
        this.active.clear()
        this.originals = {}
        ctx.redraw()
      },
      instant: true
    })
  }

  has(code: string): boolean
  {
    return !!this.cheats[this.normalize(code)]
  }

  getCodes(): string[]
  {
    return Object.keys(this.cheats)
  }

  execute(code: string, ctx: IPowerUpContext): 'activated' | 'deactivated' | 'instant' | 'unknown'
  {
    const cheat = this.cheats[this.normalize(code)]
    if (!cheat) return 'unknown'

    const isActive = this.active.has(cheat.id)

    if (cheat.instant)
    {
      cheat.apply(ctx)
      return 'instant'
    }

    if (isActive)
    {
      cheat.remove?.(ctx)
      this.active.delete(cheat.id)
      return 'deactivated'
    }

    cheat.apply(ctx)
    this.active.add(cheat.id)
    return 'activated'
  }
}
