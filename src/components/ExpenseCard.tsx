import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../types/types';
import { Colors, Spacing, FontSizes, BorderRadius, Shadow } from '../constants/theme';

interface ExpenseCardProps {
  expense: Expense;
}

/**
 * Returns color and background for an expense status badge.
 */
const getStatusStyle = (status: Expense['status']) => {
  switch (status) {
    case 'Paid':
      return { color: Colors.statusPaid, bg: Colors.statusPaidBackground };
    case 'Pending':
      return { color: Colors.statusPending, bg: Colors.statusPendingBackground };
    case 'Reimbursed':
      return { color: Colors.statusReimbursed, bg: Colors.statusReimbursedBackground };
    default:
      return { color: Colors.textSecondary, bg: Colors.searchBar };
  }
};

/**
 * Returns an Ionicons name for an expense type.
 */
const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  const lower = type.toLowerCase();
  if (lower.includes('travel') || lower.includes('transport')) return 'airplane-outline';
  if (lower.includes('food') || lower.includes('meal')) return 'restaurant-outline';
  if (lower.includes('hotel') || lower.includes('accommodation')) return 'bed-outline';
  if (lower.includes('office') || lower.includes('supply')) return 'briefcase-outline';
  if (lower.includes('software') || lower.includes('tech')) return 'laptop-outline';
  if (lower.includes('training') || lower.includes('education')) return 'school-outline';
  return 'receipt-outline';
};

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const statusStyle = getStatusStyle(expense.status);
  const icon = getTypeIcon(expense.type);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Left icon circle */}
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>

        {/* Middle info */}
        <View style={styles.info}>
          <Text style={styles.type} numberOfLines={1}>
            {expense.type}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.metaText}>{expense.claimant}</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="calendar-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.metaText}>{expense.date}</Text>
          </View>
        </View>

        {/* Right side: amount + status */}
        <View style={styles.rightColumn}>
          <Text style={styles.amount}>
            {expense.currency ?? '$'}{expense.amount?.toLocaleString() ?? '0'}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.color }]}>
              {expense.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment method footer */}
      <View style={styles.footer}>
        <Ionicons name="card-outline" size={12} color={Colors.textTertiary} />
        <Text style={styles.footerText}>{expense.paymentMethod}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  type: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  dot: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
    marginHorizontal: 2,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
});
