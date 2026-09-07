# Spec: Order Lifecycle Hardening

## Objective

Make create, edit, and cancel order operations preserve consistency across orders, order items, customers, stock, stock movements, invoices, and EOD reporting, including under partial failure and concurrent requests.

## Tech Stack

- Next.js 16.2.12 App Router and route handlers
- React 19.2.4
- Supabase JS 2.111.0
- PostgreSQL/Supabase RPC for atomic transactions
- TypeScript 5

## Commands

- Development: `npm run dev`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Production build: `npm run build`
- Graph refresh: `graphify update .`
- Code index refresh: `codegraph update`

The project currently has no test command or test framework. Adding one requires explicit approval.

## Project Structure

- `src/app/api/admin/orders/` - HTTP boundary for order operations
- `src/lib/` - server-side adapters and shared domain logic
- `supabase/migration.sql` - current database schema/migration source
- `specs/` - approved behavioral specifications
- `tests/` - proposed unit and integration tests

## Required Behavior

### Create

- Validate order type, customer fields, item quantity, weight, product identity, and monetary values on the server.
- Derive the authenticated actor from the server session; ignore client-supplied actor identity.
- Calculate authoritative totals on the server.
- Create/update the customer, order, items, stock, movements, and invoice number in one PostgreSQL transaction.
- Reject insufficient stock instead of silently clamping stock to zero.
- Generate collision-safe order and invoice numbers.

### Edit

- Reject edits to cancelled orders.
- Reverse old movements and apply replacement movements atomically.
- Address stock by the same identity everywhere: `gold_type_id + brand`.
- Replace items, update customer linkage, and update totals within the same transaction.
- Preserve an audit trail sufficient to explain stock changes.

### Cancel

- Be idempotent: cancelling an already-cancelled order succeeds without applying another reversal.
- Reverse stock using `gold_type_id + brand` and mark the order cancelled atomically.
- Never delete movement history without an equivalent auditable reversal record.

### EOD

- An EOD report must not silently remain authoritative after a covered order is edited or cancelled.
- Initial implementation may mark the affected report stale and require regeneration; immutable revision history is out of scope.

## Code Style

Use explicit typed inputs and fail closed at the boundary:

```ts
type OrderItemInput = {
  goldTypeId: string | null;
  brand: string | null;
  qty: number;
  weight: number;
};

if (!Number.isFinite(item.qty) || item.qty <= 0) {
  throw new OrderValidationError("Jumlah item harus lebih dari nol");
}
```

Route handlers translate domain/database failures into stable HTTP responses; transaction logic belongs in PostgreSQL RPC functions, not a sequence of unrelated client calls.

## Testing Strategy

- Unit tests: payload validation, stock identity normalization, and total calculation.
- Database integration tests: create, edit, cancel, duplicate cancellation, insufficient stock, rollback after forced failure, and concurrent number generation.
- Route tests: unauthenticated, `cs`, and `admin` authorization matrix plus stable error responses.
- Regression test: edit/cancel after EOD marks the report stale.

## Boundaries

- Always: preserve existing public behavior, validate on the server, check every database result, and keep service-role usage server-only.
- Ask first: adding a test dependency, changing database schema/functions, or choosing destructive replacement of existing data.
- Never: trust `createdBy`, totals, or unrestricted prices from the browser; silently clamp insufficient stock; delete user data during migration.

## Success Criteria

- Every lifecycle mutation is one atomic database transaction.
- A forced failure leaves orders, items, customers, stock, movements, invoices, and EOD state unchanged.
- Stock identity includes brand consistently in create, edit, and cancel.
- Cancel is idempotent and cancelled orders cannot be edited.
- Server derives actor and authoritative totals.
- Order/invoice numbering remains unique under concurrency.
- Relevant unit/integration tests pass; lint, type check, and production build pass.
- `graphify update .` and `codegraph update` complete after implementation.

## Out of Scope

- Redesigning the admin UI.
- Refactoring unrelated pricing or content modules.
- Historical EOD revision/versioning beyond stale marking and regeneration.
- Deploying the migration to a remote Supabase project.

## Open Questions Requiring Approval

1. Approve PostgreSQL RPC functions and supporting schema changes in `supabase/migration.sql`.
2. Approve adding Vitest (and a `test` script) for TypeScript unit tests.
3. Confirm EOD behavior: mark stale and allow regeneration (recommended), rather than immutable report revisions.
