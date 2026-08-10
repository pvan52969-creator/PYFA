<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #3B82F6, #10B981) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 10 }}>
    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>作品完整度与交付价值</Text>
      <Text style={{ fontSize: 14, color: '#3B82F6' }}>评分维度二 · 30分</Text>
    </Box>
  </Box>

  {/* B区 — 四维度 */}
  <Box style={{ flex: 1, gap: 14 }}>
    <Box style={{ flexDirection: 'row', gap: 14, flex: 1 }}>
      {[
        { icon: 'check-double', title: '业务场景覆盖', value: '14+', sub: '子模块', desc: '开课时间设置、校选课程、特殊课程、开课计划、开课安排、开课名单、通识选修、授课确认、教师替换等全场景', color: '#3B82F6' },
        { icon: 'tasks', title: '功能完整度', value: '100%', sub: '核心流程', desc: '从开课计划生成→教学任务修改→分组工作台→名单管理→授课确认，完整业务闭环', color: '#8B5CF6' },
      ].map((item, i) => (
        <Box key={i} style={{ flex: 1, background: '#131C3D', borderRadius: 14, padding: '20px 24px', borderTop: `3px solid ${item.color}`, gap: 12 }}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FAIcon name={item.icon} style={{ fill: item.color, width: 22, height: 22 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{item.title}</Text>
          </Box>
          <Box style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ fontSize: 42, fontWeight: 'bold', color: item.color, lineHeight: 1 }}>{item.value}</Text>
            <Text style={{ fontSize: 16, color: '#94A3B8' }}>{item.sub}</Text>
          </Box>
          <Text style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{item.desc}</Text>
        </Box>
      ))}
    </Box>

    <Box style={{ flexDirection: 'row', gap: 14, flex: 1 }}>
      {[
        { icon: 'file-alt', title: '文档完整性', value: '3 版', sub: '格式', desc: '用户操作手册覆盖 Word / PDF / HTML 三种格式，含30张截图、14+模块操作指南、FAQ', color: '#10B981' },
        { icon: 'globe-asia', title: '多项目复用', value: '2 项目', sub: '已验证', desc: '通用开课系统 + 马来XMU定制项目，三语国际化（中/英/马来），数据权限定制化适配', color: '#F59E0B' },
      ].map((item, i) => (
        <Box key={i} style={{ flex: 1, background: '#131C3D', borderRadius: 14, padding: '20px 24px', borderTop: `3px solid ${item.color}`, gap: 12 }}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FAIcon name={item.icon} style={{ fill: item.color, width: 22, height: 22 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{item.title}</Text>
          </Box>
          <Box style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ fontSize: 42, fontWeight: 'bold', color: item.color, lineHeight: 1 }}>{item.value}</Text>
            <Text style={{ fontSize: 16, color: '#94A3B8' }}>{item.sub}</Text>
          </Box>
          <Text style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{item.desc}</Text>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>09 / 13</Text>
  </Box>
</Slide>
