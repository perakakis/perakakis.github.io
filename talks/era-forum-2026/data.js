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

    // Top row — Aggregation (row 2)
    { id: "openaire", label: "OpenAIRE",                    role: "Aggregation layer",   col: 1.5, row: 2, cluster: "top" },
  ];

  // -----------------------------------------------------------
  // CONNECTIONS — the "glue" between specific pieces
  // -----------------------------------------------------------
  const CONNECTIONS = [
    { id: "notify-pci-csic", from: "pci",       to: "csic", label: "COAR NOTIFY", flow: "B" },
    { id: "notify-soc-csic", from: "societies", to: "csic", label: "COAR NOTIFY", flow: "B" },
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
      color: "#2563eb",        // blue
      paths: [
        ["authors", "ir"],
        ["authors", "csic"],
        ["authors", "zenodo"],
      ],
    },
    {
      id: "B", letter: "B", label: "Review",
      blurb: "Reviews organised by PCI, scientific societies, funders and evaluation committees flow back to all three repositories.",
      color: "#0d9488",        // teal-green
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
      blurb: "OpenAIRE aggregates everything from the repositories and builds a unified open knowledge graph.",
      color: "#6366f1",        // indigo
      paths: [
        ["ir",       "openaire"],
        ["csic",     "openaire"],
        ["zenodo",   "openaire"],
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
      title: "Mandate open peer reviews",
      authors: "EU · CoARA",
      targets: [],
      side: "right",
      slot: 0,
    },
    {
      id: "P2",
      number: "2",
      tag: "MANDATE 02",
      title: "Evaluate only content in OA repositories",
      authors: "EU · CoARA",
      targets: [],
      side: "right",
      slot: 1,
    },
  ];

  // -----------------------------------------------------------
  // SIDEBAR CONTENT
  // Each item declares an array of `blocks`; the renderer composes
  // them in order. One schema per element type — this is what keeps
  // the panels parallel and prevents the same content reappearing
  // in three places.
  //
  //   Node (puzzle piece):   header → lede → facts (≤3)   [+ optional stat]
  //   Flow (workflow A/B/C):  header → lede → facts (3)  → example
  //   Policy (P1/P2):         header → lede → example    (the only asks)
  //
  // Division of labour:
  //   • Nodes  = what each piece IS — the stable, factual reference layer.
  //              Nodes make NO asks: the thesis is "every piece already
  //              exists", so the only forward asks live in the two mandates.
  //   • Flows  = how the system BEHAVES — and a home for the worked
  //              examples (ANECA → A, Psicológica → B, OpenAIRE → C).
  //   • Policies = the two mandates — the only place change is proposed,
  //              each carrying a short pointer-example proving it is
  //              already real at smaller scale.
  //
  // Block kinds: header | lede | facts | example | stat |
  //   quote | list | links | html | rule | spacer
  //   - lede is escaped (text only); facts VALUES accept inline HTML.
  //   - example / html accept raw HTML (links live here).
  //   - links inherit one style from #sidebar-content a (styles.css).
  // -----------------------------------------------------------
  const SIDEBAR = {

    // --- Pieces ---
    ir: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive", title: "Institutional\nRepositories", role: "The open version of record" },
        { kind: "lede",   text: "Where researchers deposit all their scholarly outputs directly at their home institutions." },
        { kind: "facts",  rows: [
          { k: "Function", v: "Host and provide open access to all scholarly outputs" },
          { k: "Examples", v: "DIGITAL.CSIC, Zenodo, HAL, arXiv, institutional DSpace/EPrints" },
          { k: "Reach",    v: "Standard infrastructure at most European universities and research institutions" },
        ]},
      ],
    },
    csic: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive · Proof of concept", title: "DIGITAL.CSIC", role: "Repository of the Spanish National Research Council" },
        { kind: "lede",   text: "Live proof that a publicly funded repository can perform every function a commercial publisher provides: archiving, peer review, and journal hosting." },
        { kind: "facts",  rows: [
          { k: "Archive",       v: "Metadata curation and persistent identifiers" },
          { k: "Open review",   v: `Its <a href="https://infogram.com/oprm-1h1749wv0rjrl2z" target="_blank" rel="noopener">Open Peer Review Module</a> turns reviews into persistent, citable items linked to the original objects` },
          { k: "Diamond OA",    v: `Hosts journals at no cost to authors or readers via its <a href="https://digital.csic.es/bitstream/10261/361230/14/diamante-en-verde-dc.pdf" target="_blank" rel="noopener">Diamante en Verde</a> service; talks to review services via COAR Notify` },
        ]},
      ],
    },
    zenodo: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Archive", title: "Zenodo", role: "Generalist EU archive" },
        { kind: "lede",   text: "CERN-hosted, EU-funded repository for researchers without an institutional one." },
        { kind: "facts",  rows: [
          // { k: "Host",   v: "CERN, funded by the European Commission / OpenAIRE" },
          { k: "Scope",  v: "All disciplines, all output types" },
          { k: "Open Review",  v: "Metadata for hosting open reviews properly linked to the original items" },
          { k: "Scale",  v: "Millions of records; fully harvested by OpenAIRE" },
        ]},
      ],
    },
    pci: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review", title: "Peer Community In", role: "Open peer review service" },
        { kind: "lede",   text: "PCI organises rigorous, transparent peer review of preprints entirely outside journals. Reviewers evaluate directly from repository deposits, and the recommendations become open, citable objects." },
        { kind: "facts",  rows: [
          { k: "Model",     v: "Preprint → open review → public recommendation" },
          { k: "Linked to", v: "HAL (France), DIGITAL.CSIC (Spain) via COAR Notify" },
          { k: "Coverage",  v: "20+ scientific communities across disciplines" },
        ]},
      ],
    },
    societies: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review", title: "Scientific Societies", role: "Editorial governance" },
        { kind: "lede",   text: "Scientific societies are the actual administrators of the current peer review system: they set editorial standards, select reviewers, and endorse work by scope and quality." },
        { kind: "facts",  rows: [
          { k: "Role",   v: "Editorial decisions, community standards, reviewer networks" },
          { k: "Today",  v: "Most depend on commercial publishing infrastructure" },
          { k: "Reach",  v: "Thousands of disciplinary societies across Europe" },
        ]},
      ],
    },
    funders: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review · Policy actor", title: "Funding Agencies", role: "Grant evaluation and policy author" },
        { kind: "lede",   text: "Funding agencies organise peer review of grant applications, and author the policy mandates that can activate the whole system." },
        { kind: "facts",  rows: [
          { k: "Review role", v: "Evaluate grant applications and individual researcher profiles, producing assessments that are currently unavailable in the system" },
          { k: "Policy role", v: "Author the mandates that incentivise open deposit across the system" },
          { k: "Reach",       v: "National and EU funders across the ERA" },
        ]},
      ],
    },
    evals: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Review · Policy actor", title: "Evaluation\nCommittees", role: "Hiring · promotion · accreditation" },
        { kind: "lede",   text: "Bodies like ANECA (Spain) and HCERES (France) make career-defining decisions about researchers yet the reviews they produce are kept private and inaccessible." },
        { kind: "facts",  rows: [
          { k: "Function", v: "Hiring, promotion, tenure, and accreditation across Europe" },
          { k: "Today",    v: "Reviews are never deposited and exist only as internal documents" },
          { k: "Reach",    v: "ANECA, HCERES, and national equivalents EU-wide" },
        ]},
      ],
    },
    openaire: {
      blocks: [
        { kind: "header", tag: "Infrastructure · Aggregation", title: "OpenAIRE", role: "The aggregation layer" },
        { kind: "lede",   text: "OpenAIRE harvests and links research outputs from repositories across Europe into a single open knowledge graph." },
        { kind: "stat",   value: "323M", caption: "Records harvested: publications, datasets, software" },
        { kind: "facts",  rows: [
          { k: "Function", v: "Harvests, links, and exposes outputs from European repositories" },
          { k: "Scope",    v: "EU-mandated; covers all EC-funded research outputs" },
          { k: "Feeds",    v: "Open research-assessment and metrics services" },
        ]},
      ],
    },

    // --- Connections (glue) ---
    // Both COAR Notify arrows (PCI → CSIC and Societies → CSIC) share one
    // panel: the protocol is general, not PCI-specific.
    "notify-pci-csic": {
      blocks: [
        { kind: "header", tag: "Connection · Protocol", title: "COAR Notify", role: "Review services ↔ Institutional repositories" },
        { kind: "lede",   text: "A protocol that lets a repository and an external review service interact." },
        { kind: "facts",  rows: [
          { k: "What it does", v: "Sends structured notifications between repositories and review services" },
          { k: "Result",       v: "Open, PID-assigned review objects linked to deposit records" },
        ]},
      ],
    },
    "notify-soc-csic": {
      blocks: [
        { kind: "header", tag: "Connection · Protocol", title: "COAR Notify", role: "Review services ↔ Institutional repositories" },
        { kind: "lede",   text: "A protocol that lets a repository and an external review service interact." },
        { kind: "facts",  rows: [
          { k: "What it does", v: "Sends structured notifications between repositories and review services" },
          { k: "Result",       v: "Open, PID-assigned review objects linked to deposit records" },
        ]},
      ],
    },

    // --- Flows (workflows) ---
    flow_A: {
      blocks: [
        { kind: "header", tag: "Workflow A", title: "Archive", role: "Authors feed their outputs into the system" },
        { kind: "lede",   text: "Researchers self-archive manuscripts, datasets, and code directly into repositories: institutional, DIGITAL.CSIC, or Zenodo." },
        { kind: "facts",  rows: [
          { k: "Who",    v: "Authors of digital scholarly objects" },
          { k: "What",   v: "Manuscripts, datasets, code, software" },
          { k: "Effect", v: "An open, persistent record of global scientific output" },
        ]},
        { kind: "example", html: `ANECA, Spain's national accreditation agency, now only evaluates scholarly outputs that are openly accessible in a repository. This single mandate dramatically increased self-archiving across Spain.` },
      ],
    },
    flow_B: {
      blocks: [
        { kind: "header", tag: "Workflow B", title: "Review", role: "Quality assessment flows back to the repositories" },
        { kind: "lede",   text: "Review is organised by communities (scientific societies, funders, evaluation committees, initiatives like PCI) and flows back to the repository record as open, citable objects." },
        { kind: "facts",  rows: [
          { k: "Organisers", v: "scientific societies, funders, evaluation committees" },
          { k: "Output",     v: "An open review object with a persistent identifier, linked to the archived record" },
          // { k: "Unlocks",    v: "Aggregatable by OpenAIRE once Mandate 2 is active" },
        ]},
        { kind: "example", html: `In 2022 the Spanish Society for Experimental Psychology (SEPEX) left its commercial publisher and now publishes its journal, <a href="https://psicologicajournal.com" target="_blank" rel="noopener">Psicológica</a>, exclusively on <a href="https://digital.csic.es/handle/10261/228593" target="_blank" rel="noopener">DIGITAL.CSIC</a>. Its peer reviews are now openly deposited alongside the articles and costs dropped to an estimated <a href="https://doi.org/10.1038/d41586-023-02315-z" target="_blank" rel="noopener">€30 per article</a>.` },
      ],
    },
    flow_C: {
      blocks: [
        { kind: "header", tag: "Workflow C", title: "Aggregate", role: "Everything becomes discoverable" },
        { kind: "lede",   text: "OpenAIRE continuously aggregates metadata across repositories and builds a unified open knowledge graph." },
        { kind: "facts",  rows: [
          { k: "Source", v: "Institutional repositories, DIGITAL.CSIC, Zenodo" },
          { k: "Target", v: "The OpenAIRE knowledge graph, 323M linked records" },
          { k: "Feeds",  v: "Open research-assessment and metrics services" },
        ]},
        { kind: "example", html: `OpenAIRE's knowledge graph already powers open assessment tools, such as the OpenAIRE Monitor and the GraspOS pilots, letting institutions and funders evaluate research on open, fully traceable data.` },
      ],
    },

    // --- Policies (the two mandates — the only asks) ---
    P1: {
      blocks: [
        { kind: "header",  tag: "Policy mandate 01", title: "Mandate open\npeer reviews", role: "EU · CoARA · Funders · Evaluation Committees" },
        { kind: "mandate", text: "Any peer review produced in an EU-funded evaluation (grants, hiring, promotion, accreditation) must be deposited as an open, citable, PID-assigned object, harvestable by OpenAIRE." },
        { kind: "lede",    text: "Research assessment reform asks to base assessment on peer reviews, but reviews themselves are currently not part of the system. There can be no transparent assessment reform without open access to the review data it is built on." },
        { kind: "example", html: `Already happening at smaller scale: scientific-society journals like Psicológica and scholarly communities like PCI produce open, citable reviews (see Workflow B).` },
      ],
    },
    P2: {
      blocks: [
        { kind: "header",  tag: "Policy mandate 02", title: "Evaluate only content\nin OA repositories", role: "CoARA · EU · Funders · Evaluation Committees" },
        { kind: "mandate", text: "Evaluation processes (grants, hiring, promotion, tenure) must consider only the archived repository version of an output." },
        { kind: "lede",    text: "This makes the open repository the single locus of evaluation and becomes the lever that drives deposit across the whole system." },
        { kind: "example", html: `Already happening at smaller scale: ANECA evaluates only outputs openly accessible in an open access repository (see Workflow A).` },
      ],
    },

    // --- Authors node ---
    authors: {
      blocks: [
        { kind: "header", tag: "Source · Knowledge creation", title: "Scholarly\nCommunity", role: "Authors of digital scholarly objects" },
        { kind: "lede",   text: "The researchers who produce scientific outputs: the source of everything that flows through the system." },
        { kind: "facts",  rows: [
          { k: "Creates", v: "Manuscripts, datasets, code, software, reviews, commentary" },
          { k: "Today",   v: "Hand their outputs to commercial publishers, sustaining a costly, inefficient system" },
          // { k: "Want",    v: "To be scientists — though the system rewards them for being academics" },
        ]},
        // { kind: "quote",  text: "Most researchers today, especially those at the beginning of their careers, want to be scientists but are forced to become academics.", attrib: "Eurodoc, Oslo 2017" },
      ],
    },

    // --- Default state ---
    __default: {
      blocks: [
        { kind: "header", tag: "Infrastructure map", title: "Existing infrastructures.\nAvailable workflows.\nRelevant policies.", role: "Click any element to read more" },
        { kind: "rule" },
        { kind: "spacer", size: 10 },
        { kind: "html", html: `<p style="font-size: 18px; line-height: 1.55; color: var(--text-on-light-muted); margin: 0 0 18px 0; text-wrap: pretty;">How can existing open infrastructures, supported by institutions and policy mandates, enable an alternative scholarly communication system, in line with the model we set out in <a href="https://pandelisperakakis.info/research/scholarly-communication/assets/NSAP_Perakakis_2010.pdf" target="_blank" rel="noopener">Natural Selection of Academic Papers</a> (Perakakis et al., 2010)? Every piece of the puzzle already exists. The gap is to glue it together with two policy mandates.</p>` },
      ],
    },
  };

  return { PIECES, CONNECTIONS, FLOWS, POLICIES, SIDEBAR };
})();
