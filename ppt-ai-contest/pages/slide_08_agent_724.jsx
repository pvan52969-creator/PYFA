<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: 0, position: 'relative', overflow: 'hidden' }}>
  {/* 全幅背景装饰 */}
  <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 50%)' }} />

  {/* 网格 */}
  <svg style={{ position: 'absolute', top: 0, left: 0, width: 1280, height: 720, opacity: 0.03 }}>
    <svg viewBox='0 0 1280 720'>
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={i * 60} x2={1280} y2={i * 60} stroke='#06B6D4' strokeWidth={0.5} />)}
      {Array.from({ length: 21 }, (_, i) => <line key={i} x1={i * 60} y1={0} x2={i * 60} y2={720} stroke='#06B6D4' strokeWidth={0.5} />)}
    </svg>
  </svg>

  {/* 主内容 */}
  <Box style={{ position: 'relative', zIndex: 2, padding: '60px 80px', flex: 1 }}>
    {/* 顶部标签 */}
    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <Box style={{ width: 32, height: 3, background: '#06B6D4', borderRadius: 2 }} />
      <Text style={{ fontSize: 14, color: '#06B6D4', letterSpacing: 3, fontWeight: 'bold' }}>评分维度一 · 30分</Text>
    </Box>

    {/* 标题 */}
    <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#F1F5F9', lineHeight: 1.3, marginBottom: 30 }}>
      AI Agent 调度能力
    </Text>
    <Text style={{ fontSize: 22, color: '#94A3B8', marginBottom: 40 }}>
      7×24 小时自主作业 · 无人值守持续交付
    </Text>

    {/* 核心数据三块 */}
    <Box style={{ flexDirection: 'row', gap: 28 }}>
      <Box style={{ flex: 1, background: 'linear-gradient(180deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.03) 100%)', borderRadius: 18, border: '1px solid rgba(6,182,212,0.2)', padding: '28px 24px', alignItems: 'center', gap: 12 }}>
        <FAIcon name='clock' style={{ fill: '#06B6D4', width: 36, height: 36 }} />
        <Text style={{ fontSize: 72, fontWeight: 'bold', color: '#06B6D4', lineHeight: 1 }}>7×24</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>全天候自主作业</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>Agent发起任务→AI拆解→编码→测试→交付，全程无人值守</Text>
      </Box>

      <Box style={{ flex: 1, background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 100%)', borderRadius: 18, border: '1px solid rgba(59,130,246,0.2)', padding: '28px 24px', alignItems: 'center', gap: 12 }}>
        <FAIcon name='sitemap' style={{ fill: '#3B82F6', width: 36, height: 36 }} />
        <Text style={{ fontSize: 72, fontWeight: 'bold', color: '#3B82F6', lineHeight: 1 }}>100+</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>AI任务并行调度</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>多Agent协同、任务队列管理、自动优先级排序</Text>
      </Box>

      <Box style={{ flex: 1, background: 'linear-gradient(180deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 100%)', borderRadius: 18, border: '1px solid rgba(16,185,129,0.2)', padding: '28px 24px', alignItems: 'center', gap: 12 }}>
        <FAIcon name='sync-alt' style={{ fill: '#10B981', width: 36, height: 36 }} />
        <Text style={{ fontSize: 72, fontWeight: 'bold', color: '#10B981', lineHeight: 1 }}>100%</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>全流程覆盖</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>需求→设计→开发→测试→部署，端到端无断点</Text>
      </Box>
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ position: 'relative', zIndex: 2, height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 80px' }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>08 / 13</Text>
  </Box>

  {/* 底部渐变条 */}
  <Box style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, #06B6D4, #3B82F6, #8B5CF6)' }} />
</Slide>
