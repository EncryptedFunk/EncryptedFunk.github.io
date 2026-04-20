// This ensures Mermaid works even with MkDocs Material's instant loading
document.addEventListener("DOMContentLoaded", function() {
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({ startOnLoad: true });
  }
});

// Hook into MkDocs Material's page transition event
if (typeof app !== "undefined") {
  app.document$.subscribe(function() {
    if (typeof mermaid !== "undefined") {
      mermaid.init();
    }
  });
}

window.mermaidConfig = {
  startOnLoad: true,
  theme: "base",
  themeVariables: {
    // Background and Primary Colors
    primaryColor: "#000000",
    primaryTextColor: "#f3e600",
    primaryBorderColor: "#f3e600",
    lineColor: "#00ffff", // Neon Cyan for connection lines
    secondaryColor: "#050505",
    tertiaryColor: "#000000",
    
    // Text Glow Effect
    fontFamily: "Courier New",
    fontSize: "16px",
    
    // Node styling
    nodeBorder: "#f3e600",
    clusterBkg: "rgba(243, 230, 0, 0.05)",
    clusterBorder: "#ff00ff", // Neon Pink for the "Docker Swarm" box
    
    // Edge/Arrow styling
    edgeLabelBackground: "#000000",
    defaultLinkColor: "#00ffff"
  }
};