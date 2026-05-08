# Hardware & Proxmox Infrastructure

This section documents the physical hardware and the virtualization layer powering the home lab. The environment is currently split between A Beelink Ser5 and an older gaming rig, both running separate instances of Proxmox VE.

## Proxmox Compute

The cluster consists of two primary nodes providing compute, storage, and networking for the stacks running on Docker Swarm nodes.

|Name|Platform|CPU|Memory|Storage|Network|
|-|-|-|-|-|-|
|PVE-00|Beelink SER5|AMD Ryzen 5 5500U (6C/12T)|32GB DDR4|500GB NVMe|1Gbps|
|PVE-01|Old Gaming Rig|Intel Core i7-4770K|28GB DDR3|2x 25G0GB SSDs, 2TB HDD|1Gbps|
|PVE-02|HP EliteDesk 705 G4 SFF|AMD Ryzen 5 PRO 2400G|8GB DDR4|128GB NVMe|1Gbps|
|PVE-03|Beelink-SEV-8V3|Intel(R) Core(TM) i5-8279U|16GB DDR4|500GB NVMe, 750GB SSD|1Gbps|
