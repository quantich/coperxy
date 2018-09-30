import moment from 'moment';
import ComputeEventDates from '../ComputeEventDates';
import calendar from './fixtures/calendar';
import finalDates from './fixtures/finalDates';
import familiasInfo from './fixtures/familiasInfo';

/* eslint-disable */

const computeEngine = new ComputeEventDates(calendar, finalDates, familiasInfo, 1);

xtest('getCalendar', () => {
  const momentDate = moment("01-08-2018", "DD-MM-YYYY");
  const availability = computeEngine.nextAvailability(momentDate)
  const result = computeEngine.getAvaliableTime(availability);
  expect(result.startDate).toEqual(moment("01-08-2018 05:00", "DD-MM-YYYY hh:mm"));
  expect(result.endDate).toEqual(moment("01-08-2018 11:30", "DD-MM-YYYY hh:mm"));
  expect(result.availability.tempo_disponivel).toBe(390);
});
/*
test('nextAvaliableDate', () => {
  let momentDate = moment("01-01-2018", "DD-MM-YYYY");
  let result = computeEngine.nextAvailability(momentDate, '17-08-2018');
  let expectDate = "01-06-2018"
  expect(result.data_recurso).toEqual(expectDate);

  momentDate = moment("01-08-2018", "DD-MM-YYYY");
  result = computeEngine.nextAvailability(momentDate, '17-08-2018');
  expectDate = "01-08-2018"
  expect(result.data_recurso).toEqual(expectDate);
});*/

xtest('should throw exception when nextdate is greater than final date', () => {
  const momentDate = moment("01-05-2019", "DD-MM-YYYY");
  expect(() => {
    computeEngine.nextAvailability(momentDate, '17-08-2018');
  }).toThrow();
})

xtest('getEventDates', () => {
  const momentDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  let ret = computeEngine.getEventDates({}, momentDate, 500);
})

xtest('getStartDate', () => {
  let momentDate = moment('01-06-2018 08:00', 'DD-MM-YYYY hh:mm');
  let momentStartDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  let result = computeEngine.getStartDate({}, momentDate, momentStartDate);
  expect(result).toEqual(momentDate);
  momentDate = moment('01-06-2018 03:00', 'DD-MM-YYYY hh:mm');
  momentStartDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.getStartDate({}, momentDate, momentStartDate);
  expect(result).toEqual(momentStartDate);
})

xtest('shouldPushEvent', () => {
  let startPoint = moment('01-01-2018 08:00', 'DD-MM-YYYY hh:mm');
  let lastEndDate = moment('01-06-2018 08:00', 'DD-MM-YYYY hh:mm');
  let currentStartDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  let currentEndDate = moment('01-03-2018 08:00', 'DD-MM-YYYY hh:mm');
  let result = computeEngine.shouldPushEvent(startPoint, lastEndDate, currentStartDate, currentEndDate);
  expect(result).toBeTruthy();
  lastEndDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  currentStartDate = moment('01-06-2018 08:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.shouldPushEvent(startPoint, lastEndDate, currentStartDate, currentEndDate);
  expect(result).toBeFalsy();
  startPoint = moment('01-03-2018 08:00', 'DD-MM-YYYY hh:mm');
  currentEndDate = moment('01-01-2018 08:00', 'DD-MM-YYYY hh:mm');
  currentStartDate = moment('01-06-2018 05:00', 'DD-MM-YYYY hh:mm');
  currentEndDate = moment('01-03-2018 08:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.shouldPushEvent(startPoint, lastEndDate, currentStartDate, currentEndDate);
  expect(result).toBeFalsy();
})

xtest('normalizeStartDate', () => {
  let startDate = moment("01-01-2018 08:00", "DD-MM-YYYY hh:mm");
  let avaliableStartDate = moment('01-01-2018 01:00', 'DD-MM-YYYY hh:mm');
  let avaliableEndDate = moment('01-01-2018 10:00', 'DD-MM-YYYY hh:mm');
  let result = computeEngine.normalizeStartDate(startDate, avaliableStartDate, avaliableEndDate);
  console.log(result, startDate);
  expect(result).toEqual(startDate);

  startDate = moment('01-02-2018 08:00', 'DD-MM-YYYY hh:mm');
  avaliableStartDate = moment('01-01-2018 01:00', 'DD-MM-YYYY hh:mm');
  avaliableEndDate = moment('01-01-2018 10:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.normalizeStartDate(startDate, avaliableStartDate, avaliableEndDate);
  expect(result).toEqual(avaliableStartDate); 


  startDate = moment('01-01-2018 00:30', 'DD-MM-YYYY hh:mm');
  avaliableStartDate = moment('01-01-2018 01:00', 'DD-MM-YYYY hh:mm');
  avaliableEndDate = moment('01-01-2018 10:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.normalizeStartDate(startDate, avaliableStartDate, avaliableEndDate);
  expect(result).toEqual(avaliableStartDate); 


  startDate = moment('01-01-2018 11:00', 'DD-MM-YYYY hh:mm');
  avaliableStartDate = moment('01-01-2018 01:00', 'DD-MM-YYYY hh:mm');
  avaliableEndDate = moment('01-01-2018 10:00', 'DD-MM-YYYY hh:mm');
  result = computeEngine.normalizeStartDate(startDate, avaliableStartDate, avaliableEndDate);
  expect(result).toEqual(avaliableStartDate); 

});

xtest('normalizeAvaliableTime', () => {
  let startDate = moment('01-01-2018 08:00', 'DD-MM-YYYY hh:mm');
  let avaliableStartDate = moment('01-01-2018 01:00', 'DD-MM-YYYY hh:mm');
  let avaliableEndDate = moment('01-01-2018 10:00', 'DD-MM-YYYY hh:mm');
  let avaliableTime = 540;
  let avaliable = {
    startDate: avaliableStartDate,
    endDate: avaliableEndDate,
    availability: {
      tempo_disponivel: avaliableTime
    }
  }
  let result = computeEngine.normalizeAvaliableTime(startDate, avaliable);
  expect(result).toEqual(120);
})

test('coreMethod', () => {
  const startDate = moment('01-01-2020 08:00', 'DD-MM-YYYY hh:mm');
  const eventRecord = { originalData: { duration: 10140 } };
  console.log('teste');
  const result = computeEngine.computeEventDates(eventRecord, startDate);
  console.log(result);
  /* TODO ajustar timezone */
})