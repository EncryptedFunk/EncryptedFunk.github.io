# Proxmox Templates

Proxmox scripting guides

## Downloading a base Rocky 10 image

```bash
# Create a directory for downloaded images
mkdir -p /opt/qcows
# Change Directory to the one created above
cd /opt/qcows/
# Get the image from the Rocky download site and output it with a shortened name.
wget -O rocky-10.qcow2 https://dl.rockylinux.org/pub/rocky/10.1/images/x86_64/Rocky-10-GenericCloud-Base-10.1-20251116.0.x86_64.qcow2
# Create a base VM with a minimum set of resources and tag it with the appropriate VLAN ID.
qm create 9999 --name "rocky-10-template" --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0,tag=40
# Import the downloaded image to the local-lvm storage location
qm importdisk 9999 /opt/qcows/rocky-10.qcow2 local-lvm
# Attach the downloaded image to the VM
qm set 9999 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9999-disk-0
# Add a Cloud-Init disk
qm set 9999 --scsi1 local-lvm:cloudinit
# Set the boot disk to the disk with the downloaded image
qm set 9999 --boot c --bootdisk scsi0
# Set the serial console
qm set 9999 --serial0 socket --vga serial0
# Convert the VM to a template
qm template 9999
```

## Rocky Linux Template Configuration

Once the base Rocky GenericCloud image is imported into Proxmox (VM 9999), we need to inject the global Cloud-Init variables. These are the "base stats" that every Swarm node will inherit when cloned.

**Phase 1: Configure Base Template (VM 9999)**
Run the following in the Proxmox shell to set the service account, domain, and DNS:

```bash
# Set the Service Account credentials
qm set 9999 --ciuser "svc_swarm"
qm set 9999 --cipassword "YourSuperSecretPassword"

# Set the Domain and DNS (Pointed to AdGuard Home in this case)
qm set 9999 --searchdomain yourdomain.loc
qm set 9999 --nameserver 192.168.1.53
```

!!! warning "System Alert: cipassword vs SSH Key"
    Tt is highly recommended to inject an SSH key (--sshkeys) for cluster security to prevent brute-force attacks

## Generating an SSH Key for Cloud-Init

Using a password for the service account is the less secure option. It is highly recommended to generate an SSH key pair for Proxmox and inject the public key into the Cloud-Init template.

**1. Generate the Key Pair**
Run this command from your main management workstation (or whichever machine you will use to SSH into the Swarm nodes). Do **not** run this inside the Proxmox shell unless you want the keys to live exclusively on the host.

```bash
# Generate an Ed25519 key (more secure and faster than RSA)
ssh-keygen -t ed25519 -C "svc_swarm@yourdomain.loc" -f ~/.ssh/id_ed25519_swarm
```

-t ed25519: Specifies the Ed25519 algorithm.

-C "svc_swarm@yourdomain.loc": Adds a comment to the key so you remember what it's for.

-f ~/.ssh/id_ed25519_swarm: Saves the key to a specific file so you don't overwrite your primary personal key.

You will be prompted to enter a passphrase. If this key is strictly for automated tools (like Ansible) to use, you can leave it blank, but if you are manually managing these nodes, you should add a strong passphrase.

**2. Inject the Public Key into Proxmox**
Once generated, you need the public key (the file ending in .pub).

```bash
cat ~/.ssh/id_ed25519_swarm.pub
```

Copy the entire output string. This can either be pasted directly into the Proxmox GUI under the VM's Cloud-Init tab (double-click the "SSH public key" field), or injected via the CLI:

If injecting via CLI, copy the .pub file to the Proxmox host and run the following command:

```bash
qm set 9999 --sshkeys id_ed25519_swarm.pub
```

## Phase 2: Deploying a Clone

Do NOT set a static IP on the base template. When a new VM is required, clone the template and apply the specific Static IP for the appropriate VLAN subnet before booting.

```bash
# 1. Clone the template to a new VM ID (e.g., 101)
qm clone 9999 40001 --name "swarm_manager_01" --full

# 2. Inject the specific Static IP and Gateway for this node
qm set 40001 --ipconfig0 ip=192.168.40.107/24,gw=192.168.40.1

qm set 40001 --memory 12288 --cores 6

qm resize 40001 scsi0 300G

# 3. Start the VM
qm start 40101
```

!!! note "Netrunner Intel"
    As a personal preference, I set the VM ID based on the VLAN and IP address that will be assigned to it. In the example above I used 40101 because the VM will be on VLAN 40 with an IP ending in .101.

!!! warning "You may need to expand your partition!"
Depending on the template OS, running qm resize may just make the virtual hard drive bigger on the Proxmox side. The operating system inside the VM doesn't automatically know it has more room to move around yet. Once you boot up the VM, you will still need to resize the partition and filesystem inside the guest OS (using tools like growpart and resize2fs, or xfs_growfs), unless you have your Cloud-Init configured to handle it automatically on the first boot.

### Unlocking EPEL and Installing Maintenance Tools (Rocky Linux)

After cloning from this base template, the default DNF repositories (1) only provide the absolute basics. To get useful maintenance tools, we first need to add the **EPEL** (2) repository.

1.  rocky-addons.repo  rocky-devel.repo  rocky-extras.repo  rocky.repo  rocky-security.repo
2.  Extra Packages for Enterprise Linux

Once EPEL is enabled, we can install some usefull tools:

* **`btop`**: A visually excellent, interactive resource monitor (a massive upgrade over standard `top` or `htop`).
* **`tree`**: A command-line utility for mapping out directory structures visually.

Run the following commands on your new VM:

