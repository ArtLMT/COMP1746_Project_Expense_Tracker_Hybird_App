import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BudgetProgressBar from '../../components/BudgetProgressBar';
import ExpenseCard from '../../components/ExpenseCard';
import {
    BorderRadius,
    Colors,
    FontSizes,
    Shadow,
    Spacing,
} from '../../constants/theme';
import { getExpenses, getProjects } from '../../services/expenseService';
import type { ExpenseStore } from '../../services/expenseStore';
import { useExpenseStore } from '../../services/expenseStore';
import { Expense, Project } from '../../types/types';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Get expenses from Zustand store
  const allExpenses = useExpenseStore((state: ExpenseStore) => state.allExpenses);
  const setExpenses = useExpenseStore((state: ExpenseStore) => state.setExpenses);

  // Filter expenses for this project from Zustand
  const expenses = useMemo(
    () => allExpenses.filter((e) => e.projectId === id),
    [allExpenses, id]
  );

  // ---------- Fetch project + initialize expenses ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, expensesData] = await Promise.all([
          getProjects(),
          getExpenses(),
        ]);

        // Find current project
        const currentProject = (projectsData as Project[]).find(
          (p) => p.id === id
        );
        setProject(currentProject ?? null);

        // Initialize Zustand store with all expenses (only once on first load)
        // After this, all updates come through the store (no re-fetching)
        setExpenses(expensesData as Expense[]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setExpenses]);

  // ---------- Summary ----------
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0),
    [expenses]
  );

  // ---------- Render ----------
  return (
    <SafeAreaView style={styles.container}>
      {/* -------- HEADER -------- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project?.name ?? 'Project'}
          </Text>
          {project && (
            <Text style={styles.headerSubtitle}>
              {project.status} · {expenses.length} expenses
            </Text>
          )}
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* -------- BUDGET SUMMARY CARD -------- */}
      {project && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={styles.summaryValue}>
                ${project.budget?.toLocaleString() ?? '0'}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text
                style={[
                  styles.summaryValue,
                  totalExpenses > (project.budget ?? 0) && {
                    color: '#EF4444',
                  },
                ]}
              >
                ${totalExpenses.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      (project.budget ?? 0) - totalExpenses >= 0
                        ? Colors.statusActive
                        : '#EF4444',
                  },
                ]}
              >
                ${((project.budget ?? 0) - totalExpenses).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Budget progress bar */}
          <BudgetProgressBar
            spent={totalExpenses}
            budget={project.budget ?? 0}
            showLegend
          />
        </View>
      )}

      {/* -------- EXPENSE LIST -------- */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="receipt-outline"
            size={56}
            color={Colors.textTertiary}
          />
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add one
          </Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* -------- FAB -------- */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          router.push({
            pathname: '/project/add-expense',
            params: { projectId: id },
          } as any);
        }}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.searchBar,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  summaryLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  budgetProgressTrack: {
    // Removed — now using BudgetProgressBar component
  },
  budgetProgressFill: {
    // Removed — now using BudgetProgressBar component
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  // States
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.fab,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.cardHover,
  },
});
