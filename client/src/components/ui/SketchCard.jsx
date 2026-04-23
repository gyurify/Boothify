export default function SketchCard({
  as: Tag = 'section',
  children,
  className = '',
  interactive = false,
  tone = 'paper',
  tilt = 0,
  ...props
}) {
  const classes = [
    'sketch-card',
    `sketch-card--${tone}`,
    interactive ? 'sketch-card--interactive' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    ...props.style,
    ...(tilt ? { '--card-tilt': `${tilt}deg` } : {})
  };

  return (
    <Tag className={classes} {...props} style={style}>
      {children}
    </Tag>
  );
}

