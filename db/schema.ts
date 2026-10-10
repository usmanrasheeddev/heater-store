import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), idempotencyKey: text('idempotency_key').notNull().unique(),
  payloadHash: text('payload_hash').notNull(), productId: text('product_id').notNull(), productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(), unitPrice: integer('unit_price').notNull(), delivery: integer('delivery').notNull(), total: integer('total').notNull(), currency: text('currency').notNull(),
  fullName: text('full_name').notNull(), mobile: text('mobile').notNull(), city: text('city').notNull(), address: text('address').notNull(),
  status: text('status').notNull().default('received'), createdAt: text('created_at').notNull()
});
