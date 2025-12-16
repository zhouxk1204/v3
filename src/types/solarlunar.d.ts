declare module "solarlunar" {
  export interface Solar2LunarResult {
    // 公历
    cYear: number
    cMonth: number
    cDay: number

    // 农历
    lYear: number
    lMonth: number
    lDay: number
    isLeap: boolean

    // 中文显示
    yearCn: string
    monthCn: string
    dayCn: string

    // 干支
    gzYear: string
    gzMonth: string
    gzDay: string

    // 生肖
    animal: string

    // 节气
    term: string
    isTerm: boolean

    // 其他
    isToday: boolean
    nWeek: number
    ncWeek: string
  }

  const solarlunar: {
    solar2lunar(
      year: number,
      month: number,
      day: number
    ): Solar2LunarResult

    lunar2solar(
      year: number,
      month: number,
      day: number,
      isLeapMonth?: boolean
    ): {
      cYear: number
      cMonth: number
      cDay: number
    }
  }

  export default solarlunar
}
