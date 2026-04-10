import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProjectCard from '../components/ProjectCard';
import {
  BorderRadius,
  Colors,
  FontSizes,
  Shadow,
  Spacing,
} from '../constants/theme';
import { getProjects } from '../services/expenseService';
import { Project } from '../types/types';

type FilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'ON HOLD';

const FILTER_TABS: FilterTab[] = ['ALL', 'ACTIVE', 'COMPLETED', 'ON HOLD'];

export default function HomeScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  // ---------- Fetch projects ----------
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data as Project[]);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ---------- Filtered list ----------
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Status filter
    if (activeTab !== 'ALL') {
      const statusMap: Record<FilterTab, string> = {
        ALL: '',
        ACTIVE: 'Active',
        COMPLETED: 'Completed',
        'ON HOLD': 'On Hold',
      };
      filtered = filtered.filter((p) => p.status === statusMap[activeTab]);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.manager?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [projects, activeTab, searchQuery]);

  // ---------- Greeting based on time ----------
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // ---------- Render ----------
  return (
    <SafeAreaView style={styles.container}>
      {/* -------- HEADER -------- */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, Lê Minh Thành</Text>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* -------- SEARCH BAR -------- */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={Colors.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* -------- FILTER TABS -------- */}
      <View style={styles.tabsContainer}>
        {FILTER_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* -------- PROJECT LIST -------- */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      ) : filteredProjects.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="folder-open-outline" size={56} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No projects found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProjectCard project={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* -------- BOTTOM TAB BAR -------- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="home" size={22} color={Colors.primary} />
          <Text style={[styles.bottomTabText, { color: Colors.primary }]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab}>
          <Ionicons name="settings-outline" size={22} color={Colors.tabInactive} />
          <Text style={[styles.bottomTabText, { color: Colors.tabInactive }]}>
            Setting
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBar,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    height: '100%',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.searchBar,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  // States
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.card,
  },
  bottomTab: {
    alignItems: 'center',
    gap: 2,
  },
  bottomTabText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});