import { Grid } from '../dependencies/scheduler';

export default class UnplannedGrid extends Grid {
  static get defaultConfig() {
    return {
      features: {
        columnlines: true,
        celledit: false,
        stripe: true,
        eventEdit: false,
      },
      showRemoveRowInContextMenu : false,
      columns: [{
        text: 'O.P.',
        flex: 1,
        width: 100,
        field: 'name',
        htmlEncode: false,
	editor: false,
        renderer: (data) => {
          return `<i class="${data.record.iconCls}"></i>${data.record.name}`;
        }
      }, /* {
        text: 'Ref.',
	flex: 1,
        width: 100,
        editor: false,
        field: 'refer',
        renderer: data => `${data.record.refer}`
      }, */ {
        text: 'Tempo',
        width: 100,
        align: 'right',
        editor: false,
        field: 'duration',
        renderer: data => `${data.record.duration} ${data.record.durationUnit}`
      }]
    };
  }

  construct(config) {
    super.construct(config);
    this.eventStore.on({
      update: ({ record, changes }) => {
        if ('resourceId' in changes && !record.resourceId) {
          this.eventStore.remove(record);
          this.store.add(record);
        }
      },
      thisObj: this
    });
  }
}
