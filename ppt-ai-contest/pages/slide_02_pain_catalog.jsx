<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '60px 70px 40px 70px' }}>
  {/* A区 标题块 */}
  <Box style={{ height: 100, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #3B82F6, #8B5CF6) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 10 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>传统开课管理的挑战</Text>
    <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>痛点驱动 · 目录导航</Text>
  </Box>

  {/* B区 内容区：左右分栏 */}
  <Box style={{ flexDirection: 'row', flex: 1, gap: 40 }}>
    {/* 左侧：3个痛点 */}
    <Box style={{ flex: 1, gap: 20 }}>
      {[
        { icon: 'clock', title: '需求响应慢', desc: '从需求梳理到原型落地，传统流程需 2-3 周，沟通成本高、反复修改多', color: '#F59E0B' },
        { icon: 'code', title: '开发周期长', desc: '前后端+测试全链路人工编码，易出错、难追溯，项目交付延期风险大', color: '#EF4444' },
        { icon: 'file', title: '文档维护难', desc: '需求文档、PRD、用户手册需人工编写，更新滞后，版本管理混乱', color: '#F97316' },
      ].map((item, i) => (
        <Box key={i} style={{
          background: '#131C3D', borderRadius: 12, padding: '20px 24px',
          borderLeft: `3px solid ${item.color}`, gap: 8
        }}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FAIcon name={item.icon} style={{ fill: item.color, width: 22, height: 22 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F1F5F9' }}>{item.title}</Text>
          </Box>
          <Text style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6 }}>{item.desc}</Text>
        </Box>
      ))}
    </Box>

    {/* 右侧：目录 */}
    <Box style={{ width: 340, background: '#131C3D', borderRadius: 14, padding: '24px 28px', gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6', marginBottom: 4 }}>路演目录</Text>
      {[
        { num: '01', label: 'AI全流程赋能全景', icon: 'globe' },
        { num: '02', label: '产品侧AI提效', icon: 'lightbulb' },
        { num: '03', label: '开发侧AI提效', icon: 'code' },
        { num: '04', label: '评分维度对标展示', icon: 'star' },
        { num: '05', label: '现场演示与总结', icon: 'play-circle' },
      ].map((item, i) => (
        <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(148,163,184,0.1)' : 'none' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#06B6D4', minWidth: 32 }}>{item.num}</Text>
          <FAIcon name={item.icon} style={{ fill: '#3B82F6', width: 16, height: 16 }} />
          <Text style={{ fontSize: 16, color: '#E2E8F0' }}>{item.label}</Text>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 页脚 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>02 / 13</Text>
  </Box>
</Slide>
