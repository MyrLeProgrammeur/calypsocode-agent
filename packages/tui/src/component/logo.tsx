import { RGBA, TextAttributes } from "@opentui/core"
import { For, type JSX, createSignal, onCleanup, onMount } from "solid-js"
import { tint, useTheme } from "../context/theme"
import { logo } from "../logo"

// Entrance: rows materialize top-to-bottom out of the background. Ambient:
// once revealed, the bold ("Code") half pulses between the brand's violet
// and pink — punchy and continuous, no blue in the mix.
const REVEAL_MS = 620
const SHIMMER_PERIOD_MS = 2400
const TICK_MS = 50
const SHIMMER_MIX = 0.62

const SHIMMER_VIOLET = RGBA.fromHex("#8b4cff")
const SHIMMER_PINK = RGBA.fromHex("#ff2e97")

function shimmerColor(phase: number): RGBA {
  const t = ((phase % 1) + 1) % 1
  const bounce = t < 0.5 ? t * 2 : (1 - t) * 2
  return tint(SHIMMER_VIOLET, SHIMMER_PINK, bounce)
}

export function Logo() {
  const { theme } = useTheme()
  const [elapsed, setElapsed] = createSignal(0)

  onMount(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed(Date.now() - start), TICK_MS)
    onCleanup(() => clearInterval(id))
  })

  const rowCount = logo.left.length

  const rowReveal = (rowIndex: number) => {
    const span = 1 / rowCount
    const t = Math.min(1, elapsed() / REVEAL_MS)
    return Math.max(0, Math.min(1, (t - rowIndex * span) / span))
  }

  const liveColor = (fg: RGBA, rowIndex: number, shimmering: boolean) => {
    const revealed = rowReveal(rowIndex)
    if (revealed < 1) return tint(theme.background, fg, revealed)
    if (!shimmering) return fg
    return tint(fg, shimmerColor(elapsed() / SHIMMER_PERIOD_MS), SHIMMER_MIX)
  }

  const renderLine = (line: string, fg: RGBA, bold: boolean, rowIndex: number, shimmering: boolean): JSX.Element[] => {
    const attrs = bold ? TextAttributes.BOLD : undefined
    return Array.from(line).map((char) => {
      if (char === "_") {
        return (
          <text
            fg={liveColor(fg, rowIndex, shimmering)}
            bg={tint(theme.background, liveColor(fg, rowIndex, shimmering), 0.25)}
            attributes={attrs}
            selectable={false}
          >
            {" "}
          </text>
        )
      }
      if (char === "^") {
        return (
          <text
            fg={liveColor(fg, rowIndex, shimmering)}
            bg={tint(theme.background, liveColor(fg, rowIndex, shimmering), 0.25)}
            attributes={attrs}
            selectable={false}
          >
            ▀
          </text>
        )
      }
      if (char === "~") {
        return (
          <text
            fg={tint(theme.background, liveColor(fg, rowIndex, shimmering), 0.25)}
            attributes={attrs}
            selectable={false}
          >
            ▀
          </text>
        )
      }
      if (char === ",") {
        return (
          <text
            fg={tint(theme.background, liveColor(fg, rowIndex, shimmering), 0.25)}
            attributes={attrs}
            selectable={false}
          >
            ▄
          </text>
        )
      }
      return (
        <text fg={liveColor(fg, rowIndex, shimmering)} attributes={attrs} selectable={false}>
          {char}
        </text>
      )
    })
  }

  return (
    <box>
      <For each={logo.left}>
        {(line, index) => (
          <box flexDirection="row" gap={1}>
            <box flexDirection="row">{renderLine(line, theme.textMuted, false, index(), false)}</box>
            <box flexDirection="row">{renderLine(logo.right[index()], theme.text, true, index(), true)}</box>
          </box>
        )}
      </For>
    </box>
  )
}
