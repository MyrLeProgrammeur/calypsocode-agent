// Disclosure surface for `--about`: CalypsoCode is a rebranded fork of OpenCode,
// and this project's position is that hiding that fact would undermine the privacy
// argument the launcher exists to make.
//
// This printed AGPL-3.0 for the fork's changes until 2026-07-26, while LICENSE and
// both package.json files said MIT — the shipped artifact contradicting itself, in a
// project whose selling point is not saying things that are not so. MIT is the
// resolution, for two reasons. The changes here are a rebrand plus one header fix on
// a 15,000-commit MIT tree, which is thin ground for claiming separate copyleft. And
// MIT keeps that header fix offerable upstream, which is the move that would let this
// fork be retired rather than maintained forever.
//
// The launcher stays AGPL-3.0. That is where the receipt, the leak test and the
// disclosure live — the part a hostile reskin would target, and the only part where
// copyleft protects anything.
import { InstallationVersion } from "@opencode-ai/core/installation/version"

const UPSTREAM_URL = "https://github.com/anomalyco/opencode"
const LAUNCHER_URL = "https://github.com/MyrLeProgrammeur/CalypsoCode"

export function printAbout(): void {
  console.log(`CalypsoCode ${InstallationVersion}`)
  console.log(`A fork of OpenCode (${UPSTREAM_URL}).`)
  console.log("")
  console.log("This agent — MIT")
  console.log("  MIT License. Copyright (c) 2025 opencode.")
  console.log("  The changes here are a rebrand and one header fix; they carry the")
  console.log("  original's licence. Full text: LICENSE in this repository.")
  console.log("")
  console.log("The launcher — AGPL-3.0")
  console.log("  CalypsoCode itself, which runs this agent under a compartment")
  console.log("  identity, is a separate project under AGPL-3.0.")
  console.log(`  ${LAUNCHER_URL}`)
}
