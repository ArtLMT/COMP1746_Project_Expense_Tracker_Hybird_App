/**
 * Light Theme constants for the Expense Tracker app.
 */

export const Colors = {
  // Backgrounds
  background: '#F8F9FA',
  card: '#FFFFFF',
  searchBar: '#F0F1F3',

  // Accent / Primary
  primary: '#0056D2',
  primaryLight: '#E8F0FE',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Status badges
  statusActive: '#00A86B',
  statusActiveBackground: '#E6F9F0',
  statusCompleted: '#0056D2',
  statusCompletedBackground: '#E8F0FE',
  statusOnHold: '#F59E0B',
  statusOnHoldBackground: '#FEF3C7',
  statusPaid: '#00A86B',
  statusPaidBackground: '#E6F9F0',
  statusPending: '#F59E0B',
  statusPendingBackground: '#FEF3C7',
  statusReimbursed: '#6366F1',
  statusReimbursedBackground: '#EEF2FF',

  // Misc
  border: '#E5E7EB',
  shadow: '#000000',
  white: '#FFFFFF',
  tabInactive: '#9CA3AF',
  fab: '#0056D2',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
};
