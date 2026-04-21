# Hardware & Proxmox Infrastructure

This section documents the physical hardware and the virtualization layer powering the home lab. The environment is currently split between A Beelink Ser5 and an older gaming rig, both running separate instances of Proxmox VE.

## Proxmox Compute

The cluster consists of two primary nodes providing compute, storage, and networking for the stacks running on Docker Swarm nodes.

|Name|Platform|CPU|Memory|Storage|Network|
|-|-|-|-|-|-|
|PVE-00|Beelink SER5|AMD Ryzen 5 5500U (6C/12T)|32GB DDR4|500GB NVMe|1Gbps|
|PVE-01|Old Gaming Rig|Intel Core i7-4770K|28GB DDR3|2x 25G0GB SSDs, 2TB HDD|1Gbps|
