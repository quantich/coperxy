import moment from 'moment';
import { extendMoment } from 'moment-range';

export default class ComputeEventDates {
  constructor(calendar, finalDates, familiasInfo, resourceId) {
    this.calendar = calendar[resourceId];
    this.finalDates = finalDates;
    this.familiasInfo = familiasInfo;
    this.info = familiasInfo[resourceId];
    this.finalDate = finalDates[resourceId];
  }

  computeEventDates = (eventRecord, momentStartDate) => {
    const { info, finalDate } = this;
    const quantidadeRecursos = info.qtde_recursos;
    const duration = eventRecord.originalData.duration / quantidadeRecursos;
    let timeLine = [];
    /* verifica proximo dia disponivel no cadastro do systextil */
    const availability = this.nextAvailability(momentStartDate, finalDate);
    /* Busca periodos cadastrados no calendario de disponibilidade */
    const avaliableTime = this.getAvaliableTime(availability);
    /* Verifica se a data inicial esta dentro de um periodo disponivel, se não estiver busca o proximo disponivel */
    const startDate = this.normalizeStartDate(momentStartDate,
      avaliableTime.startDate, avaliableTime.endDate);
    /* Ajusta tempodisponivel usando mesma logica do calculo de cima */
    const tempoDisponivel = this.normalizeAvaliableTime(
      startDate, avaliableTime
    );

    /* calcula a data final */
    let tempoDisponivelA = tempoDisponivel;
    if (duration <= tempoDisponivelA) {
      tempoDisponivelA = duration;
    }
    let endDate = moment(startDate).add((tempoDisponivelA), 'minutes');
    timeLine = [...timeLine, {
      startDate, endDate
    }];

    /* Se a duração do evento é menor que o tempo disponivel não precisa mais calcular as datas */
    if (duration < tempoDisponivel) {
      return {
        startDate,
        endDate,
        timeLine
      };
    }
    let restDuration = duration - tempoDisponivel;
    let nextMomentDate = moment(startDate);
    /* Calcula todas datas disponiveis ate zerar a duração do evento */
    while (restDuration > 0) {
      nextMomentDate.add(1, 'days');
      const nextAvailability = this.nextAvailability(
        nextMomentDate, finalDate
      );
      const nextAvaliableTime = this.getAvaliableTime(nextAvailability);
      nextMomentDate = nextAvaliableTime.startDate;
      let nextTempoDisponivel = nextAvaliableTime.availability.tempo_disponivel;
      if (restDuration < nextTempoDisponivel) {
        nextTempoDisponivel = restDuration;
      }
      const nextEndDate = moment(nextMomentDate).add(nextTempoDisponivel, 'minutes');
      endDate = nextEndDate;
      timeLine = [...timeLine, {
        startDate: nextMomentDate, endDate: nextEndDate
      }];
      restDuration -= nextAvaliableTime.availability.tempo_disponivel;
    }
    return {
      startDate,
      endDate,
      timeLine
    };
  }

  normalizeStartDate = (startDate, avaliableStartDate, avaliableEndDate) => {
    const momentx = extendMoment(moment);
    const range = momentx().range(avaliableStartDate, avaliableEndDate);
    if (range.contains(startDate)) {
      return startDate;
    }
    return avaliableStartDate;
  }

  normalizeAvaliableTime = (startDate, avaliableTime) => {
    const diff = startDate.diff(avaliableTime.startDate, 'minutes');
    const tempoDisponivel = avaliableTime.availability.tempo_disponivel;
    if (diff === 0) {
      return tempoDisponivel;
    }
    return tempoDisponivel - diff;
  }

  nextAvailability = (momentCurrentDate, finalDate) => {
    const date = this.getDateOnCalendar(momentCurrentDate);
    if (!date) {
      const nextDate = moment(momentCurrentDate).add(1, 'days');
      const momentFinalDate = moment(`${finalDate} 05:00`, 'DD-MM-YYYY hh:mm');
      const nextFinalDate = moment(momentFinalDate).add(1, 'days');
      if (nextDate.diff(nextFinalDate, 'days') > 0) {
        throw new Error('Data não cadastrada');
      }
      return this.nextAvailability(nextDate, finalDate);
    }
    return date;
  }

  getDateOnCalendar = (momentDate) => {
    const formatedDate = momentDate.format('DD-MM-YYYY');
    return this.calendar[formatedDate];
  }

  getAvaliableTime = (availability) => {
    const startDateString = `${availability.data_recurso} ${availability.hora_inicio}`;
    const startDate = moment(startDateString, 'DD-MM-YYYY hh:mm');
    const endDateString = `${availability.data_recurso} ${availability.hora_termino}`;
    const endDate = moment(endDateString, 'DD-MM-YYYY hh:mm');
    return {
      availability,
      startDate,
      endDate
    };
  }

  shouldPushEvent = (
    newStartDatePoint,
    lastEndDate,
    currentStartDate,
    currentEndDate
  ) => {
    return lastEndDate.diff(currentStartDate, 'minutes') > 0
    && currentEndDate.diff(newStartDatePoint, 'minutes') > 0;
  }

  computeTimeLines = (timeLine) => {
    let times = [];
    let lastEndDate;
    timeLine.forEach((time) => {
      if (lastEndDate) {
        times = [...times, {
          type: 'vazio',
          startDate: lastEndDate,
          endDate: time.startDate
        }];
      }
      times = [...times, {
        type: 'util',
        startDate: time.startDate,
        endDate: time.endDate
      }];
      lastEndDate = time.endDate;
    });
    return times;
  }
}
