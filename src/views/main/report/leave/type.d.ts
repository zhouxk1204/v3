interface RecordSetting {
  type: 'point' | 'leave';    // 类型分类：工分类 or 假期类（用于前端筛选等）
  matchMode: 'pattern' | 'keyword'; // 匹配模式：是否用正则规则解析还是用关键词匹配
  keywords?: string[];            // 假期类型专用：如 ["年假", "婚假"] 用于关键词匹配
  rules?: RulePart[];           // 工分专用：规则定义（上班/加班拆分、多段结构）
  remark: string;
}

interface RulePart {
  option: 'int' | 'float' | 'text' | 'regex'; // 选项类型（整数、数字、小数、纯文本、自定义正则）
  labels: string[];               // 标签数组：例如 ['上班', '加班'] 或 ['年假', '半天年假']
  type: string;                   // 类型（如：'work', 'overtime', 'leave'）
  multiplier: number;             // 如果是工分类型，则为倍率；如果是假期类型，则为天数
  separator: string;
  sort: number;
  recordId: string;
}
