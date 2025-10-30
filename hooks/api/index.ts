/**
 * API Hooks Barrel Export
 * Centralized export for all API-related hooks
 */

// Query keys
export { queryKeys } from './query-keys';

// Auth hooks
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useVerifyEmail,
  useEnable2FA,
  useVerify2FA,
  useLoginWith2FA,
} from './use-auth';

// Listings hooks
export {
  useListings,
  useListingsInfinite,
  useListing,
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
  useMyListings,
  useSearchListings,
} from './use-listings';

// User hooks
export {
  useUserProfile,
  useUpdateProfile,
  useUserSettings,
  useUpdateSettings,
  useUserPreferences,
  useUpdatePreferences,
} from './use-user';

// Store hooks
export {
  useStore,
  useCreateStore,
  useUpdateStore,
  type Store,
  type CreateStoreData,
} from './use-store';

// Messages hooks
export {
  useConversations,
  useConversationMessages,
  useSendMessage,
  type Conversation,
  type Message,
  type SendMessageData,
} from './use-messages';

// Transactions hooks
export {
  useTransactions,
  useTransaction,
  useCreateTransaction,
  type Transaction,
  type CreateTransactionData,
} from './use-transactions';

// Billing hooks
export {
  usePlans,
  useSubscription,
  useUpdateSubscription,
  useCancelSubscription,
  usePaymentMethods,
  type Plan,
  type Subscription,
  type PaymentMethod,
} from './use-billing';
