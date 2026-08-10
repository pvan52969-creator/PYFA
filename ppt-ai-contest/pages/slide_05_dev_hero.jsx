<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #3B82F6, #06B6D4) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 15 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>开发侧 AI 提效</Text>
    <Text style={{ fontSize: 16, color: '#64748B', marginTop: 2 }}>AI Agent 7×24 自主完成数据库设计、接口开发、前端页面与测试</Text>
  </Box>

  {/* B区 — 大数字冲击 */}
  <Box style={{ flex: 1, flexDirection: 'row', gap: 24 }}>
    {/* 左侧：大数字 85% */}
    <Box style={{ width: 340, justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(6,182,212,0.05) 100%)', borderRadius: 20, border: '1px solid rgba(59,130,246,0.2)', padding: 30, gap: 20 }}>
      <Text style={{ fontSize: 120, fontWeight: 'bold', backgroundImage: 'linear-gradient(180deg, #06B6D4 0%, #3B82F6 100%)', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>85%</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>代码由 AI 生成</Text>
      <Box style={{ width: 60, height: 2, background: '#06B6D4', borderRadius: 1 }} />
      <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>后端接口、前端组件、<br />测试用例全链路覆盖</Text>
    </Box>

    {/* 右侧：三栏提效流程 */}
    <Box style={{ flex: 1, gap: 14 }}>
      {[
        { icon: 'database', title: '后端开发', steps: ['需求文档+原型 → AI拆解任务', 'AI生成数据库表结构设计', 'AI完成全部接口功能代码', '数据权限 / 登录校验 / 操作日志'], color: '#3B82F6', num: '01' },
        { icon: 'desktop', title: '前端开发', steps: ['可交互原型 → AI理解布局', '基于组件库生成正式页面', 'AI适配多端响应式布局', '三语（中/英/马来）国际化'], color: '#8B5CF6', num: '02' },
        { icon: 'vial', title: '测试验证', steps: ['AI根据功能点生成测试用例', '提交AI执行自动化测试', 'AI输出完整测试报告', 'Bug自动定位与修复建议'], color: '#10B981', num: '03' },
      ].map((section, si) => (
        <Box key={si} style={{ flex: 1, background: '#131C3D', borderRadius: 12, padding: '14px 20px', flexDirection: 'row', gap: 16, borderLeft: `3px solid ${section.color}` }}>
          <Box style={{ alignItems: 'center', gap: 6, minWidth: 44 }}>
            <Box style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${si === 0 ? '59,130,246' : si === 1 ? '139,92,246' : '16,185,129'},0.15)`, justifyContent: 'center', alignItems: 'center' }}>
              <FAIcon name={section.icon} style={{ fill: section.color, width: 20, height: 20 }} />
            </Box>
            <Text style={{ fontSize: 11, color: section.color, fontWeight: 'bold' }}>{section.num}</Text>
          </Box>
          <Box style={{ flex: 1, gap: 4, justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#F1F5F9' }}>{section.title}</Text>
            {section.steps.map((s, i) => (
              <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Box style={{ width: 4, height: 4, borderRadius: 2, background: section.color }} />
                <Text style={{ fontSize: 12, color: '#CBD5E1' }}>{s}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>05 / 13</Text>
  </Box>
</Slide>
