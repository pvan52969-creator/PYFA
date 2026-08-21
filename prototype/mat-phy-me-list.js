/** MAT & PHY 专业选修（ME）课表 — 来自《MAT & PHY - ME list.xlsx》
 * sheet「MAT ME」→ eligible mat；「PHY ME」→ eligible phy；同课号合并。
 * Group1 = 本专业开课；Group2 = 借用他专业课。
 * 注意：清单里的 eligible 仅反映 MAT/PHY 侧可修；写入校选池时还会并入开课专业本专业（见 buildSchoolElectiveCourseFromMatPhyMeItem）。
 */
var MAT_PHY_ME_LIST = [
  {
    "code": "BSC129",
    "name": "Discrete Mathematics",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "CST204",
    "name": "Data Structures",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "CST205",
    "name": "Digital Logic",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "CST207",
    "name": "Design and Analysis of Algorithms",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "CST301",
    "name": "Principles of Computer Composition",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "CST304",
    "name": "Digital Signal Processing",
    "credits": 4,
    "offeringProgrammeCode": "CST",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "FIN209",
    "name": "Monetary Policy and Financial Supervision",
    "credits": 4,
    "offeringProgrammeCode": "FIN",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "FIN303",
    "name": "Risk Management",
    "credits": 4,
    "offeringProgrammeCode": "FIN",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "IBU304",
    "name": "Global Logistics and Supply Chain Management",
    "credits": 4,
    "offeringProgrammeCode": "IBU",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "MAT107",
    "name": "Probability Theory",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "MAT110",
    "name": "Problem Solving Skills I",
    "credits": 2,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT203",
    "name": "Statistics",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "MAT205",
    "name": "Abstract Algebra II",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT207",
    "name": "Advanced Linear Algebra",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT208",
    "name": "General Topology",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT209",
    "name": "Combinatorics",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT210",
    "name": "Financial Mathematics I",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT212",
    "name": "Undergraduate Research",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT213",
    "name": "Problem Solving Skills II",
    "credits": 2,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT214",
    "name": "Data Analysis",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT301",
    "name": "Partial Differential Equations",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT302",
    "name": "Numerical Analysis",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT303",
    "name": "Differential Geometry of Curves and Surfaces",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group1 / PHY - Group 2",
    "remark": "MAT - Group1 / PHY - Group 2"
  },
  {
    "code": "MAT304",
    "name": "Real Analysis",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT305",
    "name": "Complex Analysis II",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT306",
    "name": "Differentiable Manifolds",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group1 / PHY - Group 2",
    "remark": "MAT - Group1 / PHY - Group 2"
  },
  {
    "code": "MAT307",
    "name": "Algebraic and Geometric Topology",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group1 / PHY - Group 2",
    "remark": "MAT - Group1 / PHY - Group 2"
  },
  {
    "code": "MAT308",
    "name": "Matrix Groups",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group1 / PHY - Group 2",
    "remark": "MAT - Group1 / PHY - Group 2"
  },
  {
    "code": "MAT309",
    "name": "Matrix Theory",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT310",
    "name": "Analytic Number Theory",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT311",
    "name": "Algebraic Number Theory",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT312",
    "name": "Dynamical Systems",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group1 / PHY - Group 2",
    "remark": "MAT - Group1 / PHY - Group 2"
  },
  {
    "code": "MAT313",
    "name": "Stochastic Processes",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT314",
    "name": "Regression Analysis",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT315",
    "name": "Time Series",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT317",
    "name": "Financial Mathematics II",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT318",
    "name": "Financial Mathematics III",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT321",
    "name": "Computational Physics",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT322",
    "name": "Problem Solving Skills III",
    "credits": 2,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT323",
    "name": "Bayesian Statistics",
    "credits": 3,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT324",
    "name": "Multivariate Statistical Analysis",
    "credits": 3,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT326",
    "name": "Algebraic Topology",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT327",
    "name": "Analysis and Manifolds",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "MAT328",
    "name": "Classical Algebraic Geometry",
    "credits": 4,
    "offeringProgrammeCode": "MAT",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group1",
    "remark": "MAT - Group1"
  },
  {
    "code": "PHY101",
    "name": "Mechanics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY102",
    "name": "Thermal Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY103",
    "name": "Electromagnetism",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY104",
    "name": "Modern Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY201",
    "name": "Theoretical Mechanics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY202",
    "name": "Quantum Mechanics I",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY204",
    "name": "Electrodynamics I",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY208",
    "name": "Astronomy",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY209",
    "name": "Electronic Circuits",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY210",
    "name": "Undergraduate Research I",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY301",
    "name": "Thermodynamics and Statistical Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "PHY305",
    "name": "Electrodynamics II",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY306",
    "name": "Solid State Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY307",
    "name": "Astrophysics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY308",
    "name": "Atomic and Molecular Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY309",
    "name": "Photonics and Optoelectronics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY310",
    "name": "Quantum Mechanics II",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY311",
    "name": "Mathematical Methods in Physics II",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY312",
    "name": "Quantum Information",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY402",
    "name": "Cosmology",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY403",
    "name": "Nuclear and Particle Physics",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY404",
    "name": "Semiconductor Physics and Devices",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY405",
    "name": "Relativity",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 1",
    "remark": "MAT - Group2 / PHY - Group 1"
  },
  {
    "code": "PHY406",
    "name": "Nanoscience and Nanotechnology",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY407",
    "name": "Machine Learning for Physicists",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "PHY408",
    "name": "Data Intensive Science",
    "credits": 4,
    "offeringProgrammeCode": "PHY",
    "offeringUnitAbbr": "SMP",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 1",
    "remark": "PHY - Group 1"
  },
  {
    "code": "SEM103",
    "name": "Principles of Accounting",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SEM106",
    "name": "Principles of Management",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "SEM107",
    "name": "Microeconomics",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "SEM108",
    "name": "Macroeconomics",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "SEM202",
    "name": "Principles of Finance",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "mat",
      "phy"
    ],
    "groupRemark": "MAT - Group2 / PHY - Group 2",
    "remark": "MAT - Group2 / PHY - Group 2"
  },
  {
    "code": "SEM206",
    "name": "Statistics for Business",
    "credits": 4,
    "offeringProgrammeCode": "",
    "offeringUnitAbbr": "SEM",
    "eligibleProgrammeKeys": [
      "phy"
    ],
    "groupRemark": "PHY - Group 2",
    "remark": "PHY - Group 2"
  },
  {
    "code": "SOF103",
    "name": "C and C++ Programming",
    "credits": 4,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SOF106",
    "name": "Principles of Artificial Intelligence",
    "credits": 3,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SOF108",
    "name": "Computer Architecture",
    "credits": 3,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SOF201",
    "name": "Operating Systems",
    "credits": 4,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SOF202",
    "name": "Database",
    "credits": 4,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  },
  {
    "code": "SWE404",
    "name": "Big Data Analytics",
    "credits": 3,
    "offeringProgrammeCode": "SWE",
    "offeringUnitAbbr": "SCDS",
    "eligibleProgrammeKeys": [
      "mat"
    ],
    "groupRemark": "MAT - Group2",
    "remark": "MAT - Group2"
  }
];