```bash
# 1. Enable the CRB (CodeReady Builder) repo. 
# Many EPEL packages depend on libraries stored here.
sudo dnf config-manager --set-enabled crb

# 2. Install the EPEL release package
sudo dnf install epel-release -y

# 3. Refresh your package manager cache so it sees the new loot
sudo dnf makecache

# 4. Install the maintenance tools
sudo dnf install btop tree nano -y
```

!!! tip "Verifying the Installation"
Once the installation completes, type btop in the terminal to ensure the new resource monitor tool launches successfully. You should see a highly detailed breakdown of your CPU, Memory, and Network usage. Press q or Esc to exit back to the shell.

### Advanced Node Hardening: SSH and Sudo

Before deploying any heavy applications, we need to completely lock down our base Rocky Linux installation. This guide covers stripping root access, enabling passwordless sudo for our service account, and hardening the SSH daemon against unauthorized access.

#### 1. Service Account Sudo & Passwordless Access

First, ensure your standard service account is part of the `wheel` group for sudo access. Then, we will drop a configuration file into the `sudoers.d` directory to allow this specific user to execute `sudo` commands without being prompted for a password every time.

```bash
# Add the user to the wheel group (replace 'service_user' with your actual username)
sudo usermod -aG wheel service_user

# Enable passwordless sudo for the user
echo "service_user ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/service_user

# Secure the file permissions
sudo chmod 0440 /etc/sudoers.d/service_user
```

#### 2. The Warning Banner

It is a good practice (and sometimes a legal requirement in corporate environments) to display a warning banner to anyone attempting to connect to your server.

```bash
# Create the banner file
sudo nano /etc/issue.net
```

Paste a warning message of your choice, for example:

```text
WARNING: This system is restricted to authorized crawlers only. All activities on this system are logged. Unauthorized access will be met with immediate System AI intervention.
```

#### 3. Hardening the SSH Daemon (sshd_config)

Next, we edit the SSH configuration file to apply our security rules, enable enhanced logging, and shut the door on basic attacks.

```bash
sudo nano /etc/ssh/sshd_config
```

Find and modify the following lines in the file. If they are commented out with a #, remove the # and change the value.

```text
# 1. Disable Root Login
PermitRootLogin no

# 2. Enforce Public Key Authentication and Disable Passwords
PubkeyAuthentication yes
PasswordAuthentication no

# 3. Enable the custom warning banner
Banner /etc/issue.net

# 4. Enhanced Logging (Tracks exactly what keys/users are trying to authenticate)
SyslogFacility AUTHPRIV
LogLevel VERBOSE

# 5. Best Practice Security Tweaks
MaxAuthTries 3              # Drops connection after 3 failed attempts
X11Forwarding no            # Disables graphical forwarding (not needed for servers)
ClientAliveInterval 300     # Kicks idle sessions after 5 minutes of inactivity
ClientAliveCountMax 2
```

#### 4. Apply Changes safely

Save the file and restart the SSH daemon to apply the rules:

```bash
sudo systemctl restart sshd
```

!!! danger "The 'Don't Lock Yourself in the Bathroom' Rule"
CRITICAL: Because we just set PasswordAuthentication no, you MUST ensure your SSH Public Key (e.g., your id_ed25519.pub) is already copied into the ~/.ssh/authorized_keys file of your service_user account.

**DO NOT** close your current SSH terminal immediately after restarting the service! Open a *second* terminal window and verify that you can successfully log in using your SSH key. If you close your active session without a working key, you will be completely locked out and have to use the Proxmox web console to fix it.

!!! note "It may be necessary to provide the path when using ssh"
ssh -i ~/.ssh/<SSH_KEYNAME> USERNAME@servername_or_ip

### Adding the new VM to Docker Swarm: Engine, Swarm, and Portainer

Now that the node is secured and hardened, it's time to actually install the container engine and bring Docker-07 into the Swarm cluster.

Since we are running Rocky Linux, we need to add the official Docker CentOS repository (which Rocky is 100% compatible with) before we can install the engine.

#### 1. Installing Docker Engine

Run the following commands on Docker-07 to add the repo, install the packages, and start the daemon:

```bash
# Add the official Docker repository
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker Engine, CLI, and Containerd
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Enable the service to start on boot, and start it immediately
sudo systemctl enable --now docker

# Optional: Add your service account to the docker group so you don't need sudo for every docker command
sudo usermod -aG docker service_user
```

!!! note "you get an error enabling the Docker service"
    You may get an error enabling Docker. If so, a reboot should resolve this.

(Note: If you add yourself to the docker group, you will need to log out and log back in for the permissions to take effect).

#### 2. Joining the Docker Swarm

To add Docker-07 to the cluster, you first need the authorization token.

1. On your Swarm Manager Node (e.g., Docker-01): Run the following command to reveal the worker token:

```bash
docker swarm join-token worker
```

2. On Docker-07: Paste the exact output generated by the manager node. It will look something like this:

```bash
docker swarm join --token SWMTKN-1-xxxxxxxxxxxxxxxxxxxxxxxxx 192.168.10.X:2377
```

If successful, the terminal will reply with: This node joined a swarm as a worker.

#### 3. Making it Visible in Portainer

Here is the beauty of Docker Swarm: if you deployed Portainer and the Portainer Agent correctly when you first built the cluster, you don't have to do anything else.

When the Portainer Agent is deployed as a global service within a Swarm, the Swarm Manager automatically detects that a new node has entered the arena. The manager will instantly spawn a replica of the Portainer Agent onto Docker-07.

Wait about 60 seconds, refresh your Portainer web interface, go to your Environments or Swarm tab, and Docker-07 should magically appear in your cluster inventory, fully monitored and ready to accept deployments.