import moment from "moment";
import { defineStore } from "pinia";
import http from "@/plugins/axios";

export const useCalendarStore = defineStore("calendar-store", {
  state: () => ({
    date: moment().format("DD/MM/YYYY"),
    type: "week",
    startDate: "",
    endDate: "",
    dates: [],
    types: ["day", "week", "month"],
    format: "DD/MM/YYYY",
    events: [],
    isLoadingGetEvents: false,
    showNonWorkingDays: true,
  }),
  getters: {},
  actions: {
    pushDateToDates(date, inactive = false) {
      const value = moment(date, this.format);
      const newDate = {
        day: value.format("DD"),
        month: value.format("MM"),
        year: value.format("YYYY"),
        full: value.format(this.format),
        inactive: inactive,
        isToday: value.format(this.format) === moment().format(this.format),
        events: [],
      };
      this.dates.push(newDate);
    },
    setDatesByTypeCalendary() {
      this.dates = [];

      if (this.type === "day") {
        this.pushDateToDates(this.date);
        this.startDate = "";
        this.endDate = "";
      } else if (this.type === "week") {
        this.startDate = moment(this.date, this.format)
          .startOf(this.type)
          .format(this.format);
        this.endDate = moment(this.startDate, this.format)
          .endOf(this.type)
          .format(this.format);

        let startMoment = moment(this.startDate, this.format);

        while (startMoment <= moment(this.endDate, this.format)) {
          this.pushDateToDates(startMoment.format(this.format), false);
          startMoment.add(1, "day");
        }
      } else {
        this.startDate = moment(this.date, this.format)
        .startOf(this.type)
        .format(this.format);
        this.endDate = moment(this.startDate, this.format)
        .endOf(this.type)
        .format(this.format);

        const startDatePrevMonth = moment(this.startDate, this.format).subtract(
          1,
          "month"
          );

          const firstDayOfMonth = moment(this.startDate, this.format).day();
          const lastDateOfLastMonth = startDatePrevMonth.daysInMonth();

          for (let i = firstDayOfMonth; i > 0; i--) {
            const day = lastDateOfLastMonth - i + 1;
                // let dayOfWeek = startMoment.weekday()
                // if (!this.showNonWorkingDays && (dayOfWeek !== 0  && dayOfWeek !== 6))
            this.pushDateToDates(
            `${day}/${startDatePrevMonth.format("MM/YYYY")}`,
            true
          );
        }

        let startMoment = moment(this.startDate, this.format);

        while (startMoment <= moment(this.endDate, this.format)) {
          this.pushDateToDates(startMoment.format(this.format), false);
          startMoment.add(1, "day");
        }

        const firstDayOfCurrentMonth = moment(this.endDate, this.format).day();
        const startDateNextMonth = moment(this.endDate, this.format).add(
          1,
          "month"
        );

        for (let i = firstDayOfCurrentMonth; i < 6; i++) {
          const day = i - firstDayOfCurrentMonth + 1;
          this.pushDateToDates(
            `${day}/${startDateNextMonth.format("MM/YYYY")}`,
            true
          );
        }
      }

      this.fetchGetListEvents({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    },
    moveDirectionCalendary(direction = "") {
      if (direction !== "next" && direction !== "prev") {
        throw {
          message: `La direccion no se encuentra incluida en la lista [next, prev]`,
        };
      }

      this.dates = [];
      const dateMoment = moment(this.date, this.format);

      if (this.type === "day") {
        const date =
          direction === "next"
            ? dateMoment.add(1, "day")
            : dateMoment.subtract(1, "day");
        this.date = date.format(this.format);
      } else {
        const dateStartWeek = dateMoment.startOf(this.type);
        const date =
          direction === "next"
            ? dateStartWeek.add(1, this.type)
            : dateStartWeek.subtract(1, this.type);
        this.date = date.format(this.format);
      }
      this.setDatesByTypeCalendary();
    },
    async fetchGetListEvents(payload = {}) {
      this.isLoadingGetEvents = true;
      const { data: events } = await http.API_ROUTE.get("/event", payload);
      this.events = events;

      for (let i = 0; i < this.dates.length; i++) {
        const date = this.dates[i];
        const eventsOfDay = events.filter(
          (e) => moment(e.fecha_inicio).format("DD/MM/YYYY") === date.full
        );
        this.dates[i].events = eventsOfDay;
      }

      this.isLoadingGetEvents = false;
    },
  },
});
