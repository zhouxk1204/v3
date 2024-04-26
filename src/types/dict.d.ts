export interface DictDTO {
  createBy: string;
  createTime: string;
  dictId: number;
  dictName: string;
  dictType: string;
  remark: string;
  status: string; // '0' '1'
  updateBy: string;
  updateTime: string;
}

export interface DictVO {
  createTime: string;
  dictName: string;
  dictType: string;
  status: string; // '0' '1'
  remark: string;
  dictId: number;
}

// 转换函数
export function DictDtoToVo(dto: DictDTO): DictVO {
  return {
    dictId: dto.dictId,
    createTime: dto.createTime,
    dictName: dto.dictName,
    dictType: dto.dictType,
    status: dto.status,
    remark: dto.remark,
  };
}

export interface DictForm {
  dictName: string;
  dictType: string;
  status: string; // '0' '1'
  remark: string;
  createBy: string;
}

export interface DictSearchForm {
  dictName: string;
  dictType: string;
  status: string; // '0' '1'
  beginTime: string;
  endTime: string;
}
