const { getEmployeeById } = require("../controllers/employee");
const { getEmoloyeeTimeSheet } = require("../controllers/timeSheets");
const moment = require("moment");
async function calc(id) {
  const result = await getEmoloyeeTimeSheet(id);
  const calcday = result.map((day) => {
    return {
      id: day.id,
      startAt: day.startAt,
      endAt: moment(day.endAt, "HH:mm:ss"),
      wagePerDay: moment(day.wagePerDay, "HH:mm:ss"),
      calc: moment.duration(day.endAt.diff(day.startAt)),
      //* day.wagePerDay,
    };
  });
  console.log("calcday", calcday);
}
module.exports = { calc };
