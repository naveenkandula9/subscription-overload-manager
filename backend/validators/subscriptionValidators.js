const { z } = require("zod");

const normalizeSubscriptionPayload = (value) => {
  const normalizedServiceName = value.serviceName ?? value.name;

  return {
    ...value,
    ...(normalizedServiceName
      ? {
          name: normalizedServiceName,
          serviceName: normalizedServiceName,
        }
      : {}),
  };
};

const subscriptionBodySchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    serviceName: z.string().trim().min(2).max(120).optional(),
    renewalDate: z.string().datetime(),
    remindBeforeDays: z.coerce.number().int().min(0).max(30).default(3),
    price: z.coerce.number().min(0).optional().default(0),
    currency: z.string().trim().min(3).max(10).default("INR"),
    billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly"]).default("monthly"),
  })
  .transform(normalizeSubscriptionPayload)
  .refine((value) => Boolean(value.serviceName), {
    message: "name or serviceName is required.",
    path: ["serviceName"],
  });

const createSubscriptionSchema = z.object({
  body: subscriptionBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateSubscriptionSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      serviceName: z.string().trim().min(2).max(120).optional(),
      renewalDate: z.string().datetime().optional(),
      remindBeforeDays: z.coerce.number().int().min(0).max(30).optional(),
      price: z.coerce.number().min(0).optional(),
      currency: z.string().trim().min(3).max(10).optional(),
      billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly"]).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided.",
    })
    .transform(normalizeSubscriptionPayload),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

const idParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  idParamSchema,
};
