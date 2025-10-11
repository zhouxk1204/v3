export type Area = {
  code: string; // 车牌后缀，如 'A', 'B' 等
  name: string; // 城市或地区名称
  remark: string; // 备注信息，可能为空字符串
};

export type ProvincePlate = {
  prefix: string; // 车牌省份前缀，如 '琼'
  province: string; // 省份名称，如 '海南省'
  area: Area[]; // 包含所有车牌后缀与对应地区的数组
};

export const provincePlateArray: ProvincePlate[] = [
  {
    prefix: "粤",
    province: "广东省",
    area: [
      { code: "A", name: "广州市", remark: "" },
      { code: "B", name: "深圳市", remark: "" },
      { code: "C", name: "珠海市", remark: "" },
      { code: "D", name: "汕头市", remark: "" },
      { code: "E", name: "佛山市", remark: "" },
      { code: "F", name: "韶关市", remark: "" },
      { code: "G", name: "湛江市", remark: "" },
      { code: "H", name: "肇庆市", remark: "" },
      { code: "J", name: "江门市", remark: "" },
      { code: "K", name: "茂名市", remark: "" },
      { code: "L", name: "惠州市", remark: "" },
      { code: "M", name: "梅州市", remark: "" },
      { code: "N", name: "汕尾市", remark: "" },
      { code: "P", name: "河源市", remark: "" },
      { code: "Q", name: "阳江市", remark: "" },
      { code: "R", name: "清远市", remark: "" },
      { code: "S", name: "东莞市", remark: "" },
      { code: "T", name: "中山市", remark: "" },
      { code: "U", name: "潮州市", remark: "" },
      { code: "V", name: "揭阳市", remark: "" },
      { code: "W", name: "云浮市", remark: "" },
      { code: "X", name: "顺德区", remark: "属于佛山市" },
      { code: "Y", name: "南海区", remark: "属于佛山市" },
      { code: "Z", name: "港澳进入内地车辆", remark: "" },
    ],
  },
  {
    prefix: "川",
    province: "四川省",
    area: [
      { code: "A", name: "成都市", remark: "" },
      { code: "B", name: "绵阳市", remark: "" },
      { code: "C", name: "自贡市", remark: "" },
      { code: "D", name: "攀枝花市", remark: "" },
      { code: "E", name: "泸州市", remark: "" },
      { code: "F", name: "德阳市", remark: "" },
      {
        code: "G",
        name: "成都市",
        remark: "成都市增补车牌号，于2022年4月7日开始启用",
      },
      { code: "H", name: "广元市", remark: "" },
      { code: "J", name: "遂宁市", remark: "" },
      { code: "K", name: "内江市", remark: "" },
      { code: "L", name: "乐山市", remark: "" },
      { code: "M", name: "资阳市", remark: "" },
      { code: "Q", name: "宜宾市", remark: "" },
      { code: "R", name: "南充市", remark: "" },
      { code: "S", name: "达州市", remark: "" },
      { code: "T", name: "雅安市", remark: "" },
      { code: "U", name: "阿坝藏族羌族自治州", remark: "" },
      { code: "V", name: "甘孜藏族自治州", remark: "" },
      { code: "W", name: "凉山彝族自治州", remark: "" },
      { code: "X", name: "广安市", remark: "" },
      { code: "Y", name: "巴中市", remark: "" },
      { code: "Z", name: "眉山市", remark: "" },
    ],
  },
  {
    prefix: "青",
    province: "青海省",
    area: [
      { code: "A", name: "西宁市", remark: "" },
      { code: "B", name: "海东市", remark: "" },
      { code: "C", name: "海北藏族自治州", remark: "" },
      { code: "D", name: "黄南藏族自治州", remark: "" },
      { code: "E", name: "海南藏族自治州", remark: "" },
      { code: "F", name: "果洛藏族自治州", remark: "" },
      { code: "G", name: "玉树藏族自治州", remark: "" },
      { code: "H", name: "海西蒙古族藏族自治州", remark: "" },
    ],
  },
  {
    prefix: "甘",
    province: "甘肃省",
    area: [
      { code: "A", name: "兰州市", remark: "省会，辖区内多个区县" },
      { code: "B", name: "嘉峪关市", remark: "省辖市，面积小" },
      { code: "C", name: "金昌市", remark: "" },
      { code: "D", name: "白银市", remark: "" },
      { code: "E", name: "天水市", remark: "" },
      { code: "F", name: "武威市", remark: "" },
      { code: "G", name: "张掖市", remark: "" },
      { code: "H", name: "平凉市", remark: "" },
      { code: "J", name: "酒泉市", remark: "" },
      { code: "K", name: "庆阳市", remark: "" },
      { code: "L", name: "定西市", remark: "" },
      { code: "M", name: "陇南市", remark: "" },
      {
        code: "N",
        name: "临夏回族自治州",
        remark: "民族自治州，车辆须符合相关政策",
      },
      {
        code: "P",
        name: "甘南藏族自治州",
        remark: "民族自治州，车辆须符合相关政策",
      },
    ],
  },

  {
    prefix: "藏",
    province: "西藏自治区",
    area: [
      { code: "A", name: "拉萨市", remark: "" },
      { code: "B", name: "昌都地区", remark: "" },
      { code: "C", name: "山南地区", remark: "" },
      { code: "D", name: "日喀则地区", remark: "" },
      { code: "E", name: "那曲地区", remark: "" },
      { code: "F", name: "阿里地区", remark: "" },
      { code: "G", name: "林芝地区", remark: "" },
      { code: "H", name: "驻四川省天全县车辆管理所", remark: "" },
      { code: "J", name: "驻青海省格尔木市车辆管理所", remark: "" },
    ],
  },
  {
    prefix: "琼",
    province: "海南省",
    area: [
      { code: "A", name: "海口市", remark: "" },
      { code: "B", name: "三亚市", remark: "" },
      { code: "C", name: "琼海市", remark: "" },
      { code: "D", name: "五指山市（原通什市）", remark: "" },
      { code: "E", name: "洋浦开发区", remark: "" },
    ],
  },
];
