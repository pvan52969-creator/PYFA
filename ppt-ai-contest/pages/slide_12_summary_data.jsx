<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 80px 40px 80px' }}>
  {/* A区 简化 */}
  <Box style={{ height: 60, justifyContent: 'center', marginBottom: 10 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>项目成果总览</Text>
  </Box>

  {/* B区 — 巨型数字 */}
  <Box style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
    {/* 一行三大数字 */}
    <Box style={{ flexDirection: 'row', gap: 32 }}>
      {[
        { num: '85%', label: '代码AI生成占比', sub: '前后端+测试全链路', color: '#06B6D4', icon: 'code' },
        { num: '3×', label: '产品端效率提升', sub: '2-3周 → 3-5天', color: '#8B5CF6', icon: 'rocket' },
        { num: '30+', label: '可复用AI Skill', sub: '跨项目即插即用', color: '#3B82F6', icon: 'puzzle-piece' },
      ].map((item, i) => (
        <Box key={i} style={{ flex: 1, background: '#131C3D', borderRadius: 18, padding: '28px 20px', border: `1px solid rgba(${item.color === '#06B6D4' ? '6,182,212' : item.color === '#8B5CF6' ? '139,92,246' : '59,130,246'},0.2)`, alignItems: 'center', gap: 14 }}>
          <FAIcon name={item.icon} style={{ fill: item.color, width: 32, height: 32 }} />
          <Text style={{ fontSize: 72, fontWeight: 'bold', color: item.color, lineHeight: 1 }}>{item.num}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{item.label}</Text>
          <Text style={{ fontSize: 13, color: '#64748B' }}>{item.sub}</Text>
        </Box>
      ))}
    </Box>

    {/* 底部一行两辅助数据 */}
    <Box style={{ flexDirection: 'row', gap: 32 }}>
      {[
        { num: '14+', label: '业务子模块', desc: '开课设置、专业开课、通识选修、授课确认、教师替换等全覆盖', icon: 'cubes' },
        { num: '100%', label: '端到端自动化', desc: '需求→设计→开发→测试→部署全链路AI驱动，无人值守交付', icon: 'sync-alt' },
      ].map((item, i) => (
        <Box key={i} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)', borderRadius: 14, padding: '20px 28px', flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <FAIcon name={item.icon} style={{ fill: '#3B82F6', width: 36, height: 36 }} />
          <Box style={{ flex: 1, gap: 4 }}>
            <Box style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#3B82F6' }}>{item.num}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{item.label}</Text>
            </Box>
            <Text style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{item.desc}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>12 / 13</Text>
  </Box>
</Slide>
