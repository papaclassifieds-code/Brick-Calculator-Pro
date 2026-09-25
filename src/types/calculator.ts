export type MeasurementSystem = 'imperial' | 'metric'; // Default imperial (Feet/Inches) in India

export type IndianWallType = '9_inch' | '4_5_inch' | '13_5_inch' | 'aac_block' | 'custom';

export type IndianBrickType = 'traditional_red' | 'fly_ash' | 'aac_block' | 'modular_is' | 'custom';

export interface IndianBrickSpec {
  id: IndianBrickType;
  name: string;
  hindiName: string;
  lengthInch: number;
  widthInch: number;
  heightInch: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  description: string;
}

export interface WallOpening {
  id: string;
  name: string;
  hindiName: string;
  type: 'door' | 'window' | 'custom';
  width: number;  // in current unit (ft or m)
  height: number; // in current unit (ft or m)
  count: number;
}

export type MortarRatio = '1:4' | '1:5' | '1:6';

export interface IndianCostRates {
  brickRatePerPiece: number; // ₹ per brick (e.g. ₹8.5)
  cementBagRate: number;     // ₹ per 50kg bag (e.g. ₹380)
  sandRatePerCft: number;    // ₹ per CFT (e.g. ₹55)
  laborRatePerSqFt: number;  // ₹ per Sq.Ft of masonry (e.g. ₹28)
  includeLabor: boolean;
}

export interface IndianWallInput {
  system: MeasurementSystem; // 'imperial' (ft) is default for India
  wallLength: number; // in feet (or meters)
  wallHeight: number; // in feet (or meters)
  wallType: IndianWallType;
  customThicknessInch: number;
  
  brickType: IndianBrickType;
  customBrickLengthInch: number;
  customBrickWidthInch: number;
  customBrickHeightInch: number;

  mortarJointMm: number; // default 12mm (approx 1/2")
  wastagePercent: number; // default 5% to 10%
  mortarRatio: MortarRatio; // default 1:6 for 9" wall, 1:4 for 4.5" wall
  
  openings: WallOpening[];
  costs: IndianCostRates;
}

export interface IndianCalculationResult {
  grossWallAreaSqFt: number;
  grossWallAreaSqM: number;
  totalOpeningsAreaSqFt: number;
  netWallAreaSqFt: number;
  netWallAreaSqM: number;
  
  wallThicknessInch: number;
  wallThicknessMm: number;
  wallVolumeCft: number;
  wallVolumeM3: number;

  // Bricks output
  netBricks: number;
  wastageBricks: number;
  totalBricksRequired: number;
  bricksPerSqFt: number;
  
  // Courses / height layers
  totalCourses: number;
  bricksPerCourse: number;

  // Mortar Materials
  dryMortarCft: number;
  dryMortarM3: number;
  cementBags50kg: number;
  sandCft: number;
  sandTrolleyApprox: number; // based on standard Indian 80 CFT tractor trolley
  sandBrass: number; // 1 Brass = 100 CFT
  sandTonnes: number;
  waterLitres: number;

  // Costs in ₹ (INR)
  costBreakdown: {
    brickCost: number;
    cementCost: number;
    sandCost: number;
    laborCost: number;
    totalCost: number;
  };
}

export interface SavedWallEstimate {
  id: string;
  name: string;
  siteName?: string;
  date: string;
  input: IndianWallInput;
  result: IndianCalculationResult;
}
