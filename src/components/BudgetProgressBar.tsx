import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';

interface BudgetProgressBarProps {
  /** Total amount spent */
  spent: number;
  /** Project budget cap */
  budget: number;
  /** Bar height in pixels (default: 6) */
  height?: number;
  /** Whether to show the legend row below the bar */
  showLegend?: boolean;
}

/**
 * A reusable budget progress bar that visually communicates spending vs budget.
 * - Green  (< 75%)  → On track
 * - Amber  (75–100%) → Warning
 * - Red    (> 100%)  → Over budget
 */
export default function BudgetProgressBar({
  spent,
  budget,
  height = 6,
  showLegend = false,
}: BudgetProgressBarProps) {
  const { percentage, fillWidth, fillColor } = useMemo(() => {
    const safeBudget = Math.max(budget, 1);
    const pct = (spent / safeBudget) * 100;
    const clamped = Math.min(pct, 100); // visual bar caps at 100%

    let color: string;
    if (pct > 100) {
      color = '#EF4444'; // red – over budget
    } else if (pct >= 75) {
      color = Colors.statusOnHold; // amber – warning
    } else {
      color = Colors.statusActive; // green – on track
    }

    return {
      percentage: Math.round(pct),
      fillWidth: `${Math.round(clamped)}%` as `${number}%`,
      fillColor: color,
    };
  }, [spent, budget]);

  return (
    <View>
      {/* Progress track */}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: fillWidth,
              height,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

      {/* Optional legend */}
      {showLegend && (
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: fillColor }]}>
            {percentage}% used
          </Text>
          <Text style={styles.legendText}>
            ${spent.toLocaleString()} / ${budget.toLocaleString()}
          </Text>
        </View>
      )}

      {/* Inline percentage when legend is hidden */}
      {!showLegend && (
        <View style={styles.inlineRow}>
          <Text style={[styles.inlinePercent, { color: fillColor }]}>
            {percentage}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.searchBar,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  legendText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inlineRow: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
  inlinePercent: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});
