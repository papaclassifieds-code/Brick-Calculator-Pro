import {
  IndianBrickSpec,
  IndianBrickType,
  IndianWallInput,
  IndianCalculationResult,
  IndianWallType,
} from '../types/calculator';

// Standard Indian Brick & Block Presets
export const INDIAN_BRICK_PRESETS: IndianBrickSpec[] = [
  {
    id: 'traditional_red',
    name: 'पारंपरिक लाल ईंट (Traditional Red Brick)',
    hindiName: 'लाल ईंट (9" × 4.5" × 3")',
    lengthInch: 9.0,
    widthInch: 4.5,
    heightInch: 3.0,
    lengthMm: 228,
    widthMm: 114,
    heightMm: 76,
    description: 'भारत में सबसे ज्यादा इस्तेमाल होने वाली 9 इंच की लाल भट्ठा ईंट (Red Clay Field Brick).',
  },
  {
    id: 'fly_ash',
    name: 'फ्लाई ऐश ईंट (Fly Ash Brick)',
    hindiName: 'सीमेंट/राख ईंट (9" × 4" × 3")',
    lengthInch: 9.0,
    widthInch: 4.0,
    heightInch: 3.0,
    lengthMm: 230,
    widthMm: 100,
    heightMm: 75,
    description: 'सस्ती, मजबूत और एकसमान साइज वाली पर्यावरण-अनुकूल फ्लाई ऐश ईंट।',
  },
  {
    id: 'aac_block',
    name: 'AAC ब्लॉक / सिपोरैक्स (Lightweight Block)',
    hindiName: 'AAC ब्लॉक (24" × 8" × 8")',
    lengthInch: 24.0,
    widthInch: 8.0,
    heightInch: 8.0,
    lengthMm: 600,
    widthMm: 200,
    heightMm: 200,
    description: 'हल्का और बड़ा ब्लॉक, फ्लैट्स और बहुमंजिला इमारतों में तेजी से चिनाई के लिए।',
  },
  {
    id: 'modular_is',
    name: 'BIS मॉड्यूलर ईंट (IS:1077 PWD Standard)',
    hindiName: 'सरकारी/मॉड्यूलर ईंट (190×90×90 mm)',
    lengthInch: 7.48,
    widthInch: 3.54,
    heightInch: 3.54,
    lengthMm: 190,
    widthMm: 90,
    heightMm: 90,
    description: 'CPWD, PWD और सरकारी टेंडर में प्रयुक्त मानक मॉड्यूलर ईंट।',
  },
  {
    id: 'custom',
    name: 'कस्टम साइज (Custom Brick Dimensions)',
    hindiName: 'अपनी ईंट का नाप खुद भरें',
    lengthInch: 9.0,
    widthInch: 4.5,
    heightInch: 3.0,
    lengthMm: 228,
    widthMm: 114,
    heightMm: 76,
    description: 'यदि आपकी साइट पर किसी अलग नाप की ईंट है तो यहाँ दर्ज करें।',
  },
];

export const CEMENT_BAG_VOLUME_CFT = 1.226; // 50kg cement bag volume in cubic feet (0.0347 m³)
export const STANDARD_TROLLEY_CFT = 80; // 1 tractor trolley in India ≈ 70 to 90 CFT (avg 80 CFT)
export const SAND_TONNES_PER_CFT = 0.0453; // ~1 CFT sand ≈ 45.3 kg = 0.0453 tonnes (1.6 tonnes/m³)

export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

