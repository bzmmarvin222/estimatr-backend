import {Risk, RiskFactors} from './risk';

export interface EstimationLeaf {
  taskDescription: string;
  effortInManDays: number;
  risk: Risk;
}

export interface EstimationRoot {
  projectTitle: string;
  riskFactors: RiskFactors;
}

export type EstimationDescription = string;

export type EstimationNode = EstimationRoot | EstimationDescription | EstimationLeaf;
