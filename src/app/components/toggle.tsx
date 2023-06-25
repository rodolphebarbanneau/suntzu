import styles from './toggle.module.scss';

export const Toggle = (
  { isToggled, onToggle }: {
    isToggled: boolean;
    onToggle: () => void;
  },
) => {
  return (
    <label className={styles['toggle']}>
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span />
    </label>
  );
};

export default Toggle;
