import { createId } from "./auth.js";

export function writeAudit(db, entry) {
  const now = Date.now();
  db.prepare(
    `INSERT INTO audit_log (id, user_id, action, entity_type, entity_id, before_json, after_json, ip, created_at)
     VALUES (@id, @user_id, @action, @entity_type, @entity_id, @before_json, @after_json, @ip, @created_at)`
  ).run({
    id: createId("audit"),
    user_id: entry.userId ?? null,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId ?? null,
    before_json: entry.beforeJson ?? null,
    after_json: entry.afterJson ?? null,
    ip: entry.ip ?? null,
    created_at: now,
  });
}
