import { z } from "zod";

const Rating = z.object({
  ease_of_use: z.number().nullable().default(0),
  value_for_money: z.number().nullable().default(0),
  intuitive_interface: z.number().nullable().default(0),
  overall_satisfaction: z.number().nullable().default(0),
  support_team_responsiveness: z.number().nullable().default(0),
  ease_of_customization: z.number().nullable().default(0),
});

type Rating = z.infer<typeof Rating>;

const RatingCal = {
  add: (a: Rating, b: Rating): Rating => {
    return Object.fromEntries(
      Object.keys(a)
        .map((e) => e as any as keyof Rating)
        .map((e) => [e, (a[e] ?? 0) + (b[e] ?? 0)])
    ) as Rating;
  },

  subtract: (a: Rating, b: Rating): Rating => {
    return Object.fromEntries(
      Object.keys(a)
        .map((e) => e as any as keyof Rating)
        .map((e) => [e, (a[e] ?? 0) - (b[e] ?? 0)])
    ) as Rating;
  },

  divide: (a: Rating, b: number): Rating => {
    return Object.fromEntries(
      Object.keys(a)
        .map((e) => e as any as keyof Rating)
        .map((e) => [e, (a[e] ?? 0) / b])
    ) as Rating;
  },

  multiply: (a: Rating, b: number): Rating => {
    return Object.fromEntries(
      Object.keys(a)
        .map((e) => e as any as keyof Rating)
        .map((e) => [e, (a[e] ?? 0) * b])
    ) as Rating;
  },
};

export { RatingCal, Rating };
