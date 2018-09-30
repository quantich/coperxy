import { DragHelper, Rectangle, DomHelper } from '../dependencies/scheduler';

export default class Drag extends DragHelper {
  static get defaultConfig() {
    return {
      cloneTarget: true,
      mode: 'translateXY',
      dropTargetSelector: '.b-scheduler-subgrid',
      targetSelector: '.b-grid-row',
    };
  }

  construct(config) {
    const me = this;
    super.construct(config);

    me.on({
      dragstart: me.onTaskDragStart,
      drag: me.onTaskDrag,
      drop: me.onTaskDrop,
      thisObj: me
    });
  }

  onTaskDragStart({ context }) {
    const me = this;
    const mouseX = context.clientX;
    const proxy = context.element;
    const task = me.grid.getRecordFromElement(context.grabbed);
    const newWidth = me.schedule.timeAxisViewModel.getDistanceForDuration(
      task.durationMS
    );
    context.task = task; // eslint-disable-line
    proxy.classList.remove('b-grid-row');
    proxy.classList.add('b-sch-event');
    proxy.classList.add('b-unassigned-class');
    proxy.innerHTML = task.name;
    if (context.grabbed.offsetWidth > newWidth) {
      const proxyRect = Rectangle.from(context.grabbed);
      if (mouseX > proxyRect.x + newWidth - 20) {
        context.newX = context.elementStartX = context.elementX = mouseX - newWidth / 2; // eslint-disable-line
        DomHelper.setTranslateX(proxy, context.newX);
      }
    }
    proxy.style.width = `${newWidth}px`;
  }

  onTaskDrag({ event, context }) {
    const me = this;
    const date = me.schedule.getDateFromCoordinate(DomHelper.getTranslateX(context.element), 'round', false);
    const resource = me.schedule.resolveResource(event.target);
    context.valid = context.valid && Boolean(date && resource); // eslint-disable-line
    context.resource = resource; // eslint-disable-line
  }

  onTaskDrop({ context }) {
    const me = this;
    const { task } = context;
    const date = me.schedule.getDateFromCoordinate(DomHelper.getTranslateX(context.element), 'round', false);
    if (context.valid && date) {
      task.setStartDate(date, true);
      task.resource = context.resource;
      try {
        me.schedule.eventStore.add(task);
        me.grid.store.remove(task);
      } catch (e) {
        me.schedule.eventStore.remove(task);
        me.abort();
        console.log(e);
        alert(e);
        return;
      }
      me.context.finalize();
    } else {
      me.abort();
    }
  }
}
