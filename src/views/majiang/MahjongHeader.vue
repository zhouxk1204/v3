<template>
  <div class="header">
    <div class="header-icon">🀄</div>
    <div>
      <div class="header-title">成都麻将模拟器</div>
      <div class="header-sub">血战到底 · 缺一门 · 手牌分析</div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background: white;
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-title {
  font-family: 'Ma Shan Zheng', serif;
  font-size: 26px;
  color: #1e293b;
  letter-spacing: 2px;
}

.header-sub {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 3px;
  margin-top: 2px;
}
</style>
