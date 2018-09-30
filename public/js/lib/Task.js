import { EventModel } from '../dependencies/scheduler';

export default class Task extends EventModel {
  static get defaults() {
    return {
      durationUnit: 'm'
    };
  }
}
