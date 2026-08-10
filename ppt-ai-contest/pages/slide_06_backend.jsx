<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #3B82F6, #06B6D4) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 15 }}>
    <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>后端开发 — AI 全栈交付</Text>
    <Text style={{ fontSize: 16, color: '#64748B', marginTop: 2 }}>基于PRD与交互原型拆解任务 → AI生成数据库设计、接口功能、全部实现代码</Text>
  </Box>

  {/* B区 */}
  <Box style={{ flex: 1, flexDirection: 'row', gap: 24 }}>
    {/* 左 30% — 标题栏 */}
    <Box style={{ width: 300, gap: 16, justifyContent: 'center' }}>
      <Box style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.15) 0%, transparent 100%)', borderRadius: 14, padding: 24, border: '1px solid rgba(59,130,246,0.2)', gap: 14 }}>
        <FAIcon name='server' style={{ fill: '#3B82F6', width: 36, height: 36 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F1F5F9' }}>AI 自动生成清单</Text>
        <Box style={{ width: 40, height: 2, background: '#3B82F6' }} />
        {['MySQL 数据库表结构', 'RESTful API 接口', '业务逻辑代码', '数据权限中间件', '登录校验 & JWT', '操作日志记录', '三语国际化适配'].map((t, i) => (
          <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FAIcon name='check-circle' style={{ fill: '#10B981', width: 14, height: 14 }} />
            <Text style={{ fontSize: 14, color: '#E2E8F0' }}>{t}</Text>
          </Box>
        ))}
      </Box>
    </Box>

    {/* 右70% — 流程+定制skill */}
    <Box style={{ flex: 1, gap: 14 }}>
      {/* 工作流程 */}
      <Box style={{ background: '#131C3D', borderRadius: 14, padding: '20px 24px', gap: 14 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3B82F6' }}>AI 开发工作流</Text>
        <Box style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {['需求文档\n输入', '任务\n拆解', '数据库\n设计', '接口\n生成', '代码\n联调', '部署\n交付'].map((label, i) => (
            <Box key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Box style={{ width: 52, height: 52, borderRadius: 26, background: i === 5 ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.12)', justifyContent: 'center', alignItems: 'center', border: `2px solid ${i === 5 ? '#10B981' : '#3B82F6'}40` }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: i === 5 ? '#10B981' : '#3B82F6' }}>0{i+1}</Text>
              </Box>
              <Text style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', whiteSpace: 'pre-line' }}>{label}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 定制化Skill */}
      <Box style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(139,92,246,0.2)', gap: 12 }}>
        <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <FAIcon name='puzzle-piece' style={{ fill: '#8B5CF6', width: 20, height: 20 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8B5CF6' }}>马来项目定制 Skill</Text>
        </Box>
        <Box style={{ flexDirection: 'row', gap: 14 }}>
          {[
            { label: '三语转换', desc: '中/英/马来自动互译' },
            { label: '数据权限', desc: '多角色RBAC控制' },
            { label: '登录校验', desc: 'JWT+统一鉴权' },
            { label: '操作日志', desc: '全链路行为追踪' },
          ].map((item, i) => (
            <Box key={i} style={{ flex: 1, background: 'rgba(139,92,246,0.08)', borderRadius: 10, padding: '12px 14px', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#C4B5FD' }}>{item.label}</Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>{item.desc}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>06 / 13</Text>
  </Box>
</Slide>
