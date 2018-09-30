import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  listFamilias, listOrdens, listOs, listCalendario, listFinalDates, listFamiliasInfo
} from '../../modules/recurso';
import Scheduler from '../../components/Scheduler';

const mapStateToProps = state => ({
  familias: state.recurso.familias,
  ordens: state.recurso.ordens,
  os: state.recurso.os,
  calendario: state.recurso.calendario,
  finalDates: state.recurso.finalDates,
  familiasInfo: state.recurso.familiasInfo
});

const mapDispatchToProps = dispatch => ({
  listFamilias: bindActionCreators(listFamilias, dispatch),
  listOrdens: bindActionCreators(listOrdens, dispatch),
  listOs: bindActionCreators(listOs, dispatch),
  listCalendario: bindActionCreators(listCalendario, dispatch),
  listFinalDates: bindActionCreators(listFinalDates, dispatch),
  listFamiliasInfo: bindActionCreators(listFamiliasInfo, dispatch)
});

class ConsultaRecurso extends Component {
  componentDidMount() {
    this.props.listFamilias();
    this.props.listOrdens();
    this.props.listOs();
    this.props.listCalendario();
    this.props.listFinalDates();
    this.props.listFamiliasInfo();
  }

  render() {
    const {
      familias, ordens, os, calendario, finalDates, familiasInfo
    } = this.props;

    if (familiasInfo) {
      // console.log(familiasInfo);
    }

    return (
      <div>
        { familias.length > 0
          && ordens.length > 0
          && calendario
          && finalDates
          && familiasInfo
          && (
          <Scheduler
            resources={familias}
            ordens={ordens}
            calendario={calendario}
            finalDates={finalDates}
            familiasInfo={familiasInfo}
          />
          )
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaRecurso);
