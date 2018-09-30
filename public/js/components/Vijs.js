import React from 'react';
import ReactDOM from 'react-dom';
import { Timeline, DataSet } from 'vis';
import '../../../node_modules/vis/dist/vis.css';

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
  }
};

const numberOfGroups = 25;
const groups = new DataSet();
for (let i = 0; i < numberOfGroups; i += 1) {
  groups.add({
    id: i,
    content: i,
    subgroupStack: false
  });
}

const numberOfItems = 300;
const items = new DataSet();
const itemsPerGroup = Math.round(numberOfItems / numberOfGroups);
for (let truck = 0; truck < numberOfGroups; truck += 1) {
  const date = new Date();
  for (let order = 0; order < itemsPerGroup; order += 1) {
    date.setHours(date.getHours() + 4 * (Math.random() < 0.2));
    const start = new Date(date);
    date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
    const end = new Date(date);
    items.add({
      id: order + itemsPerGroup * truck,
      group: truck,
      start,
      end,
      content: `Order ${order}`
    });
  }
}

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

  render() {
    return (
      <div>
        <h1>Vis timline with React</h1>
        <h2>Using react components for items and group templates</h2>
        <div id="mytimeline" />
      </div>
    );
  }
}

export default VisTimeline;
