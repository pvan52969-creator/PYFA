<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 标题块 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #06B6D4, #3B82F6) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 15 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>AI 全流程赋能全景图</Text>
  </Box>

  {/* B区 — 流程大图 */}
  <Box style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
    {/* 流程主轴 */}
    <Box style={{ flexDirection: 'row', alignItems: 'stretch', gap: 16, height: 240 }}>
      {/* 产品阶段 */}
      <Box style={{ flex: 1, background: 'linear-gradient(180deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 100%)', borderRadius: 16, border: '1px solid rgba(139,92,246,0.25)', padding: '20px 24px', gap: 12, justifyContent: 'center' }}>
        <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Box style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <FAIcon name='lightbulb' style={{ fill: '#8B5CF6', width: 20, height: 20 }} />
          </Box>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F1F5F9' }}>产品侧</Text>
        </Box>
        {['需求梳理 → AI文档', '动态可交互原型', 'PRD/用户操作手册'].map((t, i) => (
          <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Box style={{ width: 6, height: 6, borderRadius: 3, background: '#8B5CF6' }} />
            <Text style={{ fontSize: 15, color: '#C4B5FD' }}>{t}</Text>
          </Box>
        ))}
      </Box>

      {/* 箭头 */}
      <Box style={{ justifyContent: 'center', alignItems: 'center', width: 40 }}>
        <FAIcon name='arrow-right' style={{ fill: '#06B6D4', width: 28, height: 28 }} />
      </Box>

      {/* 开发阶段 */}
      <Box style={{ flex: 1, background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.25)', padding: '20px 24px', gap: 12, justifyContent: 'center' }}>
        <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Box style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <FAIcon name='code' style={{ fill: '#3B82F6', width: 20, height: 20 }} />
          </Box>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F1F5F9' }}>开发侧</Text>
        </Box>
        {['后端：DB+API+代码', '前端：组件库+原型→页面', '测试：用例→报告'].map((t, i) => (
          <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Box style={{ width: 6, height: 6, borderRadius: 3, background: '#3B82F6' }} />
            <Text style={{ fontSize: 15, color: '#93C5FD' }}>{t}</Text>
          </Box>
        ))}
      </Box>
    </Box>

    {/* 底部三卡片 */}
    <Box style={{ flexDirection: 'row', gap: 16, height: 170 }}>
      {[
        { icon: 'clock', num: '7×24', unit: '小时', label: 'Agent 自主作业', sub: '无人值守持续迭代', color: '#06B6D4', bgc: 'rgba(6,182,212,0.08)' },
        { icon: 'chart-line', num: '85%', unit: '', label: '代码AI生成占比', sub: '前后端+测试全覆盖', color: '#3B82F6', bgc: 'rgba(59,130,246,0.08)' },
        { icon: 'layer-group', num: '30+', unit: '', label: '可复用AI Skill', sub: '马来项目定制化扩展', color: '#8B5CF6', bgc: 'rgba(139,92,246,0.08)' },
      ].map((c, i) => (
        <Box key={i} style={{ flex: 1, background: '#131C3D', borderRadius: 14, padding: '20px 24px', border: `1px solid ${c.bgc}`, gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <FAIcon name={c.icon} style={{ fill: c.color, width: 24, height: 24 }} />
          <Box style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: c.color, lineHeight: 1 }}>{c.num}</Text>
            {c.unit && <Text style={{ fontSize: 18, color: c.color }}>{c.unit}</Text>}
          </Box>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{c.label}</Text>
          <Text style={{ fontSize: 13, color: '#64748B' }}>{c.sub}</Text>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>03 / 13</Text>
  </Box>
</Slide>
