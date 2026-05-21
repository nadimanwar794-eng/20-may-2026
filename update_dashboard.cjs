const fs = require('fs');

const file = 'components/StudentDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `    // Increment visit count for today
    const visitCountKey = \`nst_store_visits_\${freshUser.id}_\${today}\`;
    const visitCount = parseInt(localStorage.getItem(visitCountKey) || '0', 10) + 1;
    localStorage.setItem(visitCountKey, String(visitCount));

    // Helper: send one discount mail if not already sent at this tier today
    const sendDiscount = (pct: number, tier: string) => {`;

const newStr = `    // Increment visit count for today per login
    // we use a combination of date and a session marker (or just tracking visits since load)
    const sessionToken = (window as any).__sessionToken || ((window as any).__sessionToken = Date.now().toString());
    const visitCountKey = \`nst_store_visits_\${freshUser.id}_\${today}_\${sessionToken}\`;

    // Check total visits today across all sessions to limit max 10
    const dailyTotalKey = \`nst_store_total_visits_\${freshUser.id}_\${today}\`;
    const dailyTotal = parseInt(localStorage.getItem(dailyTotalKey) || '0', 10) + 1;
    if (dailyTotal > 10) return; // Limit reached
    localStorage.setItem(dailyTotalKey, String(dailyTotal));

    const visitCount = parseInt(localStorage.getItem(visitCountKey) || '0', 10) + 1;
    localStorage.setItem(visitCountKey, String(visitCount));

    // Helper: send one discount mail if not already sent at this tier today
    const sendDiscount = async (pct: number, tier: string) => {`;

content = content.replace(targetStr, newStr);


const targetStr2 = `      const msgId = \`store-disc-\${tier}-\${today}\`;
      // Re-fetch freshest user to avoid inbox race
      const latestUser = (window as any).__dashUserRef?.current ?? freshUser;
      const alreadyHas = (latestUser.inbox || []).some((m: any) => m.id === msgId);
      if (alreadyHas) return;
      const code = 'DISC' + Math.random().toString(36).toUpperCase().slice(2, 9);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const discMsg: any = {
        id: msgId,
        text: \`🎁 Special Discount!\\n\\n⬆️ Upgrade your plan to unlock full power!\\n\\n🏷️ You got \${pct}% off — redeem now!\`,
        date: new Date().toISOString(),
        read: false,
        type: 'REDEEM_CODE',
        redeemCode: code,
        expiresAt,
      };
      const updatedInbox = [discMsg, ...(latestUser.inbox || [])];
      handleUserUpdate({ ...latestUser, inbox: updatedInbox });
      localStorage.setItem(sentKey, '1');
    };`;

const newStr2 = `      const msgId = \`store-disc-\${tier}-\${today}\`;
      // Re-fetch freshest user to avoid inbox race
      const latestUser = (window as any).__dashUserRef?.current ?? freshUser;
      const alreadyHas = (latestUser.inbox || []).some((m: any) => m.id === msgId);
      if (alreadyHas) return;

      const code = 'DISC' + Math.random().toString(36).toUpperCase().slice(2, 9);
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

      // Save code to Firebase so it can be redeemed
      try {
          const { doc, setDoc } = require('firebase/firestore');
          const { db } = require('../firebase');
          await setDoc(doc(db, "redeem_codes", code), {
              code,
              type: 'DISCOUNT',
              discountPercent: pct,
              maxUses: 1,
              usedCount: 0,
              isRedeemed: false,
              expiresAt,
              createdBy: 'SYSTEM_AUTO'
          });

          const { ref: rtdbRef, set: rtdbSet } = require('firebase/database');
          const { rtdb } = require('../firebase');
          await rtdbSet(rtdbRef(rtdb, \`redeem_codes/\${code}\`), {
              code,
              type: 'DISCOUNT',
              discountPercent: pct,
              maxUses: 1,
              usedCount: 0,
              isRedeemed: false,
              expiresAt,
              createdBy: 'SYSTEM_AUTO'
          });
      } catch (e) { console.error("Error creating discount code", e); }

      const discMsg: any = {
        id: msgId,
        text: \`🎁 Special Discount!\\n\\n⬆️ Upgrade your plan to unlock full power!\\n\\n🏷️ You got \${pct}% off — redeem now! (Expires in 2 hours)\`,
        date: new Date().toISOString(),
        read: false,
        type: 'REDEEM_CODE',
        redeemCode: code,
        expiresAt,
      };
      const updatedInbox = [discMsg, ...(latestUser.inbox || [])];
      handleUserUpdate({ ...latestUser, inbox: updatedInbox });
      localStorage.setItem(sentKey, '1');
    };`;

content = content.replace(targetStr2, newStr2);
fs.writeFileSync(file, content);
