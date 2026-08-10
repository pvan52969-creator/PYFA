<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #8B5CF6, #10B981) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 15 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>前端 & 测试 — 从原型到交付</Text>
  </Box>

  {/* B区 上下分栏 */}
  <Box style={{ flex: 1, gap: 14 }}>
    {/* 上半部 55% 前端 */}
    <Box style={{ flex: 3, background: '#131C3D', borderRadius: 14, padding: '20px 24px', gap: 12 }}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <FAIcon name='desktop' style={{ fill: '#8B5CF6', width: 24, height: 24 }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8B5CF6' }}>前端开发</Text>
        <Text style={{ fontSize: 14, color: '#A78BFA' }}>— 原型即设计稿</Text>
      </Box>
      <Box style={{ flexDirection: 'row', gap: 16 }}>
        {/* 步骤流程 */}
        <Box style={{ flex: 1, gap: 10 }}>
          {[
            { icon: 'file-code', title: 'HTML原型解析', desc: 'AI分析可交互HTML，提取布局结构和交互逻辑' },
            { icon: 'cubes', title: '组件库映射', desc: '根据组件库规范，将原型元素映射为正式组件代码' },
            { icon: 'mobile-alt', title: '多端适配', desc: '自动处理响应式布局，适配PC/平板/移动端' },
          ].map((item, i) => (
            <Box key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(148,163,184,0.08)' : 'none' }}>
              <Box style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(139,92,246,0.15)', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <FAIcon name={item.icon} style={{ fill: '#8B5CF6', width: 18, height: 18 }} />
              </Box>
              <Box style={{ gap: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F1F5F9' }}>{item.title}</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8' }}>{item.desc}</Text>
              </Box>
            </Box>
          ))}
        </Box>
        {/* 产出物 */}
        <Box style={{ width: 260, gap: 10, justifyContent: 'center' }}>
          {['TypeScript + React 页面', '可复用业务组件', '统一主题 & 设计Token', '表单校验 & 状态管理'].map((t, i) => (
            <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FAIcon name='check' style={{ fill: '#10B981', width: 14, height: 14 }} />
              <Text style={{ fontSize: 13, color: '#E2E8F0' }}>{t}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* 下半部 45% 测试 */}
    <Box style={{ flex: 2, background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.04) 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(16,185,129,0.15)', gap: 12 }}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <FAIcon name='vial' style={{ fill: '#10B981', width: 24, height: 24 }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10B981' }}>自动测试</Text>
      </Box>
      <Box style={{ flexDirection: 'row', gap: 14 }}>
        {[
          { icon: 'list-alt', title: 'AI生成测试用例', desc: '根据功能点自动生成覆盖正常/异常/边界的测试场景' },
          { icon: 'play', title: 'AI执行测试', desc: '自动化运行全部用例，实时记录通过率与异常信息' },
          { icon: 'file-pdf', title: '输出测试报告', desc: '结构化测试报告，含通过率、问题清单与修复建议' },
        ].map((item, i) => (
          <Box key={i} style={{ flex: 1, background: 'rgba(16,185,129,0.06)', borderRadius: 10, padding: '14px 16px', gap: 6, alignItems: 'center' }}>
            <FAIcon name={item.icon} style={{ fill: '#10B981', width: 22, height: 22 }} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>{item.title}</Text>
            <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 1.4 }}>{item.desc}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>07 / 13</Text>
  </Box>
</Slide>
