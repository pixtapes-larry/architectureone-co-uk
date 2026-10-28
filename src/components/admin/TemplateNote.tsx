// Shown at the top of admin forms for pages that share one template
// component across many rows (Category Pages, Project Types, Local
// Authority pages) — makes clear the layout itself isn't editable here,
// only the text fields below it are.
export default function TemplateNote({ templateName }: { templateName: string }) {
  return (
    <p
      style={{
        fontSize: 13,
        color: "var(--color-muted)",
        marginBottom: 20,
        background: "var(--color-surface-alt)",
        border: "1px solid var(--color-line)",
        borderRadius: "var(--radius-card)",
        padding: "12px 16px",
      }}
    >
      This page uses the shared <strong>{templateName}</strong> template —
      the layout, styling and section order are fixed in code and the same
      across every page that uses it. Only the text fields below are
      editable here.
    </p>
  );
}