export function calculateIndianMasonry(input: IndianWallInput): IndianCalculationResult {
  const isImperial = input.system === 'imperial';

  // 1. Wall Dimensions converted to Feet and Meters
  const wallLengthFt = isImperial ? input.wallLength : input.wallLength * 3.28084;
  const wallHeightFt = isImperial ? input.wallHeight : input.wallHeight * 3.28084;

  const wallLengthM = wallLengthFt * 0.3048;
  const wallHeightM = wallHeightFt * 0.3048;

  // 2. Wall Thickness Determination
  let wallThicknessInch = 9.0;
  if (input.wallType === '9_inch') {
    wallThicknessInch = 9.0;
  } else if (input.wallType === '4_5_inch') {
    wallThicknessInch = 4.5;
  } else if (input.wallType === '13_5_inch') {
    wallThicknessInch = 13.5;
  } else if (input.wallType === 'aac_block') {
    wallThicknessInch = 8.0;
  } else {
    wallThicknessInch = input.customThicknessInch || 9.0;
  }

  const wallThicknessFt = wallThicknessInch / 12;
  const wallThicknessMm = wallThicknessInch * 25.4;
  const wallThicknessM = wallThicknessMm / 1000;

  // 3. Gross Wall Area
  const grossWallAreaSqFt = Math.max(0, wallLengthFt * wallHeightFt);
  const grossWallAreaSqM = Math.max(0, wallLengthM * wallHeightM);

  // 4. Openings Deduction (Doors & Windows)
  let totalOpeningsAreaSqFt = 0;
  if (input.openings && input.openings.length > 0) {
    for (const op of input.openings) {
      if (op.count > 0 && op.width > 0 && op.height > 0) {
        const opWFt = isImperial ? op.width : op.width * 3.28084;
        const opHFt = isImperial ? op.height : op.height * 3.28084;
        totalOpeningsAreaSqFt += opWFt * opHFt * op.count;
      }
    }
  }

  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - totalOpeningsAreaSqFt);
  const netWallAreaSqM = netWallAreaSqFt * 0.092903;

  // 5. Total Masonry Volume
  const wallVolumeCft = netWallAreaSqFt * wallThicknessFt;
  const wallVolumeM3 = wallVolumeCft * 0.0283168;

  // 6. Brick Dimensions with Mortar
  let brickSpec = INDIAN_BRICK_PRESETS.find((p) => p.id === input.brickType) || INDIAN_BRICK_PRESETS[0];

  let bLengthIn = brickSpec.lengthInch;
  let bWidthIn = brickSpec.widthInch;
  let bHeightIn = brickSpec.heightInch;

  if (input.brickType === 'custom') {
    bLengthIn = input.customBrickLengthInch || 9.0;
    bWidthIn = input.customBrickWidthInch || 4.5;
    bHeightIn = input.customBrickHeightInch || 3.0;
  }

  const jointInch = (input.mortarJointMm || 12) / 25.4; // 12mm ≈ 0.47 inch

  // Dimensions with mortar joint
  const bLengthWithJointIn = bLengthIn + jointInch;
  const bHeightWithJointIn = bHeightIn + jointInch;
  const bWidthWithJointIn = bWidthIn + jointInch;

  // Nominal single brick volume in CFT
  const singleBrickVolCft = (bLengthIn * bWidthIn * bHeightIn) / 1728;

  // Face area of one brick with mortar in Sq.Ft
  const brickFaceAreaSqFt = (bLengthWithJointIn * bHeightWithJointIn) / 144;

  // Bricks per Sq.Ft for a half-brick (4.5") wall
  const singleSkinBricksPerSqFt = brickFaceAreaSqFt > 0 ? 1 / brickFaceAreaSqFt : 4.5;

  // Thickness multiplier:
  // For 4.5" wall = 1 skin (~4.5 to 5 bricks/sq.ft)
  // For 9" wall = 2 skins (~9 to 10 bricks/sq.ft)
  // For 13.5" wall = 3 skins (~14 to 15 bricks/sq.ft)
  let skinMultiplier = 2;
  if (input.wallType === '4_5_inch') {
    skinMultiplier = 1;
  } else if (input.wallType === '9_inch') {
    skinMultiplier = 2;
  } else if (input.wallType === '13_5_inch') {
    skinMultiplier = 3;
  } else if (input.wallType === 'aac_block') {
    skinMultiplier = 1;
  } else {
    skinMultiplier = Math.max(1, wallThicknessInch / bWidthIn);
  }

  const bricksPerSqFt = singleSkinBricksPerSqFt * skinMultiplier;
  const netBricks = Math.round(netWallAreaSqFt * bricksPerSqFt);

  // Wastage (e.g. 5% to 10% standard in India)
  const wastagePct = Math.max(0, input.wastagePercent);
  const totalBricksRequired = Math.ceil(netBricks * (1 + wastagePct / 100));
  const wastageBricks = Math.max(0, totalBricksRequired - netBricks);

  // Course calculations (horizontal layers of brick)
  const courseHeightFt = bHeightWithJointIn / 12;
  const totalCourses = courseHeightFt > 0 ? Math.round(wallHeightFt / courseHeightFt) : 0;
  const bricksPerCourse = totalCourses > 0 ? Math.round(totalBricksRequired / totalCourses) : 0;

  // 7. Mortar, Cement & Sand Calculations
  // Total volume of all bricks
  const allBricksSolidVolCft = netBricks * singleBrickVolCft;
  // Wet mortar volume in wall
  const wetMortarCft = Math.max(0, wallVolumeCft - allBricksSolidVolCft);

  // Dry Mortar Factor: 1.33 (33% increase for void filling and water shrinkage)
  const dryMortarCft = wetMortarCft * 1.33;
  const dryMortarM3 = dryMortarCft * 0.0283168;

  // Mix ratio: '1:4', '1:5', '1:6'
  const ratioParts: Record<string, number> = {
    '1:4': 5,
    '1:5': 6,
    '1:6': 7,
  };
  const parts = ratioParts[input.mortarRatio] || 7;

  // Cement volume = 1 part of dry mortar
  const cementVolCft = dryMortarCft / parts;
  const cementBags50kg = Math.ceil(cementVolCft / CEMENT_BAG_VOLUME_CFT);

  // Sand volume = (parts - 1) of dry mortar
  const sandCft = cementVolCft * (parts - 1);
  const sandBrass = sandCft / 100; // 1 Brass = 100 CFT
  const sandTrolleyApprox = Number((sandCft / STANDARD_TROLLEY_CFT).toFixed(2));
  const sandTonnes = sandCft * SAND_TONNES_PER_CFT;
  const waterLitres = Math.round(cementBags50kg * 26); // ~25-28L per 50kg bag

  // 8. Cost Breakdown in ₹
  const rates = input.costs;
  const brickCost = totalBricksRequired * (rates.brickRatePerPiece || 0);
  const cementCost = cementBags50kg * (rates.cementBagRate || 0);
  const sandCost = sandCft * (rates.sandRatePerCft || 0);
  const laborCost = rates.includeLabor ? netWallAreaSqFt * (rates.laborRatePerSqFt || 0) : 0;
  const totalCost = brickCost + cementCost + sandCost + laborCost;

  return {
    grossWallAreaSqFt: Number(grossWallAreaSqFt.toFixed(1)),
    grossWallAreaSqM: Number(grossWallAreaSqM.toFixed(1)),
    totalOpeningsAreaSqFt: Number(totalOpeningsAreaSqFt.toFixed(1)),
    netWallAreaSqFt: Number(netWallAreaSqFt.toFixed(1)),
    netWallAreaSqM: Number(netWallAreaSqM.toFixed(1)),
    wallThicknessInch,
    wallThicknessMm: Math.round(wallThicknessMm),
    wallVolumeCft: Number(wallVolumeCft.toFixed(1)),
    wallVolumeM3: Number(wallVolumeM3.toFixed(2)),
    netBricks,
    wastageBricks,
    totalBricksRequired,
    bricksPerSqFt: Number(bricksPerSqFt.toFixed(1)),
    totalCourses,
    bricksPerCourse,
    dryMortarCft: Number(dryMortarCft.toFixed(1)),
    dryMortarM3: Number(dryMortarM3.toFixed(2)),
    cementBags50kg,
    sandCft: Number(sandCft.toFixed(1)),
    sandTrolleyApprox,
    sandBrass: Number(sandBrass.toFixed(2)),
    sandTonnes: Number(sandTonnes.toFixed(2)),
    waterLitres,
    costBreakdown: {
      brickCost: Math.round(brickCost),
      cementCost: Math.round(cementCost),
      sandCost: Math.round(sandCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(totalCost),
    },
  };
}

