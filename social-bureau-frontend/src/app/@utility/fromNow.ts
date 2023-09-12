import moment from "moment";

export const fromNow = (time: number) => {
  return moment(time * 1000).fromNow();
};
