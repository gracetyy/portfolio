import styles from "./ProjectShape.module.css";

export function ProjectShape() {
  return (
    <div className={styles.shapeContainer}>
      <div className={styles.gradientMask} />
    </div>
  );
}
