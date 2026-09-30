// Presentation helpers only. No permissions, persistence, or cloud state live here.
/** @param {{date:string}[]} readiness
 * @param {{weekStart:string}[]} reviews
 * @param {string} day
 * @param {string} week */
export function routineStatus(readiness, reviews, day, week) {
  return {
    dailyComplete: readiness.some(entry => entry.date === day),
    weeklyComplete: reviews.some(review => review.weekStart === week)
  };
}

/** @param {number[]} values
 * @param {number} [width]
 * @param {number} [height]
 * @param {number} [padding] */
export function trendGeometry(values, width = 520, height = 180, padding = 36) {
  const valid = values.filter(Number.isFinite);
  if (!valid.length) return null;
  const min = Math.min(...valid), max = Math.max(...valid);
  // A flat series stays centered; it must not look like a rise or fall.
  const margin = max === min ? Math.max(Math.abs(min) * .1, 1) : (max - min) * .12;
  const low = min - margin, high = max + margin;
  const points = valid.map((value, index) => ({
    value,
    x: valid.length === 1 ? width / 2 : padding + index * (width - padding * 2) / (valid.length - 1),
    y: height - padding - (value - low) / (high - low) * (height - padding * 2)
  }));
  return {points, min, max, low, high, middle: (high + low) / 2};
}

/** @param {number} value */
export function formatChartValue(value) {
  return new Intl.NumberFormat("en", {maximumFractionDigits: 2}).format(value);
}

/** @param {number} first @param {number} last @param {boolean} lower */
export function percentageImprovement(first, last, lower) {
  if (!Number.isFinite(first) || !Number.isFinite(last) || first === 0) return 0;
  return Math.round((lower ? first - last : last - first) / Math.abs(first) * 1000) / 10;
}
