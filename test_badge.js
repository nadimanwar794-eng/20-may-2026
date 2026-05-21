const badgeJsx = `
            {/* Subscription badge */}
            {user.isPremium && (
              <div className="flex flex-col items-center justify-center shrink-0 w-[72px]">
                <span className="w-full text-center text-[7px] font-black py-0.5 rounded-full bg-white/20 text-white border border-white/30 whitespace-nowrap shrink-0">
                  {user.subscriptionLevel === 'ULTRA' ? '👑 ULTRA' : user.subscriptionLevel === 'BASIC' ? '⭐ BASIC' : 'PRO'}
                </span>
                {user.subscriptionEndDate && (
                  <span className="text-[6px] font-medium text-white/80 mt-0.5 whitespace-nowrap">
                    Exp: {new Date(user.subscriptionEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                )}
              </div>
            )}
`;
