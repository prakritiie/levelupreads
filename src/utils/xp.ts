export function addXP(currentXp: number, amount: number) {
  return Math.max(0, currentXp + amount)
}

export function calculateLevel(xp: number) {
  return Math.floor(xp / 100)
}
