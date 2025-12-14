/* Virtualization Exam (100 MCQs) - GitHub Pages Ready
   Data structure:
   { id, topic, difficulty, q, options:[], answerIndex, reason }
*/

const QUESTIONS = [
  // ===== STORAGE (1-25) =====
  {id:1, topic:"STORAGE", difficulty:"EASY", q:"Which storage type is directly attached to a physical server and typically not shared over the network?", options:["NAS","SAN","Local storage","IP SAN"], answerIndex:2, reason:"Local storage is directly attached to the host and not inherently shared."},
  {id:2, topic:"STORAGE", difficulty:"EASY", q:"Which option is MOST associated with file-level shared access?", options:["SAN","NAS","Fibre Channel","Block LUN"], answerIndex:1, reason:"NAS provides file-level access (e.g., NFS/SMB) and shared directories."},
  {id:3, topic:"STORAGE", difficulty:"EASY", q:"Which storage approach is typically block-based?", options:["NAS","SAN","SMB share","NFS export"], answerIndex:1, reason:"SAN commonly exposes block devices (LUNs) to hosts."},
  {id:4, topic:"STORAGE", difficulty:"MEDIUM", q:"Which statement about a datastore is NOT correct?", options:["A datastore is a manageable logical storage unit","A datastore corresponds to a storage device/logical unit","A datastore carries VM services such as disk creation","A datastore can contain multiple storage devices"], answerIndex:3, reason:"In the taught model, a datastore corresponds to one logical storage unit/device, not multiple devices inside it."},
  {id:5, topic:"STORAGE", difficulty:"MEDIUM", q:"Thin provisioning primarily helps by:", options:["Encrypting VM disks","Allocating capacity on-demand to improve utilization","Increasing CPU scheduling fairness","Reducing broadcast domains"], answerIndex:1, reason:"Thin provisioning delays physical space allocation until data is actually written."},
  {id:6, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is a typical advantage of shared storage (SAN/NAS) in virtualization clusters?", options:["VM files are accessible only to one host","Supports features like live migration/HA by shared access","Eliminates the need for hypervisors","Prevents VLAN tagging"], answerIndex:1, reason:"Shared access to VM disk files across hosts enables cluster features like live migration."},
  {id:7, topic:"STORAGE", difficulty:"MEDIUM", q:"NAS commonly provides a shared directory via:", options:["NFS/SMB","FCoE frames","PCIe pass-through","MAC learning"], answerIndex:0, reason:"NAS exposes shared folders, typically over NFS or SMB."},
  {id:8, topic:"STORAGE", difficulty:"HARD", q:"During datastore migration, what is the critical safety condition?", options:["Datastore must be empty","All hosts must be powered off","No VM files are actively in use during the migration","Datastore must be local storage"], answerIndex:2, reason:"Active use of VM files risks inconsistency/corruption during migration."},
  {id:9, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is MOST cost-effective for SAN over standard Ethernet/TCP-IP infrastructure?", options:["Fibre Channel","iSCSI","SAS backplane","USB-attached storage"], answerIndex:1, reason:"iSCSI uses Ethernet and TCP/IP, avoiding specialized FC fabrics in many cases."},
  {id:10, topic:"STORAGE", difficulty:"EASY", q:"Which feature lets you revert a VM disk state to a previous point in time?", options:["Template","Snapshot","Trunk link","VLAN"], answerIndex:1, reason:"Snapshots capture point-in-time VM state for rollback (with caveats)."},
  {id:11, topic:"STORAGE", difficulty:"MEDIUM", q:"Which storage is typically preferred for high-performance, block-level database workloads?", options:["NAS file share","SAN LUN","Tape archive","Local USB"], answerIndex:1, reason:"SAN provides block storage (LUNs) suited to many DB patterns."},
  {id:12, topic:"STORAGE", difficulty:"HARD", q:"A common disk type in some virtualization platforms generally means the disk:", options:["Can be used by only one VM","Can be used by multiple VMs concurrently","Cannot be used by any VM","Must be stored on NAS only"], answerIndex:0, reason:"Common/non-shared disks are typically attached to a single VM at a time."},
  {id:13, topic:"STORAGE", difficulty:"MEDIUM", q:"Which best describes a virtualized datastore concept?", options:["A physical disk only","A logical, manageable unit used to provide VM storage services","A VLAN trunk","A kernel module"], answerIndex:1, reason:"Datastores are logical storage units managed by the virtualization platform."},
  {id:14, topic:"STORAGE", difficulty:"HARD", q:"Which statement is MOST accurate about snapshots?", options:["Snapshots replace backups","Snapshots are always performance-neutral","Snapshots are useful temporarily but can grow and impact performance","Snapshots only work on local disks"], answerIndex:2, reason:"Snapshots are short-term safety nets; long-lived snapshots can degrade performance and grow large."},
  {id:15, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is a typical advanced NAS capability mentioned in virtualization storage contexts?", options:["Broadcast storm protection","Snapshots/replication","CPU virtualization extensions","VLAN tagging"], answerIndex:1, reason:"NAS often offers advanced features like snapshots and replication."},
  {id:16, topic:"STORAGE", difficulty:"EASY", q:"IP SAN refers to SAN access over:", options:["Ethernet/TCP-IP","Only Fibre Channel","Only USB","Only Wi-Fi"], answerIndex:0, reason:"IP SAN (e.g., iSCSI) uses Ethernet and TCP/IP networks."},
  {id:17, topic:"STORAGE", difficulty:"MEDIUM", q:"Which scenario BEST fits NAS usage?", options:["Shared file access for many clients/VMs (NFS)","Ultra-low latency FC-only storage","CPU scheduling improvements","Layer-2 segmentation"], answerIndex:0, reason:"NAS shines for shared file/directory access like NFS."},
  {id:18, topic:"STORAGE", difficulty:"HARD", q:"Which requirement is MOST essential for live VM migration from a storage perspective?", options:["Huge disk capacity","Shared access to VM disk files across hosts","Local disk only","Snapshots enabled"], answerIndex:1, reason:"Live migration needs shared visibility of VM storage between hosts."},
  {id:19, topic:"STORAGE", difficulty:"MEDIUM", q:"Block storage is primarily accessed by:", options:["Files and directories","Logical blocks (LUN)","MAC addresses","VLAN IDs"], answerIndex:1, reason:"Block storage exposes raw blocks rather than file structures."},
  {id:20, topic:"STORAGE", difficulty:"MEDIUM", q:"A key benefit of thin provisioning is:", options:["Immediate full allocation of space","Better capacity utilization by allocating only what is used","Eliminating storage networking","Preventing ARP broadcasts"], answerIndex:1, reason:"Thin provisioning helps avoid allocating unused space up front."},
  {id:21, topic:"STORAGE", difficulty:"HARD", q:"If VM disks are on local storage, which cluster feature is MOST impacted?", options:["Centralized vSwitch management","Live migration between hosts","VLAN tagging","DNS resolution"], answerIndex:1, reason:"Local-only disks prevent other hosts from accessing VM files for migration."},
  {id:22, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is NOT a storage resource type in typical virtualization resource lists?", options:["SAN","NAS","Local disk","Local memory (RAM)"], answerIndex:3, reason:"RAM is a compute resource, not a storage resource type."},
  {id:23, topic:"STORAGE", difficulty:"HARD", q:"What is the safest interpretation of “datastore corresponds to a storage device” in taught models?", options:["One datastore maps to one logical storage unit/device (e.g., LUN)","One datastore always contains many devices","Datastore is the same as VLAN","Datastore exists only for templates"], answerIndex:0, reason:"A datastore maps to one logical unit/device in the presented model."},
  {id:24, topic:"STORAGE", difficulty:"MEDIUM", q:"Which is a common reason shared storage improves availability?", options:["It disables isolation","It enables other hosts to access VM disks if one host fails","It removes the need for networks","It forces all VMs to share the same IP"], answerIndex:1, reason:"Shared storage allows failover/restart of VMs on other hosts."},
  {id:25, topic:"STORAGE", difficulty:"MEDIUM", q:"Which protocol is most closely associated with iSCSI?", options:["TCP/IP","Bluetooth","IEEE 802.11 only","RS-232"], answerIndex:0, reason:"iSCSI encapsulates SCSI over TCP/IP."},

  // ===== NETWORK (26-50) =====
  {id:26, topic:"NETWORK", difficulty:"EASY", q:"Which OSI layer is responsible for logical addressing (IP)?", options:["Data Link","Network","Transport","Session"], answerIndex:1, reason:"Layer 3 (Network) handles IP addressing and routing."},
  {id:27, topic:"NETWORK", difficulty:"EASY", q:"Which OSI layer primarily uses MAC addresses?", options:["Physical","Data Link","Network","Transport"], answerIndex:1, reason:"Layer 2 uses MAC addresses and switching."},
  {id:28, topic:"NETWORK", difficulty:"MEDIUM", q:"VLAN technology mainly helps mitigate:", options:["TCP congestion","Broadcast storms in Layer 2 domains","CPU overcommitment","Disk fragmentation"], answerIndex:1, reason:"VLANs segment Layer 2 broadcast domains to reduce broadcast impact."},
  {id:29, topic:"NETWORK", difficulty:"EASY", q:"A trunk link is used to:", options:["Carry a single VLAN only","Carry multiple VLANs on one link","Disable VLANs","Replace routers"], answerIndex:1, reason:"Trunks carry tagged traffic for multiple VLANs."},
  {id:30, topic:"NETWORK", difficulty:"EASY", q:"An access link is typically used to:", options:["Carry multiple VLANs","Carry one VLAN to an endpoint","Encapsulate FC frames","Provide VM snapshots"], answerIndex:1, reason:"Access ports map untagged traffic to a single VLAN."},
  {id:31, topic:"NETWORK", difficulty:"MEDIUM", q:"Why can broadcast traffic be more problematic in virtual networks?", options:["vSwitches block broadcasts by default","High VM density amplifies broadcast fan-out","Broadcasts affect only storage","Hypervisors filter all broadcasts"], answerIndex:1, reason:"More endpoints (VMs) on the same domain can magnify broadcast overhead."},
  {id:32, topic:"NETWORK", difficulty:"MEDIUM", q:"Which feature best guarantees/controls VM bandwidth on a virtual switch?", options:["VLAN tagging","Traffic shaping","ARP","Spanning tree"], answerIndex:1, reason:"Traffic shaping controls rate/limits and can enforce bandwidth policies."},
  {id:33, topic:"NETWORK", difficulty:"MEDIUM", q:"Standard vSwitch is best described as:", options:["Centralized across hosts","Configured per host","A physical switch","A storage protocol"], answerIndex:1, reason:"Standard vSwitch is host-local; each ESXi host has its own configuration."},
  {id:34, topic:"NETWORK", difficulty:"MEDIUM", q:"Distributed vSwitch (DVS) is best described as:", options:["Host-local only","Centralized management across multiple hosts","Only for storage networks","Does not support VLANs"], answerIndex:1, reason:"DVS provides centralized configuration for multiple hosts."},
  {id:35, topic:"NETWORK", difficulty:"HARD", q:"Which statement is NOT correct about Standard vSwitch?", options:["Configured per ESXi host","Can connect VMs on the same host","Uses physical NICs as uplinks","Can be deployed across multiple physical servers as one shared switch"], answerIndex:3, reason:"Standard vSwitch is not shared across servers; DVS is designed for multi-host centralization."},
  {id:36, topic:"NETWORK", difficulty:"MEDIUM", q:"Why does DVS reduce configuration errors at scale?", options:["Eliminates VLAN usage","Centralizes configuration","Replaces physical switches","Works without uplinks"], answerIndex:1, reason:"Centralized configuration avoids inconsistent per-host settings."},
  {id:37, topic:"NETWORK", difficulty:"MEDIUM", q:"Which is a typical use-case for a VM connected to a trunk port group?", options:["Belongs to only one VLAN always","Handles traffic from multiple VLANs (e.g., virtual firewall/router)","Cannot use tagging","Bypasses physical network"], answerIndex:1, reason:"Trunking to a VM supports multi-VLAN appliances."},
  {id:38, topic:"NETWORK", difficulty:"EASY", q:"Which layer does TCP operate on?", options:["Layer 2","Layer 3","Layer 4","Layer 7"], answerIndex:2, reason:"TCP is a Transport layer protocol (Layer 4)."},
  {id:39, topic:"NETWORK", difficulty:"HARD", q:"Broadcast storms are primarily a concern in which type of domain?", options:["Collision domain","Broadcast domain","Routing domain","TLS domain"], answerIndex:1, reason:"Broadcast storms occur when excessive broadcasts flood a broadcast domain."},
  {id:40, topic:"NETWORK", difficulty:"MEDIUM", q:"Which is the main purpose of VLAN segmentation?", options:["Increase CPU","Reduce/segment broadcast domains","Encrypt traffic","Replace routing"], answerIndex:1, reason:"VLANs logically separate Layer 2 segments (broadcast domains)."},
  {id:41, topic:"NETWORK", difficulty:"MEDIUM", q:"A physical server can connect to:", options:["Only one vSwitch total","Multiple Standard vSwitches","Only one DVS","No virtual switches"], answerIndex:1, reason:"A host can have multiple virtual switches, depending on design."},
  {id:42, topic:"NETWORK", difficulty:"MEDIUM", q:"A host can be connected to multiple DVSs:", options:["Never supported","Supported depending on platform/design","Only if no VLANs","Only for templates"], answerIndex:1, reason:"Hosts can attach to multiple distributed switches when designed that way."},
  {id:43, topic:"NETWORK", difficulty:"HARD", q:"Which option best describes why VLANs help with Layer 2 broadcast traffic issues?", options:["They increase broadcast reach","They isolate broadcast domains","They move traffic to Layer 4","They remove the need for switching"], answerIndex:1, reason:"VLANs isolate broadcast domains so broadcasts don’t flood all nodes."},
  {id:44, topic:"NETWORK", difficulty:"EASY", q:"Trunk links usually carry VLANs using:", options:["VLAN tags","IP addresses","CPU microcode","Disk blocks"], answerIndex:0, reason:"Trunks use VLAN tagging (e.g., 802.1Q)."},
  {id:45, topic:"NETWORK", difficulty:"HARD", q:"Which is MOST relevant for monitoring/observability of traffic flows in virtual networks?", options:["Port mirroring","Thin provisioning","Templates","Snapshots"], answerIndex:0, reason:"Port mirroring copies traffic for analysis/troubleshooting."},
  {id:46, topic:"NETWORK", difficulty:"MEDIUM", q:"Which statement about broadcast traffic is TRUE?", options:["It never reaches VMs","It can consume bandwidth/CPU processing on many endpoints","It is encrypted by default","It is only storage traffic"], answerIndex:1, reason:"Broadcasts must be processed by many endpoints, causing overhead."},
  {id:47, topic:"NETWORK", difficulty:"MEDIUM", q:"Which is a key design reason to use VLANs in a data center?", options:["Increase disk IOPS","Traffic isolation between tenants/apps","Replace hypervisors","Increase RAM"], answerIndex:1, reason:"VLANs provide Layer 2 isolation between groups/tenants."},
  {id:48, topic:"NETWORK", difficulty:"HARD", q:"If you need consistent port group policy across many hosts, which is most appropriate?", options:["Standard vSwitch only","Distributed vSwitch","Local disk","Template"], answerIndex:1, reason:"DVS centralizes policies across multiple hosts."},
  {id:49, topic:"NETWORK", difficulty:"MEDIUM", q:"Access vs Trunk: access is typically used for:", options:["Carrying many VLANs","Single VLAN endpoint access","Carrying FC frames","Implementing snapshots"], answerIndex:1, reason:"Access ports associate untagged traffic with one VLAN."},
  {id:50, topic:"NETWORK", difficulty:"MEDIUM", q:"Traffic shaping is critical in multi-tenant environments because it:", options:["Eliminates broadcast traffic","Guarantees fair bandwidth allocation","Replaces physical switches","Disables VLAN hopping"], answerIndex:1, reason:"It enforces bandwidth policies so one VM/tenant can’t starve others."},

  // ===== VMs/TEMPLATES (51-75) =====
  {id:51, topic:"VMS", difficulty:"EASY", q:"A primary advantage of VM templates is:", options:["Manual OS install every time","Faster standardized VM deployment","Disabling snapshots","Reducing storage capacity"], answerIndex:1, reason:"Templates accelerate consistent VM provisioning."},
  {id:52, topic:"VMS", difficulty:"MEDIUM", q:"Which is NOT a method to create a VM template?", options:["Convert powered-off VM to template","Clone VM to template","Install an OS directly on a template","Deploy VM then convert to template"], answerIndex:2, reason:"Templates are not typically installed to directly; you prepare a VM then convert/clone."},
  {id:53, topic:"VMS", difficulty:"EASY", q:"Which feature allows temporary rollback to a previous VM state?", options:["Snapshot","Trunk link","VLAN","Datastore migration"], answerIndex:0, reason:"Snapshots allow reverting to earlier VM state."},
  {id:54, topic:"VMS", difficulty:"MEDIUM", q:"Which approach MOST reduces configuration inconsistency across environments (Dev/Test/Prod)?", options:["Manual installs","VM snapshots","VM templates","Local storage cloning"], answerIndex:2, reason:"Templates enforce consistent baselines across deployments."},
  {id:55, topic:"VMS", difficulty:"MEDIUM", q:"VM Tools typically provide:", options:["Hardware virtualization extensions","Better mouse/graphics integration and guest enhancements","VLAN trunking on physical switches","SAN zoning"], answerIndex:1, reason:"VM Tools enhance guest OS integration and performance features."},
  {id:56, topic:"VMS", difficulty:"HARD", q:"Which statement about snapshots is MOST accurate for exam scenarios?", options:["Snapshots replace backups","Snapshots should be long-lived always","Snapshots are best used temporarily; long-lived snapshots can impact performance","Snapshots work only on FC SAN"], answerIndex:2, reason:"Snapshots are short-term safety nets; long-lived ones may degrade performance."},
  {id:57, topic:"VMS", difficulty:"MEDIUM", q:"A common workflow to make a reusable VM template is:", options:["Create VM → configure OS/apps → convert/clone to template","Create datastore → convert to template","Create VLAN → convert to template","Enable KVM → convert kernel"], answerIndex:0, reason:"Templates come from a prepared, configured VM baseline."},
  {id:58, topic:"VMS", difficulty:"HARD", q:"Which VM deployment option MOST directly improves provisioning speed AND standardization?", options:["Snapshots","Templates","Broadcast control","MAC learning"], answerIndex:1, reason:"Templates are designed for fast, consistent provisioning."},
  {id:59, topic:"VMS", difficulty:"EASY", q:"VM Tools is installed in:", options:["The physical switch","The guest OS inside the VM","The SAN fabric","The VLAN trunk"], answerIndex:1, reason:"VM Tools runs inside the guest OS."},
  {id:60, topic:"VMS", difficulty:"MEDIUM", q:"If you need many identical VMs quickly, the best method is:", options:["Manual installs","Template deployment","Re-cabling switches","RAID rebuild"], answerIndex:1, reason:"Templates provide pre-configured images for fast deployment."},
  {id:61, topic:"VMS", difficulty:"MEDIUM", q:"Which statement about templates is TRUE?", options:["Templates are used to deploy new VMs","Templates are always running VMs","Templates eliminate the need for storage","Templates are VLAN constructs"], answerIndex:0, reason:"Templates serve as golden images to deploy new VMs."},
  {id:62, topic:"VMS", difficulty:"HARD", q:"VM Tools functions typically include:", options:["Time synchronization, improved drivers/integration","Hypervisor kernel patching","Fibre Channel zoning","Datastore replication"], answerIndex:0, reason:"Guest tools provide time sync and enhanced drivers/features."},
  {id:63, topic:"VMS", difficulty:"MEDIUM", q:"A key risk of relying on snapshots as backups is:", options:["Snapshots are always offsite","Snapshots can be deleted automatically and may not protect against all failures","Snapshots encrypt storage","Snapshots increase VLAN count"], answerIndex:1, reason:"Snapshots are not full backups and can be lost/corrupt if storage fails."},
  {id:64, topic:"VMS", difficulty:"MEDIUM", q:"Which is a typical reason to use templates in enterprises?", options:["Increase broadcast storms","Standardize OS patch level","Replace networks","Disable hypervisors"], answerIndex:1, reason:"Templates standardize baseline OS/apps/patches."},
  {id:65, topic:"VMS", difficulty:"HARD", q:"If a template is updated, the most consistent approach is to:", options:["Update every deployed VM manually only","Rebuild the golden image VM and re-convert to template","Disable storage features","Change VLAN IDs"], answerIndex:1, reason:"Maintain a golden VM image, then convert it to a new template revision."},
  {id:66, topic:"VMS", difficulty:"MEDIUM", q:"Which feature is best for quick rollback after a risky change?", options:["Template","Snapshot","VLAN trunk","iSCSI"], answerIndex:1, reason:"Snapshots are intended for short-term rollback before/after changes."},
  {id:67, topic:"VMS", difficulty:"EASY", q:"Cloning a VM generally means:", options:["Copying a VM to create a new VM instance","Creating a VLAN tag","Creating a datastore LUN","Enabling TCP"], answerIndex:0, reason:"Cloning duplicates a VM to create a new instance."},
  {id:68, topic:"VMS", difficulty:"HARD", q:"Which is MOST likely to be considered an 'advanced function' enabled by VM Tools?", options:["Mouse pointer integration","SAN zoning","Switch trunk configuration","Kernel module loading in host"], answerIndex:0, reason:"VM Tools improves guest usability and integration like mouse/graphics."},
  {id:69, topic:"VMS", difficulty:"MEDIUM", q:"The main purpose of a template is to:", options:["Act as a network switch","Provide a reusable VM baseline image","Replace shared storage","Reduce IP addresses"], answerIndex:1, reason:"Templates are reusable baselines for new VM deployments."},
  {id:70, topic:"VMS", difficulty:"MEDIUM", q:"Which is NOT a benefit of templates?", options:["Consistency","Speed","Reduced manual errors","Guaranteed higher CPU frequency"], answerIndex:3, reason:"Templates improve deployment workflow, not raw CPU frequency."},
  {id:71, topic:"VMS", difficulty:"HARD", q:"When should you generally remove snapshots in production?", options:["Never","Only after years","After validation and when no longer needed","Only when VLAN changes"], answerIndex:2, reason:"Long-lived snapshots can degrade performance; remove after changes are verified."},
  {id:72, topic:"VMS", difficulty:"MEDIUM", q:"What’s the best exam answer describing why templates matter in Dev/Test/Prod?", options:["They increase broadcast traffic","They enforce identical baselines across environments","They remove the need for SAN","They replace routing"], answerIndex:1, reason:"Templates standardize baselines across environments."},
  {id:73, topic:"VMS", difficulty:"MEDIUM", q:"Which is most likely a prerequisite for converting a VM to a template?", options:["VM must be powered off","VM must be connected to trunk","VM must be on local memory","VM must use TCP"], answerIndex:0, reason:"Often a VM must be powered off to convert to a template."},
  {id:74, topic:"VMS", difficulty:"HARD", q:"Which is a correct statement about template vs snapshot?", options:["Template is for rollback; snapshot is for provisioning","Template is for provisioning; snapshot is for rollback","Both mean the same thing","Neither relates to VMs"], answerIndex:1, reason:"Templates provision; snapshots rollback."},
  {id:75, topic:"VMS", difficulty:"MEDIUM", q:"Which provides standardized, repeatable provisioning at scale?", options:["Snapshots","Templates","Broadcasts","MAC flooding"], answerIndex:1, reason:"Templates are the standard provisioning mechanism."},

  // ===== KVM/QEMU (76-88) =====
  {id:76, topic:"KVM", difficulty:"EASY", q:"KVM is best described as:", options:["A Linux kernel module enabling hardware virtualization","A storage protocol","A VLAN feature","A physical switch"], answerIndex:0, reason:"KVM integrates virtualization into the Linux kernel using CPU virtualization extensions."},
  {id:77, topic:"KVM", difficulty:"MEDIUM", q:"QEMU's primary role in KVM-based virtualization is:", options:["Hardware/device emulation","VLAN segmentation","SAN replication","CPU microcode updates"], answerIndex:0, reason:"QEMU provides device emulation and userspace virtualization support."},
  {id:78, topic:"KVM", difficulty:"MEDIUM", q:"Which statement BEST describes KVM and QEMU together?", options:["QEMU replaces KVM entirely","KVM enables hardware virtualization and QEMU provides device emulation","KVM manages VLANs and QEMU manages SAN","QEMU is only for templates"], answerIndex:1, reason:"KVM provides kernel acceleration; QEMU emulates devices and coordinates VM execution."},
  {id:79, topic:"KVM", difficulty:"HARD", q:"Hardware virtualization extensions commonly refer to:", options:["Intel VT-x / AMD-V","802.1Q","NFSv4","Fibre Channel zoning"], answerIndex:0, reason:"VT-x/AMD-V are CPU features used by hypervisors like KVM."},
  {id:80, topic:"KVM", difficulty:"MEDIUM", q:"In KVM stacks, VM lifecycle management is often done via:", options:["Only QEMU CLI always","Management layers (e.g., libvirt) + QEMU/KVM","VLAN trunk ports","SAN LUN masking"], answerIndex:1, reason:"Common deployments use management layers around QEMU/KVM."},
  {id:81, topic:"KVM", difficulty:"HARD", q:"Which is NOT a typical responsibility of QEMU in KVM context?", options:["Emulating virtual NICs/disks","Providing userspace device models","Handling VM instructions with KVM acceleration","Configuring VLANs on physical switches"], answerIndex:3, reason:"Physical switch VLAN configuration is outside QEMU’s role."},
  {id:82, topic:"KVM", difficulty:"MEDIUM", q:"KVM lives in:", options:["Linux kernel space","A physical switch ASIC","NAS controller firmware only","OSI Layer 4"], answerIndex:0, reason:"KVM is a kernel module (kernel space)."},
  {id:83, topic:"KVM", difficulty:"HARD", q:"If KVM acceleration is unavailable, QEMU can still run VMs using:", options:["Full software emulation (slower)","802.1Q tagging","SAN zoning","TCP congestion control"], answerIndex:0, reason:"Without KVM, QEMU may fall back to full emulation, typically slower."},
  {id:84, topic:"KVM", difficulty:"MEDIUM", q:"Which pairing is correct?", options:["KVM = device emulation; QEMU = kernel virtualization","KVM = kernel virtualization; QEMU = device emulation","KVM = VLAN; QEMU = SAN","KVM = NAS; QEMU = FC"], answerIndex:1, reason:"KVM accelerates virtualization in kernel; QEMU emulates devices."},
  {id:85, topic:"KVM", difficulty:"HARD", q:"A practical benefit of KVM + QEMU architecture is:", options:["Centralized DVS management","Combining kernel acceleration with flexible device models","Replacing iSCSI","Eliminating need for VM images"], answerIndex:1, reason:"Kernel acceleration (KVM) + flexible device models (QEMU) is powerful and common."},
  {id:86, topic:"KVM", difficulty:"MEDIUM", q:"Which is a correct statement about KVM?", options:["It is a storage array feature","It is a hypervisor implemented as part of Linux kernel","It is a VLAN tagging protocol","It is a file sharing protocol"], answerIndex:1, reason:"KVM provides hypervisor capabilities via the Linux kernel."},
  {id:87, topic:"KVM", difficulty:"HARD", q:"Which is MOST accurate about where VM Tools fits compared to KVM/QEMU?", options:["VM Tools replaces QEMU","VM Tools runs in guest OS; KVM/QEMU are host virtualization components","VM Tools configures SAN zoning","VM Tools creates VLAN trunks"], answerIndex:1, reason:"VM Tools is guest-side; KVM/QEMU are host-side virtualization stack."},
  {id:88, topic:"KVM", difficulty:"MEDIUM", q:"KVM-based virtualization typically requires:", options:["CPU virtualization extensions support","VLAN-only networks","NAS-only storage","No hypervisor"], answerIndex:0, reason:"Hardware virtualization extensions are commonly required/used for acceleration."},

  // ===== XEN (89-100) =====
  {id:89, topic:"XEN", difficulty:"MEDIUM", q:"In Xen, the control API is mainly used for:", options:["Managing VM lifecycle operations","Providing hardware emulation only","VLAN tagging","Disk defragmentation"], answerIndex:0, reason:"Control APIs handle creation/start/stop and management tasks."},
  {id:90, topic:"XEN", difficulty:"HARD", q:"Which is the best description of Xen’s control plane role?", options:["Controls and manages VMs via APIs/tools","Replaces physical disks","Acts as an L2 switch","Provides NFS exports"], answerIndex:0, reason:"Xen control plane coordinates and manages guest lifecycle and resources."},
  {id:91, topic:"XEN", difficulty:"MEDIUM", q:"Which is MOST associated with Xen hypervisor architecture conceptually?", options:["Domains (Dom0/DomU) and control mechanisms","VLAN trunking only","SAN zoning only","Templates only"], answerIndex:0, reason:"Xen uses domain-based architecture with privileged control domain."},
  {id:92, topic:"XEN", difficulty:"HARD", q:"Which statement is MOST exam-correct about Xen control API vs QEMU in KVM?", options:["Both are the same component","Xen control API is for VM management; QEMU is for device emulation in KVM stacks","Xen control API is VLAN tagging; QEMU is SAN","QEMU is for Xen templates only"], answerIndex:1, reason:"They serve different roles: Xen control for management; QEMU for emulation in KVM."},
  {id:93, topic:"XEN", difficulty:"MEDIUM", q:"A key job of virtualization control interfaces (like Xen control API) is:", options:["Provision, start/stop, configure VMs","Encrypt all traffic by default","Replace storage arrays","Disable broadcast"], answerIndex:0, reason:"Control interfaces handle lifecycle and management operations."},
  {id:94, topic:"XEN", difficulty:"HARD", q:"Which is NOT typically a Xen control API responsibility?", options:["Create/stop VM instances","Query VM state/metrics","Manage VM configs","Configure physical switch trunk ports"], answerIndex:3, reason:"Physical switch configuration is outside hypervisor control API scope."},
  {id:95, topic:"XEN", difficulty:"MEDIUM", q:"Which is the safest comparison between Xen and KVM stacks?", options:["Both are approaches to server virtualization; details differ","Both are storage protocols","Both are VLAN standards","Both are NAS implementations"], answerIndex:0, reason:"Xen and KVM are virtualization approaches with different architectures."},
  {id:96, topic:"XEN", difficulty:"HARD", q:"In virtualization exam context, which pairing is correct?", options:["Xen control API = VM management; VLAN = bandwidth guarantee","Xen control API = VM management; traffic shaping = bandwidth policy","Xen control API = SAN protocol; templates = VLAN","Xen control API = routing; snapshots = TCP"], answerIndex:1, reason:"Traffic shaping is the bandwidth policy mechanism; control API manages VMs."},
  {id:97, topic:"XEN", difficulty:"MEDIUM", q:"Which statement about hypervisors is correct?", options:["Hypervisors abstract physical resources for VMs","Hypervisors are VLAN tags","Hypervisors are NAS directories","Hypervisors are IP addresses"], answerIndex:0, reason:"Hypervisors provide abstraction and isolation for VMs."},
  {id:98, topic:"XEN", difficulty:"HARD", q:"Which is the best exam reasoning for why management APIs matter (Xen, etc.)?", options:["They automate and control VM lifecycle and resources","They replace storage networking","They prevent all broadcasts","They increase CPU frequency"], answerIndex:0, reason:"Management APIs are essential for orchestrating VM operations at scale."},
  {id:99, topic:"XEN", difficulty:"MEDIUM", q:"Which is most likely a 'control' operation in Xen?", options:["Start a VM instance","Perform VLAN tagging","Create an NFS export","Configure iSCSI target"], answerIndex:0, reason:"Starting/stopping VMs are classic control API tasks."},
  {id:100, topic:"XEN", difficulty:"HARD", q:"Which statement best ties together the course themes (storage/network/VMs/virtualization platforms)?", options:["They are unrelated topics","They integrate: shared storage + segmented networks + standardized VM provisioning + hypervisor stacks","Only VLANs matter","Only templates matter"], answerIndex:1, reason:"Virtualized environments combine these layers to deliver scalable services."},
];

// ------------------- UI / App -------------------
const quizEl = document.getElementById("quiz");
const submitBtn = document.getElementById("btnSubmit");
const retryBtn = document.getElementById("btnRetry");
const expandBtn = document.getElementById("btnExpandAll");
const collapseBtn = document.getElementById("btnCollapseAll");
const resultBox = document.getElementById("resultBox");
const answeredPill = document.getElementById("answeredPill");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const difficultySelect = document.getElementById("difficultySelect");

const timerToggle = document.getElementById("timerToggle");
const timerPill = document.getElementById("timerPill");

let userAnswers = new Map(); // qid -> answerIndex
let locked = false;

let timerInterval = null;
let secondsLeft = 0;

function formatTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,"0");
  const s = String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

function setTimer(enabled){
  if(!enabled){
    clearInterval(timerInterval);
    timerInterval = null;
    secondsLeft = 0;
    timerPill.textContent = "Timer: Off";
    return;
  }
  secondsLeft = 60 * 60; // 60 minutes
  timerPill.textContent = `Timer: ${formatTime(secondsLeft)}`;
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    secondsLeft--;
    timerPill.textContent = `Timer: ${formatTime(secondsLeft)}`;
    if(secondsLeft <= 0){
      clearInterval(timerInterval);
      timerInterval = null;
      timerPill.textContent = "Timer: 00:00";
      gradeQuiz(true);
    }
  }, 1000);
}

timerToggle.addEventListener("change", () => {
  if(locked) { timerToggle.checked = false; return; }
  setTimer(timerToggle.checked);
});

function getFilteredQuestions(){
  const term = (searchInput.value || "").trim().toLowerCase();
  const topic = filterSelect.value;
  const diff = difficultySelect.value;

  return QUESTIONS.filter(q=>{
    const matchTerm = !term || (q.q.toLowerCase().includes(term) || q.options.some(o=>o.toLowerCase().includes(term)) || q.reason.toLowerCase().includes(term));
    const matchTopic = (topic === "ALL") || (q.topic === topic);
    const matchDiff = (diff === "ALL") || (q.difficulty === diff);
    return matchTerm && matchTopic && matchDiff;
  });
}

function updateAnsweredPill(){
  answeredPill.textContent = `Answered: ${userAnswers.size} / ${QUESTIONS.length}`;
}

function render(){
  const list = getFilteredQuestions();
  quizEl.innerHTML = "";

  if(list.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `<div class="qtitle">No questions match your filters.</div>`;
    quizEl.appendChild(empty);
    return;
  }

  list.forEach(q => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.qid = String(q.id);

    const chosen = userAnswers.get(q.id);

    const header = document.createElement("div");
    header.className = "cardHeader";
    header.innerHTML = `
      <div>
        <div class="meta">
          <span class="tag">Q${q.id}</span>
          <span class="tag">${q.topic}</span>
          <span class="tag">${q.difficulty}</span>
        </div>
        <div class="qtitle">${escapeHtml(q.q)}</div>
      </div>
    `;

    const options = document.createElement("div");
    options.className = "options";

    q.options.forEach((opt, idx) => {
      const row = document.createElement("label");
      row.className = "option";
      row.innerHTML = `
        <input type="radio" name="q_${q.id}" value="${idx}" ${chosen === idx ? "checked" : ""} ${locked ? "disabled" : ""}/>
        <div>${escapeHtml(opt)}</div>
      `;
      row.addEventListener("change", (e) => {
        if(locked) return;
        userAnswers.set(q.id, idx);
        updateAnsweredPill();
      });
      options.appendChild(row);
    });

    const details = document.createElement("details");
    details.innerHTML = `<summary>Explanation (shown after submit)</summary><div class="feedback" data-feedback></div>`;

    card.appendChild(header);
    card.appendChild(options);
    card.appendChild(details);

    quizEl.appendChild(card);
  });

  updateAnsweredPill();
}

