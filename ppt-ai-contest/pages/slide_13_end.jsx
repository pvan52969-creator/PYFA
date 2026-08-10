<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: 0, position: 'relative', overflow: 'hidden' }}>
  {/* 背景装饰 */}
  <Box style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, borderRadius: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
  <Box style={{ position: 'absolute', top: -60, left: -60, width: 350, height: 350, borderRadius: 175, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />

  {/* 网格 */}
  <svg style={{ position: 'absolute', top: 0, left: 0, width: 1280, height: 720, opacity: 0.03 }}>
    <svg viewBox='0 0 1280 720'>
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={i * 60} x2={1280} y2={i * 60} stroke='#3B82F6' strokeWidth={0.5} />)}
      {Array.from({ length: 21 }, (_, i) => <line key={i} x1={i * 60} y1={0} x2={i * 60} y2={720} stroke='#3B82F6' strokeWidth={0.5} />)}
    </svg>
  </svg>

  {/* 主内容 */}
  <Box style={{ position: 'relative', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30 }}>
    {/* 金句 */}
    <Text style={{
      fontSize: 48, fontWeight: 'bold',
      backgroundImage: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
      backgroundClip: 'text',
      color: 'transparent',
      textAlign: 'center',
      lineHeight: 1.3,
      maxWidth: 800,
    }}>
      AI 不是替代开发者，
    </Text>
    <Text style={{
      fontSize: 48, fontWeight: 'bold',
      textAlign: 'center', lineHeight: 1.3, maxWidth: 800,
      color: '#F1F5F9',
    }}>
      而是让一个人完成一个团队的产出。
    </Text>

    {/* 装饰分割线 */}
    <Box style={{ width: 80, height: 3, background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)', borderRadius: 2 }} />

    {/* 感谢 */}
    <Text style={{ fontSize: 24, color: '#94A3B8', marginTop: 20 }}>感谢聆听 · 欢迎体验</Text>

    {/* 底部联系信息 */}
    <Box style={{ flexDirection: 'row', gap: 40, marginTop: 30 }}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FAIcon name='users' style={{ fill: '#64748B', width: 16, height: 16 }} />
        <Text style={{ fontSize: 14, color: '#64748B' }}>AI 参赛团队</Text>
      </Box>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FAIcon name='calendar' style={{ fill: '#64748B', width: 16, height: 16 }} />
        <Text style={{ fontSize: 14, color: '#64748B' }}>2026年8月</Text>
      </Box>
    </Box>
  </Box>

  {/* 底部渐变条 */}
  <Box style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #3B82F6)' }} />
</Slide>
