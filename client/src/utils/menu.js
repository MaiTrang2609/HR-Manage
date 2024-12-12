import {
  HomeOutlined,
  UserOutlined,
  PartitionOutlined,
  FilePdfOutlined,
  ScheduleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  MailOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import { Division, Room } from "../assets/icon";

export const menuList = [
  {
    key: 1,
    label: "Home",
    path: "/",
    icon: <HomeOutlined />,
  },
  {
    key: 2,
    label: "User",
    path: "/user",
    icon: <UserOutlined />,
  },
  {
    key: 3,
    label: "Division",
    path: "/division",
    icon: Division,
  },
  {
    key: 4,
    label: "Room",
    path: "/room",
    icon: Room,
  },
  {
    key: 5,
    label: "Position",
    path: "/position",
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: 6,
    label: "Job",
    path: "/job",
    icon: <PartitionOutlined />,
  },
  {
    key: 7,
    label: "CV",
    path: "/cv",
    icon: <FilePdfOutlined />,
  },
  {
    key: 8,
    label: "Annual Leave",
    path: "/annual-leave",
    icon: <ScheduleOutlined />,
  },
  {
    key: 9,
    label: "Pay check",
    path: "/pay-check",
    icon: <DollarOutlined />,
  },
  {
    key: 10,
    label: "Mail",
    path: "/email",
    icon: <MailOutlined />,
  },
];
export const menuHRList = [
  {
    key: 1,
    label: "Home",
    path: "/",
    icon: <HomeOutlined />,
  },
  {
    key: 2,
    label: "Job",
    path: "/job",
    icon: <PartitionOutlined />,
  },
  {
    key: 3,
    label: "CV",
    path: "/cv",
    icon: <FilePdfOutlined />,
  },
  {
    key: 4,
    label: "Annual Leave",
    path: "/my-annual-leave",
    icon: <ScheduleOutlined />,
  },
  {
    key: 5,
    label: "Pay check",
    path: "/my-pay-check",
    icon: <DollarOutlined />,
  },
  {
    key: 6,
    label: "Mail",
    path: "/email",
    icon: <MailOutlined />,
  },
  {
    key: 7,
    label: "Statistica",
    path: "/statistica",
    icon: <BarChartOutlined />,
  },
];

export const menuOnsiteList = [
  {
    key: 2,
    label: "Job",
    path: "/job-candidate",
    icon: <PartitionOutlined />,
  },
  {
    key: 3,
    label: "My Cv",
    path: "/my-cv",
    icon: <FilePdfOutlined />,
  },
];

export const menuEmployeeList = [
  {
    key: 1,
    label: "Home",
    path: "/",
    icon: <HomeOutlined />,
  },
  {
    key: 2,
    label: "Annual Leave",
    path: "/my-annual-leave",
    icon: <ScheduleOutlined />,
  },
  {
    key: 3,
    label: "Pay check",
    path: "/my-pay-check",
    icon: <DollarOutlined />,
  },
  {
    key: 4,
    label: "Statistica",
    path: "/statistica",
    icon: <BarChartOutlined />,
  },
];
export const menuDMList = [
  {
    key: 1,
    label: "Home",
    path: "/",
    icon: <HomeOutlined />,
  },
  {
    key: 2,
    label: "User",
    path: "/user",
    icon: <UserOutlined />,
  },
  {
    key: 3,
    label: "Annual Leave",
    path: "/my-annual-leave",
    icon: <ScheduleOutlined />,
  },
  {
    key: 4,
    label: "Request Leave",
    path: "/my-request-leave",
    icon: <SolutionOutlined />,
  },
  {
    key: 5,
    label: "Pay check",
    path: "/my-pay-check",
    icon: <DollarOutlined />,
  },
  {
    key: 6,
    label: "Statistica",
    path: "/statistica",
    icon: <BarChartOutlined />,
  },
];

export const handleMenu = (role) => {
  let menu = [];
  switch (role) {
    case "candidate":
      menu = [...menuOnsiteList];
      break;
    case "employee":
      menu = [...menuEmployeeList];
      break;
    case "dm":
      menu = [...menuDMList];
      break;
    case "hr":
      menu = [...menuHRList];
      break;
    default:
      menu = [...menuList];
  }
  return menu;
};
