/**
 * CYBERPUNK MERMAID LOADER
 * This version forces the Material theme to use our custom config.
 */

window.mermaidConfig = {
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#000000",
    primaryTextColor: "#f3e600",
    primaryBorderColor: "#f3e600",
    lineColor: "#00ffff",
    nodeBorder: "#f3e600",
    clusterBkg: "rgba(243, 230, 0, 0.05)",
    clusterBorder: "#ff00ff",
    fontFamily: "Courier New",
    fontSize: "16px",
    defaultLinkColor: "#00ffff",
    tertiaryColor: "#000000"
  }
};

// Handshake with Material for MkDocs
const init = () => {
  if (typeof mermaid !== "undefined") {
    mermaid.initialize(window.mermaidConfig);
    // This is the critical line that tells the theme "I've got this"
    window.mermaid = mermaid; 
    mermaid.init();
  }
};

// Subscribe to both initial load and Instant Navigation
document.addEventListener("DOMContentLoaded", init);
if (typeof app !== "undefined") {
  app.document$.subscribe(init);
}