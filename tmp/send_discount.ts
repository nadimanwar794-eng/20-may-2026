  // --- EXPIRY CHECK & AUTO DOWNGRADE ---
  useEffect(() => {
    if (user.isPremium && !SubscriptionEngine.isPremium(user)) {
      const updatedUser: User = {
        ...user,
        isPremium: false,
        subscriptionTier: "FREE",
        subscriptionLevel: undefined,
        subscriptionEndDate: undefined,
      };
      handleUserUpdate(updatedUser);
      showAlert(
        "Your subscription has expired. You are now on the Free Plan.",
        "ERROR",
        "Plan Expired",
      );
    }
  }, [user.isPremium, user.subscriptionEndDate]);

  // --- STORE VISIT → MAILBOX DISCOUNT DELIVERY (multi-tier escalation) ---
  // 1st visit  →  10% (storeVisitDiscountPercent, default 10)
  // 3rd visit  →  15%
  // 5th+ visit →  20% (max)
  // NOTE: uses userRef.current (defined later in the component) to avoid stale closure
  // overwriting inbox. Effect callbacks are closures that execute AFTER the full
  // component function runs, so userRef is already initialized by then.
  useEffect(() => {
    if (activeTab !== 'STORE') return;
    const freshUser = (window as any).__dashUserRef?.current ?? user;
    const isSubscribed = freshUser.isPremium && freshUser.subscriptionEndDate && new Date(freshUser.subscriptionEndDate) > new Date();
    if (isSubscribed) return;
    if (!freshUser?.id) return;
    const today = new Date().toISOString().split('T')[0];

    // Increment visit count for today
    const visitCountKey = `nst_store_visits_${freshUser.id}_${today}`;
    const visitCount = parseInt(localStorage.getItem(visitCountKey) || '0', 10) + 1;
    localStorage.setItem(visitCountKey, String(visitCount));

    // Helper: send one discount mail if not already sent at this tier today
    const sendDiscount = (pct: number, tier: string) => {
      const sentKey = `nst_store_disc${tier}_${freshUser.id}_${today}`;
      if (localStorage.getItem(sentKey)) return;
      const msgId = `store-disc-${tier}-${today}`;
      // Re-fetch freshest user to avoid inbox race
      const latestUser = (window as any).__dashUserRef?.current ?? freshUser;
      const alreadyHas = (latestUser.inbox || []).some((m: any) => m.id === msgId);
      if (alreadyHas) return;
      const code = 'DISC' + Math.random().toString(36).toUpperCase().slice(2, 9);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const discMsg: any = {
        id: msgId,
        text: `🎁 Special Discount!\n\n⬆️ Upgrade your plan to unlock full power!\n\n🏷️ You got ${pct}% off — redeem now!`,
        date: new Date().toISOString(),
        read: false,
        type: 'REDEEM_CODE',
        redeemCode: code,
        expiresAt,
      };
      const updatedInbox = [discMsg, ...(latestUser.inbox || [])];
      handleUserUpdate({ ...latestUser, inbox: updatedInbox });
      localStorage.setItem(sentKey, '1');
    };

    if (visitCount === 1) sendDiscount(settings?.storeVisitDiscountPercent ?? 10, '1');
    if (visitCount === 3) sendDiscount(15, '3');
    if (visitCount >= 5) sendDiscount(20, '5');
  }, [activeTab, user?.id]);

  // --- MCQ DAILY TRACKING HELPER ---
  // Uses userRef.current (via __dashUserRef) to prevent stale closure overwriting inbox
  const trackDailyMcqAnswer = (isCorrect: boolean) => {
    try {
      const freshUser = (window as any).__dashUserRef?.current ?? user;
      const today = new Date().toISOString().split('T')[0];
      const countKey = `nst_mcq_daily_total_${today}_${freshUser.id}`;
      const correctKey = `nst_mcq_daily_correct_${today}_${freshUser.id}`;
      const total = (parseInt(localStorage.getItem(countKey) || '0')) + 1;
      const correct = (parseInt(localStorage.getItem(correctKey) || '0')) + (isCorrect ? 1 : 0);
      localStorage.setItem(countKey, total.toString());
