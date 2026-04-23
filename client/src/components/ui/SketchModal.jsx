import { useEffect } from 'react';
import SketchButton from './SketchButton.jsx';

export default function SketchModal({ open, eyebrow, title, children, actions, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="sketch-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="sketch-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="sketch-modal__header">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h3>{title}</h3>
          </div>
          <SketchButton onClick={onClose} size="sm" type="button" variant="ghost">
            Close
          </SketchButton>
        </div>

        <div className="sketch-modal__body">{children}</div>

        {actions ? <div className="sketch-modal__actions">{actions}</div> : null}
      </div>
    </div>
  );
}

