import { HOLIDAYS2, HOLIDAY_ACTIONS2 } from "@/constants";

import useStore from "@/store";
import { IEmployee } from "@/types";

export function useSelect() {
  const holidayActions = HOLIDAY_ACTIONS2;
  const getHolidayActionName = (value: string) => {
    return holidayActions.find((item) => item.value === value)?.label;
  };

  const holidays = HOLIDAYS2;
  const getHolidayName = (value: string) => {
    return holidays.find((item) => item.value === value)?.label;
  };

  const genders = [
    {
      label: "女性",
      value: "0",
    },
    {
      label: "男性",
      value: "1",
    },
  ];
  const getGenderName = (value: string) => {
    return genders.find((item) => item.value === value)?.label;
  };

  const posts = [
    {
      label: "护士",
      value: "0",
    },
    {
      label: "护士长",
      value: "1",
    },
  ];
  const getPostName = (value: string) => {
    return posts.find((item) => item.value === value)?.label;
  };

  const jobs = [
    {
      label: "胃镜1",
      value: "0",
    },
    {
      label: "胃镜2",
      value: "1",
    },
    {
      label: "胃镜3",
      value: "2",
    },
    {
      label: "手术1",
      value: "3",
    },
    {
      label: "手术2",
      value: "4",
    },
    {
      label: "手术3",
      value: "5",
    },
    {
      label: "机动",
      value: "6",
    },
    {
      label: "其他",
      value: "7",
    },
  ];
  const getJobName = (value: string) => {
    return jobs.find((item) => item.value === value)?.label;
  };

  const works = [
    {
      label: "上班",
      value: "0",
    },
    {
      label: "加班",
      value: "1",
    },
  ];
  const getWorkName = (value: string) => {
    return works.find((item) => item.value === value)?.label;
  };

  const employees: { label: string; value: string }[] = toRaw(
    useStore().employee2.list
  ).map((e: IEmployee) => {
    return {
      label: e.name,
      value: `${e.id}`,
    };
  });
  const getEmployeeName = (value: string) => {
    return employees.find((item) => item.value === value)?.label;
  };

  return {
    getHolidayActionName,
    getHolidayName,
    getGenderName,
    getPostName,
    getJobName,
    getWorkName,
    getEmployeeName,
    holidayActions,
    holidays,
    genders,
    posts,
    jobs,
    works,
    employees,
  };
}
