# Tasks

## 1. Product sign-off on matrix

- [ ] 1.1 Confirm glossary: prototype `teachingConfirmStatus=confirmed` equals「任务安排已提交 / 历史称授课确认」; record yes/no in design.md Open Questions closure note
- [ ] 1.2 Choose gate policy: keep「确认=生效门禁 + 仅教师替换旁路」vs remove confirm gate; write the choice into design.md Decisions
- [ ] 1.3 Choose collision policy for replacement vs withdraw/revert (design D3 default or freeze-withdraw); verify the chosen row appears in the impact matrix table

## 2. Codepath audit against matrix

- [ ] 2.1 List all writers of `teachingConfirmStatus` / `taskArrangementSubmittedAt` in `app.js` and map each to a matrix row; verify every writer is labeled submit / withdraw / roster-revert / plan-revert / demo-seed
- [ ] 2.2 List all readers/gates of `isMajorOfferingTaskArrangementSubmitted` (or equivalent) for 名单 / 开课清单 / 排课任务; verify each gate matches「未确认不可生效」except documented bypass
- [ ] 2.3 Trace教师替换审批生效路径; verify it updates teachers without calling `resetMajorOfferingTaskArrangementToDraft` / without forcing `pending`

## 3. Align behavior to signed matrix (only after 1.x)

- [ ] 3.1 If gate policy keeps confirm-as-gate: add/adjust guards so withdraw/roster-revert clear confirm and block生效 until re-submit; verify with a major section round-trip in the prototype
- [ ] 3.2 Enforce「撤回后不可仅靠教师替换旁路恢复 confirmed」; verify a pending-after-withdraw section stays pending after a simulated replacement apply
- [ ] 3.3 Keep「已排课不可撤回」block; verify alert still lists scheduled sections and confirm stays confirmed until schedule cleared then withdraw

## 4. Edge-case checklist

- [ ] 4.1 Walk 合班任务：未确认退回计划 → split; verify multi-line becomes single-batch plans and confirm pending
- [ ] 4.2 Walk 名单退回：confirm pending, roster kept, plan still submitted; verify 任务安排页可再提交
- [ ] 4.3 Note GE/special vs major deltas (or「same matrix」) in design.md after a skim of GE/other revert helpers; verify the note names any diverging function

## 5. Integration smoke

- [ ] 5.1 Run one happy path: 计划提交 → 任务安排提交 → 教师替换生效 → 确认仍为 confirmed；verify manifest/schedule still see the section
- [ ] 5.2 Run one clear path: 任务安排提交 → 撤回 → 改教师 → 再提交 → 再次 confirmed；verify生效 only after the second submit
