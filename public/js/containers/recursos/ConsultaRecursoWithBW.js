import React, { Component } from 'react';
import BryntumWrapper from '../../components/BryntumWrapper';

/* eslint-disable */

const fixedData = {
  "success"   : true,
  "resources" : {
      "rows": [
          {"id": "a", "name": "Arcady", "role": "Core developer"},
          {"id": "b", "name": "Dave", "role": "Tech Sales"},
          {"id": "c", "name": "Henrik", "role": "Sales"},
          {"id": "d", "name": "Linda", "role": "Core developer"},
          {"id": "e", "name": "Maxim", "role": "Developer & UX"},
          {"id": "f", "name": "Mike", "role": "CEO"},
          {"id": "g", "name": "Lee", "role": "CTO"}
      ]
  },
  "events"    : {
      "rows": [
          {
              "resourceId": "a",
              "name"      : "Meeting #1",
              "startDate" : "2017-02-07 11:00",
              "endDate"   : "2017-02-07 14:00",
              "location"  : "Some office",
              "eventType" : "Meeting",
              "iconCls"   : "fa fa-calendar"
          },
          {
              "resourceId": "b",
              "name"      : "Meeting #2",
              "startDate" : "2017-02-07 12:00",
              "endDate"   : "2017-02-07 15:00",
              "location"  : "Home office",
              "eventType" : "Meeting",
              "iconCls"   : "fa fa-calendar"
          },
          {
              "resourceId": "c",
              "name"      : "Meeting #3",
              "startDate" : "2017-02-07 13:00",
              "endDate"   : "2017-02-07 16:00",
              "location"  : "Customer office",
              "eventType" : "Meeting",
              "iconCls"   : "fa fa-calendar"
          },
          {
              "resourceId": "d",
              "name"      : "Important meeting",
              "startDate" : "2017-02-07 09:00",
              "endDate"   : "2017-02-07 11:00",
              "location"  : "Some office",
              "eventType" : "Meeting",
              "eventColor": "red",
              "iconCls"   : "fa fa-calendar-exclamation"
          },
          {
              "resourceId": "e",
              "name"      : "Appointment #1",
              "startDate" : "2017-02-07 10:00",
              "endDate"   : "2017-02-07 12:00",
              "location"  : "Home office",
              "type"      : "Dental",
              "eventType" : "Appointment",
              "iconCls"   : "fa fa-calendar-alt"
          },
          {
              "resourceId": "f",
              "name"      : "Appointment #2",
              "startDate" : "2017-02-07 11:00",
              "endDate"   : "2017-02-07 13:00",
              "location"  : "Customer office",
              "type"      : "Medical",
              "eventType" : "Appointment",
              "iconCls"   : "fa fa-calendar-alt"
          },
          {
              "resourceId": "g",
              "name"      : "Appointment #3",
              "startDate" : "2017-02-07 10:00",
              "endDate"   : "2017-02-07 12:00",
              "location"  : "Home office",
              "type"      : "Medical",
              "eventType" : "Appointment",
              "iconCls"   : "fa fa-calendar-alt"
          },
          {
              "resourceId": "g",
              "name"      : "Important appointment",
              "startDate" : "2017-02-07 15:00",
              "endDate"   : "2017-02-07 18:00",
              "location"  : "Customer office",
              "type"      : "Dental",
              "eventType" : "Appointment",
              "eventColor": "red",
              "iconCls"   : "fa fa-calendar-exclamation"
          }
      ]
  },
  "timeRanges": {
      "rows": [
          {
              "startDate": "2017-02-07 11:00",
              "endDate"  : "2017-02-07 12:00"
          }
      ]
  }
}

/* eslint-enable */

export default class ConsultaRecurso extends Component {
  state = {
    barMargin: 5,
    selectedEvent: ''
  };

  componentDidMount() {
    fetch(fixedData).then((response) => {
      response.json().then((data) => {
        this.setState({
          eventsVersion: 1,
          resourcesVersion: 1,
          events: data.events.rows,
          resources: data.resources.rows,
          timeRanges: data.timeRanges.rows
        });
      });
    });
  }

  handleBarMarginChange = (event) => {
    this.setState({ barMargin: parseInt(event.target.value) });
  };

  handleSelectionChange = ({ selected }) => {
    this.setState({ selectedEvent: selected.length && selected[0].name || '' });
  };

  render() {
    return (
      <div>
        <div id="tools">
          <div className="barmargin">
            <input id="margin-input" min="0" max="10" type="number" value={this.state.barMargin} onChange={this.handleBarMarginChange} />
          </div>
        </div>
        <BryntumWrapper
          ref={(instance) => { this.scheduler = instance; }}
          autoHeight
          barMargin={this.state.barMargin}
          eventsVersion={this.state.eventsVersion}
          resourcesVersion={this.state.resourcesVersion}
          events={this.state.events}
          resources={this.state.resources}
          startDate={new Date(2017, 1, 7, 8)}
          endDate={new Date(2017, 1, 7, 18)}
          columns={[
            {
              type: 'resourceInfo',
              imagePath: '../_shared/images/users/',
              text: 'Staff',
              width: 130
            },
            {
              text: 'Type',
              field: 'role',
              width: 130
            }
          ]}
          onEventSelectionChange={this.handleSelectionChange}
        />
      </div>
    );
  }
}
