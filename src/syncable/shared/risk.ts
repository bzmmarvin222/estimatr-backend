export type Risk = 'low' | 'moderate' | 'high' | 'showstopper';

export interface RiskFactors {
  low: number;
  moderate: number;
  high: number;
  showstopper: number;
}
