/* ============================================================
   Sidebar renderer — block-composition.
   ============================================================ */
(function () {
  function render(container, item) {
    if (!item || !item.blocks) {
      container.innerHTML = "";
      return;
    }
    // Fade out → swap → fade in
    container.classList.add("fading");
    setTimeout(() => {
      container.innerHTML = "";
      item.blocks.forEach((b) => {
        const node = renderBlock(b);
        if (node) container.appendChild(node);
      });
      container.classList.remove("fading");
    }, 160);
  }

  function renderBlock(b) {
    switch (b.kind) {
      case "header": {
        const wrap = document.createElement("div");
        wrap.style.cssText = "margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--rule-light);";
        wrap.innerHTML = `
          <div class="mono" style="font-size: 11px; letter-spacing: 0.20em; text-transform: uppercase; color: var(--teal-600); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span style="display:inline-block;width:24px;height:1px;background:currentColor;"></span>${escape(b.tag || "")}
          </div>
          <h2 style="font-family: var(--font-display); font-size: 34px; font-weight: 400; line-height: 1.08; font-variation-settings: 'SOFT' 50, 'opsz' 34; letter-spacing: -0.015em; margin: 0 0 10px 0; color: var(--text-on-light); text-wrap: balance; white-space: pre-line;">${escape(b.title || "")}</h2>
          ${b.role ? `<div style="font-size: 13px; font-family: var(--font-mono); letter-spacing: 0.04em; color: var(--text-on-light-muted); line-height: 1.5; padding: 6px 10px; background: rgba(10,22,40,0.04); border-radius: 4px; display: inline-block;">${escape(b.role)}</div>` : ""}
        `;
        return wrap;
      }
      case "lede": {
        const p = document.createElement("p");
        p.style.cssText = "font-size: 18px; line-height: 1.55; color: var(--text-on-light-muted); margin: 0 0 18px 0; text-wrap: pretty;";
        p.textContent = b.text || "";
        return p;
      }
      case "facts": {
        const wrap = document.createElement("div");
        wrap.style.cssText = "display: flex; flex-direction: column; gap: 0; margin: 12px 0;";
        (b.rows || []).forEach((f) => {
          const row = document.createElement("div");
          row.style.cssText = "display: grid; grid-template-columns: 110px 1fr; gap: 18px; align-items: baseline; padding: 12px 0; border-top: 1px solid var(--rule-light);";
          row.innerHTML = `<div class="mono" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(10,22,40,0.5);">${escape(f.k)}</div><div style="font-size: 16px; line-height: 1.45; color: var(--text-on-light); text-wrap: pretty;">${escape(f.v)}</div>`;
          wrap.appendChild(row);
        });
        return wrap;
      }
      case "stat": {
        const wrap = document.createElement("div");
        wrap.style.cssText = "margin: 18px 0; padding: 20px 0; border-top: 1px solid var(--rule-light); border-bottom: 1px solid var(--rule-light);";
        wrap.innerHTML = `
          <div style="font-family: var(--font-display); font-size: 72px; font-weight: 300; line-height: 1; color: var(--teal-600); font-variation-settings: 'SOFT' 100, 'opsz' 72;">${escape(b.value)}</div>
          <div class="mono" style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-on-light-muted); margin-top: 8px;">${escape(b.caption || "")}</div>
        `;
        return wrap;
      }
      case "quote": {
        const wrap = document.createElement("blockquote");
        wrap.style.cssText = "margin: 18px 0; padding-left: 20px; border-left: 3px solid var(--teal-600);";
        wrap.innerHTML = `<p style="font-family: var(--font-display); font-size: 22px; line-height: 1.3; font-style: italic; color: var(--text-on-light); margin: 0 0 8px 0;">${escape(b.text)}</p>${b.attrib ? `<div class="mono" style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-on-light-muted);">— ${escape(b.attrib)}</div>` : ""}`;
        return wrap;
      }
      case "list": {
        const ul = document.createElement("ul");
        ul.style.cssText = "margin: 14px 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px;";
        (b.items || []).forEach((it) => {
          const li = document.createElement("li");
          li.style.cssText = "font-size: 16px; line-height: 1.5; color: var(--text-on-light-muted);";
          li.textContent = it;
          ul.appendChild(li);
        });
        return ul;
      }
      case "links": {
        const wrap = document.createElement("div");
        wrap.style.cssText = "display: flex; flex-direction: column; gap: 10px; margin: 14px 0;";
        (b.items || []).forEach((it) => {
          const a = document.createElement(it.url ? "a" : "div");
          a.style.cssText = "font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: var(--teal-600); text-decoration: none; border-bottom: 1px solid var(--rule-light); padding-bottom: 8px;";
          if (it.url) { a.href = it.url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
          a.textContent = it.label;
          wrap.appendChild(a);
        });
        return wrap;
      }
      case "rule": {
        const hr = document.createElement("hr");
        hr.style.cssText = "border: none; border-top: 1px solid var(--rule-light); margin: 14px 0;";
        return hr;
      }
      case "spacer": {
        const d = document.createElement("div");
        d.style.height = (b.size || 16) + "px";
        return d;
      }
      case "example": {
        const wrap = document.createElement("div");
        wrap.style.cssText = "margin: 14px 0; padding: 12px 16px; background: rgba(201,122,10,0.06); border-left: 3px solid #c97a0a; border-radius: 0 6px 6px 0;";
        const label = document.createElement("div");
        label.style.cssText = "font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #c97a0a; margin-bottom: 8px;";
        label.textContent = "In practice";
        const text = document.createElement("div");
        text.style.cssText = "font-size: 15px; line-height: 1.5; color: var(--text-on-light);";
        text.innerHTML = b.html || escape(b.text || "");
        wrap.appendChild(label);
        wrap.appendChild(text);
        return wrap;
      }
      case "html": {
        const d = document.createElement("div");
        d.innerHTML = b.html || "";
        return d;
      }
    }
    return null;
  }

  function escape(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  window.Sidebar = { render };
})();
