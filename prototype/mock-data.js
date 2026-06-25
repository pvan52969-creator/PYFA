/** 学院代码 → 学院全称 */
const SCHOOL_NAME_MAP = {
  SASS: 'School of Arts and Social Sciences',
  SEM: 'School of Economics and Management',
  SOC: 'School of Communication',
  STCM: 'School of Traditional Chinese Medicine',
  SCDS: 'School of Computing and Data Science',
  CAMS: 'China-ASEAN College of Marine Sciences',
  SECE: 'School of Energy and Chemical Engineering',
  SEEARI: 'School of Artificial Intelligence and Robotics',
  SMP: 'School of Mathematics and Physics'
};

/** 专业代码 → 学院代码 */
var PROGRAMME_SCHOOL_CODE_MAP = {
  CHS: 'SASS', ENG: 'SASS',
  ACC: 'SEM', FIN: 'SEM', IBU: 'SEM', ECM: 'SEM', HMT: 'SEM',
  JRN: 'SOC', ADV: 'SOC', COM: 'SOC',
  TCM: 'STCM',
  CST: 'SCDS', DMT: 'SCDS', SWE: 'SCDS', CYS: 'SCDS', DSC: 'SCDS',
  MBT: 'CAMS', MEC: 'CAMS',
  CME: 'SECE', NESE: 'SECE',
  EEE: 'SEEARI', AIT: 'SEEARI', ERA: 'SEEARI',
  MAT: 'SMP', PHY: 'SMP'
};

var PROGRAMME_CATALOG = [
  { code: 'CHS', name: 'Chinese Studies', nameZh: '中国研究', degree: '文学学士', duration: 3 },
  { code: 'ACC', name: 'Accounting', nameZh: '会计学', degree: '管理学学士', duration: 4 },
  { code: 'FIN', name: 'Finance', nameZh: '金融学', degree: '经济学学士', duration: 4 },
  { code: 'IBU', name: 'International Business', nameZh: '国际商务', degree: '管理学学士', duration: 4 },
  { code: 'JRN', name: 'Journalism', nameZh: '新闻学', degree: '文学学士', duration: 4 },
  { code: 'TCM', name: 'Traditional Chinese Medicine', nameZh: '中医学', degree: '医学学士', duration: 5 },
  { code: 'CST', name: 'Computer Science and Technology', nameZh: '计算机科学与技术', degree: '工学学士', duration: 4 },
  { code: 'DMT', name: 'Digital Media Technology', nameZh: '数字媒体技术', degree: '工学学士', duration: 4 },
  { code: 'SWE', name: 'Software Engineering', nameZh: '软件工程', degree: '工学学士', duration: 4 },
  { code: 'MBT', name: 'Marine Biotechnology', nameZh: '海洋生物技术', degree: '理学学士', duration: 4 },
  { code: 'CME', name: 'Chemical Engineering', nameZh: '化学工程', degree: '工学学士', duration: 4 },
  { code: 'NESE', name: 'New Energy Science and Engineering', nameZh: '新能源科学与工程', degree: '工学学士', duration: 4 },
  { code: 'EEE', name: 'Electrical and Electronics Engineering', nameZh: '电气与电子工程', degree: '工学学士', duration: 4 },
  { code: 'ADV', name: 'Advertising', nameZh: '广告学', degree: '文学学士', duration: 4 },
  { code: 'MAT', name: 'Mathematics and Applied Mathematics', nameZh: '数学与应用数学', degree: '理学学士', duration: 4 },
  { code: 'MEC', name: 'Marine Environmental Chemistry', nameZh: '海洋环境化学', degree: '理学学士', duration: 4 },
  { code: 'PHY', name: 'Physics', nameZh: '物理学', degree: '理学学士', duration: 4 },
  { code: 'AIT', name: 'Artificial Intelligence', nameZh: '人工智能', degree: '工学学士', duration: 4 },
  { code: 'ENG', name: 'English Language and Literature', nameZh: '英语语言文学', degree: '文学学士', duration: 4 },
  { code: 'CYS', name: 'Cyber Security', nameZh: '网络安全', degree: '工学学士', duration: 4 },
  { code: 'DSC', name: 'Data Science', nameZh: '数据科学', degree: '理学学士', duration: 4 },
  { code: 'ECM', name: 'E-Commerce', nameZh: '电子商务', degree: '管理学学士', duration: 4 },
  { code: 'COM', name: 'Communication', nameZh: '传播学', degree: '文学学士', duration: 4 },
  { code: 'ERA', name: 'Robotics and Automation Engineering', nameZh: '机器人与自动化工程', degree: '工学学士', duration: 4 },
  { code: 'HMT', name: 'Hospitality Management', nameZh: '酒店管理', degree: '管理学学士', duration: 4 }
];

const MOCK_AC_TEACHERS = [
  '张老师', '李老师', '王老师', '陈老师', '赵老师', '刘老师', '黄老师', '周老师', '吴老师', '郑老师'
];

function buildProgrammesFromCatalog() {
  const programmes = {};
  PROGRAMME_CATALOG.forEach((row, idx) => {
    const key = row.code.toLowerCase();
    const schoolCode = PROGRAMME_SCHOOL_CODE_MAP[row.code];
    programmes[key] = {
      code: row.code,
      name: row.name,
      nameZh: row.nameZh,
      school: SCHOOL_NAME_MAP[schoolCode] || schoolCode,
      schoolCode,
      degree: row.degree,
      duration: row.duration,
      acTeacher: MOCK_AC_TEACHERS[idx % MOCK_AC_TEACHERS.length]
    };
  });
  return programmes;
}

var PROGRAMMES = buildProgrammesFromCatalog();
var SCHOOL_CODES = [...new Set(Object.values(PROGRAMME_SCHOOL_CODE_MAP))].sort();
