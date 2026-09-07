# Stock Correction

## Objective

Allow administrators to correct an incorrect manual stock movement without editing or deleting audit history.

## Rules

- Only authenticated administrators can read or mutate stock administration endpoints.
- A manual adjustment and its movement record are committed atomically.
- Stock can never become negative.
- Quantity must be a positive integer.
- Only an active manual movement can be corrected from the Stock menu.
- Order movements must be corrected by editing or cancelling the originating order.
- A correction requires a replacement quantity and a reason.
- Correction preserves the original movement, creates a full reversal and a replacement movement, and records the actor.
- A correction replacement remains eligible for a later correction if another mistake is found.

## User Interface

- Movement history displays source, actor, state, and correction action.
- Corrected movements remain visible and are marked `Dikoreksi`.
- The correction dialog previews current and resulting stock before confirmation.
- Correction is disabled when the replacement quantity is unchanged or would make stock negative.

## Acceptance

- Admin can create and correct a manual movement.
- CS and unauthenticated requests are rejected.
- Movement history is never deleted or overwritten.
- Concurrent mutations serialize on the affected stock row.
