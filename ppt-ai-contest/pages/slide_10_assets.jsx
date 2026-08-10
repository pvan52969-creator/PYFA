<Slide style={{ width: 1280, height: 720, background: '#0A0E27', padding: '50px 70px 40px 70px' }}>
  {/* A区 */}
  <Box style={{ height: 80, borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #8B5CF6, #06B6D4) 1', paddingLeft: 20, justifyContent: 'center', marginBottom: 10 }}>
    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#F1F5F9' }}>沉淀资产价值</Text>
      <Text style={{ fontSize: 14, color: '#8B5CF6' }}>评分维度三 · 15分加分</Text>
    </Box>
  </Box>

  {/* B区 非对称双栏 */}
  <Box style={{ flex: 1, flexDirection: 'row', gap: 24 }}>
    {/* 左 60% Skill清单 */}
    <Box style={{ flex: 3, gap: 14 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8B5CF6' }}>可复用 AI Skill 资产库</Text>
      <Box style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {[
          { icon: 'database', label: 'MySQL数据库设计', color: '#3B82F6' },
          { icon: 'code', label: 'RESTful API生成', color: '#06B6D4' },
          { icon: 'react', label: 'React组件开发', color: '#8B5CF6' },
          { icon: 'vial', label: '自动化测试', color: '#10B981' },
          { icon: 'language', label: '三语国际化', color: '#F59E0B' },
          { icon: 'lock', label: 'RBAC权限控制', color: '#EF4444' },
          { icon: 'sign-in-alt', label: 'JWT登录校验', color: '#3B82F6' },
          { icon: 'history', label: '操作日志追踪', color: '#8B5CF6' },
          { icon: 'file-alt', label: 'PRD文档生成', color: '#06B6D4' },
          { icon: 'book', label: '用户手册生成', color: '#10B981' },
          { icon: 'desktop', label: '原型→前端转换', color: '#F59E0B' },
          { icon: 'tasks', label: '任务拆解编排', color: '#3B82F6' },
        ].map((skill, i) => (
          <Box key={i} style={{
            width: '30%', background: 'rgba(139,92,246,0.06)',
            borderRadius: 10, padding: '12px 14px',
            flexDirection: 'row', alignItems: 'center', gap: 10,
            border: `1px solid rgba(${skill.color === '#3B82F6' ? '59,130,246' : skill.color === '#06B6D4' ? '6,182,212' : skill.color === '#8B5CF6' ? '139,92,246' : skill.color === '#10B981' ? '16,185,129' : skill.color === '#F59E0B' ? '245,158,11' : '239,68,68'},0.12)`,
          }}>
            <FAIcon name={skill.icon} style={{ fill: skill.color, width: 18, height: 18 }} />
            <Text style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 'bold' }}>{skill.label}</Text>
          </Box>
        ))}
      </Box>
    </Box>

    {/* 右40% 价值 */}
    <Box style={{ flex: 2, gap: 14, justifyContent: 'center' }}>
      <Box style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.1) 0%, transparent 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(139,92,246,0.2)', gap: 10, alignItems: 'center' }}>
        <FAIcon name='sync-alt' style={{ fill: '#8B5CF6', width: 28, height: 28 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>跨项目复用</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
          通用开课系统 → 马来XMU定制项目，Skill直接复用，仅需少量项目级配置调整
        </Text>
      </Box>

      <Box style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.1) 0%, transparent 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(6,182,212,0.2)', gap: 10, alignItems: 'center' }}>
        <FAIcon name='plug' style={{ fill: '#06B6D4', width: 28, height: 28 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>即插即用</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
          每个Skill独立封装，Agent自动按需调度，新项目可快速搭建开发框架
        </Text>
      </Box>

      <Box style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.1) 0%, transparent 100%)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(16,185,129,0.2)', gap: 10, alignItems: 'center' }}>
        <FAIcon name='users' style={{ fill: '#10B981', width: 28, height: 28 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center' }}>团队赋能</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 }}>
          Agent调度技巧文档 + Skill清单，团队成员可快速掌握AI辅助开发模式
        </Text>
      </Box>
    </Box>
  </Box>

  {/* C区 */}
  <Box style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
    <Text style={{ fontSize: 14, color: '#64748B' }}>AI大赛 · 开课管理系统</Text>
    <Text style={{ fontSize: 14, color: '#64748B' }}>10 / 13</Text>
  </Box>
</Slide>
