# Gold Type Modal Design

## Shared Language

- Uses the same generic admin modal shell as Stock.
- Header, content, and footer remain visible and proportional to the task.
- Keyboard focus is trapped, Escape and backdrop close the dialog, and focus is restored after close.

## Add and Edit

- Wide desktop layout with product fields on the left and live preview on the right.
- Four categories use accessible radio-card semantics and contextual descriptions.
- Product ID is generated from the name on create and remains immutable on edit.
- LM requires a positive weight; karat defaults to 24 when selecting LM or Buyback LM if empty.
- Edit submission is disabled until a field changes.
- Primary actions read `Tambah produk` and `Simpan perubahan`.

## Delete

- Compact danger-accent dialog displays product identity and system ID.
- Destructive action reads `Hapus produk` and exposes database rejection inline.
- No generic logout-style icon is used.
