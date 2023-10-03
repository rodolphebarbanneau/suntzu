import styles from './toggle.module.scss';

/* Toggle */
export const Toggle = (
  { isToggled, onToggle, isDisabled }: {
    isToggled: boolean;
    onToggle: () => void;
    isDisabled?: boolean;
  },
) => {
  return (
    <label className={styles['toggle']}>
      <input
        type="checkbox"
        checked={!isDisabled && isToggled}
        onChange={onToggle}
        disabled={isDisabled ?? false}
      />
      <span />
    </label>
  );
};

export default Toggle;
