export const Toggle = ({
  isToggled,
  onToggle,
}: {
  isToggled: boolean;
  onToggle: () => void;
}) => {
  return (
    <label className="toggle">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="slider" />
    </label>
  );
};

export default Toggle;
