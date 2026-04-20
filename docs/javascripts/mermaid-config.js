/**
 * COMBINED NEON-TERMINAL CONFIG
 * Handles both the Cyberpunk aesthetic and the Material Instant Loading fix.
 */

window.mermaidConfig = {
  startOnLoad: false, // We handle the loading manually below
  theme: "base",
  themeVariables: {
    primaryColor: "#000000",
    primaryTextColor: "#f3e600",
    primaryBorderColor: "#f3e600",
    lineColor: "#00ffff",
    secondaryColor: "#050505",
    tertiaryColor: "#000000",
    fontFamily: "Courier New",
    fontSize: "16px",
    nodeBorder: "#f3e600",
    clusterBkg: "rgba(243, 230, 0, 0.05)",
    clusterBorder: "#ff00ff",
    edgeLabelBackground: "#000000",
    defaultLinkColor: "#00ffff"
  }
};

// Function to initialize Mermaid
function initMermaid() {
  if (typeof mermaid !== "undefined") {
    mermaid.initialize(window.mermaidConfig);
    mermaid.init();
  }
}

// 1. Run on initial page load
document.addEventListener("DOMContentLoaded", initMermaid);

// 2. Run every time Material switches pages (Instant Loading)
if (typeof app !== "undefined") {
  app.document$.subscribe(function() {
    initMermaid();
  });
}