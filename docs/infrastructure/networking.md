# Networking Infrastructure

Network needs delivered and managed with a Unifi Dream Pro.

|Device|Model|Connectivity|
|-|-|-|
|Gateway/Router|Unifi Dream Machine Pro (UDM-Pro)|1G RJ45|
|Switching|Integrated UDM-Pro Switch|Nodes directly Connected|

```mermaid
graph TD
    %% External Entry
    Internet((Internet)) --> UDM[Unifi Dream Machine Pro]

    %% Infrastructure Subgraphs
    subgraph PVE00 [Proxmox Node: PVE-00 / Beelink SER5]
        direction TB
        D04[Docker-04: Adguard DNS]
        D05[Docker-05: Netrunner - AI/n8n]
    end

    subgraph PVE01 [Proxmox Node: PVE-01 / Legacy i7]
        direction TB
        D01[Docker-01: Traefik Reverse Proxy]
        D02[Docker-02: DB & Infisical]
        D03[Docker-03: Swarm Worker]
    end

    %% Network Flow
    UDM --> D01
    UDM --> D04

    %% Traefik Routing
    D01 -- HTTP/S Routing --> D02
    D01 -- HTTP/S Routing --> D03
    D01 -.-> D05
    
    %% Management/DNS
    D04 -.-> PVE00
    D04 -.-> PVE01

    %% Styling
    style D05 fill:#6c2525,stroke:#bc0404,stroke-width:2px
    style D01 fill:#29457b,stroke:#4571da,stroke-width:2px
    style UDM fill:#128412,stroke:#bab968,stroke-width:2px
```