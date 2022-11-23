import {
  Store,
  NOTIFICATION_INSERTION,
  NOTIFICATION_CONTAINER,
  iNotificationDismiss,
} from 'react-notifications-component';

export const notification: {
  insert: NOTIFICATION_INSERTION;
  container: NOTIFICATION_CONTAINER;
  dismiss: iNotificationDismiss;
} = {
  insert: 'top',
  container: 'top-right',
  dismiss: {
    duration: 1500,
  },
};

// success, danger, info, default, warning

export const notificationSuccess = (title: string, message: string) => {
  Store.addNotification({
    ...notification,
    title: title,
    message: message,
    type: 'success',
  });
};

export const notificationFailure = (title: string, message: string) => {
  Store.addNotification({
    ...notification,
    title: title,
    message: message,
    type: 'danger',
  });
};

export const notificationInfo = (title: string, message: string) => {
  Store.addNotification({
    ...notification,
    title: title,
    message: message,
    type: 'info',
  });
};
