<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #8B5CF6, #3B82F6) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 15 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>产品侧 AI 提效</Text>
    <Text style={{ fontSize: 16, color: '#64748B', marginTop: 2 }}>需求梳理 → 交互原型 → 产品文档 → 用户手册 全链路 AI 赋能</Text>
  </Box>

  {/* B区 非对称双栏 */}
  <Box style={{ flex: 1, flexDirection: 'row', gap: 30 }}>
    {/* 左侧 55% 流程图 */}
    <Box style={{ width: 620, gap: 24, justifyContent: 'center' }}>
      {/* 流程4步骤 */}
      {[
        { step: '01', icon: 'comments', title: '需求梳理', desc: 'AI对话式需求采集，自动结构化输出需求要点与业务规则', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
        { step: '02', icon: 'object-group', title: '交互原型', desc: '基于需求自动生成HTML可交互原型，实时预览、即时迭代', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
        { step: '03', icon: 'file-alt', title: '产品文档', desc: '自动输出PRD，含功能清单、字段说明、业务规则、状态流转', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
        { step: '04', icon: 'book', title: '用户手册', desc: '自动截图+排版，生成Word/PDF/HTML三版操作手册', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
      ].map((item, i) => (
        <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 18, background: item.bg, borderRadius: 12, padding: '16px 20px', borderLeft: `3px solid ${item.color}` }}>
          <Box style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <FAIcon name={item.icon} style={{ fill: item.color, width: 24, height: 24 }} />
          </Box>
          <Box style={{ flex: 1, gap: 4 }}>
            <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: item.color }}>{item.step}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9' }}>{item.title}</Text>
            </Box>
            <Text style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.5 }}>{item.desc}</Text>
          </Box>
        </Box>
      ))}
    </Box>

    {/* 右侧45% 效果数据 */}
    <Box style={{ flex: 1, gap: 16, justifyContent: 'center' }}>
      <Box style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 100%)', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(139,92,246,0.2)', gap: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 64, fontWeight: 'bold', backgroundImage: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>3×</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>效率提升</Text>
        <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>产品需求产出周期从 2-3 周缩短至 3-5 天</Text>
      </Box>

      <Box style={{ background: '#131C3D', borderRadius: 14, padding: '20px 24px', gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#06B6D4', marginBottom: 4 }}>关键产出物</Text>
        {['PRD 产品需求文档', '可交互 HTML 原型', '用户操作手册（3 版格式）', '完整业务流程图与FAQ'].map((t, i) => (
          <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FAIcon name='check-circle' style={{ fill: '#10B981', width: 16, height: 16 }} />
            <Text style={{ fontSize: 14, color: '#E2E8F0' }}>{t}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>04 / 13</Text>
  </Box>
</Slide>
