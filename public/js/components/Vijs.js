import React from 'react';
import ReactDOM from 'react-dom';
import { Timeline, DataSet } from 'vis';
import '../../../node_modules/vis/dist/vis.css';
import familias from '../fixtures/familias';
import ops from '../fixtures/ops';

const options = {
  orientation: 'top',
  maxHeight: 400,
  start: new Date(),
  end: new Date(1000 * 60 * 60 * 24 + (new Date()).valueOf()),
  editable: true,
  template(item, element) {
    if (!item) { return; }
    ReactDOM.unmountComponentAtNode(element);
    ReactDOM.render(<ItemTemplate item={item} />, element);
  },
  groupTemplate(group, element) {
    if (!group) { return; }
    ReactDOM.unmountComponentAtNode(element);
    ReactDOM.render(<GroupTemplate group={group} />, element);
  },
  onDropObjectOnItem: (objectData, item, callback) => {
    alert(item);
    if (!item) { return; }
    alert(`dropped object with content: "${objectData.content}" to item: "${item.content}"`);
  }
};

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
    <div>
      <label>{item.content}</label>
    </div>
  );
};

class VisTimeline extends React.Component {
  componentDidMount() {
    this.initTimeline();
  }

  initTimeline = () => {
    const container = document.getElementById('mytimeline');
    this.container = new Timeline(container, items, groups, options);
  }

  renderOpList = () => {
    return ops.map((op) => {
      return (
        <li draggable="true" className="item" onDragStart={e => this.onDragStart(e, op)}>
          {op.name}
          {' '}
- range
                </li>
      );
    });
  }

  onDragStart = (event, op) => {
    console.log(event);
    const dragSrcEl = event.target;
    event.dataTransfer.effectAllowed = 'move';
    const itemType = event.target.innerHTML.split('-')[1].trim();
    const item = {
      id: new Date(),
      type: itemType,
      content: event.target.innerHTML.split('-')[0].trim()
    };
    const isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() === 'fixed times');
    if (isFixedTimes) {
      item.start = new Date();
      item.end = new Date(1000 * 60 * 10 + (new Date()).valueOf());
    }
    event.dataTransfer.setData('text', JSON.stringify(item));
  }

  handleDragStart = (event) => {
    console.log(event);
    const dragSrcEl = event.target;
    event.dataTransfer.effectAllowed = 'move';
    const itemType = event.target.innerHTML.split('-')[1].trim();
    const item = {
      id: new Date(),
      type: itemType,
      content: event.target.innerHTML.split('-')[0].trim()
    };
    const isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() === 'fixed times');
    if (isFixedTimes) {
      item.start = new Date();
      item.end = new Date(1000 * 60 * 10 + (new Date()).valueOf());
    }
    event.dataTransfer.setData('text', JSON.stringify(item));
  }

  render() {
    return (
      <div>
        <h1>Vis timline with React</h1>
        <h2>Using react components for items and group templates</h2>
        <div id="mytimeline" />
        <div className="items-panel">
          <ul className="items">
            {this.renderOpList()}
          </ul>
        </div>

        <div className="items-panel">
          <div className="side">
            <h3>Items:</h3>
            <ul className="items">
              <li draggable="true" className="item" onDragStart={this.handleDragStart}>
                item 1 - box
              </li>
              <li draggable="true" className="item" onDragStart={this.handleDragStart}>
                item 2 - point
              </li>
              <li draggable="true" className="item" onDragStart={this.handleDragStart}>
                item 3 - range
              </li>
              <li draggable="true" className="item">
                item 3 - range - fixed times -
                (start: now, end: now + 10 min)
              </li>
            </ul>
          </div>
          <div className="side">
            <h3>Object with :</h3>
            <li draggable="true" className="object-item">
              object with target
            </li>
          </div>
        </div>
      </div>
    );
  }
}

export default VisTimeline;
