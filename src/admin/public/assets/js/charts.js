function initChart(selector, ...log) {
  new Chartist.Line(
    selector,
    {
      labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      series: [...log],
    },
    { low: Math.min(log), showArea: true }
  );
}

initChart(".joins-chart", joinsLog, leavesLog);
initChart(".punishments-chart", punishmentsLog);
initChart(".messages-chart", messagesLog);
