import { RECOVERY_KEY, REGIONS_SOLUTION, SERVICES, SLIDER_MAX_DIFF, SLIDER_TARGET_SUM } from '../data/constants.js'

// ============================================================
//  Layer 1 Engine: Switch Logic Gate
// ============================================================

/**
 * Toggle a switch and apply XOR-chain side effects.
 * Returns the new switches state.
 */
export function applySwitch(currentSwitches, serviceId) {
  const newSwitches = { ...currentSwitches }

  // Toggle the clicked switch
  newSwitches[serviceId] = !newSwitches[serviceId]

  // Apply dependencies (XOR toggle linked services)
  const service = SERVICES.find(s => s.id === serviceId)
  if (service?.dep) {
    for (const depId of service.dep) {
      newSwitches[depId] = !newSwitches[depId]
    }
  }

  return newSwitches
}

/**
 * Check if Layer 1 is solved (all switches = true).
 */
export function isSwitchesSolved(switches) {
  return Object.values(switches).every(Boolean)
}


// ============================================================
//  Layer 2 Engine: Slider Resonance
// ============================================================

/**
 * Returns a resonance score 0–1.
 * 1 = perfect resonance (sum === 150, max diff <= 30)
 * Partial score for proximity feedback.
 */
export function getResonanceScore(sliders) {
  const { cpu, memory, bandwidth } = sliders
  const sum = cpu + memory + bandwidth
  const values = [cpu, memory, bandwidth]
  const maxDiff = Math.max(...values) - Math.min(...values)

  const sumDelta = Math.abs(sum - SLIDER_TARGET_SUM)
  const diffDelta = Math.max(0, maxDiff - SLIDER_MAX_DIFF)

  const sumScore = Math.max(0, 1 - sumDelta / 50)
  const diffScore = Math.max(0, 1 - diffDelta / 50)

  return sumScore * diffScore
}

/**
 * Returns true when sliders are in the solved state.
 */
export function isSlidersSolved(sliders) {
  const { cpu, memory, bandwidth } = sliders
  const sum = cpu + memory + bandwidth
  const values = [cpu, memory, bandwidth]
  const maxDiff = Math.max(...values) - Math.min(...values)
  return sum === SLIDER_TARGET_SUM && maxDiff <= SLIDER_MAX_DIFF
}


// ============================================================
//  Layer 3 Engine: Dropdown Cascade
// ============================================================

/**
 * Get available failover options for a given primary region.
 */
export function getFailoverOptions(tree, primary) {
  if (!primary || !tree[primary]) return []
  return Object.keys(tree[primary].failover)
}

/**
 * Get available CDN options for primary + failover combo.
 */
export function getCdnOptions(tree, primary, failover) {
  if (!primary || !failover || !tree[primary]?.failover[failover]) return []
  return tree[primary].failover[failover].cdn
}

/**
 * Check if a combination is the correct solution.
 */
export function isDropdownsSolved(selections) {
  return (
    selections.primary === REGIONS_SOLUTION.primary &&
    selections.failover === REGIONS_SOLUTION.failover &&
    selections.cdn === REGIONS_SOLUTION.cdn
  )
}

/**
 * Get a contextual error message hinting at the correct path.
 * Returns null if selections are complete and valid.
 */
export function getDropdownError(selections) {
  if (!selections.primary || !selections.failover || !selections.cdn) return null

  if (isDropdownsSolved(selections)) return null

  // Hint towards AP region when wrong primary
  if (selections.primary !== REGIONS_SOLUTION.primary) {
    return 'CDN edge mismatch: AP region requires AP-prefixed downstream edge.'
  }
  // Hint towards eu-west when wrong failover
  if (selections.failover !== REGIONS_SOLUTION.failover) {
    return 'Latency conflict: routing loop detected between selected nodes.'
  }
  // Hint towards ap-south when wrong cdn
  return 'Topology error: selected CDN cannot reach the failover node.'
}


// ============================================================
//  Layer 4 Engine: Recovery Key
// ============================================================

/**
 * Check if the entered recovery key is correct (case-insensitive).
 */
export function isRecoveryKeySolved(inputValue) {
  return inputValue.trim().toUpperCase() === RECOVERY_KEY.toUpperCase()
}
