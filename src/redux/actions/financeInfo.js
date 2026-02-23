import {
  REQUEST_BILLING_PROFILE,
  RECEIVE_BILLING_PROFILE,
  REQUEST_SOURCES,
  RECEIVE_SOURCES,
  ATTACHING_SOURCE,
  ATTACHED_SOURCE,
  DELETING_SOURCE,
  DELETED_SOURCE,
  CHANGING_DEFAULT_SOURCE,
  CHANGED_DEFAULT_SOURCE
} from "../action-types";

import { getErrorMessage } from "./messageInfo";

import {
  getBillingProfile,
  getSources,
  attachSource as attachSourceAPI,
  deleteSource as deleteSourceAPI,
  changeDefaultSource as changeDefaultSourceAPI
} from "../../libs/ilingu-libs/finance";

export const requestBillingProfile = () => ({
  type: REQUEST_BILLING_PROFILE,
  isLoadingBillingProfile: true
});

export const receiveBillingProfile = billingProfile => ({
  type: RECEIVE_BILLING_PROFILE,
  billingProfile: billingProfile,
  isLoadingBillingProfile: false
});

export function fetchBillingProfile(userId) {
  return function(dispatch) {
    dispatch(requestBillingProfile());

    return getBillingProfile(userId).then(
      response => dispatch(receiveBillingProfile(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestSources = () => ({
  type: REQUEST_SOURCES,
  isLoadingSources: true
});

export const receiveSources = sources => ({
  type: RECEIVE_SOURCES,
  sources: sources,
  isLoadingSources: false
});

export function fetchSources(stripeCustomerId) {
  return function(dispatch) {
    dispatch(requestSources());

    return getSources(stripeCustomerId).then(
      response => dispatch(receiveSources(response)),
      error =>
        dispatch(
          getErrorMessage(
            "We encountered an error. Unfortunately this card has not been " +
              "added. Please check the card details and try again. If you " +
              "continue to get this error message, you may need to use a " +
              "different card"
          )
        )
    );
  };
}

export const attachingSource = () => ({
  type: ATTACHING_SOURCE,
  isAttachingSource: true
});

export const attachedSource = () => ({
  type: ATTACHED_SOURCE,
  isAttachingSource: false
});

export function attachSource(stripeCustomerId, sourceId) {
  return function(dispatch) {
    dispatch(attachingSource());

    return attachSourceAPI(stripeCustomerId, sourceId).then(
      () => {
        dispatch(attachedSource());
        dispatch(fetchSources(stripeCustomerId));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const deletingSource = (sourceId) => ({
  type: DELETING_SOURCE,
  deletingSourceId: sourceId
});

export const deletedSource = () => ({
  type: DELETED_SOURCE
});

export function deleteSource(stripeCustomerId, sourceId) {
  return function(dispatch) {
    dispatch(deletingSource(sourceId));

    return deleteSourceAPI(stripeCustomerId, sourceId).then(
      () => {
        dispatch(deletedSource());
        dispatch(fetchSources(stripeCustomerId));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const changingDefaultSource = (sourceId) => ({
  type: CHANGING_DEFAULT_SOURCE,
  changingToDefaultSourceId: sourceId
});

export const changedDefaultSource = () => ({
  type: CHANGED_DEFAULT_SOURCE
});

export function changeDefaultSource(stripeCustomerId, sourceId) {
  return function(dispatch) {
    dispatch(changingDefaultSource(sourceId));

    return changeDefaultSourceAPI(stripeCustomerId, sourceId).then(
      () => {
        dispatch(changedDefaultSource());
        dispatch(fetchSources(stripeCustomerId));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}
