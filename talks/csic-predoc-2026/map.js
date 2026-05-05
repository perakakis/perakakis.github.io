/* ============================================================
   Interactive Infrastructure Map — single-slide version
   Force-directed layout on warm paper background
   ============================================================ */

(function () {
  const svgNS = "http://www.w3.org/2000/svg";

  // -------- Node definitions --------
  const NODES = [
    { id: "eosc",     label: "EOSC",                          sub: "Federated compute & data",          x: 0.50, y: 0.86, r: 60 },
    { id: "ir",       label: "Institutional\nrepositories",   sub: "Self-archiving",                     x: 0.18, y: 0.62, r: 64 },
    { id: "csic",     label: "DIGITAL.CSIC",                  sub: "Psicológica\nproof of concept",     x: 0.30, y: 0.30, r: 70, accent: true },
    { id: "zenodo",   label: "Zenodo",                        sub: "Generalist deposit",                 x: 0.13, y: 0.40, r: 54 },
    { id: "notify",   label: "COAR Notify",                   sub: "Repo ↔ review protocol",            x: 0.42, y: 0.50, r: 56 },
    { id: "openaire", label: "OpenAIRE",                      sub: "323M records aggregated",            x: 0.62, y: 0.42, r: 86 },
    { id: "ore",      label: "Open Research\nEurope",         sub: "Open peer-review venue",             x: 0.75, y: 0.66, r: 60 },
    { id: "graspos",  label: "GraspOS",                       sub: "Open metrics services",              x: 0.84, y: 0.30, r: 58 },
    { id: "coara",    label: "CoARA",                         sub: "700+ assessment reform",             x: 0.68, y: 0.16, r: 60 },
    { id: "mandate",  label: "EU funder\nmandates",           sub: "Policy lever — the ask",             x: 0.42, y: 0.14, r: 64, missing: true },
    { id: "orcid",    label: "ORCID",                         sub: "Researcher identity",                x: 0.92, y: 0.50, r: 48 },
  ];

  const EDGES = [
    { a: "eosc",     b: "openaire", route: "shared" },
    { a: "eosc",     b: "ir",       route: "shared" },
    { a: "ir",       b: "openaire", route: "A" },
    { a: "csic",     b: "openaire", route: "A" },
    { a: "zenodo",   b: "openaire", route: "A" },
    { a: "csic",     b: "notify",   route: "A" },
    { a: "ir",       b: "notify",   route: "A" },
    { a: "notify",   b: "openaire", route: "A" },
    { a: "ore",      b: "openaire", route: "B" },
    { a: "ore",      b: "notify",   route: "B" },
    { a: "openaire", b: "graspos",  route: "shared" },
    { a: "orcid",    b: "openaire", route: "shared" },
    { a: "orcid",    b: "graspos",  route: "shared" },
    { a: "graspos",  b: "coara",    route: "feedback" },
    { a: "coara",    b: "mandate",  route: "feedback" },
    { a: "mandate",  b: "ir",       route: "A", missing: true },
    { a: "mandate",  b: "ore",      route: "B", missing: true },
    { a: "mandate",  b: "csic",     route: "A", missing: true },
  ];

  // Rich detail content surfaced on node click
  const DETAILS = {
    eosc: {
      title: "EOSC",
      role: "European Open Science Cloud · Foundation layer",
      blurb: "Federated compute and data services across European research institutions. The substrate beneath everything else in the stack.",
      facts: [],
    },
    ir: {
      title: "Institutional repositories",
      role: "Self-archive layer",
      blurb: "Where researchers deposit preprints and accepted manuscripts. Already mandated by most EU funders for publications.",
      facts: [
        { k: "Note", v: "The same logic that mandates publications can extend to peer reviews — without any new infrastructure." },
      ],
    },
    csic: {
      title: "DIGITAL.CSIC + Psicológica",
      role: "Working proof of concept · the solution in your house",
      blurb: "Psicológica — the Spanish Society for Experimental Psychology's official journal — runs its full scholarly communication cycle here. Submission, peer review, publication, hosting, discovery. No commercial publisher in the loop.",
      facts: [
        { k: "Cost", v: "≈ €30 per publication (vs hundreds–thousands commercially)" },
        { k: "Model", v: "Diamond open access — no APCs, no subscriptions" },
        { k: "Status", v: "Now a full service offered by DIGITAL.CSIC to Spanish societies" },
        { k: "Protocol", v: "COAR Notify in production" },
      ],
    },
    zenodo: {
      title: "Zenodo",
      role: "Generalist deposit",
      blurb: "Catch-all repository for researchers without an institutional home. CERN-hosted; assigns DOIs to anything depositable.",
      facts: [],
    },
    notify: {
      title: "COAR Notify",
      role: "Protocol · production pilot",
      blurb: "A standard letting repositories communicate with external peer-review services. Repository identifies an item; review service conducts review; review object links back to the repository; OpenAIRE harvests both.",
      facts: [
        { k: "Live at", v: "DIGITAL.CSIC ↔ Peer Community In" },
        { k: "Live at", v: "HAL ↔ Peer Community In" },
        { k: "Origin", v: "COAR — not an EU project" },
      ],
    },
    openaire: {
      title: "OpenAIRE",
      role: "Aggregation layer",
      blurb: "Harvests publications, datasets, software and peer reviews from across Europe and links them as one knowledge graph.",
      facts: [
        { k: "Records", v: "323 million" },
        { k: "Origin", v: "The Global Open Archive described in 2010 — built and running in 2026" },
      ],
    },
    ore: {
      title: "Open Research Europe",
      role: "Publishing venue",
      blurb: "Community-governed venue with open peer review. The fully-open route — Route B in the assembly plan.",
      facts: [
        { k: "Reach", v: "Expanding to 16 national funders" },
      ],
    },
    graspos: {
      title: "GraspOS",
      role: "Metrics layer",
      blurb: "Builds open indicators directly from the OpenAIRE knowledge graph. The bridge from open content to open assessment.",
      facts: [],
    },
    coara: {
      title: "CoARA",
      role: "Assessment reform",
      blurb: "Coalition of research-performing organisations committed to reforming evaluation. The political ground for the policy ask.",
      facts: [
        { k: "Signatories", v: "700+ institutions" },
        { k: "Deadline", v: "2027 — reformed assessment commitments due" },
      ],
    },
    mandate: {
      title: "EU funder mandates",
      role: "Policy lever — the missing link",
      blurb: "The single piece not yet activated. A mandate that EU-funded peer reviews be deposited as open, citable, PID-assigned objects would activate the system already in place.",
      facts: [
        { k: "Authority", v: "Within the EC's remit — public evaluation processes" },
        { k: "Standing", v: "Publishers have no claim over reviews in public evaluations" },
        { k: "New build?", v: "None — every other component is already deployed" },
        { k: "Precedent", v: "ANECA's evaluation requirement in Spain transformed repository deposit behaviour without any technical change" },
      ],
    },
    orcid: {
      title: "ORCID",
      role: "Identity layer",
      blurb: "Researcher identifiers that link review records, publications and datasets to people. Connective tissue across the graph.",
      facts: [],
    },
  };

  // -------- Helpers --------
  function el(name, attrs = {}, children = []) {
    const e = document.createElementNS(svgNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    children.forEach((c) => e.appendChild(c));
    return e;
  }

  function buildMap(host, opts = {}) {
    const W = 1480;
    const H = 920;
    host.innerHTML = "";

    const svg = el("svg", {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      height: "100%",
      class: "infra-map-svg",
      style: "display: block;",
    });

    const defs = el("defs");
    defs.innerHTML = `
      <filter id="paperGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    // Pre-compute coords
    const nodeMap = {};
    NODES.forEach((n) => {
      nodeMap[n.id] = { ...n, cx: n.x * W, cy: n.y * H };
    });

    // ---- Edges ----
    const edgesG = el("g", { class: "edges" });
    svg.appendChild(edgesG);

    const edgeEls = [];
    EDGES.forEach((edge, i) => {
      const a = nodeMap[edge.a];
      const b = nodeMap[edge.b];
      const mx = (a.cx + b.cx) / 2;
      const my = (a.cy + b.cy) / 2;
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      const len = Math.sqrt(dx * dx + dy * dy);
      const off = Math.min(40, len * 0.08) * ((i % 2 === 0) ? 1 : -1);
      const cx = mx + (-dy / len) * off;
      const cy = my + (dx / len) * off;

      const path = el("path", {
        d: `M ${a.cx} ${a.cy} Q ${cx} ${cy} ${b.cx} ${b.cy}`,
        fill: "none",
        stroke: edge.missing ? "#c97a0a" : "#0d3b4f",
        "stroke-width": edge.missing ? "2" : "1.4",
        "stroke-dasharray": edge.missing ? "8 6" : "0",
        opacity: edge.missing ? "0.55" : "0.22",
        class: `edge edge-${edge.route} ${edge.missing ? "edge-missing" : ""}`,
        "data-route": edge.route,
        "data-from": edge.a,
        "data-to": edge.b,
      });
      edgesG.appendChild(path);
      edgeEls.push({ path, edge });
    });

    // ---- Nodes ----
    const nodesG = el("g", { class: "nodes" });
    svg.appendChild(nodesG);

    const nodeEls = {};
    NODES.forEach((n) => {
      const m = nodeMap[n.id];
      const g = el("g", {
        class: `node ${n.accent ? "node-accent" : ""} ${n.missing ? "node-missing" : ""}`,
        "data-id": n.id,
        transform: `translate(${m.cx}, ${m.cy})`,
        style: "cursor: pointer;",
      });

      // outer halo
      const halo = el("circle", {
        r: n.r + 14,
        fill: n.missing ? "rgba(245,158,11,0.10)" : "rgba(13,59,79,0.05)",
        class: "node-halo",
      });
      g.appendChild(halo);

      // inner circle — paper-friendly fills
      const fill = n.missing ? "#fdf3df" : (n.accent ? "#dceee8" : "#ece4d3");
      const stroke = n.missing ? "#c97a0a" : (n.accent ? "#0d3b4f" : "#0d3b4f");
      const sw = n.missing ? 2.5 : (n.accent ? 2 : 1.4);
      const circ = el("circle", {
        r: n.r,
        fill: fill,
        stroke: stroke,
        "stroke-width": sw,
        class: "node-circle",
        filter: "url(#paperGlow)",
      });
      g.appendChild(circ);

      // label inside
      const lines = n.label.split("\n");
      const labelG = el("g", { class: "node-label" });
      lines.forEach((line, i) => {
        const t = el("text", {
          x: 0,
          y: -((lines.length - 1) * 9) + i * 18,
          "text-anchor": "middle",
          "font-family": "Inter, sans-serif",
          "font-size": lines.length > 1 ? "15" : "17",
          "font-weight": "600",
          fill: n.missing ? "#9a5e08" : "#0a1628",
          "letter-spacing": "-0.01em",
        });
        t.textContent = line;
        labelG.appendChild(t);
      });
      g.appendChild(labelG);

      // sublabel
      const subLines = n.sub.split("\n");
      subLines.forEach((line, i) => {
        const t = el("text", {
          x: 0,
          y: n.r + 22 + i * 16,
          "text-anchor": "middle",
          "font-family": "IBM Plex Mono, monospace",
          "font-size": "12",
          fill: "rgba(10,22,40,0.55)",
          "letter-spacing": "0.04em",
        });
        t.textContent = line;
        g.appendChild(t);
      });

      nodesG.appendChild(g);
      nodeEls[n.id] = g;

      g.addEventListener("click", () => opts.onNodeClick && opts.onNodeClick(n.id));
      g.addEventListener("mouseenter", () => {
        circ.setAttribute("stroke-width", sw + 1.2);
        halo.setAttribute("r", n.r + 22);
      });
      g.addEventListener("mouseleave", () => {
        circ.setAttribute("stroke-width", sw);
        halo.setAttribute("r", n.r + 14);
      });
    });

    // gentle bob
    NODES.forEach((n, i) => {
      const m = nodeMap[n.id];
      const g = nodeEls[n.id];
      const phase = (i * 0.7) % (Math.PI * 2);
      const amp = 3 + (i % 3);
      const speed = 0.0005 + (i % 4) * 0.00008;
      function tick(t) {
        const dy = Math.sin(t * speed + phase) * amp;
        const dx = Math.cos(t * speed * 0.7 + phase) * amp * 0.6;
        g.setAttribute("transform", `translate(${m.cx + dx}, ${m.cy + dy})`);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    host.appendChild(svg);

    return {
      svg,
      highlightNode(id, on = true) {
        const g = nodeEls[id];
        if (!g) return;
        const c = g.querySelector(".node-circle");
        const halo = g.querySelector(".node-halo");
        const n = NODES.find((x) => x.id === id);
        if (on) {
          c.setAttribute("filter", "url(#strongGlow)");
          c.setAttribute("fill", n.missing ? "#fde7b7" : "#c8dcd3");
          halo.setAttribute("r", n.r + 24);
          halo.setAttribute("fill", n.missing ? "rgba(245,158,11,0.18)" : "rgba(13,59,79,0.12)");
        } else {
          c.setAttribute("filter", "url(#paperGlow)");
          c.setAttribute("fill", n.missing ? "#fdf3df" : (n.accent ? "#dceee8" : "#ece4d3"));
          halo.setAttribute("r", n.r + 14);
          halo.setAttribute("fill", n.missing ? "rgba(245,158,11,0.10)" : "rgba(13,59,79,0.05)");
        }
      },
      highlightEdges(nodeId, on = true) {
        edgeEls.forEach(({ path, edge }) => {
          const touches = edge.a === nodeId || edge.b === nodeId;
          if (on && touches) {
            path.setAttribute("opacity", "0.95");
            path.setAttribute("stroke-width", edge.missing ? "3" : "2.2");
            path.setAttribute("stroke", edge.missing ? "#c97a0a" : "#0d3b4f");
          } else {
            path.setAttribute("opacity", edge.missing ? "0.55" : "0.22");
            path.setAttribute("stroke-width", edge.missing ? "2" : "1.4");
          }
        });
      },
      reset() {
        Object.keys(DETAILS).forEach((id) => this.highlightNode(id, false));
        edgeEls.forEach(({ path, edge }) => {
          path.setAttribute("opacity", edge.missing ? "0.55" : "0.22");
          path.setAttribute("stroke-width", edge.missing ? "2" : "1.4");
        });
      },
    };
  }

  window.InfraMap = { build: buildMap, NODES, EDGES, DETAILS };
})();
