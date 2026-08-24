import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import type { ScanResult } from "@/lib/scan-types"

export const scans = pgTable(
  "scans",
  {
    id: text("id").primaryKey(),
    domain: text("domain").notNull(),
    result: jsonb("result").notNull().$type<ScanResult>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("scans_domain_idx").on(table.domain)]
)

export type ScanRecord = typeof scans.$inferSelect
export type NewScanRecord = typeof scans.$inferInsert
