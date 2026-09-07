# Stock Modal Design

## Direction

Use the approved Orders modal as the interaction and visual reference while keeping each Stock task proportional to its information density.

## Shared Shell

- Consistent gold accent, eyebrow, title, description, close control, content region, and footer.
- Desktop content stays within the viewport; constrained-height and mobile screens may scroll inside the content region.
- Escape and backdrop close the modal.
- Keyboard focus is trapped while open and restored to the triggering control after close.

## Adjustment

- Wide two-column desktop layout.
- Left card contains product, brand, quantity, note, and quick-note choices.
- Right card previews product identity, movement type, current stock, delta, and final stock.
- Semantic green/red treatment communicates in/out alongside visible text.

## Correction

- Wide comparison layout with immutable original movement and editable corrected data.
- A separate impact strip shows current stock, net correction, and final stock.
- Audit explanation remains visible and correction reason remains required.

## Minimum Stock

- Compact modal with product context, current stock, old threshold, new threshold, and resulting availability state.
