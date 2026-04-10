import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Crypto from 'expo-crypto';
import { useCallback, useState } from 'react';
import { Expense } from '../types/types';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'VND'] as const;
const EXPENSE_TYPES = [
  'Travel',
  'Equipment',
  'Materials',
  'Services',
  'Software/Licenses',
  'Labour costs',
  'Utilities',
  'Miscellaneous',
] as const;
const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'Cheque',
] as const;
const STATUSES: Expense['status'][] = ['Paid', 'Pending', 'Reimbursed'];

/**
 * Format date to YYYY-MM-DD format
 */
const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

interface UseAddExpenseLogicProps {
  projectId: string;
  onSave: (expense: Expense) => Promise<void> | void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

interface UseAddExpenseLogicReturn {
  // State
  date: Date;
  showDatePicker: boolean;
  amount: string;
  currency: string;
  type: string;
  paymentMethod: string;
  claimant: string;
  status: Expense['status'];
  errors: FormErrors;
  saving: boolean;

  // Options
  currencies: typeof CURRENCIES;
  expenseTypes: typeof EXPENSE_TYPES;
  paymentMethods: typeof PAYMENT_METHODS;
  statuses: typeof STATUSES;

  // Handlers
  setDate: (date: Date) => void;
  setShowDatePicker: (show: boolean) => void;
  setAmount: (amount: string) => void;
  setCurrency: (currency: string) => void;
  setType: (type: string) => void;
  setPaymentMethod: (method: string) => void;
  setClaimant: (claimant: string) => void;
  setStatus: (status: Expense['status']) => void;
  setErrors: (errors: FormErrors) => void;

  // Logic
  onDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  validate: () => boolean;
  handleSubmit: () => Promise<void>;
  formatDate: (d: Date) => string;
  clearErrors: () => void;
}

export const useAddExpenseLogic = ({
  projectId,
  onSave,
  onCancel,
}: UseAddExpenseLogicProps): UseAddExpenseLogicReturn => {
  // ──────── State ────────
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [claimant, setClaimant] = useState('');
  const [status, setStatus] = useState<Expense['status']>('Pending');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // ──────── Handlers ────────
  const onDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    // iOS keeps picker open on change
    if (selectedDate) setDate(selectedDate);
  };

  // ──────── Validation ────────
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!currency) newErrors.currency = 'Currency is required';
    if (!type) newErrors.type = 'Expense type is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!claimant.trim()) newErrors.claimant = 'Claimant is required';
    if (!status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, currency, type, paymentMethod, claimant, status]);

  // ──────── Clear Errors ────────
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // ──────── Form Submission ────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const expense: Expense = {
        id: Crypto.randomUUID(),
        projectId,
        date: formatDate(date),
        amount: parseFloat(amount),
        currency,
        type,
        paymentMethod,
        claimant: claimant.trim(),
        status,
      };

      await onSave(expense);
    } catch (err) {
      console.error('Save expense error:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    // State
    date,
    showDatePicker,
    amount,
    currency,
    type,
    paymentMethod,
    claimant,
    status,
    errors,
    saving,

    // Options
    currencies: CURRENCIES,
    expenseTypes: EXPENSE_TYPES,
    paymentMethods: PAYMENT_METHODS,
    statuses: STATUSES,

    // Handlers
    setDate,
    setShowDatePicker,
    setAmount,
    setCurrency,
    setType,
    setPaymentMethod,
    setClaimant,
    setStatus,
    setErrors,

    // Logic
    onDateChange,
    validate,
    handleSubmit,
    formatDate,
    clearErrors,
  };
};

export default useAddExpenseLogic;
