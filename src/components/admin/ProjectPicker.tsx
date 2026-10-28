"use client";

import { useMemo, useState } from "react";
import formStyles from "@/components/forms/forms.module.css";

type ProjectOption = { id: number; address: string; place: string; postcode: string };

function labelFor(p: ProjectOption) {
  return `${p.address}, ${p.place} (${p.postcode}) — #${p.id}`;
}

export default function ProjectPicker({
  projects,
  defaultProject,
  label = "Attached project (optional — which job this is for)",
}: {
  projects: ProjectOption[];
  defaultProject: ProjectOption | null;
  label?: string;
}) {
  const [text, setText] = useState(defaultProject ? labelFor(defaultProject) : "");
  const [projectId, setProjectId] = useState<number | null>(defaultProject?.id ?? null);

  const labelToId = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) map.set(labelFor(p), p.id);
    return map;
  }, [projects]);

  return (
    <div className={formStyles.field}>
      <label className={formStyles.label} htmlFor="projectPicker">
        {label}
      </label>
      <input
        id="projectPicker"
        list="project-options"
        value={text}
        onChange={(e) => {
          const value = e.target.value;
          setText(value);
          setProjectId(labelToId.get(value) ?? null);
        }}
        placeholder="Start typing an address…"
        className={formStyles.input}
      />
      <datalist id="project-options">
        {projects.map((p) => (
          <option key={p.id} value={labelFor(p)} />
        ))}
      </datalist>
      <input type="hidden" name="projectId" value={projectId ?? ""} />
      {text && !projectId && (
        <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>
          No matching project selected from the list — this won&apos;t be
          attached.
        </p>
      )}
      {projectId && (
        <button
          type="button"
          onClick={() => {
            setText("");
            setProjectId(null);
          }}
          style={{
            fontSize: 12,
            color: "var(--color-muted)",
            textDecoration: "underline",
            marginTop: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
