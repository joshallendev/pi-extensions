import { type ExtensionAPI } from "@mariozechner/pi-coding-agent";

/**
 * Formats seconds into a human-readable duration string (e.g., 1m5s).
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) {
    return `${mins}m${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Turn Tracker Extension
 * Tracks the duration of each agent turn and displays it in the footer.
 */
export default function (pi: ExtensionAPI) {
  let turnStartTime: number | null = null;
  let lastDuration: number | null = null;
  let timerId: NodeJS.Timeout | null = null;

  // References to trigger re-renders for the live timer
  let currentRequestRender: (() => void) | null = null;

  pi.on("session_start", (event, ctx) => {
    // Skip all UI operations in headless mode
    if (!ctx.hasUI) return;

    // Set the custom footer using the component pattern
    ctx.ui.setFooter((tui, theme) => {
      currentRequestRender = () => tui.requestRender();

      return {
        invalidate() {},
        render(width: number): string[] {
          const parts: string[] = [];

          // Add model info if available
          if (ctx.model) {
            const model = ctx.model;
            parts.push(`Model: ${model.provider}/${model.id}`);
          }

          if (turnStartTime) {
            const elapsed = (Date.now() - turnStartTime) / 1000;
            parts.push(`Current turn: ${formatDuration(elapsed)}`);
          }

          if (lastDuration !== null) {
            parts.push(`Last turn: ${formatDuration(lastDuration)}`);
          }

          return [parts.join(" | ")];
        },
        dispose: () => {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        },
      };
    });

    // Start the live timer loop to trigger re-renders
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      if (turnStartTime && currentRequestRender) {
        currentRequestRender();
      }
    }, 100);
  });

  pi.on("agent_start", (event, ctx) => {
    turnStartTime = Date.now();
    lastDuration = null;
  });

  pi.on("agent_end", (event, ctx) => {
    if (turnStartTime) {
      lastDuration = (Date.now() - turnStartTime) / 1000;
      turnStartTime = null;
    }
  });
}
