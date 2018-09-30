import nxj from 'nxj'; // eslint-disable-line
import _ from 'lodash';

const PREVIOUS_FORM = 'PREVIOUS_FORM';
const RESOURCE_ZOOM = 'DO_RESOURCE_ZOOM';

function registerZoomOnCloseEvent(onClose) {
  const { childWindow } = window.parent.clientManager;
  const originalUnload = childWindow.onbeforeunload || (() => {});
  childWindow.onbeforeunload = (e) => {
    originalUnload.call(null, e);
    onClose.call(null, e);
  };
}

export function dorResourceZoom(onClose) {
  nxj.doingCommand = false;
  nxj.doCommandInternal(RESOURCE_ZOOM);
  setTimeout(registerZoomOnCloseEvent.bind(null, onClose), 500);
}

export function doPreviousForm() {
  if (!nxj) return;
  nxj.doingCommand = false;
  nxj.doCommandInternal(PREVIOUS_FORM);
}

export function getNxjFieldValue(field) {
  if (!nxj) return null;
  const fieldName = `${field}.`;
  const descriptor = _.find(nxj.fieldDescriptors, ['name', fieldName]);
  return nxj.getValue(descriptor.field);
}
