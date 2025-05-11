interface WorkingDetail {
    /** 基本月薪（单位：元） */
    salary: number;
    
    /** 每月工作天数（如：22天） */
    workDaysPerMonth: number;
    
    /** 每日标准工作时长（小时，如：8） */
    standardHoursPerDay: number;
    
    /** 正常上班时间（格式："HH:mm"，如 "09:00"） */
    workStartTime: string;
    
    /** 正常下班时间（格式："HH:mm"，如 "18:00"） */
    workEndTime: string;
    
    /** 是否包含午休时间 */
    hasLunchBreak: boolean;
    
    /** 午休开始时间（格式："HH:mm"） */
    lunchBreakStart?: string;
    
    /** 午休结束时间（格式："HH:mm"） */
    lunchBreakEnd?: string;
    
    /** 加班开始计算的阈值（超过此时长才算加班，单位：分钟） */
    overtimeThreshold?: number;
    
    /** 加班工资每小时（单位：元） */
    hourlyOvertimePay: number;
    
    /** 周末加班工资倍数（默认1.5倍） */
    weekendOvertimeRate?: number;
    
    /** 节假日加班工资倍数（默认3倍） */
    holidayOvertimeRate?: number;
    
    /** 工作日加班工资倍数（默认1.5倍） */
    weekdayOvertimeRate?: number;
  }