export const DEFAULT_INDIAN_INPUT: IndianWallInput = {
  system: 'imperial', // Feet is universal in Indian house construction
  wallLength: 10,     // 10 feet
  wallHeight: 10,     // 10 feet
  wallType: '9_inch', // 9" main outer wall is the most common
  customThicknessInch: 9.0,
  brickType: 'traditional_red',
  customBrickLengthInch: 9.0,
  customBrickWidthInch: 4.5,
  customBrickHeightInch: 3.0,
  mortarJointMm: 12,  // 12mm standard Indian mortar joint
  wastagePercent: 5,  // 5% breakage allowance
  mortarRatio: '1:6', // 1:6 is the standard masonry mix in India
  openings: [
    {
      id: 'door-1',
      name: 'Main Door',
      hindiName: 'दरवाजा',
      type: 'door',
      width: 3.0,  // 3 feet
      height: 7.0, // 7 feet standard Indian door
      count: 1,
    },
  ],
  costs: {
    brickRatePerPiece: 8.5,  // ₹8.5 per brick (typical Indian rate ₹8 - ₹10)
    cementBagRate: 380,      // ₹380 per 50kg bag (UltraTech / ACC / Ambuja)
    sandRatePerCft: 55,      // ₹55 per CFT (typical Indian rate ₹45 - ₹65)
    laborRatePerSqFt: 25,    // ₹25 per Sq.Ft
    includeLabor: true,
  },
};
