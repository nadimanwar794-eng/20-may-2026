const fs = require('fs');

const file = 'components/StudentDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Hide from normal place
const start = content.indexOf('{/* FEATURE LIMITS CARD */}');
const end = content.indexOf('          <div className="space-y-3 mt-4">', start);
const nextEnd = content.indexOf('            {/* General Menu Items */}', start);

if (start !== -1 && nextEnd !== -1) {
    let toReplace = content.substring(start, nextEnd);
    content = content.replace(toReplace, '');
}

const target = '                      <div className="p-4 bg-slate-50 border-t border-slate-100">';
const codeToInsert = `
                      {/* FEATURE LIMITS CARD MOVED HERE */}
                      {(() => {
                        const isUltra = user.isPremium && user.subscriptionLevel === 'ULTRA';
                        const isBasic = user.isPremium && user.subscriptionLevel === 'BASIC';
                        const htmlCost = settings?.htmlUnlockCost ?? 5;
                        const basicLimit = settings?.basicHtmlDailyLimit ?? 3;
                        const todayStr = new Date().toISOString().split('T')[0];
                        const basicUsed = isBasic
                          ? parseInt(localStorage.getItem(\`nst_basic_html_\${user.id}_\${todayStr}\`) || '0', 10)
                          : 0;
                        const basicLeft = Math.max(0, basicLimit - basicUsed);

                        type Row = { icon: string; label: string; value: string; pill: 'green' | 'blue' | 'red' | 'amber' };
                        const rows: Row[] = [
                          {
                            icon: '📝',
                            label: 'Notes / PDF / Video / Audio / MCQ',
                            value: isUltra ? 'Unlimited' : 'Ultra only',
                            pill: isUltra ? 'green' : 'red',
                          },
                          {
                            icon: '✍️',
                            label: 'Write Mode (HTML View)',
                            value: isUltra
                              ? 'Unlimited'
                              : isBasic
                                ? \`\${basicLeft} / \${basicLimit} free today\`
                                : \`\${htmlCost} CR per session\`,
                            pill: isUltra ? 'green' : isBasic ? (basicLeft > 0 ? 'blue' : 'amber') : 'amber',
                          },
                          {
                            icon: '💰',
                            label: 'Credits Balance',
                            value: \`\${user.credits || 0} CR\`,
                            pill: (user.credits || 0) >= 20 ? 'green' : (user.credits || 0) > 0 ? 'amber' : 'red',
                          },
                        ];

                        const pillStyle: Record<Row['pill'], string> = {
                          green: 'bg-emerald-100 text-emerald-700',
                          blue:  'bg-sky-100 text-sky-700',
                          amber: 'bg-amber-100 text-amber-700',
                          red:   'bg-rose-100 text-rose-600',
                        };

                        return (
                          <div className="bg-white border-t border-slate-200 shadow-sm overflow-hidden mt-4">
                            <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                              <span className="text-base">🔑</span>
                              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Your Feature Limits</p>
                            </div>
                            <div className="divide-y divide-slate-100">
                              {rows.map((r, i) => (
                                <div key={i} className="px-4 py-3 flex items-center gap-3">
                                  <span className="text-lg shrink-0">{r.icon}</span>
                                  <p className="flex-1 text-[11px] font-bold text-slate-600 leading-tight">{r.label}</p>
                                  <span className={\`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full \${pillStyle[r.pill]}\`}>
                                    {r.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {!isUltra && (
                              <div className="px-4 pb-3 pt-1">
                                <button
                                  onClick={() => { onTabChange('STORE'); setShowDotsMenu(false); }}
                                  className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-black active:scale-95 transition"
                                >
                                  Upgrade to Ultra — Unlock Everything
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
`;

content = content.replace(target, codeToInsert + "\n" + target);
fs.writeFileSync(file, content);
