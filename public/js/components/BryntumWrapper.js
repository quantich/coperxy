import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Scheduler } from '../dependencies/scheduler';

const features = [
  'columnLines',
  'dependencies',
  'eventDrag',
  'eventContextMenu',
  'eventDrag',
  'eventDragCreate',
  'eventEditor',
  'eventFilter',
  'eventResize',
  'eventTooltip',
  'group',
  'groupSummary',
  'headerContextMenu',
  'nonWorkingTime',
  'regionResize',
  'sort',
  'scheduleTooltip',
  'stripe',
  'summaryToolbar',
  'timeRanges'
];

export default class BryntumWrapper extends Component {
  static propTypes = {
    viewPreset: PropTypes.string
  }

  static defaultProps = {
    viewPreset: 'dayAndWeek'
  }

  componentDidMount() {
    console.log('mount');
    console.log('Scheduler', Scheduler);
    const { props } = this;

    const config = {
      appendTo: this.bryntumDiv,
      callOnFunctions: true,
      features: {}
    };

    features.forEach((featureName) => {
      if (featureName in props) {
        config.features[featureName] = props[featureName];
      }
    });

    Object.keys(props).forEach((name) => {
      if (!features.includes(name)) {
        config[name] = props[name];
      }
    });

    this.schedulerEngine = new Scheduler(config); // eslint-disable-line
    const engine = this.schedulerEngine;

    Object.keys(engine.features).forEach((key) => {
      if (!this.key) this[key] = engine.features[key];
    });
  }

  componentDidUpdate(prevProps) {
    const engine = this.schedulerEngine;
    const { props } = this;
    const exludeProps = [
      'events',
      'resources',
      'eventsVersion',
      'resourcesVersion',
      'timeRanges',
      'columns',
      'adapter',
      'ref',
      'children',
      ...features];

    Object.keys(props).forEach((propName) => {
      if (!exludeProps.includes(propName)
        && props[propName] !== prevProps[propName]) {
        engine[propName] = props[propName];
      }
    });

    if (prevProps.resourcesVersion !== props.resourcesVersion) {
      engine.resources = props.resources;
    }

    if (prevProps.eventsVersion !== props.eventsVersion) {
      engine.eventStore.data = props.events;
    }

    features.forEach((fieldName) => {
      const currentProp = props[fieldName];
      const prevProp = prevProps[fieldName];

      if (fieldName in props && currentProp !== prevProp
        && JSON.stringify(currentProp) !== JSON.stringify(prevProp)) {
        engine.features[fieldName].setConfig(currentProp);
      }
    });
  }

  componentWillUnmount() {
    this.schedulerEngine.destroy();
  }

  render() {
    const { id } = this.props;
    return (
      <div
        className="b-react-scheduler-container"
        id={id}
        ref={(div) => { this.bryntumDiv = div; }}
      />
    );
  }
}
