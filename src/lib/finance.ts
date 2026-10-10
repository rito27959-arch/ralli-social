export interface ProjectionInput {
  users: number;
  conversion: number;
  creatorPrice: number;
  business: number;
  businessPrice: number;
  ads: number;
  costs: number;
}

const nonnegative = (n: number) => Number.isFinite(n) ? Math.max(0, n) : 0;

export function project(input: ProjectionInput) {
  const mrr = nonnegative(input.users) * Math.min(100, nonnegative(input.conversion)) / 100 * nonnegative(input.creatorPrice)
    + nonnegative(input.business) * nonnegative(input.businessPrice);
  const turnover = mrr + nonnegative(input.ads);
  return {
    mrr,
    turnover,
    arr: mrr * 12,
    margin: turnover - nonnegative(input.costs),
    remaining: Math.max(0, 10_000 - turnover),
  };
}
