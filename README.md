# pi-extensions

A collection of [pi](https://github.com/mariozechner/pi-coding-agent) extensions for tracking and enhancing your coding agent experience.

## Extensions

### [turn-tracker](./turn-tracker/)

Tracks the duration of each agent turn and displays it in the footer. Shows both the current active turn's elapsed time (live-updated) and the previous turn's duration.

**Features:**
- Live timer showing current agent turn duration (updates every 100ms)
- Displays last completed turn's duration for reference
- Composes turn timing alongside default footer data (git branch, provider count)

**How it works:**
- Captures `agent_start` and `agent_end` events to measure turn duration
- Uses a live timer loop that triggers re-renders for the footer component
- Formats durations as `XmYs` (e.g., `2m15s`) for readability
- Composes turn info alongside default footer data (git branch, provider count)

**Headless mode:**
- Detects headless mode and gracefully returns early — no UI operations are performed when `ctx.hasUI` is false
