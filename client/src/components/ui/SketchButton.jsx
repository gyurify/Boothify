export default function SketchButton({
  children,
  className = '',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  ...props
}) {
  const classes = [
    'sketch-button',
    `sketch-button--${variant}`,
    `sketch-button--${size}`,
    fullWidth ? 'sketch-button--block' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      <span className="sketch-button__label">{children}</span>
    </button>
  );
}

