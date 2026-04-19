# Network Topology

The homelab has been designed to use a multi-node Swarm behind a Traefik Ingress.

## Traffic Flow

```mermaid
graph TD
    User((User)) --&gt;|HTTPS| CF[Cloudflare]
    CF --&gt;|Tunnel/Port Forward| T[Traefik: Docker-01]
    
    subgraph &quot;Docker Swarm&quot;
    T --&gt;|Overlay Network| I[Infisical: Docker-02]
    T --&gt;|Overlay Network| N[n8n: Docker-05]
    T --&gt;|Internal| A[Adguard: Docker-04]
    end

    subgraph &quot;Infrastructure&quot;
    I --&gt;|Persistence| V1[(Volume: Docker-02)]
    N --&gt;|Compute| V2[(Memory: Docker-05)]
    end
