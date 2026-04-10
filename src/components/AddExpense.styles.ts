import { StyleSheet } from 'react-native';
import {
    BorderRadius,
    Colors,
    FontSizes,
    Shadow,
    Spacing,
} from '../constants/theme';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  // ─── Field Containers ───
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ─── Input Wrapper ───
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  fieldIcon: {
    marginRight: Spacing.sm,
  },

  // ─── Error States ───
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },

  // ─── Row Layout ───
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ─── Dropdown ───
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textTertiary,
  },

  // ─── Modal ───
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxHeight: 380,
    overflow: 'hidden',
    ...Shadow.cardHover,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // ─── Buttons ───
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.white,
  },
});