function gradeQuiz(auto=false){
  if(locked) return;
  locked = true;
  submitBtn.disabled = true;
  retryBtn.disabled = false;
  expandBtn.disabled = false;
  collapseBtn.disabled = false;
  searchInput.disabled = true;
  filterSelect.disabled = true;
  difficultySelect.disabled = true;
  timerToggle.disabled = true;
  clearInterval(timerInterval);
  timerInterval = null;

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  for(const q of QUESTIONS){
    const chosen = userAnswers.get(q.id);
    if(chosen === undefined){
      unanswered++;
      continue;
    }
    if(chosen === q.answerIndex) correct++;
    else wrong++;
  }

  const total = QUESTIONS.length;
  const percent = Math.round((correct/total)*100);

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <div><strong>Result:</strong> <span class="good">${correct} correct</span> • <span class="bad">${wrong} wrong</span> • ${unanswered} unanswered</div>
    <div><strong>Score:</strong> ${percent}%</div>
    <div class="muted">${auto ? "Time is up. Auto-submitted." : "Submitted successfully."}</div>
  `;

  // Show per-question feedback
  for(const q of QUESTIONS){
    const card = quizEl.querySelector(`.card[data-qid="${q.id}"]`);
    if(!card) continue; // filtered out
    const feedbackEl = card.querySelector("[data-feedback]");
    const detailsEl = card.querySelector("details");

    const chosen = userAnswers.get(q.id);
    const isCorrect = chosen === q.answerIndex;

    if(chosen === undefined){
      feedbackEl.className = "feedback bad";
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="bad">Unanswered</span></div>
        <div><strong>Correct:</strong> ${escapeHtml(q.options[q.answerIndex])}</div>
        <div><strong>Reason:</strong> ${escapeHtml(q.reason)}</div>
      `;
    } else if(isCorrect){
      feedbackEl.className = "feedback good";
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="good">Correct</span></div>
        <div><strong>Your answer:</strong> ${escapeHtml(q.options[chosen])}</div>
        <div><strong>Reason:</strong> ${escapeHtml(q.reason)}</div>
      `;
    } else {
      feedbackEl.className = "feedback bad";
      feedbackEl.innerHTML = `
        <div><strong>Status:</strong> <span class="bad">Wrong</span></div>
        <div><strong>Your answer:</strong> ${escapeHtml(q.options[chosen])}</div>
        <div><strong>Correct:</strong> ${escapeHtml(q.options[q.answerIndex])}</div>
        <div><strong>Reason:</strong> ${escapeHtml(q.reason)}</div>
      `;
    }

    // Auto-expand explanations after grading (nice UX)
    detailsEl.open = true;
  }

  // Disable all radios
  document.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
}

function resetQuiz(){
  locked = false;
  userAnswers = new Map();
  submitBtn.disabled = false;
  retryBtn.disabled = true;
  searchInput.disabled = false;
  filterSelect.disabled = false;
  difficultySelect.disabled = false;
  timerToggle.disabled = false;

  resultBox.classList.add("hidden");
  resultBox.innerHTML = "";

  // stop timer
  timerToggle.checked = false;
  setTimer(false);

  render();
}

function expandAll(){
  document.querySelectorAll("details").forEach(d => d.open = true);
}
function collapseAll(){
  document.querySelectorAll("details").forEach(d => d.open = false);
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Filters
function onFilterChanged(){
  render();
}
searchInput.addEventListener("input", onFilterChanged);
filterSelect.addEventListener("change", onFilterChanged);
difficultySelect.addEventListener("change", onFilterChanged);

submitBtn.addEventListener("click", () => gradeQuiz(false));
retryBtn.addEventListener("click", resetQuiz);
expandBtn.addEventListener("click", expandAll);
collapseBtn.addEventListener("click", collapseAll);

// Initial render
render();
