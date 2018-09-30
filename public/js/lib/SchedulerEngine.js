import { Scheduler } from '../dependencies/scheduler';

export default class SchedulerEngine extends Scheduler {
  static get defaultConfig() {
    return {
      features: {
        stripe: true,
        timeRanges: true,
        eventContextMenu: {
          items: [
            {
              text: 'Unassign',
              icon: 'fa fa-user-times',
              weight: 200,
              onItem: ({ eventRecord, resourceRecord }) => {
                eventRecord.unassign(resourceRecord);
              }
            }
          ]
        }
      },
      rowHeight: 50,
      barMargin: 4,
      eventColor: 'indigo',
      columns: [
        {
          type: 'resourceInfo',
          imagePath: '../_shared/images/users/',
          text: 'Name',
          width: 200,
          showEventCount: false,
          showRole: true
        },
        {
          text: 'Nbr tasks',
          editor: false,
          renderer: data => `${data.record.events.length || ''}`,
          align: 'center',
          sortable: (a, b) => (a.events.length < b.events.length ? -1 : 1),
          width: 100
        }
      ],

      crudManager: {
        autoLoad: true,
        transport: {
          load: {
            url: 'data/data.json'
          }
        }
      },

      viewPreset: {
        name: 'hourAndDay',
        timeColumnWidth: 10,
        columnLinesFor: 'top',
        headerConfig: {
          top: {
            unit: 'd',
            align: 'center',
            dateFormat: 'ddd DD MMM'
          },
          middle: {
            unit: 'h',
            align: 'center',
            dateFormat: 'HH'
          }
        }
      }
    };
  }
}
