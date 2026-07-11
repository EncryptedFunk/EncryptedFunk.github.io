# Gitlab

## Deploying GitLab as a Docker Swarm Stack

With Docker-07 online, expanded, and secured, we can finally deploy GitLab. Because we are running this in a Docker Swarm, we cannot just use a standard `docker run` command. We need a Compose Stack that explicitly tells the Swarm Manager to **never** move this container off our high-compute node.

### The Stack Configuration

In Portainer, navigate to **Stacks -> Add Stack**. Name it `gitlab-core` (or similar) and paste the following configuration:

```yaml
version: '3.8'

services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    hostname: 'gitlab.encryptidfunk.net' # Update this to your actual domain
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        # Set the external URL for your repository
        external_url '[https://gitlab.encryptidfunk.net](https://gitlab.encryptidfunk.net)'
        # Tell GitLab that SSH cloning should use port 2222 instead of 22
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
    ports:
      - '80:80'
      - '443:443'
      - '2222:22' # Maps host port 2222 to container port 22
    volumes:
      - 'gitlab_config:/etc/gitlab'
      - 'gitlab_logs:/var/log/gitlab'
      - 'gitlab_data:/var/opt/gitlab'
    deploy:
      # THE ANCHOR: This prevents Swarm from moving GitLab to weaker nodes
      placement:
        constraints:
          - node.hostname == Docker-07
      # THE LEASH: Prevents GitLab from eating the entire node's memory
      resources:
        limits:
          memory: 10G
        reservations:
          memory: 4G

volumes:
  gitlab_config:
  gitlab_logs:
  gitlab_data:
```

!!! tip "Traefik Integration Notes"
If you are utilizing Traefik as your Swarm ingress controller (as planned for the broader homelab), you will eventually remove the ports: 80:80 and 443:443 blocks and replace them with Traefik labels: in the deploy section, tying it to your proxy network. However, port 2222:22 must remain exposed for raw SSH Git cloning.

!!! failure "The 'Patience, Crawler' Warning"
GitLab takes an agonizingly long time to start up on its first boot. It has to initialize a PostgreSQL database, Redis caches, and dozens of background workers. Do not panic if you get a 502 Bad Gateway error for the first 5 to 10 minutes. Monitor the container logs in Portainer. Once the logs settle down, the web interface will become accessible.
