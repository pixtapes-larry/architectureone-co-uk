import Link from "next/link";
import type { SiteMapNode } from "@/lib/admin/site-map";
import styles from "./SiteMapTree.module.css";

function TreeNode({ node }: { node: SiteMapNode }) {
  return (
    <li className={styles.item}>
      <Link
        href={node.href}
        className={[styles.card, node.kind === "list" ? styles.cardList : styles.cardPage].join(" ")}
      >
        <span className={styles.label}>{node.label}</span>
        <span className={styles.arrow}>→</span>
      </Link>
      {node.note && <div className={styles.note}>{node.note}</div>}
      {node.children && node.children.length > 0 && (
        <ul className={styles.tree}>
          {node.children.map((child) => (
            <TreeNode key={child.href} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SiteMapTree({ roots }: { roots: SiteMapNode[] }) {
  return (
    <ul className={`${styles.tree} ${styles.root}`}>
      {roots.map((node) => (
        <TreeNode key={node.href} node={node} />
      ))}
    </ul>
  );
}
