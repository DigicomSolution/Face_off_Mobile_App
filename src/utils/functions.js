import moment from 'moment';
export function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age + ' Yrs';
}

export const convertDate = (date) => {
  const convertedDate = new Date(date);
  const getParticularDay = convertedDate.getDay();
  const getParticularMonth = convertedDate.getMonth();
  const getParticularYear = convertedDate.getFullYear();
  const getParticularDate = convertedDate.getDate();

  const string =
    // week[getParticularDay] +
    // ' ' +
    getParticularDate +
    '-' +
    ('0' + (getParticularMonth + 1)).slice(-2) +
    '-' +
    getParticularYear;
  return string;
};

export const convertDateTime = (dateTime) => {
  var m = moment.utc(dateTime, 'DD-MM-YY h:mm:ss A');
  let newTime = m.clone().local().format('h:mm A');
  let newDate = moment(dateTime).format('DD-MM-YY');
  if (moment().format('DD-MM-YY') == newDate) {
    return newTime;
  } else {
    return newDate;
  }
};
export const convertTime24to12 = (time24) => {
  if (time24) {
    let tmpArr = time24.split(':'),
      time12;
    if (Number(tmpArr[0]) === 12) {
      time12 = tmpArr[0] + ':' + tmpArr[1] + ' PM';
    } else {
      if (Number(tmpArr[0]) === 0) {
        time12 = '12:' + tmpArr[1] + ' AM';
      } else {
        if (Number(tmpArr[0]) > 12) {
          time12 = tmpArr[0] - 12 + ':' + tmpArr[1] + 'PM';
        } else {
          time12 = tmpArr[0] + ':' + tmpArr[1] + 'AM';
        }
      }
    }
    return time12;
  } else {
    return '';
  }
};
