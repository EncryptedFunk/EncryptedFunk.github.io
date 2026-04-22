# Notes and Layout Testing

!!! warning "System Alert: Identity Required"
    Infisical will fail to boot if the Machine Identity Client Secret is not provided in the environment.

!!! note "Netrunner Intel"
    Docker-05 is the high-compute node. Direct all LLM traffic here for optimal performance.

!!! error "Critical Failure"
    Invalid ENCRYPTION_KEY length detected. System shutting down.

!!! tip "System Status"
    All primary services are currently **Operational**. See the [Technical Hurdles](planning/hurdles.md) page for a log of previous "explosions."

Docker-05 is running Proxmox 8.1 (1)
(1): This is where we host the Ollama stack.

UI Component Test

1. Admonition Stress Test

!!! info "System Intel: Netrunner Blue"

Color Check: #29457b or #4571da

!!! tip "Terminal Shortcut"

Color Check: #bab968

!!! failure "Critical Breach: Synapse-Fried Red"

Color Check: #6c2525 or #bc0404

!!! quote "The Dungeon Master"

"Quantity has a quality all its own, Carl." — Use this for external references or log entries.

2. Content Tabs


=== "PowerShell"
powershell Write-Host "Initializing Swarm Node..." -ForegroundColor Cyan 

=== "Bash"
bash echo "Running post-exploit cleanup..." 

3. Data Tables

Check the header row color and cell borders here.
Node ID	Primary Service	Status	Latency
D-01	Traefik Proxy	Active	2ms
D-05	Ollama LLM	Computing	45ms
PVE-01	Proxmox Kernel	Locked	--
NAS-01	Shared Storage	Degraded	120ms
4. Annotations & Tooltips

Hover over the marker at the end of this sentence to see if the contrast holds up. (1)

(1): Encryption Key: 8Hjk-99Lm-Xq21 — If this text is hard to read against the tooltip background, we need to adjust your .md-annotate__content class.
5. Progress Bars & Buttons

Useful for the "Roadmap" floor to show how close you are to finishing a phase.

System Synchronization:
[=15% "Phase 1: Hardware"]
[=85% "Phase 2: Networking"]
[=0% "Phase 3: World Domination"]

[:material-rocket: Launch Console]{ .md-button .md-button--primary }
[View Source Code]{ .md-button }
