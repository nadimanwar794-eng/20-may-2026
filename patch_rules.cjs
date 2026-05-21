const fs = require('fs');

const file = 'components/StudentDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `            {/* WRITE MODE */}
            <div className="bg-white border border-teal-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-teal-50 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">✏️</span>
                <div>
                  <p className="font-black text-sm text-slate-800">Write Mode (HTML Notes)</p>
                  <p className="text-[10px] text-slate-500">Notes ka full rendered view — Deep Dive mein</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-red-500">{settings?.writeModeCreditFree ?? 5} coins</p>
                  <p className="text-[9px] text-slate-400 mt-1">Har baar</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-green-600">{settings?.writeModeFreeLimitBasic ?? 5} free/day</p>
                  <p className="text-[9px] text-slate-400 mt-1">Phir {settings?.writeModeCreditPaid ?? 10} coins</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-violet-600">{settings?.writeModeFreeLimitUltra ?? 10} free/day</p>
                  <p className="text-[9px] text-slate-400 mt-1">Phir {settings?.writeModeCreditPaid ?? 10} coins</p>
                </div>
              </div>
              <div className="px-4 pb-2.5">
                <p className="text-[9px] text-slate-400">📌 {settings?.writeModeMaxLimit ?? 20}+ uses/day hone ke baad sabke liye 20 coins per use</p>
              </div>
            </div>

            {/* HTML VIEWS */}
            <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-purple-50 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="font-black text-sm text-slate-800">HTML / Rich Notes View</p>
                  <p className="text-[10px] text-slate-500">Chunk notes ka full HTML rendered view</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-red-500">🔒 Locked</p>
                  <p className="text-[9px] text-slate-400 mt-1">Available nahi</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-amber-600">🔒 Locked</p>
                  <p className="text-[9px] text-slate-400 mt-1">Ultra chahiye</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-green-600">✅ Free</p>
                  <p className="text-[9px] text-slate-400 mt-1">Ultra users only</p>
                </div>
              </div>
            </div>`;

const newStr = `            {/* HTML VIEWS */}
            <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-purple-50 px-4 py-2.5 flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="font-black text-sm text-slate-800">Write Mode (HTML View)</p>
                  <p className="text-[10px] text-slate-500">Chunk notes ka full HTML rendered view</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-red-500">{settings?.htmlUnlockCost ?? 5} coins</p>
                  <p className="text-[9px] text-slate-400 mt-1">Har baar</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-green-600">{settings?.basicHtmlDailyLimit ?? 3} free/day</p>
                  <p className="text-[9px] text-slate-400 mt-1">Phir {settings?.htmlUnlockCost ?? 5} coins</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-black text-green-600">✅ Unlimited</p>
                  <p className="text-[9px] text-slate-400 mt-1">Ultra users only</p>
                </div>
              </div>
            </div>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
