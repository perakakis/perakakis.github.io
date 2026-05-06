/* ============================================================
   Infrastructures — content data
   Pieces, connections, flows, policies, and sidebar content.
   Sidebar uses block-composition: each item declares an
   array of blocks the renderer composes in order.
   ============================================================ */

window.INFRA_DATA = (function () {

  // -----------------------------------------------------------
  // PUZZLE PIECES
  // Layout grid (col, row) — bottom row = row 0
  // The puzzle uses an interlocking shape with tabs/blanks.
  // -----------------------------------------------------------
  // Author node added (row -1, "scholarly community") so workflow A flows
  // FROM authors → repositories.
  const PIECES = [
    // Authors row (row -1)
    { id: "authors",  label: "Scholarly\nCommunity", role: "Authors of digital objects", col: 1.5, row: -1, cluster: "authors" },

    // Repositories row (row 0)
    { id: "ir",       label: "Institutional\nRepositories", role: "Archive layer",   col: 0,   row: 0, cluster: "deposit" },
    { id: "csic",     label: "DIGITAL.CSIC",                role: "National repository", col: 1.5, row: 0, cluster: "deposit", accent: true },
    { id: "zenodo",   label: "Zenodo",                      role: "Generalist archive",  col: 3,   row: 0, cluster: "deposit" },

    // Review organisers row (row 1)
    { id: "funders",  label: "Funding Agencies",            role: "Grant evaluation",                   col: 0, row: 1, cluster: "review" },
    { id: "evals",    label: "Evaluation\nCommittees",       role: "Hiring · promotion · accreditation", col: 1, row: 1, cluster: "review" },
    { id: "pci",      label: "Peer Community In",           role: "Open review service",                col: 2, row: 1, cluster: "review" },
    { id: "societies",label: "Scientific Societies",        role: "Editorial governance",               col: 3, row: 1, cluster: "review" },

    // Top row — Aggregation & metrics (row 2)
    { id: "openaire", label: "OpenAIRE",                    role: "Aggregation layer",   col: 0.7, row: 2, cluster: "top" },
    { id: "graspos",  label: "GraspOS",                     role: "Open metrics",        col: 2.3, row: 2, cluster: "top" },
  ];

  // -----------------------------------------------------------
  // CONNECTIONS — the "glue" between specific pieces
  // -----------------------------------------------------------
  const CONNECTIONS = [
    { id: "notify-pci-csic", from: "pci", to: "csic", label: "COAR NOTIFY", flow: "B" },
  ];

  // -----------------------------------------------------------
  // WORKFLOWS — directional flows across multiple pieces
  // Each flow is a sequence of piece ids; particles travel
  // along the path through them in order.
  // Colours are siblings on the warm-paper palette.
  // -----------------------------------------------------------
  const FLOWS = [
    {
      id: "A", letter: "A", label: "Archive",
      blurb: "Authors self-archive digital objects (manuscripts, data, code) into the repositories.",
      color: "#1c7a8c",        // muted teal
      paths: [
        ["authors", "ir"],
        ["authors", "csic"],
        ["authors", "zenodo"],
      ],
    },
    {
      id: "B", letter: "B", label: "Review",
      blurb: "Reviews organised by PCI, scientific societies, funders and evaluation committees flow back to all three repositories.",
      color: "#5b8a3a",        // sage green
      paths: [
        ["funders",   "ir"],
        ["evals",     "ir"],
        ["pci",       "csic"],
        ["societies", "csic"],
        ["societies", "zenodo"],
      ],
    },
    {
      id: "C", letter: "C", label: "Aggregate",
      blurb: "OpenAIRE aggregates everything from the repositories and exposes it to overlay services like GraspOS.",
      color: "#3a5b8a",        // slate blue
      paths: [
        ["ir",       "openaire"],
        ["csic",     "openaire"],
        ["zenodo",   "openaire"],
      ],
    },
    {
      id: "D", letter: "D", label: "Assess",
      blurb: "OpenAIRE feeds GraspOS, which produces open metrics that funders and evaluation committees use for assessment.",
      color: "#7a4a8a",        // dusty plum
      paths: [
        ["openaire", "graspos"],
        ["graspos",  "funders"],
        ["graspos",  "evals"],
      ],
    },
  ];

  // -----------------------------------------------------------
  // POLICIES — sticky notes pinned to the margin
  // targets = piece ids the thread connects to
  // -----------------------------------------------------------
  const POLICIES = [
    {
      id: "P1",
      number: "1",
      tag: "MANDATE 01",
      title: "Evaluate only content in OA repositories",
      authors: "EU · CoARA",
      targets: [],
      side: "right",
      slot: 0,
    },
    {
      id: "P2",
      number: "2",
      tag: "MANDATE 02",
      title: "Mandate open peer reviews",
      authors: "EU · CoARA",
      targets: [],
      side: "right",
      slot: 1,
    },
  ];

  // -----------------------------------------------------------
  // SIDEBAR CONTENT
  // Each item declares an array of `blocks`. Renderer composes.
  // Available block kinds (extensible):
  //   { kind: "header", tag, title, role }
  //   { kind: "lede",   text }
  //   { kind: "facts",  rows: [{k,v}] }
  //   { kind: "stat",   value, caption }
  //   { kind: "quote",  text, attrib }
  //   { kind: "list",   items: [string] }
  //   { kind: "links",  items: [{label, url?}] }
  //   { kind: "rule" }                 // horizontal divider
  //   { kind: "spacer", size: 16 }
  //   { kind: "html",   html }         // escape hatch
  // -----------------------------------------------------------
  const SIDEBAR = {

    // --- Pieces ---
    ir: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive", title: "Institutional\nRepositories", role: "Source of truth" },
        { kind: "lede",   text: "Where researchers deposit scholarly outputs directly at their home institutions." },
        { kind: "facts",  rows: [
          { k: "Function", v: "Hosts and provides open access to all scholarly outputs" },
          { k: "Examples", v: "DIGITAL.CSIC, Zenodo, HAL, arXiv, institutional DSpace/EPrints" },
          { k: "What needs to change", v: "Wide adoption of self-archiving practices by researchers." },
        ]},
        { kind: "example", html: `ANECA (Spain's national accreditation agency) now requires publications to be accessible in an open repository to count toward academic accreditation. This policy has dramatically increased self-archiving.` }
      ],
    },
    csic: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive · Proof of concept", title: "DIGITAL.CSIC", role: "Open Access repository of the Spanish National Research Council" },
        { kind: "lede",   text: "DIGITAL.CSIC is not just a repository — it is a live proof that a publicly funded national infrastructure can replace every function a commercial publisher currently provides." },
        { kind: "facts",  rows: [
          { k: "Archive",      v: "Metadata curation, persistent identifiers" },
          { k: "Open Peer Review",    v: "The Open Peer Review Module creates reviews as persistent citable items linked to the original digital objects" },
          { k: "Protocol",   v: "Uses COAR Notify to communicate with external review services like Peer Community In" },
          { k: "Diamond Open Access",    v: "Hosts journals published with no costs for authors and readers" },
        ]},
        { kind: "example", html: `DIGITAL.CSIC publishes <a href="https://psicologicajournal.com" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Psicológica</a> — the journal of the Spanish Society for Experimental Psychology (SEPEX) and offers a <a href=https://digital.csic.es/bitstream/10261/361230/14/diamante-en-verde-dc.pdf" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Diamond Open Access publication service</a> to other journals in need of publication infrastructure. It is equiped with the <a href="https://infogram.com/oprm-1h1749wv0rjrl2z" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Open Peer Review Module</a> that allows any hosted digital object to be reviewed and evaluated by expert peers.` },
      ],
    },
    zenodo: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive", title: "Zenodo", role: "Generalist archive home" },
        { kind: "lede",   text: "CERN-hosted, EU-funded repository for researchers who lack an institutional repository. Accepts publications, datasets, code, and software. Integrates tightly with GitHub and OpenAIRE." },
        { kind: "facts",  rows: [
          { k: "Funder",   v: "European Commission / OpenAIRE" },
          { k: "Scope",    v: "All disciplines, all output types" },
          { k: "Scale",    v: "Millions of records; fully harvested by OpenAIRE" },
        ]},
        { kind: "example", html: `Zenodo hosts reviews for conference papers and other digital objects using appropriate metadata that enable proper harvesting and linking by OpenAIRE.` }
      ],
    },
    pci: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review", title: "Peer Community In", role: "Open peer review service" },
        { kind: "lede",   text: "PCI organises rigorous, transparent peer review of preprints entirely outside journals. Recommenders (reviewers) evaluate directly from repository deposits. Reviews become open, citable objects." },
        { kind: "facts",  rows: [
          { k: "Model",    v: "Preprint → open review → recommendation" },
          { k: "Linked to", v: "HAL (France), DIGITAL.CSIC (Spain) via COAR Notify" },
          { k: "Coverage", v: "20+ scientific communities across disciplines" },
        ]},
      ],
    },
    societies: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review", title: "Scientific Societies", role: "Editorial governance" },
        { kind: "lede",   text: "Scientific communities are the legitimate governors of peer review. Societies set editorial standards, select reviewers, and endorse manuscripts based on scope and quality." },
        { kind: "facts",  rows: [
          { k: "Role",     v: "Editorial decision-making, community standards, reviewer networks" },
          { k: "Current state",  v: "Largely depend on commercial publishing infrastructure" },
          { k: "What needs to change", v: "Any scientific society can leverage the existing open infrastructures afforded by institutional repositories to offer diamond OA today" },
        ]},
        { kind: "example", html: `In 2022, the Spanish Society for Experimental Psychology (SEPEX), broke its contract with its commercial publisher and now publishes its journal, <a href="https://psicologicajournal.com" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Psicológica</a> exclusively on <a https://digital.csic.es/handle/10261/228593" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">DIGITAL.CSIC</a>, the institutional repository of the Spanish National Research Council (CSIC).` },
      ],
    },
    funders: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review · Policy actor", title: "Funding Agencies", role: "Grant evaluation — and a key policy author" },
        { kind: "lede",   text: "Funding agencies sit in two layers of this system: they organise peer review of grant applications, and they are the authors of the policy mandates that can incentivize the activation of the whole system." },
        { kind: "facts",  rows: [
          { k: "Review role", v: "Evaluate grant applications — producing quality assessments that currently disappear" },
          { k: "Policy role", v: "Can mandate open deposit of any review produced in their processes" },
        ]},
      ],
    },
    evals: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review · Policy actor", title: "Evaluation\nCommittees", role: "Hiring · promotion · accreditation" },
        { kind: "lede",   text: "Bodies like ANECA (Spain), HCERES (France), and national equivalents make career-defining decisions about researchers. They currently generate reviews that vanish into private files." },
        { kind: "facts",  rows: [
          { k: "Function",  v: "Hiring, promotion, tenure, and accreditation across European systems" },
          { k: "The gap",   v: "Reviews produced here are not deposited — they exist only as internal documents" },
          { k: "Policy role", v: "Can mandate open deposit of any review produced in their processes" },
        ]},
        { kind: "example", html: `ANECA (Spain's national accreditation agency) now requires publications to be accessible in an open repository to count toward academic accreditation. This policy has dramatically increased self-archiving.` },

      ],
    },
    openaire: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Aggregation", title: "OpenAIRE", role: "The aggregation layer — 323 million records" },
        { kind: "html",   html: `<p style="font-size: 18px; line-height: 1.55; color: var(--text-on-light-muted); margin: 0 0 18px 0; text-wrap: pretty;">In 2010, we described a <a href="https://pandelisperakakis.info/research/scholarly-communication/assets/NSAP_Perakakis_2010.pdf" style="color: var(--emerald); text-decoration: underline; text-underline-offset: 3px;">Global Open Archive</a> that would aggregate metadata and peer reviews from institutional repositories. In 2026, that archive exists and it's called OpenAIRE — the review layer is the one piece still waiting for a policy mandate.</p>` },
        { kind: "stat",   value: "323M", caption: "Records harvested — publications, datasets, software" },
        { kind: "facts",  rows: [
          { k: "Function", v: "Harvests, links, and exposes outputs from repositories across Europe" },
          { k: "Feeds",    v: "GraspOS and other open metrics services" },
          { k: "Scope",    v: "EU-mandated; covers all EC-funded research outputs" },
        ]},
      ],
    },
    graspos: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Metrics", title: "GraspOS", role: "Open metrics — overlay service on the knowledge graph" },
        { kind: "lede",   text: "GraspOS builds research assessment indicators directly from the open graph. It proves it is possible to evaluate researchers using only open, verifiable data — without commercial databases." },
        { kind: "facts",  rows: [
          { k: "Input",    v: "OpenAIRE knowledge graph + open review objects" },
          { k: "Output",   v: "Open metrics for funders and evaluation committees" },
          { k: "Replaces", v: "Journal Impact Factor, h-index from Scopus/WoS — with open alternatives" },
        ]},
      ],
    },

    // --- Connections (glue) ---
    "notify-pci-csic": {
      blocks: [
        { kind: "header", tag: "Connection · Protocol", title: "COAR Notify", role: "Peer Community In ↔ DIGITAL.CSIC" },
        { kind: "lede",   text: "COAR Notify is the protocol that lets a repository and an external review service talk to each other automatically. When PCI recommends a preprint in DIGITAL.CSIC, the review object is linked back to the repository record — and becomes harvestable by OpenAIRE." },
        { kind: "facts",  rows: [
          { k: "What it does", v: "Sends structured notifications between repositories and review services" },
          { k: "Result",       v: "Open, PID-assigned review objects linked to deposit records" },
        ]},
      ],
    },

    // --- Flows (workflows) ---
    flow_A: {
      blocks: [
        { kind: "header", tag: "Workflow A", title: "Archive", role: "Authors feed their scientific outputs into the system" },
        { kind: "lede",   text: "Researchers self-archive manuscripts, datasets, and code directly into repositories — institutional repositories, DIGITAL.CSIC, or Zenodo." },
        { kind: "facts",  rows: [
          { k: "Who",       v: "Authors of digital scholarly objects" },
          { k: "Where",     v: "Institutional repositories, DIGITAL.CSIC, Zenodo" },
          { k: "What",      v: "Manuscripts, datasets, code, software" },
          { k: "Effect",    v: "Creates an open, persistent record that becomes the source of truth in the system" },
        ]},
        { kind: "example", html: `ANECA (Spain's national accreditation agency) now requires publications to be accessible in an open repository to count toward academic accreditation. This policy has dramatically increased self-archiving.` },
      ],
    },
    flow_B: {
      blocks: [
        { kind: "header", tag: "Workflow B", title: "Review", role: "Quality assessment flows back to the open access repositories" },
        { kind: "lede",   text: "Review is organised by communities — PCI, scientific societies, funding agencies, and evaluation committees — and flows back to the repository record. The result: open, citable review objects instead of private PDFs." },
        { kind: "facts",  rows: [
          { k: "Organisers",  v: "PCI, scientific societies, funders, evaluation committees" },
          { k: "Output",      v: "Open review object with DOI, linked to the archived record — aggregatable by OpenAIRE once Mandate 2 is active" },
        ]},
        { kind: "example", html: `<a href="https://psicologicajournal.com" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Psicológica</a> — the journal of the Spanish Society for Experimental Psychology (SEPEX) is <a href="https://doi.org/10.1038/d41586-023-02315-z" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">published at DIGITAL.CSIC</a>. <a href="https://peercommunityin.org/" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">Peer Community In (PCI)</a> organises community peer review, and the review objects are linked back to the original records in the open access repositories.` },
      ],
    },
    flow_C: {
      blocks: [
        { kind: "header", tag: "Workflow C", title: "Aggregate", role: "Everything becomes discoverable" },
        { kind: "lede",   text: "OpenAIRE continuously aggregates metadata from all three repository layers and builds a unified knowledge graph. 323 million records — publications, data, code, and software — linked and openly accessible." },
        { kind: "facts",  rows: [
          { k: "Source",   v: "Institutional repositories, DIGITAL.CSIC, Zenodo" },
          { k: "Target",   v: "OpenAIRE knowledge graph" },
          { k: "Feeds",    v: "GraspOS and any open metrics overlay service" },
        ]},
      ],
    },
    flow_D: {
      blocks: [
        { kind: "header", tag: "Workflow D", title: "Assess", role: "The open record feeds back into evaluation" },
        { kind: "lede",   text: "OpenAIRE feeds GraspOS, which produces open metrics that funders and evaluation committees can use instead of commercial indicators." },
        { kind: "facts",  rows: [
          { k: "OpenAIRE → GraspOS", v: "Open knowledge graph becomes the raw material for indicators" },
          { k: "GraspOS → Funders",  v: "Grant evaluation using open, reproducible metrics" },
          { k: "Why it matters",     v: "Breaks the dependency on commercial databases for career evaluation" },
        ]},
        { kind: "example", html: `<a href="https://coara.eu/" style="color:var(--teal-600);text-decoration:underline;text-underline-offset:3px;">CoARA</a> (Coalition for Advancing Research Assessment) has over 700 signatories committed to moving away from journal-based metrics — including <strong>ANECA</strong> and <strong>AEI</strong> (Spain's national accreditation agency and state research funder). Signatories commit to recognising diverse outputs, valuing qualitative assessment, and phasing out the Journal Impact Factor as a primary criterion.` },
      ],
    },

    // --- Policies ---
    P1: {
      blocks: [
        { kind: "header", tag: "Policy mandate 01", title: "Evaluate only content\nin OA repositories", role: "CoARA · EU · Funding Agencies · Evaluation Committees" },
        { kind: "lede",   text: "Evaluation processes — for grants, hiring, promotion, tenure — consider only the archived (repository) version of outputs, not the publisher's website." },
      ],
    },
    P2: {
      blocks: [
        { kind: "header", tag: "Policy mandate 02", title: "Mandate open\npeer reviews", role: "EU · Funding Agencies · Evaluation Committees" },
        { kind: "lede",   text: "Any peer review produced in an EU-funded evaluation process — for grants, hiring, promotion, or accreditation — must be archived as an open, citable, PID-assigned object in a compliant repository, aggregatable by OpenAIRE." },
      ],
    },

    // --- Authors node ---
    authors: {
      blocks: [
        { kind: "header", tag: "Source · The starting point", title: "Scholarly\nCommunity", role: "Authors of digital scholarly objects" },
        { kind: "lede",   text: "The researchers who produce scientific outputs — the source of everything that flows through the system." },
        { kind: "facts",  rows: [
          { k: "What they create", v: "Scientific outputs in the form of digital objects: Manuscripts, datasets, code, software, reviews, commentary, etc." },
          { k: "What they do",   v: "Currently, they hand their outputs to commercial publishers sustaining an inefficient and costly system." },
          { k: "What needs to change",     v: "Self-archiving in repositories keeps the output in the open record from day one" },
        ]},
        { kind: "quote",  text: "Most researchers today, especially those at the beginning of their careers, want to be scientists but are forced to become academics.", attrib: "Eurodoc Oslo 2017" },
        { kind: "links",  items: [{ label: "Open-minded scepticism (blog post)", url: "https://pandelisperakakis.info/blog/open-minded-scepticism.html" }] },
      ],
    },

    // --- Default state ---
    __default: {
      blocks: [
        { kind: "header", tag: "Infrastructure map", title: "Existing infrastructures.\nAvailable workflows.\nRelevant policies.", role: "Click any element to read more" },
        { kind: "rule" },
        { kind: "spacer", size: 10 },
        { kind: "html", html: `<p style="font-size: 18px; line-height: 1.55; color: var(--text-on-light-muted); margin: 0 0 18px 0; text-wrap: pretty;">How can existing open infrastructures supported by institutions and policy mandates enable an alternative scholarly communication system in line with the model we presented in our key paper on <a href="https://pandelisperakakis.info/research/scholarly-communication/assets/NSAP_Perakakis_2010.pdf" style="color: var(--emerald); text-decoration: underline; text-underline-offset: 3px;">Natural Selection of Academic Papers</a> (Perakakis et al., 2010).</p>` },
      ],
    },
  };

  return { PIECES, CONNECTIONS, FLOWS, POLICIES, SIDEBAR };
})();
