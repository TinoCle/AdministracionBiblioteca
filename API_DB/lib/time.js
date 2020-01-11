let time = new Date();
time = new Date(time.getFullYear(), time.getMonth(), time.getDate());

module.exports = {
  getTime: days => {
    let aux = new Date();
    if (days) {
      aux.setDate(time.getDate() + days);
      return aux;
    } else {
      return time.toISOString();
    }
  },
  modifyTime: days => {
    time.setDate(time.getDate() + days);
    return time;
  }
}