<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: `linear-gradient(180deg, '#10B981', '#3B82F6') 1`, paddingLeft: 20, justifyContent: 'center', marginBottom: 10 }}>
    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>自动化工程能力</Text>
      <Text style={{ fontSize: 14, color: '#10B981' }}>评分维度四 · 10分加分</Text>
    </Box>
  </Box>

  {/* B区 上下分栏 */}
  <Box style={{ flex: 1, gap: 16 }}>
    {/* 上半部 50% — 部署流程 */}
    <Box style={{ flex: 3, background: '#131C3D', borderRadius: 14, padding: '24px', gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10B981' }}>一键部署 & 持续交付流水线</Text>

      <Box style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        {[
          { icon: 'code-branch', label: '代码\n提交', color: '#3B82F6' },
          { icon: 'cogs', label: '自动\n构建', color: '#8B5CF6' },
          { icon: 'vial', label: '自动\n测试', color: '#06B6D4' },
          { icon: 'rocket', label: '一键\n部署', color: '#10B981' },
          { icon: 'check-circle', label: '交付\n就绪', color: '#F59E0B' },
        ].map((step, i) => (
          <Box key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 56, height: 56, borderRadius: 28, background: `rgba(${i === 0 ? '59,130,246' : i === 1 ? '139,92,246' : i === 2 ? '6,182,212' : i === 3 ? '16,185,129' : '245,158,11'},0.12)`, justifyContent: 'center', alignItems: 'center', border: `2px solid ${step.color}40` }}>
              <FAIcon name={step.icon} style={{ fill: step.color, width: 24, height: 24 }} />
            </Box>
            <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', whiteSpace: 'pre-line' }}>{step.label}</Text>
          </Box>
        ))}
      </Box>

      <Text style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>
        AI Agent 完成代码后自动触发构建流水线 → 运行全量测试 → 输出测试报告 → 环境一键部署。
        全程无需人工介入，从代码提交到生产就绪仅需数分钟。
      </Text>
    </Box>

    {/* 下半部 50% — 交付物 */}
    <Box style={{ flex: 2, flexDirection: 'row', gap: 14 }}>
      {[
        { icon: 'file-code', title: '完整源码', desc: '前端 + 后端 + 数据库脚本全部由AI生成并验证', color: '#3B82F6' },
        { icon: 'file-alt', title: 'PRD文档', desc: '产品需求文档含功能清单、字段说明、业务规则', color: '#8B5CF6' },
        { icon: 'book', title: '操作手册', desc: 'Word/PDF/HTML 三版用户操作手册含截图', color: '#10B981' },
      ].map((item, i) => (
        <Box key={i} style={{ flex: 1, background: 'rgba(16,185,129,0.04)', borderRadius: 12, padding: '18px 20px', border: `1px solid rgba(${item.color === '#3B82F6' ? '59,130,246' : item.color === '#8B5CF6' ? '139,92,246' : '16,185,129'},0.15)`, gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <FAIcon name={item.icon} style={{ fill: item.color, width: 28, height: 28 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>{item.desc}</Text>
        </Box>
      ))}
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>11 / 13</Text>
  </Box>
</Slide>
