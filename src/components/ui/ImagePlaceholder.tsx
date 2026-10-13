import styles from "./ImagePlaceholder.module.css";

type Props = {
  label: string;
  rounded?: boolean;
  className?: string;
};

// Standing in for real photography until the harvest from Jonathon's
// archive is imported. Swap for an <Image> once a photoUrl exists.
export default function ImagePlaceholder({ label, rounded, className }: Props) {
  return (
    <div
      className={[styles.placeholder, rounded ? styles.rounded : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
    </div>
  );
}
