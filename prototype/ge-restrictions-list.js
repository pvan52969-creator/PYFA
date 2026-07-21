/**
 * GE 校选课主数据（含专业限制）
 * 来源：参考文档/2、开课管理&排课管理/副本【AA use only】GE with Restrictions List.xlsx
 * 图例：灰底 = 不可选；红星(*) = 满足条件才可选；全白 = 无条件可选
 * 课程号均为 G 开头；开课单位按 GE Field 映射（Arts→SASS / Business→SEM / Science→SMP）
 */
var GE_RESTRICTIONS_LIST = [
  {
    "code": "G0102",
    "name": "Cross-Cultural Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0103",
    "name": "Psychology of Interpersonal Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0104",
    "name": "Introduction to International Politics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0105",
    "name": "English Drama",
    "credits": 4,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT offered to students who have already earned credit for course G1126 English Drama (3 credits)."
  },
  {
    "code": "G0106",
    "name": "Film Appreciation: Introduction to Cinema",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0108",
    "name": "The Drama and Theater of China: From Classical to Contemporary",
    "credits": 4,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0110",
    "name": "Operations Research",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ecm",
      "fin",
      "ibu"
    ]
  },
  {
    "code": "G0111",
    "name": "Elementary Number Theory",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0112",
    "name": "Introduction to Discrete Mathematics",
    "credits": 4,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "dmt",
      "mat",
      "phy",
      "swe"
    ]
  },
  {
    "code": "G0114",
    "name": "American Society and Culture",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0115",
    "name": "The Presidents in American History: From F.D.Roosevelt to Barack  Obama",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0116",
    "name": "Introduction to Data Analytics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "dsc",
      "mat"
    ]
  },
  {
    "code": "G0117",
    "name": "Speech Communications",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "ege"
    ],
    "remark": "*This course is compulsory for EGE students and cannot be selected as a General Elective."
  },
  {
    "code": "G0118",
    "name": "Success Strategies",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0119",
    "name": "Introduction to Sociology",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0120",
    "name": "Diversity, Gender and Society",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0121",
    "name": "Introduction to Linear Algebra",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "cys",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "phy"
    ]
  },
  {
    "code": "G0123",
    "name": "Mathematical Graphics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0124",
    "name": "Introduction to Chinese Language I",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT offered to: \n•Students from China\n•International students who have passed HSK Level 1 or possess equivalent language proficiency\n•Malaysian students who have passed Chinese language subjects in the SPM, UEC, IGCSE, IB or A Level examinations"
  },
  {
    "code": "G0125",
    "name": "Introduction to Global Mandarin",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0127",
    "name": "Positive Psychology",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0128",
    "name": "Art and Science",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0129",
    "name": "Protection of Innovation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "mbt"
    ]
  },
  {
    "code": "G0131",
    "name": "Communication Skills for Job Search",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0132",
    "name": "Basic Korean Language",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0135",
    "name": "Probability and Statistics in Real Life",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "dsc",
      "mat"
    ]
  },
  {
    "code": "G0138",
    "name": "Introduction to German Language I",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to students with no prior knowledge of German language."
  },
  {
    "code": "G0139",
    "name": "Languages of Malaysia",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0140",
    "name": "Languages and Writings of the World",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0142",
    "name": "Art Appreciation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0143",
    "name": "Digital Publishing",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0144",
    "name": "History of Art",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0145",
    "name": "Introduction to Creative Typography Design",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0146",
    "name": "Multimedia Storytelling",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0147",
    "name": "Acting and Appreciation of Theatre",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0148",
    "name": "Car Culture",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0150",
    "name": "Principles of Public Relations",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0151",
    "name": "Visual Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0153",
    "name": "Social Media & Digital Communities",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0155",
    "name": "Introduction to Western Philosophy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0156",
    "name": "Cinematic Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0160",
    "name": "Relationship Marketing",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT offered to year 1 students"
  },
  {
    "code": "G0162",
    "name": "Political Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0163",
    "name": "Chinese Epigraphy in Southeast Asia",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0166",
    "name": "Public Speaking",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0167",
    "name": "#mysocialmediapresence",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0168",
    "name": "The Art of Online Shop Management",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0169",
    "name": "Occupational Safety And Health At Workplace",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0171",
    "name": "Disaster Empathy and Management",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0173",
    "name": "New Media: Digital, Activism and Society",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0174",
    "name": "Design Management",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0179",
    "name": "Chinese Seal Carving: Appreciation and Practice",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*Native proficiency in Chinese, or demonstrated ability in Chinese listening, reading, and writing; possession of SPM Chinese, UEC Chinese, or an equivalent qualification"
  },
  {
    "code": "G0180",
    "name": "Mathematical Theory of Games",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0182",
    "name": "The Four Great Classical Novels of Chinese Literature and Drama Series",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0183",
    "name": "Introduction to Building Lighting",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0184",
    "name": "Technical Writing",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0185",
    "name": "Introduction to Epistemology",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0189",
    "name": "Beginning French Language",
    "credits": 4,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to students with little or no prior knowledge of French language or culture."
  },
  {
    "code": "G0190",
    "name": "Geographical Information Systems (GIS)  for Digital Humanities",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0192",
    "name": "Culturology of Chinese Characters",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*Intermediate to advanced proficiency in Chinese"
  },
  {
    "code": "G0193",
    "name": "Malaysian Literature in English",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0194",
    "name": "Cyberpsychology",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0195",
    "name": "Scientific Communication",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0196",
    "name": "Communication and Law in Malaysia",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0197",
    "name": "English Novels and Short Stories",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0198",
    "name": "Philosophy and Education",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0199",
    "name": "Leadership with Fun",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G0201",
    "name": "Principles of Economics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ],
    "conditionalProgrammeKeys": [
      "mat",
      "phy"
    ],
    "remark": "*This course is NOT offered to MAT and PHY students who have already taken SEM107 Microeconomics or/and SEM108 Macroeconomics as a Major Elective."
  },
  {
    "code": "G0202",
    "name": "Principles of Marketing",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0204",
    "name": "Business and Administrative Communication",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0205",
    "name": "International Investment Law",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0206",
    "name": "Principles of Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ],
    "conditionalProgrammeKeys": [
      "ege",
      "phy"
    ],
    "remark": "*(1) This course is compulsory for EGE students and cannot be selected as a General Elective. \n(2) This course is NOT offered to PHY students who have already taken SEM106 Principles of Management as a Major Elective."
  },
  {
    "code": "G0208",
    "name": "Introduction to Finance",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ],
    "conditionalProgrammeKeys": [
      "mat",
      "phy"
    ],
    "remark": "*This course is NOT offered to MAT and PHY students who have already taken SEM202 Principles of Finance as a Major Elective."
  },
  {
    "code": "G0209",
    "name": "Introduction to Entrepreneurship",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0210",
    "name": "Introduction to Personal Financial Planning",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0211",
    "name": "Introduction to Advanced Mathematics I",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dsc",
      "eee",
      "ege",
      "mat",
      "mbt",
      "mec",
      "phy"
    ]
  },
  {
    "code": "G0212",
    "name": "Introduction to Advanced Mathematics II",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cst",
      "cys",
      "dsc",
      "eee",
      "ege",
      "mat",
      "mbt",
      "mec",
      "phy"
    ],
    "conditionalProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "cme",
      "dmt",
      "swe",
      "tcm"
    ],
    "remark": "*Pre-requisite: G0211 Introduction to Advanced Mathematics I or BSC112 Engineering Mathematics I"
  },
  {
    "code": "G0215",
    "name": "The Malaysian Economy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0216",
    "name": "Accounting for Decision Making",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0218",
    "name": "Introduction to Legal Studies",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0219",
    "name": "Financial Analysis",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0220",
    "name": "Introduction to Operations Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0221",
    "name": "Business Strategy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ],
    "conditionalProgrammeKeys": [
      "ege"
    ],
    "remark": "*This course is compulsory for EGE students and cannot be selected as a General Elective."
  },
  {
    "code": "G0223",
    "name": "Introduction to Organizational Behaviour",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0224",
    "name": "Critical Thinking Skills",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0226",
    "name": "Auditing for Beginners",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0227",
    "name": "Introduction to FinTech",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0228",
    "name": "Fundamentals of Digital Marketing",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0230",
    "name": "Fundamentals of Contract Law",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0231",
    "name": "Entrepreneurship and Sustainable Development",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0233",
    "name": "Environmental Economics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0234",
    "name": "Python Programming in Business",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0235",
    "name": "Microfinance and development",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0236",
    "name": "Introduction to Enterprise Risk Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0237",
    "name": "Introduction to Corporate Financial Issues",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0239",
    "name": "Real Estate Principles",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0240",
    "name": "Introduction to Malaysian Taxation",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0241",
    "name": "Economics and Society",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0242",
    "name": "Introduction to Intellectual Property Law",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0243",
    "name": "Accounting and Ethics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0244",
    "name": "Fundamentals of Research Methods",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0245",
    "name": "Chinese Economy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0246",
    "name": "Fundamentals of Supply Chain and Logistics Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0247",
    "name": "Introduction to International Business",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0248",
    "name": "Introduction to Human Resource Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0249",
    "name": "Principles of Health Economics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0250",
    "name": "Fundamentals of Electronic Commerce",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0251",
    "name": "Foundations of Business Analytics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0252",
    "name": "Introduction to Business Ethics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0253",
    "name": "Blockchain Finance",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu"
    ]
  },
  {
    "code": "G0302",
    "name": "Web Site Design",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0307",
    "name": "Environmental Problems and Environmental Awareness",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "conditionalProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "mat"
    ],
    "remark": "*This course is offered ONLY to second year and above students."
  },
  {
    "code": "G0308",
    "name": "Energy Materials and Technology",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0311",
    "name": "Physics in Movies",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0314",
    "name": "A Brief History of Astronomy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0316",
    "name": "Introduction to Marine Animals",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0317",
    "name": "Computer Skills for Beginners",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0319",
    "name": "Climate Change and Your Future",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0320",
    "name": "Biomedical Revolution: Towards Better Life",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0321",
    "name": "Imagined Futures of Technology and Society",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0325",
    "name": "Drugs, Society, and Human Behavior",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0327",
    "name": "Chemistry Is Everywhere I",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0328",
    "name": "Chemistry in Materials",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0330",
    "name": "Science Handcraft",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0331",
    "name": "Engineering Innovations",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0334",
    "name": "What's on your plate? Food technologies around the world",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0335",
    "name": "Understanding Evolution",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0336",
    "name": "Data Management and Artificial Intelligence",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0338",
    "name": "There's Plenty of Room at the Bottom",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0339",
    "name": "First Step into MATLAB for undergraduates",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0340",
    "name": "Bakery Engineering",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0341",
    "name": "Globalization and Sustainable Development",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0342",
    "name": "Nanotech-the small things for fun",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0343",
    "name": "Application and method of TCM massage and scraping health care",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0344",
    "name": "Empowering Your Life Through Solar Energy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0345",
    "name": "What's in a Chemical Plant?",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0346",
    "name": "Aquariums and the Breeding of Aquatic Organisms",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0347",
    "name": "Computer Aided Research and Presentation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0349",
    "name": "Brief History of Biomedical Revolution",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0352",
    "name": "Waste and Energy from a Global Perspective",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0353",
    "name": "Introduction to Chinese Medicine",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0355",
    "name": "Introduction to Remote Sensing",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0356",
    "name": "Carbon Management for Sustainable Environment",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0357",
    "name": "Fundamental of Forensic Science",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0358",
    "name": "Practical Printed Circuit Board Design",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0359",
    "name": "Water Motions in the Global Ocean",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0360",
    "name": "Electronic Automation Systems",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0361",
    "name": "Sensors for Modern Day Applications",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0362",
    "name": "Science and Nature",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0363",
    "name": "Engineering Disaster Management",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0364",
    "name": "Save Our Earth with New Energy!",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0365",
    "name": "Gesture Recognition",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0366",
    "name": "Wireless Technology for Preserving the Environment",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0367",
    "name": "Energy Demand Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0368",
    "name": "Introduction to IT",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0369",
    "name": "Nature’s Mysteries and Scientific Inventions",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0371",
    "name": "The Magic of Semiconductor Technology",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0372",
    "name": "Beyond the Stars: Exploring the Mysteries of the Universe",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0373",
    "name": "Introduction to Nutrition Therapy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0374",
    "name": "Foundation Nutrition",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0375",
    "name": "Fundamentals of Artificial Intelligence (AI)",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "conditionalProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "mat"
    ],
    "remark": "*This course is offered ONLY to Business, Mathematics and Arts & Social Sciences programs second-year and above students"
  },
  {
    "code": "G0376",
    "name": "Food and Nutrition",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0377",
    "name": "Chemistry and the Environment",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0378",
    "name": "Fish Collection and Preservation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0379",
    "name": "Environmental Pollution and Society",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0380",
    "name": "Introduction to Aquatic Vaccines and Therapeutics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0381",
    "name": "The Immune System and Health of Animal",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0382",
    "name": "Travel for Science: Discover Science Around the Globe",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0383",
    "name": "Innovation and Design Thinking",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0384",
    "name": "Fundamentals of Safety and Disaster Engineering",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0385",
    "name": "From Physics to Finance: Quantitative Finance",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0386",
    "name": "Vibrations in Technology and Everyday Life",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0387",
    "name": "Introduction to Digital Design",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0388",
    "name": "Industrial Mathematics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0389",
    "name": "Exploring Artificial Intelligence with Python",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0390",
    "name": "Engineering Logic and Design",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G0391",
    "name": "New Energy for a Sustainable Earth",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "conditionalProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "mat"
    ],
    "remark": "*This course is NOT available to students who have already completed G0364 Save Our Earth with New Energy!"
  },
  {
    "code": "G1100",
    "name": "Media and Representations",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1101",
    "name": "Creative Writing in Literature and Art",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1102",
    "name": "The Art of Invisibility Science",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1103",
    "name": "Literary Narration in the Three Kingdoms in Malay",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course requires language proficiency in Malay"
  },
  {
    "code": "G1104",
    "name": "Fundamental of Mathematics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "ege",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ]
  },
  {
    "code": "G1105",
    "name": "Reading and Writing About Films",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1108",
    "name": "Fascinating Fermentation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1109",
    "name": "Introduction to Machine Learning with Python",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "era",
      "mat",
      "phy",
      "swe"
    ],
    "conditionalProgrammeKeys": [
      "cme",
      "ege",
      "mbt",
      "mec",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to second year and above students"
  },
  {
    "code": "G1110",
    "name": "Introduction to Chatbot Design and Implementation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "era",
      "mat",
      "phy",
      "swe"
    ]
  },
  {
    "code": "G1112",
    "name": "Fun of Mushroom Growing",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1114",
    "name": "Art Is Therapy",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1115",
    "name": "Healthy and Effective Relationships",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1117",
    "name": "The History and Culture of Football Games",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*Note: Students must bring their own sports shoes and football boots"
  },
  {
    "code": "G1118",
    "name": "A Brief Introduction to Chinese Philosophy",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*Chinese language proficiency at HSK Level 4 or an equivalent level or above."
  },
  {
    "code": "G1119",
    "name": "Explore Biology with Art",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1120",
    "name": "Basics of Project Management for Software Development",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "swe"
    ]
  },
  {
    "code": "G1121",
    "name": "Medical Image Analysis using Python",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "mat",
      "phy",
      "swe"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "cme",
      "ege",
      "mbt",
      "mec",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to second year and above students"
  },
  {
    "code": "G1122",
    "name": "Technology and Culture: Science Fiction, Video Games and Social Media",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT available to students who have already completed G0134"
  },
  {
    "code": "G1123",
    "name": "Introduction to Logic",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1124",
    "name": "French for Communication",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to students with little or no prior knowledge of French language."
  },
  {
    "code": "G1125",
    "name": "Artificial Intelligence and Society",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1126",
    "name": "English Drama",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT offered to students who have already earned credit for course G0105 English Drama (4 credits)."
  },
  {
    "code": "G1127",
    "name": "Introduction to Text Analytics for Product Review Analysis",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn",
      "ait",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "mat",
      "phy",
      "swe"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "cme",
      "ege",
      "mbt",
      "mec",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to second year and above students"
  },
  {
    "code": "G1128",
    "name": "Designing Nature: AI, Atoms, and the Art of Simulation",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1129",
    "name": "Chinese for Management",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is ONLY offered to non-native Chinese speaker with Chinese language level of HSK level 4 and above"
  },
  {
    "code": "G1130",
    "name": "Business Chinese",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is ONLY offered to non-native Chinese speaker with Chinese language level of HSK level 3 and above"
  },
  {
    "code": "G1131",
    "name": "Practical Skills in English-Chinese Interpretation",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to native speakers of Mandarin. Non-native speakers may also enroll, provided they are able to understand and speak fluently in both English and Mandarin Chinese."
  },
  {
    "code": "G1132",
    "name": "Readings in World Modern Chinese Poetry",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*Students are required to have a Chinese language proficiency of at least HSK Level 5 or an equivalent level of competence (e.g. pass UEC / SPM Chinese)."
  },
  {
    "code": "G1133",
    "name": "Chinese–Malay Bidirectional Translation: Introduction and Practice",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is NOT available to students who have already completed G01107"
  },
  {
    "code": "G1134",
    "name": "Kitchen Hacks for Everyday Life",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1135",
    "name": "Western Classical Music: Theory, History and Practice",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1136",
    "name": "Introduction to Phonetics",
    "credits": 2,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  },
  {
    "code": "G1137",
    "name": "Agentic AI and Workflow Automation for Everyone",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ],
    "conditionalProgrammeKeys": [
      "acc",
      "ecm",
      "fin",
      "hmt",
      "ibu",
      "ait",
      "cme",
      "cst",
      "cys",
      "dmt",
      "dsc",
      "eee",
      "ege",
      "era",
      "mat",
      "mbt",
      "mec",
      "phy",
      "swe",
      "tcm"
    ],
    "remark": "*This course is offered ONLY to Business and Sciences programs second-year and above students.\nNote: Basic Understanding on Computing & Python"
  },
  {
    "code": "G1138",
    "name": "AI for Mathematics",
    "credits": 3,
    "geCategory": "arts",
    "offeringUnitAbbr": "SASS",
    "department": "School of Arts and Social Sciences",
    "excludedProgrammeKeys": [
      "adt",
      "chs",
      "cos",
      "eng",
      "jrn"
    ]
  }
];
