const fs = require('fs');

const file = 'components/StudentDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `    if (visitCount === 1) sendDiscount(settings?.storeVisitDiscountPercent ?? 10, '1');
    if (visitCount === 3) sendDiscount(15, '3');
    if (visitCount >= 5) sendDiscount(20, '5');`;

const newStr = `    if (visitCount === 2) sendDiscount(settings?.storeVisitDiscountPercent ?? 10, '1');
    if (visitCount === 3) sendDiscount(15, '3');
    if (visitCount >= 5) sendDiscount(20, '5');`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
