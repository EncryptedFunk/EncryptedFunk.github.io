# Network Topology

The homelab has been designed to use a multi-node Swarm behind a Traefik Ingress.

## Traffic Flow

```mermaid
graph TD
    User((User)) -->|HTTPS| CF[Cloudflare]
    CF -->|Tunnel/Port Forward| T[Traefik: Docker-01]
    
    subgraph "Docker Swarm"
    T -->|Overlay Network| I[Infisical: Docker-02]
    T -->|Overlay Network| N[n8n: Docker-05]
    T -->|Internal| A[Adguard: Docker-04]
    end

    subgraph "Infrastructure"
    I -->|Persistence| V1[(Volume: Docker-02)]
    N -->|Compute| V2[(Memory: Docker-05)]
    end