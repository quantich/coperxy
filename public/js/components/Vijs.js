import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Timeline, DataSet } from 'vis';
import '../../../node_modules/vis/dist/vis.css';
import { Table } from 'antd';
import familias from '../fixtures/familias';
import familiasInfo from '../fixtures/informacoes';
import finalDates from '../fixtures/datasFinais';
import ops from '../fixtures/ops';
import calendario from '../fixtures/calendario';
import ComputeEventDates from '../lib/ComputeEventDates';

const numberOfGroups = 25;
const groups = new DataSet();
// for (let i = 0; i < numberOfGroups; i += 1) {
//   groups.add({
//     id: i,
//     content: i,
//     subgroupStack: false
//   });
// }

familias.forEach((f) => {
  groups.add({
    id: Number(f.id),
    content: f.name,
    subgroupStack: false
  });
});

const numberOfItems = 300;
const items = new DataSet();
const datex = new Date();
datex.setHours(datex.getHours() + 4 * (Math.random() < 0.2));
const startx = new Date(datex);
datex.setHours(datex.getHours() + 2 + Math.floor(Math.random() * 4));
const endx = new Date(datex);

// items.add({
//   id: 43432423423,
//   group: 1,
//   start: startx,
//   end: endx,
//   type: 'background'
// });

// items.add({
//   id: 43423423677,
//   group: 5,
//   start: startx,
//   end: endx,
//   type: 'background'
// });
// const itemsPerGroup = Math.round(numberOfItems / numberOfGroups);
// for (let truck = 0; truck < numberOfGroups; truck += 1) {
//   const date = new Date();
//   for (let order = 0; order < itemsPerGroup; order += 1) {
//     date.setHours(date.getHours() + 4 * (Math.random() < 0.2));
//     const start = new Date(date);
//     date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
//     const end = new Date(date);
//     items.add({
//       id: order + itemsPerGroup * truck,
//       group: truck,
//       start,
//       end,
//       content: `Order ${order}`
//     });
//   }
// }

const GroupTemplate = (props) => {
  const { group } = props;
  return (
    <div>
      <label>{group.content}</label>
    </div>
  );
};

const ItemTemplate = (props) => {
  const { item } = props;
  return (
    <div className="item-template">
      <label>{item.content}</label>
    </div>
  );
};

class VisTimeline extends React.Component {
  state = {
    items: []
  }

  componentDidMount() {
    this.initTimeline();
    this.prepareCalendarBk(calendario);
  }

  initTimeline = () => {
    const timelineHeight = `${Math.round(window.innerHeight * 0.9) }px`;
    const options = {
      orientation: 'top',
      maxHeight: timelineHeight,
      verticalScroll: true,
      start: new Date(),
      end: new Date(1000 * 60 * 60 * 24 + (new Date()).valueOf()),
      editable: true,
      template: (item, element) => {
        if (!item) { return; }
        ReactDOM.unmountComponentAtNode(element);
        ReactDOM.render(<ItemTemplate key={`item-${item.id}`} item={item} />, element);
      },
      groupTemplate: (group, element) => {
        if (!group) { return; }
        ReactDOM.unmountComponentAtNode(element);
        ReactDOM.render(<GroupTemplate key={`group-${group.id}`} group={group} />, element);
      },
      onDropObjectOnItem: (objectData, item, callback) => {
        alert(item);
        if (!item) { return; }
        alert(`dropped object with content: "${objectData.content}" to item: "${item.content}"`);
      },
      onAdd: (t) => {
        const computeEngine = new ComputeEventDates(
          calendario, finalDates, familiasInfo, t.group
        );
        const result = computeEngine
          .computeEventDates(t.duration, moment(t.start));
        t.start = result.startDate;
        t.end = result.endDate;
        const startPoint = result.startDate;
        let lastEndDate = result.endDate;
        const newItens = [...this.state.items, t];
        const recomputedItens = newItens
          .sort((a, b) => {
            return a.start > b.start;
          }).map((x) => {
            if (x.overType !== 'op') return x;
            if (x.id === t.id) return x;
            if (x.group !== t.group) return x;
            if (!computeEngine.shouldPushEvent(
              startPoint, lastEndDate,
              moment(x.start), moment(x.end)
            )) return x;
            const newDates = computeEngine
              .computeEventDates(x.duration, lastEndDate);
            x.start = newDates.startDate; /* eslint-disable-line */
            x.end = newDates.endDate; /* eslint-disable-line */
            /* altera a data final do eixo para usar como base no proximo evento do loop */
            lastEndDate = newDates.endDate;
            return x;
          });
        this.container.setItems(recomputedItens);
        this.setState({ items: recomputedItens });
        // this.container.redraw();
      }
    };
    const container = document.getElementById('mytimeline');
    this.container = new Timeline(container, items, groups, options);
  }

  prepareCalendarBk = (calendar) => {
    let bk = [];
    Object.values(calendar).forEach((x) => {
      Object.values(x).forEach((y) => {
        const startDateString = `${y.data_recurso} ${y.hora_inicio}`;
        const startDate = moment(startDateString, 'DD-MM-YYYY hh:mm');
        const endDateString = `${y.data_recurso} ${y.hora_termino}`;
        const endDate = moment(endDateString, 'DD-MM-YYYY hh:mm');
        const newBk = {
          id: `${y.codigo_recurso}-${y.data_recurso}`,
          key: `${y.codigo_recurso}-${y.data_recurso}`,
          group: y.codigo_recurso,
          start: startDate,
          end: endDate,
          type: 'background'
        };
        bk = [...bk, newBk];
      });
    });
    this.setState({ items: bk });
  };

  renderOpList = () => {
    return ops.map((op) => {
      // precisamos colocar a referência
      return (
        <tr draggable="true" className="item" onDragStart={e => this.onDragStart(e, op)}>
          <td>
            {op.name}
          </td>
          <td>
            {op.id}
          </td>
          <td className="duration">
            {op.duration}
          </td>
        </tr>
      );
    });
  }

  onDragStart = (event, op) => {
    event.dataTransfer.effectAllowed = 'move';
    const item = {
      id: Number(op.id),
      type: 'range',
      content: op.name,
      overType: 'op',
      duration: op.duration
    };
    event.dataTransfer.setData('text', JSON.stringify(item));
  }

  render() {
    return (
      <div>
        <div className="timeline">
          <div id="mytimeline" />
          <div className="items-panel">
            <table className="items">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Ref.</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                {this.renderOpList()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default VisTimeline;
