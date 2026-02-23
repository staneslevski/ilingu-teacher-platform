import {
  REQUEST_BILLING_PROFILE,
  RECEIVE_BILLING_PROFILE,
  REQUEST_SOURCES,
  RECEIVE_SOURCES,
  ATTACHING_SOURCE,
  ATTACHED_SOURCE,
  DELETING_SOURCE,
  DELETED_SOURCE,
  CHANGING_DEFAULT_SOURCE, CHANGED_DEFAULT_SOURCE
} from "../action-types";

export default function getFinanceData(
  state = {
    isLoadingBillingProfile: false,
    billingProfile: {},
    isLoadingSources: false,
    sources: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_BILLING_PROFILE:
      return Object.assign({}, state, {
        isLoadingBillingProfile: action.isLoadingBillingProfile
      });
    case RECEIVE_BILLING_PROFILE:
      return Object.assign({}, state, {
        isLoadingBillingProfile: action.isLoadingBillingProfile,
        billingProfile: action.billingProfile
      });
    case REQUEST_SOURCES:
      return Object.assign({}, state, {
        isLoadingSources: action.isLoadingSources
      });
    case RECEIVE_SOURCES:
      return Object.assign({}, state, {
        sources: action.sources,
        isLoadingSources: action.isLoadingSources
      });
    case ATTACHING_SOURCE:
    case ATTACHED_SOURCE:
      return Object.assign({}, state, {
        isAttachingSource: action.isAttachingSource
      });
    case DELETING_SOURCE:
      return Object.assign({}, state, {
        deletingSourceId: action.deletingSourceId
      });
    case DELETED_SOURCE:
      return Object.assign({}, state, {
        deletingSourceId: undefined
      });
    case CHANGING_DEFAULT_SOURCE:
      return Object.assign({}, state, {
        changingToDefaultSourceId: action.changingToDefaultSourceId
      });
    case CHANGED_DEFAULT_SOURCE:
      return Object.assign({}, state, {
        changingToDefaultSourceId: undefined
      });
    default:
      return state;
  }
}
