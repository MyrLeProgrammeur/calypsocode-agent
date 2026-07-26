import { RGBA, TextAttributes } from "@opentui/core"
import { For, type JSX, createSignal, onCleanup, onMount } from "solid-js"
import { tint, useTheme } from "../context/theme"
import { logo } from "../logo"

// Entrance: rows materialize top-to-bottom out of the background. Ambient: once
// revealed, the bold ("Code") half carries the brand ramp — primary on its first
// column, accent on its last, the same gradient the exported logo draws — and the
// whole ramp breathes along that axis. No blue in the mix.
const REVEAL_MS = 620
const SHIMMER_PERIOD_MS = 2400
const TICK_MS = 50
const SHIMMER_MIX = 0.25

function bounce(phase: number): number {
  const t = ((phase % 1) + 1) % 1
  return t < 0.5 ? t * 2 : (1 - t) * 2
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

  const gradient = (col: number, width: number) =>
    tint(theme.primary, theme.accent, width > 1 ? col / (width - 1) : 0)

  const liveColor = (fg: RGBA, rowIndex: number, shimmering: boolean, col: number, width: number) => {
    let target = fg
    if (shimmering) {
      const pulse = tint(theme.primary, theme.accent, bounce(elapsed() / SHIMMER_PERIOD_MS))
      target = tint(gradient(col, width), pulse, SHIMMER_MIX)
    }
    const revealed = rowReveal(rowIndex)
    return revealed < 1 ? tint(theme.background, target, revealed) : target
  }

  const renderLine = (line: string, fg: RGBA, bold: boolean, rowIndex: number, shimmering: boolean): JSX.Element[] => {
    const attrs = bold ? TextAttributes.BOLD : undefined
    const chars = Array.from(line)
    return chars.map((char, col) => {
      const color = () => liveColor(fg, rowIndex, shimmering, col, chars.length)
      if (char === "_") {
        return (
          <text fg={color()} bg={tint(theme.background, color(), 0.25)} attributes={attrs} selectable={false}>
            {" "}
          </text>
        )
      }
      if (char === "^") {
        return (
          <text fg={color()} bg={tint(theme.background, color(), 0.25)} attributes={attrs} selectable={false}>
            ▀
          </text>
        )
      }
      if (char === "~") {
        return (
          <text fg={tint(theme.background, color(), 0.25)} attributes={attrs} selectable={false}>
            ▀
          </text>
        )
      }
      if (char === ",") {
        return (
          <text fg={tint(theme.background, color(), 0.25)} attributes={attrs} selectable={false}>
            ▄
          </text>
        )
      }
      return (
        <text fg={color()} attributes={attrs} selectable={false}>
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
