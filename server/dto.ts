import { Type as t } from "@sinclair/typebox";

export const TickDTO = t.Object({
  id: t.Integer({ minimum: 1, maximum: 9 }),
  name: t.String(),
  address: t.Optional(t.String()),
  avatar: t.Optional(t.String({ format: 'uri' })),
});

export const UpdateDTO = t.Object({
  name: t.String(),
  address: t.Optional(t.String()),
  avatar: t.Optional(t.String({ format: 'uri' })),
});