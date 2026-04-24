import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Project, Expense } from '../types/types';
import { Colors, Spacing, FontSizes, BorderRadius, Shadow } from '../constants/theme';
import BudgetProgressBar from './BudgetProgressBar';
import { useExpenseTotal, calculateBudgetPercentage } from '../hooks/useExpenseTotal';

interface ProjectCardProps {
  project: Project;
  /** Expenses belonging to this project (used for budget progress) */
  expenses?: Expense[];
}


const getStatusStyle = (status: Project['status']) => {
  switch (status) {
    case 'Active':
      return { color: Colors.statusActive, bg: Colors.statusActiveBackground };
    case 'Completed':
      return { color: Colors.statusCompleted, bg: Colors.statusCompletedBackground };
    case 'On Hold':
      return { color: Colors.statusOnHold, bg: Colors.statusOnHoldBackground };
    default:
      return { color: Colors.textSecondary, bg: Colors.searchBar };
  }
};

export default function ProjectCard({ project, expenses = [] }: ProjectCardProps) {
  const router = useRouter();
  const statusStyle = getStatusStyle(project.status);
  const totalSpent = useExpenseTotal(expenses);

  const handlePress = () => {
    router.push({ pathname: '/project/[id]', params: { id: project.id } } as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Top row: name + status */}
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.color }]}>
            {project.status}
          </Text>
        </View>
      </View>

      {/* Description */}
      {project.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      ) : null}

      {/* Manager + Budget row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{project.manager}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="wallet-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            ${project.budget?.toLocaleString() ?? '0'}
          </Text>
        </View>
      </View>

      {/* Date range */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={13} color={Colors.textTertiary} />
        <Text style={styles.dateText}>
          {project.startDate}  →  {project.endDate}
        </Text>
      </View>

      {/* Budget progress bar — reflects actual spending */}
      <BudgetProgressBar
        spent={totalSpent}
        budget={project.budget ?? 0}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dateText: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
});
