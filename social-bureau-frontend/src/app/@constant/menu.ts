import { MenuItem } from "../@type/menu.type";

export const MENU: MenuItem[] = [
  {
    id: "background-check",
    label: "Background Check",
    link: "/background-check",
    auth: false,
  },
  {
    id: "crimes",
    label: "Crimes",
    link: "/crimes",
    auth: false,
  },
  {
    id: "report-crime",
    label: "Report Crime",
    link: "/report-crime",
    auth: true,
  },
  {
    id: "stake",
    label: "Become an Inspector",
    link: "/stake",
    auth: true,
  },
];
