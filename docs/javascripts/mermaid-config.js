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