/* ============================================================
   Network renderer — separated node cards on warm paper,
   glue ribbons, particle flows, sticky-note policies.
   ============================================================ */

(function () {
  const { PIECES, CONNECTIONS, FLOWS, POLICIES } = window.INFRA_DATA;
  const svgNS = "http://www.w3.org/2000/svg";

  // Node card geometry
  const NODE_W = 244;
  const NODE_H = 148;
  const COL_GAP = 104;  // generous separation
  const ROW_GAP = 124;

  // Rows used: -1 (authors), 0 (deposit), 1 (review), 2 (top)
  const ROWS_RANGE = [-1, 0, 1, 2];
  const COLS = 4;
  const ORIGIN_X = 90;
  const ORIGIN_Y = 80;
  const BOARD_W = ORIGIN_X * 2 + COLS * NODE_W + (COLS - 1) * COL_GAP;
  const BOARD_H = ORIGIN_Y * 2 + ROWS_RANGE.length * NODE_H + (ROWS_RANGE.length - 1) * ROW_GAP + 40;

  function el(name, attrs = {}) {
    const e = document.createElementNS(svgNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function nodeXY(p) {
    const x = ORIGIN_X + p.col * (NODE_W + COL_GAP);
    // row -1 at top? No — row -1 is authors, but we want bottom-to-top reading.
    // Actually: authors are "above" the system in narrative — they put things in.
    // Better: authors at TOP, repos below, then review, then aggregation at very top?
    // User said: A flows from authors → repos. So authors are ABOVE repos.
    // But the rest is bottom-to-top: repos (low) → review → aggregation (high).
    // So: place authors at the SIDE or treat as a separate band.
    // Simplest: authors ABOVE repos, but repos still at bottom. Aggregation at top.
    // Reorder rows: row -1 (authors) sits BETWEEN repos and review? No, source.
    // Let's just place authors LEFT of the repos row instead of a row.
    // Actually keep grid simple: bottom-to-top = repos, review, aggregation.
    // Authors as a separate "source" node placed to the left of the repos row,
    // floating slightly above-left. We'll handle authors specially.
    const rowIdx = ROWS_RANGE.indexOf(p.row);
    const y = ORIGIN_Y + (ROWS_RANGE.length - 1 - rowIdx) * (NODE_H + ROW_GAP);
    return { x, y };
  }

  function nodeCenter(p) {
    const { x, y } = nodeXY(p);
    return { cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
  }

  function build(host, opts = {}) {
    host.innerHTML = "";

    const svg = el("svg", {
      viewBox: `0 0 ${BOARD_W} ${BOARD_H}`,
      width: "100%",
      height: "100%",
      style: "display: block; font-family: Inter, sans-serif; touch-action: manipulation;",
    });

    const defs = el("defs");
    const arrowMarkerDefs = FLOWS.map(f => `
      <marker id="arrow-${f.id}" viewBox="0 0 10 6" markerWidth="12" markerHeight="8"
        refX="10" refY="3" orient="auto">
        <path d="M 0 0 L 10 3 L 0 6 z" fill="${f.color}" opacity="0.9"/>
      </marker>
    `).join('');
    defs.innerHTML = `
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0a1628" flood-opacity="0.10"/>
      </filter>
      <filter id="noteShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#0a1628" flood-opacity="0.16"/>
      </filter>
      ${arrowMarkerDefs}
    `;
    svg.appendChild(defs);

    // Cluster band labels (subtle)
    const bands = [
      { row: -1, label: "AUTHORS" },
      { row: 0,  label: "ARCHIVE" },
      { row: 1,  label: "REVIEW" },
      { row: 2,  label: "AGGREGATE" },
    ];
    bands.forEach((b) => {
      const rowIdx = ROWS_RANGE.indexOf(b.row);
      const y = ORIGIN_Y + (ROWS_RANGE.length - 1 - rowIdx) * (NODE_H + ROW_GAP) + NODE_H / 2 + 4;
      const t = el("text", {
        transform: `translate(14, ${y}) rotate(-90)`,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "10",
        "letter-spacing": "0.22em",
        fill: "rgba(10,22,40,0.32)",
      });
      t.textContent = b.label;
      svg.appendChild(t);
    });

    // Cluster lane backgrounds
    const CLUSTER_COLORS = {
      "-1": { fill: "rgba(245,178,50,0.07)",  stroke: "rgba(154,94,8,0.13)"   },
      "0":  { fill: "rgba(28,122,140,0.07)",  stroke: "rgba(13,75,94,0.14)"   },
      "1":  { fill: "rgba(91,138,58,0.07)",   stroke: "rgba(45,100,25,0.14)"  },
      "2":  { fill: "rgba(58,91,138,0.08)",   stroke: "rgba(25,55,110,0.14)"  },
    };
    const LANE_PAD_X = 32;
    const LANE_PAD_Y = 18;
    const gLanes = el("g", { class: "layer-lanes" });
    ROWS_RANGE.forEach((row) => {
      const rowIdx = ROWS_RANGE.indexOf(row);
      const y = ORIGIN_Y + (ROWS_RANGE.length - 1 - rowIdx) * (NODE_H + ROW_GAP);
      const colors = CLUSTER_COLORS[String(row)];
      if (!colors) return;
      gLanes.appendChild(el("rect", {
        x: LANE_PAD_X, y: y - LANE_PAD_Y,
        width: BOARD_W - LANE_PAD_X * 2,
        height: NODE_H + LANE_PAD_Y * 2,
        rx: 16, fill: colors.fill, stroke: colors.stroke, "stroke-width": "1",
      }));
    });

    // Layer groups (z-order)
    const gFlows = el("g", { class: "layer-flows" });
    const gInfra = el("g", { class: "layer-infra" });
    const gGlue = el("g", { class: "layer-glue" });
    const gPolicies = el("g", { class: "layer-policies" });
    svg.appendChild(gLanes);  // bottom layer: cluster backgrounds
    svg.appendChild(gFlows);  // under nodes
    svg.appendChild(gInfra);
    svg.appendChild(gGlue);
    svg.appendChild(gPolicies);

    // ---- Render node cards ----
    const pieceEls = {};
    PIECES.forEach((p) => {
      const { x, y } = nodeXY(p);
      const g = el("g", {
        class: `piece ${p.accent ? "piece-accent" : ""} ${p.cluster === "authors" ? "piece-authors" : ""}`,
        "data-id": p.id,
        transform: `translate(${x}, ${y})`,
        style: "cursor: pointer;",
      });

      const fill = p.cluster === "authors" ? "#fef5e2" :
                   p.cluster === "deposit" ? (p.accent ? "#bfe4d8" : "#d8eae7") :
                   p.cluster === "review"  ? "#dae9d4" :
                   p.cluster === "top"     ? "#d6e2ec" :
                   "#ece4d3";
      const stroke = p.cluster === "authors" ? "#9a5e08" :
                     p.cluster === "deposit" ? (p.accent ? "#0a5e48" : "#0d4a5e") :
                     p.cluster === "review"  ? "#3a6a28" :
                     p.cluster === "top"     ? "#2a4a6a" :
                     "#0d3b4f";
      const strokeWidth = p.accent ? "2.4" : "1.5";

      // Invisible hit-padding rect — expands touch target on iOS/iPadOS
      const hitPad = el("rect", {
        x: -8, y: -8, width: NODE_W + 16, height: NODE_H + 16, rx: 16,
        fill: "transparent", stroke: "none", "pointer-events": "all",
      });
      g.appendChild(hitPad);

      const rect = el("rect", {
        x: 0, y: 0, width: NODE_W, height: NODE_H, rx: 10,
        fill, stroke, "stroke-width": strokeWidth, "stroke-opacity": "0.9",
        filter: "url(#cardShadow)",
        class: "piece-shape",
      });
      if (p.cluster === "authors") rect.setAttribute("stroke-dasharray", "7 3");
      g.appendChild(rect);

      // Accent node: teal header bar
      if (p.accent) {
        const bar = el("rect", { x: 2, y: 2, width: NODE_W - 4, height: 7, rx: 9 });
        bar.setAttribute("fill", "#0a6050");
        bar.setAttribute("opacity", "0.55");
        g.appendChild(bar);
      }

      // Cluster tag
      const tagText = p.cluster === "authors" ? "AUTHORS" :
                      p.cluster === "deposit" ? "ARCHIVE" :
                      p.cluster === "review" ? "REVIEW" :
                      p.cluster === "top" ? (p.id === "openaire" ? "AGGREGATION" : "METRICS") : "";
      const tag = el("text", {
        x: 16, y: 22,
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "10",
        "letter-spacing": "0.16em",
        fill: p.cluster === "authors" ? "rgba(154,94,8,0.7)" : "rgba(10,22,40,0.5)",
      });
      tag.textContent = tagText;
      g.appendChild(tag);

      // Label
      const lines = p.label.split("\n");
      lines.forEach((line, i) => {
        const t = el("text", {
          x: NODE_W / 2,
          y: NODE_H / 2 - (lines.length - 1) * 13 + i * 26 + 4,
          "text-anchor": "middle",
          "font-family": "Fraunces, serif",
          "font-size": "24",
          "font-weight": "400",
          fill: p.cluster === "authors" ? "#5a3a04" : "#0a1628",
          "letter-spacing": "-0.01em",
        });
        t.textContent = line;
        g.appendChild(t);
      });

      // Role
      const role = el("text", {
        x: NODE_W / 2,
        y: NODE_H - 16,
        "text-anchor": "middle",
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "10",
        fill: p.cluster === "authors" ? "rgba(154,94,8,0.7)" : "rgba(10,22,40,0.55)",
        "letter-spacing": "0.04em",
      });
      role.textContent = p.role;
      g.appendChild(role);

      g.addEventListener("click", () => opts.onSelect && opts.onSelect("piece", p.id));
      g.addEventListener("touchstart", (e) => { e.stopPropagation(); opts.onSelect && opts.onSelect("piece", p.id); }, { passive: true });
      g.addEventListener("mouseenter", () => rect.setAttribute("stroke-width", "3"));      g.addEventListener("mouseleave", () => rect.setAttribute("stroke-width", strokeWidth));

      gInfra.appendChild(g);
      pieceEls[p.id] = g;
    });

    // ---- Glue ribbons ----
    const glueEls = {};
    CONNECTIONS.forEach((c) => {
      const a = PIECES.find((p) => p.id === c.from);
      const b = PIECES.find((p) => p.id === c.to);
      if (!a || !b) return;
      const ca = nodeCenter(a);
      const cb = nodeCenter(b);
      const mx = (ca.cx + cb.cx) / 2;
      const my = (ca.cy + cb.cy) / 2;

      const g = el("g", { class: "glue", "data-id": c.id, style: "cursor: pointer; display: none;" });
      const rw = 110, rh = 24;
      const wrap = el("g", { transform: `translate(${mx}, ${my})` });

      const ribbon = el("rect", {
        x: -rw / 2, y: -rh / 2, width: rw, height: rh, rx: 4,
        fill: "#fdf3df", stroke: "#9a5e08", "stroke-width": "1",
        filter: "url(#noteShadow)",
      });
      wrap.appendChild(ribbon);

      [-rw / 2 + 8, rw / 2 - 8].forEach((dx) => {
        wrap.appendChild(el("circle", { cx: dx, cy: 0, r: 2, fill: "#9a5e08", opacity: "0.7" }));
      });

      const label = el("text", {
        x: 0, y: 4, "text-anchor": "middle",
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "11", "font-weight": "500",
        fill: "#9a5e08", "letter-spacing": "0.1em",
      });
      label.textContent = c.label;
      wrap.appendChild(label);

      g.appendChild(wrap);
      g.addEventListener("click", () => opts.onSelect && opts.onSelect("glue", c.id));
      g.addEventListener("touchstart", (e) => { e.stopPropagation(); opts.onSelect && opts.onSelect("glue", c.id); }, { passive: true });
      g.addEventListener("mouseenter", () => ribbon.setAttribute("stroke-width", "2"));
      g.addEventListener("mouseleave", () => ribbon.setAttribute("stroke-width", "1"));
      gGlue.appendChild(g);
      glueEls[c.id] = g;
    });

    // ---- Flow arrows ----
    // Helper: find the point where a line from fromCenter exits the node rectangle
    function nodeEdge(fromCenter, toCenter) {
      const dx = toCenter.cx - fromCenter.cx;
      const dy = toCenter.cy - fromCenter.cy;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return { x: fromCenter.cx, y: fromCenter.cy };
      const hw = NODE_W / 2;
      const hh = NODE_H / 2;
      const tx = Math.abs(dx) > 0.1 ? hw / Math.abs(dx) : Infinity;
      const ty = Math.abs(dy) > 0.1 ? hh / Math.abs(dy) : Infinity;
      const t = Math.min(tx, ty);
      return { x: fromCenter.cx + dx * t, y: fromCenter.cy + dy * t };
    }

    const flowState = { A: false, B: false, C: false, D: false };
    const flowGroups = {};
    FLOWS.forEach((f) => {
      const g = el("g", { class: `flow flow-${f.id}`, "data-flow": f.id, style: "display: none;" });
      f.paths.forEach((seg, idx) => {
        const a = PIECES.find((p) => p.id === seg[0]);
        const b = PIECES.find((p) => p.id === seg[1]);
        if (!a || !b) return;
        const ca = nodeCenter(a);
        const cb = nodeCenter(b);
        // Start at source edge, end at target edge so arrowhead is visible
        const pa = nodeEdge(ca, cb);
        const pb = nodeEdge(cb, ca);
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const off = Math.min(50, len * 0.10) * ((idx % 2 === 0) ? 1 : -1);
        const cx = mx + (-dy / len) * off;
        const cy = my + (dx / len) * off;
        const d = `M ${pa.x} ${pa.y} Q ${cx} ${cy} ${pb.x} ${pb.y}`;

        const trail = el("path", {
          d, fill: "none", stroke: f.color,
          "stroke-width": "2.5", opacity: "0.72", "stroke-linecap": "round",
          "marker-end": `url(#arrow-${f.id})`,
        });
        g.appendChild(trail);
      });
      gFlows.appendChild(g);
      flowGroups[f.id] = g;
    });

    // ---- Policy sticky notes ----
    const policyState = { P1: false, P2: false };
    const policyGroups = {};
    POLICIES.forEach((pol) => {
      const g = el("g", { class: "policy", "data-id": pol.id, style: "display: none; cursor: pointer;" });
      const noteW = 270, noteH = 120;
      const noteX = BOARD_W - noteW - 30;
      const noteY = 50 + pol.slot * (noteH + 50);
      const tilt = pol.slot === 0 ? -2.2 : 1.6;

      const wrap = el("g", { transform: `translate(${noteX + noteW / 2}, ${noteY + noteH / 2}) rotate(${tilt})` });
      const note = el("rect", {
        x: -noteW / 2, y: -noteH / 2, width: noteW, height: noteH, rx: 2,
        fill: "#fde7b7", stroke: "#c97a0a", "stroke-width": "1",
        filter: "url(#noteShadow)",
      });
      wrap.appendChild(note);
      const pin = el("circle", { cx: -noteW / 2 + 18, cy: -noteH / 2 + 16, r: 7, fill: "#c97a0a", stroke: "#9a5e08" });
      wrap.appendChild(pin);
      wrap.appendChild(el("circle", { cx: -noteW / 2 + 16, cy: -noteH / 2 + 14, r: 2, fill: "#fdf3df", opacity: "0.7" }));

      const num = el("text", {
        x: -noteW / 2 + 38, y: -noteH / 2 + 24,
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "11", "letter-spacing": "0.18em", fill: "#9a5e08",
      });
      num.textContent = pol.tag || `MANDATE 0${pol.number}`;
      wrap.appendChild(num);

      const titleLines = wrapText(pol.title, 26);
      titleLines.forEach((line, idx) => {
        const t = el("text", {
          x: -noteW / 2 + 18, y: -noteH / 2 + 50 + idx * 22,
          "font-family": "Fraunces, serif", "font-size": "18",
          fill: "#5a3a04",
        });
        t.textContent = line;
        wrap.appendChild(t);
      });

      const authors = el("text", {
        x: -noteW / 2 + 18, y: noteH / 2 - 14,
        "font-family": "IBM Plex Mono, monospace",
        "font-size": "9", fill: "rgba(90,58,4,0.75)", "letter-spacing": "0.04em",
      });
      authors.textContent = pol.authors;
      wrap.appendChild(authors);

      g.appendChild(wrap);

      pol.targets.forEach((tid) => {
        const target = PIECES.find((p) => p.id === tid);
        if (!target) return;
        const tc = nodeCenter(target);
        const ax = noteX + 6;
        const ay = noteY + noteH / 2;
        const dx = tc.cx - ax;
        const cx = ax + dx * 0.4;
        const path = el("path", {
          d: `M ${ax} ${ay} Q ${cx} ${ay} ${tc.cx} ${tc.cy}`,
          fill: "none", stroke: "#c97a0a", "stroke-width": "1.2",
          "stroke-dasharray": "4 4", opacity: "0.7",
        });
        g.appendChild(path);
        g.appendChild(el("circle", { cx: tc.cx, cy: tc.cy, r: 4, fill: "#c97a0a" }));
      });

      g.addEventListener("click", () => opts.onSelect && opts.onSelect("policy", pol.id));
      g.addEventListener("touchstart", (e) => { e.stopPropagation(); opts.onSelect && opts.onSelect("policy", pol.id); }, { passive: true });
      g.addEventListener("mouseenter", () => note.setAttribute("stroke-width", "2"));
      g.addEventListener("mouseleave", () => note.setAttribute("stroke-width", "1"));
      gPolicies.appendChild(g);
      policyGroups[pol.id] = g;
    });

    host.appendChild(svg);

    function setFlow(id, on) {
      flowState[id] = on;
      const g = flowGroups[id];
      if (g) g.style.display = on ? "" : "none";
      // show/hide glue ribbons associated with this flow
      CONNECTIONS.forEach(c => {
        if (c.flow === id) {
          const ge = glueEls[c.id];
          if (ge) ge.style.display = on ? "" : "none";
        }
      });
    }
    function setPolicy(id, on) {
      policyState[id] = on;
      const g = policyGroups[id];
      if (g) g.style.display = on ? "" : "none";
    }
    function setLayer(kind, on) {
      if (kind === "infra") gInfra.style.opacity = on ? "1" : "0.18";
      if (kind === "glue") gGlue.style.display = on ? "" : "none";
      if (kind === "flows") {
        if (on) {
          const anyOn = Object.values(flowState).some(Boolean);
          if (!anyOn) FLOWS.forEach((f) => setFlow(f.id, true));
          gFlows.style.display = "";
        } else {
          gFlows.style.display = "none";
        }
      }
      if (kind === "policies") {
        if (on) {
          const anyOn = Object.values(policyState).some(Boolean);
          if (!anyOn) POLICIES.forEach((p) => setPolicy(p.id, true));
        } else {
          POLICIES.forEach((p) => setPolicy(p.id, false));
        }
      }
    }
    function highlightPiece(id, on) {
      const g = pieceEls[id];
      if (!g) return;
      const rect = g.querySelector(".piece-shape");
      const piece = PIECES.find(p => p.id === id);
      const baseWidth = piece && piece.accent ? "2.4" : "1.5";
      const baseStroke = piece && piece.cluster === "authors" ? "#9a5e08" :
                         piece && piece.cluster === "deposit" ? (piece.accent ? "#0a5e48" : "#0d4a5e") :
                         piece && piece.cluster === "review"  ? "#3a6a28" :
                         piece && piece.cluster === "top"     ? "#2a4a6a" :
                         "#0d3b4f";
      if (on) { rect.setAttribute("stroke", "#c97a0a"); rect.setAttribute("stroke-width", "3"); }
      else { rect.setAttribute("stroke", baseStroke); rect.setAttribute("stroke-width", baseWidth); }
    }
    return { svg, setLayer, setFlow, setPolicy, highlightPiece, flowState, policyState };
  }

  function wrapText(text, maxChars) {
    const words = text.split(" ");
    const lines = [];
    let cur = "";
    words.forEach((w) => {
      if ((cur + " " + w).trim().length <= maxChars) cur = (cur + " " + w).trim();
      else { if (cur) lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  window.Puzzle = { build };
})();
