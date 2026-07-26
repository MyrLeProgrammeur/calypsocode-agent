// Disclosure surface for `--about`: CalypsoCode is a rebranded fork of
// OpenCode, and this project's position is that hiding that fact would
// undermine the privacy argument the launcher exists to make. This prints
// both licenses that apply — the original's and this fork's own.
import { InstallationVersion } from "@opencode-ai/core/installation/version"

const UPSTREAM_URL = "https://github.com/anomalyco/opencode"
const AGPL_URL = "https://www.gnu.org/licenses/agpl-3.0.html"

export function printAbout(): void {
  console.log(`CalypsoCode ${InstallationVersion}`)
  console.log(`A fork of OpenCode (${UPSTREAM_URL}).`)
  console.log("")
  console.log("Original work — OpenCode")
  console.log("  MIT License. Copyright (c) 2025 opencode.")
  console.log("  Full text: LICENSE in this repository.")
  console.log("")
  console.log("CalypsoCode modifications")
  console.log("  AGPL-3.0. CalypsoCode's changes on top of the MIT-licensed original")
  console.log(`  are licensed separately, under AGPL-3.0 (${AGPL_URL}).`)
}
