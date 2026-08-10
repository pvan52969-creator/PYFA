<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: 0, position: 'relative', overflow: 'hidden' }}>
  {/* 背景装饰 — 右上角大光晕 */}
  <Box style={{ position: 'absolute', top: -80, right: -120, width: 500, height: 500, borderRadius: 250, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
  {/* 背景装饰 — 左下几何 */}
  <Box style={{ position: 'absolute', bottom: 60, left: 40, width: 300, height: 300, background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
  {/* 网格线装饰 */}
  <svg style={{ position: 'absolute', top: 0, left: 0, width: 1280, height: 720, opacity: 0.04 }}>
    <svg viewBox='0 0 1280 720'>
      {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={1280} y2={i * 60} stroke='#3B82F6' strokeWidth={0.5} />)}
      {Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={720} stroke='#3B82F6' strokeWidth={0.5} />)}
    </svg>
  </svg>

  {/* 主内容区 — 垂直居中 */}
  <Box style={{ position: 'relative', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 90, paddingTop: 140 }}>
    {/* 顶部标签 */}
    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 }}>
      <Box style={{ width: 40, height: 3, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', borderRadius: 2 }} />
      <Text style={{ fontSize: 16, color: '#3B82F6', letterSpacing: 4, fontWeight: 'bold' }}>AI AGENT · 全流程开发</Text>
    </Box>

    {/* 主标题 */}
    <Text style={{
      fontSize: 64, fontWeight: 'bold', color: '#F1F5F9',
      lineHeight: 1.2, marginBottom: 10,
      textShadow: '0 0 40px rgba(59,130,246,0.3)',
    }}>
      AI赋能开课管理系统
    </Text>
    <Text style={{
      fontSize: 64, fontWeight: 'bold',
      backgroundImage: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
      backgroundClip: 'text',
      color: 'transparent',
      lineHeight: 1.2, marginBottom: 30,
    }}>
      全流程提效实战
    </Text>

    {/* 副标题 */}
    <Text style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 40 }}>
      产品 · 开发 · 测试 — AI Agent 7×24 自主作业，代码生成占比超 85%
    </Text>

    {/* 底部信息 */}
    <Box style={{ flexDirection: 'row', gap: 40, marginTop: 50 }}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FAIcon name='users' style={{ fill: '#3B82F6', width: 18, height: 18 }} />
        <Text style={{ fontSize: 14, color: '#64748B' }}>AI 参赛团队</Text>
      </Box>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FAIcon name='calendar' style={{ fill: '#3B82F6', width: 18, height: 18 }} />
        <Text style={{ fontSize: 14, color: '#64748B' }}>2026年8月</Text>
      </Box>
    </Box>
  </Box>

  {/* 底部渐变条 */}
  <Box style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)' }} />
</Slide>
