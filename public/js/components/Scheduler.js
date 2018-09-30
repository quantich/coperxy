import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  WidgetHelper,
  Scheduler as SchedulerEngine,
  LocaleManager,
  EventHelper
} from '../dependencies/scheduler';
// import SvSE from '../dependencies/locale/scheduler.locale.SvSE.js';
import UnplannedGrid from '../lib/UnplannedGrid';
import Drag from '../lib/Drag';
import Task from '../lib/Task';
import { dorResourceZoom } from '../utils/nxj-interop';
import ComputeEventDates from '../lib/ComputeEventDates';

const presets = {
  Seconds: 'secondAndMinute',
  Minutes: 'minuteAndHour',
  Hours: 'hourAndDay',
  Days: 'weekAndDay',
  Weeks: 'weekAndMonth',
  'Weeks 2': 'weekAndDayLetter',
  'Weeks 3': 'weekDateAndMonth',
  Months: 'monthAndYear',
  Years: 'year',
  'Years 2': 'manyYears',
};

export default class Scheduler extends Component {
  componentDidMount() {
    this.configureEngine();
    this.configureZoom();
    this.createGrid();
    this.createDrag();

    this.scheduler.zoomTo('weekAndDay');
    EventHelper.addListener({
      element: this.scheduler.element,
      delegate: '.b-resource-info',
      click: () => {
        dorResourceZoom(() => console.log('fechou'));
      }
    });

    this.scheduler.eventStore.on({
      add: (props) => {
        console.log("add", props);
        const { records } = props;
        /* records -> eventos que esta sendo adicionado, itera esse evento,
           pois o breithaupt permite adicionar mais de um evento de cada vez,
           no nosso caso sera inserido apenas o evento adicionado pelo drag and drop
        */
        records.forEach((eventRecord) => {
          const { resourceId } = eventRecord.data;
          const { calendario, finalDates, familiasInfo } = this.props;
          /* Cria objeto para calculo de datas do evento, carregando dados iniciais com base no resourceId,
             como todos eventos que serão calculados para o mesmo recurso,
             esses dados podem ser inicializados uma unica vez
          */
          const computeEngine = new ComputeEventDates(
            calendario, finalDates, familiasInfo, resourceId
          );
          /* Data inicial do evento que esta sendo criado */
          const momentStartDate = moment(eventRecord.startDate);
          /* roda calculo de datas do novo evento para buscar as datas conforme calendario de disponibilidade */
          const dates = computeEngine
            .computeEventDates(eventRecord, momentStartDate);

          eventRecord.startDate = dates.startDate; /* eslint-disable-line */
          eventRecord.endDate = dates.endDate; /* eslint-disable-line */
          eventRecord.timeLine = computeEngine.computeTimeLines(dates.timeLine); /* eslint-disable-line */

          /* data inicial do calculo, essa data é usada como base do novo eixo de datas que sera criado */
          const startPoint = dates.startDate;
          /* data final do calculo, essa data é usada como data base do novo eixo de datas,
             sempre que um evento for recalculado esse evento empurara a data final */
          let lastEndDate = dates.endDate;

          /* Reordena todos eventos por data inicial para empurar os eventos na ordem correta
             o novo evento tem acesso aos outros eventos com base no recurso -> evento.resource.events
          */
          const allEvents = eventRecord.resource.events
            .sort((a, b) => a.startDate > b.startDate);
          console.log('allEventsA', allEvents);
          /* Itera todos eventos por ordem de data inicial */
          allEvents.forEach((event) => {
            /* se o evento no loop é o novo evento a data não sera recalculada */
            if (event.data.id !== eventRecord.data.id) {
              /* Verifica se o evento no loop esta dentro do eixo das novas datas calculadas,
                 se estiver esse evento deve ser recalculado
              */
              if (computeEngine.shouldPushEvent(
                startPoint, lastEndDate,
                moment(event.startDate), moment(event.endDate)
              )) {
                /* roda calculo para evento no loop usando a data final
                   do ultimo evento calculado como data inicial desse evento */
                const newDates = computeEngine
                  .computeEventDates(event, lastEndDate);
                event.startDate = newDates.startDate; /* eslint-disable-line */
                event.endDate = newDates.endDate; /* eslint-disable-line */
                event.timeLine = computeEngine.computeTimeLines(newDates.timeLine); /* eslint-disable-line */
                /* altera a data final do eixo para usar como base no proximo evento do loop */
                lastEndDate = newDates.endDate;
              }
            }
          });
        });
      },
      update: (props) => {
        const eventRecord = props.record;
        /* records -> eventos que esta sendo adicionado, itera esse evento,
           pois o breithaupt permite adicionar mais de um evento de cada vez,
           no nosso caso sera inserido apenas o evento adicionado pelo drag and drop
        */
        const { resourceId } = eventRecord.data;
        const { calendario, finalDates, familiasInfo } = this.props;
        /* Cria objeto para calculo de datas do evento, carregando dados iniciais com base no resourceId,
            como todos eventos que serão calculados para o mesmo recurso,
            esses dados podem ser inicializados uma unica vez
        */
        const computeEngine = new ComputeEventDates(
          calendario, finalDates, familiasInfo, resourceId
        );
        /* Data inicial do evento que esta sendo criado */
        const momentStartDate = moment(eventRecord.startDate);
        /* roda calculo de datas do novo evento para buscar as datas conforme calendario de disponibilidade */
        const dates = computeEngine
          .computeEventDates(eventRecord, momentStartDate);

        eventRecord.startDate = dates.startDate; /* eslint-disable-line */
        eventRecord.endDate = dates.endDate; /* eslint-disable-line */
        eventRecord.timeLine = computeEngine.computeTimeLines(dates.timeLine); /* eslint-disable-line */

        /* data inicial do calculo, essa data é usada como base do novo eixo de datas que sera criado */
        const startPoint = dates.startDate;
        /* data final do calculo, essa data é usada como data base do novo eixo de datas,
            sempre que um evento for recalculado esse evento empurara a data final */
        let lastEndDate = dates.endDate;

        /* Reordena todos eventos por data inicial para empurar os eventos na ordem correta
            o novo evento tem acesso aos outros eventos com base no recurso -> evento.resource.events
        */
        const allEvents = eventRecord.resource.events
          .sort((a, b) => a.startDate > b.startDate);
        console.log('allEventsU', allEvents);
        /* Itera todos eventos por ordem de data inicial */
        allEvents.forEach((event) => {
          /* se o evento no loop é o novo evento a data não sera recalculada */
          if (event.data.id !== eventRecord.data.id) {
            /* Verifica se o evento no loop esta dentro do eixo das novas datas calculadas,
                se estiver esse evento deve ser recalculado
            */
            if (computeEngine.shouldPushEvent(
              startPoint, lastEndDate,
              moment(event.startDate), moment(event.endDate)
            )) {
              /* roda calculo para evento no loop usando a data final
                  do ultimo evento calculado como data inicial desse evento */
              const newDates = computeEngine
                .computeEventDates(event, lastEndDate);
              event.startDate = newDates.startDate; /* eslint-disable-line */
              event.endDate = newDates.endDate; /* eslint-disable-line */
              event.timeLine = computeEngine.computeTimeLines(newDates.timeLine); /* eslint-disable-line */
              /* altera a data final do eixo para usar como base no proximo evento do loop */
              lastEndDate = newDates.endDate;
            }
          }
        });
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    // this.unplannedGrid.data = nextProps.ordens;
  }

  componentWillUnmount() {
    this.scheduler.destroy();
  }

  configureEngine = () => {
    const { resources } = this.props;
    const engine = new SchedulerEngine({
      appendTo: this.bryntumDiv,
      minHeight: '20em',
      createEventOnDblClick: false,
      showRemoveRowInContextMenu: false,
      readOnly: false,
      // startDate: new Date(),
      // endDate: new Date(),
      features: {
        columnlines: false,
        scheduleTooltip: false,
        eventResize: false,
        editCell: false,
        labels: {
          bottomLabel: 'name'
        },
        eventContextMenu: {
          items: [
            {
              text: 'Unassign',
              icon: 'fa fa-user-times',
              weight: 200,
              onItem: ({ eventRecord, resourceRecord }) => {
                return eventRecord.unassign(resourceRecord);
              }
            }
          ]
        },
        eventEdit: {
          editorConfig: {
            widgets: [
              {
                type: 'combo',
                label: 'resourceText',
                name: 'resourceId',
                ref: 'resourceIdField',
                editable: false,
                valueField: 'id',
                displayField: 'name'
              }, {
                type: 'extraWidgets'
              }, {
                type: 'button',
                color: 'b-green',
                text: 'saveText',
                ref: 'saveButton'
              }, {
                type: 'button',
                color: 'b-gray',
                text: 'cancelText',
                ref: 'cancelButton'
              }]
          }
        }
      },

      columns: [
        {
          type: 'resourceInfo',
          text: 'Famílias',
          width: '10em',
          showImage: false,
          showEventCount: false,
          editor: false
        }
      ],
      resources,
      barMargin: 15,
      viewPreset: 'weekAndDay',
      /* eventStore: {
        fields: ['dt', { name: 'durationUnit', defaultValue: 'hour' }],
        createUrl: normalizeUrl('cost/scheduler/event/create'),
        autoLoad: false,
        autoCommit: true,

        onBeforeCommit: () => {
          // Make it read only since it only allows one commit at the time
          this.scheduler.readOnly = true;
        },

        onCommit: () => {
          this.scheduler.readOnly = false;
        }
      }, */
      eventRenderer: ({ eventRecord, tplData }) => {
        /* TODO refactor to use reducer or normal for to break; loop */
        if (!eventRecord.timeLine) return null;
        const dateToPx = (date) => {
          return this.scheduler
            .getCoordinateFromDate(new Date(date)) - tplData.left;
        };
        let calculate = true;
        return eventRecord.timeLine.map((periodo) => {
          if (calculate) {
            const pxStart = dateToPx(periodo.startDate);
            const pxEnd = dateToPx(periodo.endDate);
            let pxLeft = pxStart;
            let px = pxEnd - pxStart;
            if (px === 0) {
              calculate = false;
              return null;
            }
            if (px < 0) {
              px *= -1;
              pxLeft = pxEnd;
            }
            return {
              type: periodo.type,
              left: pxLeft,
              width: px
            };
          }
          return null;
        }).filter(x => x);
      },
      eventBodyTemplate: (periodos) => {
        if (!periodos) return null;
        return (
          periodos.map((periodo) => {
            return (`
              <div
                class="nested ${periodo.type}"
                style="left: ${periodo.left}; width: ${periodo.width}px"
              ></div>
            `);
          }).join('')
        );
      }
      // eventRenderer: ({ eventRecord }) => {
      //   return eventRecord;
      // },
      // eventBodyTemplate: (data) => {
      //   return `<div class="value">${data.name || ''}</div>`;
      // }
    });
    this.scheduler = engine;
  }

  configureZoom = () => {
    WidgetHelper.append([
      {
        type: 'combo',
        id: 'preset',
        placeholder: 'Preset',
        editable: false,
        cls: 'b-bright',
        items: Object.keys(presets),
        picker: {
          maxHeight: 500
        },
        onAction: ({ value }) => {
          const preset = presets[value];
          this.scheduler.zoomTo(preset);
        }
      },
      {
        type: 'button',
        id: 'zoomInButton',
        cls: 'b-raised',
        color: 'b-orange',
        icon: 'b-icon b-icon-search-plus',
        tooltip: 'Zoom in',
        onAction: () => this.scheduler.zoomIn()
      },
      {
        type: 'button',
        id: 'zoomOutButton',
        cls: 'b-raised',
        color: 'b-orange',
        icon: 'b-icon b-icon-search-minus',
        tooltip: 'Zoom out',
        onAction: () => this.scheduler.zoomOut()
      }
    ], { insertFirst: document.getElementById('tools') || document.body });
  }

  createGrid = () => {
    const unplannedGrid = new UnplannedGrid({
      appendTo: this.bryntumDiv,
      id: 'unplanned',
      eventStore: this.scheduler.eventStore,
      data: this.props.ordens,
      store: {
        modelClass: Task,
        autoLoad: true
      },
    });
    this.unplannedGrid = unplannedGrid;
  }

  createDrag = () => {
    const drag = new Drag({
      grid: this.unplannedGrid,
      schedule: this.scheduler,
      outerElement: this.unplannedGrid.element
    });
    this.drag = drag;
  }

  render() {
    return (
      <div
        className="scheduler-wrapper"
        ref={(div) => { this.containerDiv = div; }}
      >
        <div
          className="b-react-scheduler-container"
          id="bodycontainer"
          ref={(div) => { this.bryntumDiv = div; }}
        />
      </div>
    );
  }
}
