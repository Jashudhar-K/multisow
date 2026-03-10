/**
 * Planting Guides Data
 * Comprehensive guides for all 6 regional preset models
 * Based on Indian agricultural research and best practices
 */

import type { StrataLayer } from '@/lib/spacing';

export interface PlantingSequenceStep {
  week: number;
  activity: string;
  layer: StrataLayer;
  species: string;
  notes: string;
}

export interface SpacingGuide {
  species: string;
  rowSpacing: string;
  plantSpacing: string;
  depth: string;
  method: 'pit' | 'furrow' | 'broadcast' | 'mound';
}

export interface IrrigationSchedule {
  stage: string;
  frequency: string;
  method: string;
  amount: string;
}

export interface FertilizerSchedule {
  month: number;
  fertilizer: string;
  quantity: string;
  method: string;
}

export interface PestManagement {
  pest: string;
  symptom: string;
  treatment: string;
  preventive: string;
}

export interface HarvestCalendar {
  species: string;
  firstHarvest: string;
  peakSeason: string;
  method: string;
  yield: string;
}

export interface RevenueProjection {
  year: number;
  revenue: string;
  primaryCrop: string;
}

export interface PlantingGuide {
  id: string;
  presetId: string;
  title: string;
  region: string;
  bestSeason: string;
  soilPrep: string[];
  nurseryWork: string[];
  plantingSequence: PlantingSequenceStep[];
  spacingGuide: SpacingGuide[];
  irrigationSchedule: IrrigationSchedule[];
  fertilizerSchedule: FertilizerSchedule[];
  pestManagement: PestManagement[];
  harvestCalendar: HarvestCalendar[];
  revenueProjection: RevenueProjection[];
  soilRequirements: string[];
  suitableStates: string[];
  climateZone: string;
  annualRainfall: string;
  altitude: string;
}

export const plantingGuides: PlantingGuide[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 1. WAYANAD CLASSIC
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-wayanad',
    presetId: 'wayanad-classic',
    title: 'Wayanad Classic Agroforestry',
    region: 'Kerala Western Ghats',
    bestSeason: 'June–July (Southwest Monsoon onset)',
    soilRequirements: [
      'Laterite or red loamy soil',
      'pH 5.5–6.5 (slightly acidic)',
      'Well-drained, no waterlogging',
      'Organic matter > 2%',
      'Depth > 2m for coconut roots',
    ],
    suitableStates: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Goa'],
    climateZone: 'Tropical Wet',
    annualRainfall: '2500–3500 mm',
    altitude: '700–1200 m MSL',
    soilPrep: [
      'Clear land of weeds and debris during February–March',
      'Plough to 30cm depth twice, 15 days apart',
      'Apply 25 tonnes/ha of well-decomposed FYM',
      'Dig pits (1m × 1m × 1m) for coconut 45 days before planting',
      'Fill pits with topsoil + 10kg FYM + 500g bone meal',
      'Mark rows using string lines for precise 8m triangular spacing',
      'Create drainage channels on slopes to prevent erosion',
      'Apply 2kg lime per pit if soil pH < 5.5',
    ],
    nurseryWork: [
      'Select 10–12 month old coconut seedlings (Chowghat Dwarf variety)',
      'Choose seedlings with 6+ leaves, thick collar, early splitting',
      'Procure disease-free banana suckers (Nendran or Robusta) weighing 1.5–2kg',
      'Treat banana suckers with Pseudomonas (20g/L) for 30 minutes',
      'Source high-yielding black pepper cuttings (Panniyur-1) from certified nurseries',
      'Root pepper cuttings in poly bags 3 months before transplanting',
      'Prepare turmeric rhizomes (Salem or Erode local) weighing 30–40g each',
      'Treat turmeric with Trichoderma (5g/L) to prevent rhizome rot',
    ],
    plantingSequence: [
      { week: 1, activity: 'Plant coconut seedlings in prepared pits', layer: 'overstory', species: 'Coconut', notes: 'Water immediately, provide shade cloth for 2 weeks' },
      { week: 2, activity: 'Install black pepper stakes at coconut base', layer: 'vertical', species: 'Black Pepper', notes: '2 cuttings per coconut, north-south orientation' },
      { week: 3, activity: 'Plant banana suckers in between coconut rows', layer: 'middle', species: 'Banana', notes: '3m from coconuts, avoid low-lying areas' },
      { week: 4, activity: 'Prepare beds for turmeric planting', layer: 'understory', species: 'Turmeric', notes: 'Raised beds 15cm high, 1m wide' },
      { week: 5, activity: 'Plant turmeric rhizomes in prepared beds', layer: 'understory', species: 'Turmeric', notes: '30×25cm spacing, 5cm depth' },
      { week: 8, activity: 'First weeding and mulching', layer: 'understory', species: 'All', notes: 'Use coconut fronds as mulch' },
      { week: 12, activity: 'Apply first fertilizer dose', layer: 'overstory', species: 'Coconut', notes: 'NPK 500g per palm in circular basin' },
      { week: 16, activity: 'Train pepper vines to coconut trunk', layer: 'vertical', species: 'Black Pepper', notes: 'Use coir rope, tie loosely every 30cm' },
    ],
    spacingGuide: [
      { species: 'Coconut', rowSpacing: '8m', plantSpacing: '8m', depth: '60cm', method: 'pit' },
      { species: 'Black Pepper', rowSpacing: 'On coconut', plantSpacing: '2 per palm', depth: '15cm', method: 'pit' },
      { species: 'Banana', rowSpacing: '4m', plantSpacing: '3m', depth: '45cm', method: 'pit' },
      { species: 'Turmeric', rowSpacing: '30cm', plantSpacing: '25cm', depth: '5cm', method: 'furrow' },
    ],
    irrigationSchedule: [
      { stage: 'Establishment (Month 1–3)', frequency: 'Every 2 days', method: 'Drip irrigation', amount: '40L per coconut' },
      { stage: 'Active growth (Month 4–8)', frequency: 'Every 4 days', method: 'Drip + sprinkler', amount: '80L per coconut' },
      { stage: 'Monsoon (June–September)', frequency: 'As needed', method: 'Natural rainfall', amount: 'Supplemental only' },
      { stage: 'Summer (March–May)', frequency: 'Every 2 days', method: 'Drip irrigation', amount: '100L per coconut' },
      { stage: 'Fruiting (Year 3+)', frequency: 'Every 3 days', method: 'Basin irrigation', amount: '200L per coconut' },
    ],
    fertilizerSchedule: [
      { month: 1, fertilizer: 'Organic starter (FYM + Neem cake)', quantity: '20kg per coconut', method: 'Basin application' },
      { month: 3, fertilizer: 'NPK 13:5:24', quantity: '500g per palm', method: 'Ring application 1m from trunk' },
      { month: 6, fertilizer: 'Urea + MOP', quantity: '300g + 500g per palm', method: 'Split application' },
      { month: 9, fertilizer: 'Bone meal + Wood ash', quantity: '2kg per palm', method: 'Broadcasting in basin' },
      { month: 12, fertilizer: 'Complete fertilizer + micronutrients', quantity: '1kg NPK + Borax 50g', method: 'Ring application' },
      { month: 4, fertilizer: 'Banana: 10:26:26 NPK', quantity: '200g per plant', method: 'Side dressing' },
      { month: 7, fertilizer: 'Banana: Urea', quantity: '100g per plant', method: 'Foliar spray 1%' },
      { month: 5, fertilizer: 'Turmeric: FYM top dress', quantity: '5 tonnes/ha', method: 'Between rows' },
    ],
    pestManagement: [
      { pest: 'Rhinoceros Beetle (Coconut)', symptom: 'V-shaped cuts on unopened fronds, bore holes', treatment: 'Hook out beetles, apply Metarhizium to breeding sites', preventive: 'Fill leaf axils with sand + carbaryl (1:20)' },
      { pest: 'Red Palm Weevil', symptom: 'Yellowing crown, toppling of crown', treatment: 'Inject trunk with imidacloprid', preventive: 'Avoid crown damage, treat wounds with Bordeaux paste' },
      { pest: 'Quick Wilt (Pepper)', symptom: 'Sudden wilting, root rot', treatment: 'Drench with Metalaxyl (2g/L)', preventive: 'Improve drainage, apply Trichoderma' },
      { pest: 'Banana Pseudostem Weevil', symptom: 'Tunneling in pseudostem, oozing', treatment: 'Trap with split pseudostem, apply chlorpyrifos', preventive: 'Clean cultivation, destroy crop residues' },
      { pest: 'Shoot Borer (Turmeric)', symptom: 'Dead hearts, wilting', treatment: 'Spray quinalphos 0.05%', preventive: 'Deep summer ploughing, crop rotation' },
    ],
    harvestCalendar: [
      { species: 'Coconut', firstHarvest: 'Year 5–6', peakSeason: 'Year-round (peak Mar–May)', method: 'Climbing or mechanical harvester', yield: '80–120 nuts/palm/year' },
      { species: 'Black Pepper', firstHarvest: 'Year 3', peakSeason: 'December–January', method: 'Hand picking when berries turn red', yield: '2–4 kg dry/vine' },
      { species: 'Banana', firstHarvest: 'Month 12–14', peakSeason: 'Continuous after establishment', method: 'Cut bunch when fingers plump', yield: '15–25 kg/bunch' },
      { species: 'Turmeric', firstHarvest: 'Month 8–9', peakSeason: 'January–March', method: 'Dig rhizomes when leaves yellow', yield: '20–25 tonnes fresh/ha' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹45,000/acre', primaryCrop: 'Banana + Turmeric' },
      { year: 2, revenue: '₹75,000/acre', primaryCrop: 'Banana + Turmeric' },
      { year: 3, revenue: '₹1,20,000/acre', primaryCrop: 'Pepper + Banana' },
      { year: 4, revenue: '₹1,80,000/acre', primaryCrop: 'Pepper + Coconut (first)' },
      { year: 5, revenue: '₹2,50,000/acre', primaryCrop: 'Full production all crops' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 2. KARNATAKA SPICE GARDEN
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-karnataka',
    presetId: 'karnataka-spice',
    title: 'Karnataka Spice Garden',
    region: 'Kodagu & Chikmagalur',
    bestSeason: 'May–June (Pre-monsoon showers)',
    soilRequirements: [
      'Forest loam or laterite',
      'pH 6.0–7.0',
      'Rich in organic matter (>3%)',
      'Good water retention',
      'Partial shade tolerance',
    ],
    suitableStates: ['Karnataka', 'Kerala', 'Tamil Nadu'],
    climateZone: 'Tropical Highlands',
    annualRainfall: '2000–3500 mm',
    altitude: '800–1400 m MSL',
    soilPrep: [
      'Forest clearing (if applicable) with selective tree retention',
      'Establish Silver Oak as shade trees 2 years before cardamom',
      'Dig planting pits (75cm × 75cm × 75cm) for main crops',
      'Apply 15kg FYM + 1kg neem cake per pit',
      'Create contour bunds on slopes >15%',
      'Install drip irrigation mainlines before monsoon',
      'Mulch heavily with coffee husk or leaf litter',
      'Establish windbreaks with Casuarina on exposed edges',
    ],
    nurseryWork: [
      'Silver Oak: Sow seeds in nursery beds during March',
      'Papaya: Select Taiwan Red Lady or Coorg Honey Dew varieties',
      'Cardamom: Procure tissue culture plants (Malabar or Mysore)',
      'Vanilla: Obtain 3-node cuttings from certified disease-free gardens',
      'Root vanilla cuttings in shade house for 6 months before field planting',
      'Harden off all seedlings 2 weeks before transplanting',
    ],
    plantingSequence: [
      { week: 1, activity: 'Plant Silver Oak seedlings', layer: 'overstory', species: 'Silver Oak', notes: '10m × 10m spacing, marking with pegs' },
      { week: 2, activity: 'Establish vanilla support structures', layer: 'vertical', species: 'Vanilla', notes: 'Use Gliricidia or Erythrina as live supports' },
      { week: 3, activity: 'Plant papaya seedlings', layer: 'middle', species: 'Papaya', notes: '3m × 3m, in pits 45cm deep' },
      { week: 4, activity: 'Plant vanilla cuttings at base of supports', layer: 'vertical', species: 'Vanilla', notes: 'Bury 2 nodes, train upward' },
      { week: 6, activity: 'Plant cardamom in shaded areas', layer: 'understory', species: 'Cardamom', notes: '2m × 2m, under Silver Oak canopy' },
      { week: 8, activity: 'First mulching and shade regulation', layer: 'understory', species: 'Cardamom', notes: '50–70% shade optimal' },
      { week: 12, activity: 'Train vanilla vines to horizontal growth', layer: 'vertical', species: 'Vanilla', notes: 'Loop vines at 2m height' },
      { week: 20, activity: 'Thinning of papaya (remove males)', layer: 'middle', species: 'Papaya', notes: 'Retain 1 male per 10 females' },
    ],
    spacingGuide: [
      { species: 'Silver Oak', rowSpacing: '10m', plantSpacing: '10m', depth: '45cm', method: 'pit' },
      { species: 'Papaya', rowSpacing: '3m', plantSpacing: '3m', depth: '30cm', method: 'pit' },
      { species: 'Cardamom', rowSpacing: '2m', plantSpacing: '2m', depth: '15cm', method: 'pit' },
      { species: 'Vanilla', rowSpacing: '3m', plantSpacing: '2.5m', depth: '10cm', method: 'mound' },
    ],
    irrigationSchedule: [
      { stage: 'Establishment', frequency: 'Daily', method: 'Sprinkler', amount: '5mm/day' },
      { stage: 'Vegetative growth', frequency: 'Alternate days', method: 'Drip', amount: '4L/plant' },
      { stage: 'Flowering (Cardamom)', frequency: 'Daily light irrigation', method: 'Misting', amount: '80% humidity maintenance' },
      { stage: 'Dry season', frequency: 'Every 2 days', method: 'Drip', amount: '8L/plant' },
      { stage: 'Vanilla flowering', frequency: 'Maintain stress', method: 'Reduce irrigation', amount: '50% reduction for 6 weeks' },
    ],
    fertilizerSchedule: [
      { month: 2, fertilizer: 'NPK 10:10:10', quantity: '200g per cardamom clump', method: 'Ring application' },
      { month: 4, fertilizer: 'Vermicompost', quantity: '5kg per papaya', method: 'Basin application' },
      { month: 6, fertilizer: 'Potash (MOP)', quantity: '150g per vanilla vine', method: 'Drip fertigation' },
      { month: 8, fertilizer: 'Micronutrient spray (Zn, Mg, B)', quantity: '0.5% solution', method: 'Foliar spray' },
      { month: 10, fertilizer: 'Organic cake mixture', quantity: '1kg per cardamom', method: 'Top dressing' },
      { month: 12, fertilizer: 'FYM + wood ash', quantity: '10kg per tree', method: 'Broadcasting' },
    ],
    pestManagement: [
      { pest: 'Thrips (Cardamom)', symptom: 'Silvery streaks on leaves, malformed capsules', treatment: 'Spray imidacloprid 0.3ml/L', preventive: 'Maintain shade, avoid water stress' },
      { pest: 'Katte disease (Cardamom)', symptom: 'Mosaic patterns on leaves', treatment: 'Remove and burn affected plants', preventive: 'Aphid vector control, disease-free planting material' },
      { pest: 'Root rot (Vanilla)', symptom: 'Yellowing, stem base rotting', treatment: 'Drench with copper oxychloride', preventive: 'Avoid waterlogging, raised beds' },
      { pest: 'Papaya ring spot virus', symptom: 'Ring patterns on fruits, leaf distortion', treatment: 'No cure, remove affected plants', preventive: 'Resistant varieties, aphid control' },
      { pest: 'Coffee berry borer (if intercropped)', symptom: 'Holes in berries', treatment: 'Beauveria bassiana spray', preventive: 'Timely harvest, sanitation' },
    ],
    harvestCalendar: [
      { species: 'Silver Oak', firstHarvest: 'Year 8–10', peakSeason: 'Continuous pruning', method: 'Selective pruning for timber', yield: '40–60 cu.ft/tree at maturity' },
      { species: 'Papaya', firstHarvest: 'Month 10–12', peakSeason: 'Year-round', method: 'Twist and pull ripe fruits', yield: '50–80 kg/plant/year' },
      { species: 'Cardamom', firstHarvest: 'Year 3', peakSeason: 'August–February', method: 'Hand picking, 6–8 rounds', yield: '150–250 kg dry/ha' },
      { species: 'Vanilla', firstHarvest: 'Year 4', peakSeason: 'May–July', method: 'Hand harvest mature pods', yield: '400–600 kg green/ha' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹30,000/acre', primaryCrop: 'Papaya (first fruits)' },
      { year: 2, revenue: '₹80,000/acre', primaryCrop: 'Papaya' },
      { year: 3, revenue: '₹1,50,000/acre', primaryCrop: 'Cardamom + Papaya' },
      { year: 4, revenue: '₹3,00,000/acre', primaryCrop: 'Vanilla + Cardamom' },
      { year: 5, revenue: '₹4,50,000/acre', primaryCrop: 'Full production (Vanilla peak)' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 3. TAMIL NADU TROPICAL
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-tamilnadu',
    presetId: 'tamil-nadu-tropical',
    title: 'Tamil Nadu Tropical Garden',
    region: 'Coimbatore & Nilgiris Foothills',
    bestSeason: 'October–November (Northeast Monsoon)',
    soilRequirements: [
      'Red sandy loam',
      'pH 6.5–7.5',
      'Good drainage essential',
      'Moderate organic matter',
      'Calcium-rich soils preferred',
    ],
    suitableStates: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
    climateZone: 'Tropical Semi-Arid',
    annualRainfall: '700–1200 mm',
    altitude: '300–600 m MSL',
    soilPrep: [
      'Deep ploughing during summer to break hardpan',
      'Apply 20 tonnes FYM/ha and incorporate',
      'Level field for uniform irrigation',
      'Dig mango pits (1m cube) during May–June',
      'Fill with topsoil + 25kg FYM + 2kg single super phosphate',
      'Create raised beds for ginger (30cm height)',
      'Install drip irrigation with fertigation unit',
      'Apply gypsum 500kg/ha if soil is sodic',
    ],
    nurseryWork: [
      'Mango: Procure grafted Alphonso/Banganapalli from certified nursery',
      'Guava: Select Taiwan Pink or Allahabad Safeda grafts',
      'Ginger: Seed rhizomes from high-yield variety (Rio de Janeiro)',
      'Betel Leaf: Obtain disease-free vines from established gardens',
      'Treat all planting material with Trichoderma + Pseudomonas',
      'Harden mango grafts under 50% shade for 2 weeks',
    ],
    plantingSequence: [
      { week: 1, activity: 'Plant mango grafts in prepared pits', layer: 'overstory', species: 'Mango', notes: 'Graft union 15cm above soil' },
      { week: 2, activity: 'Install betel leaf pandals/supports', layer: 'vertical', species: 'Betel Leaf', notes: 'Use bamboo frame 2m height' },
      { week: 3, activity: 'Plant guava between mango rows', layer: 'middle', species: 'Guava', notes: '6m × 6m pattern, staggered' },
      { week: 4, activity: 'Prepare ginger beds and plant', layer: 'understory', species: 'Ginger', notes: '25cm × 25cm spacing in beds' },
      { week: 5, activity: 'Plant betel leaf cuttings', layer: 'vertical', species: 'Betel Leaf', notes: '90cm × 90cm under pandal' },
      { week: 8, activity: 'First earthing up of ginger', layer: 'understory', species: 'Ginger', notes: 'Hill soil to 10cm around plants' },
      { week: 12, activity: 'Mulch all trees with paddy straw', layer: 'overstory', species: 'All trees', notes: '15cm thick layer in basin' },
      { week: 16, activity: 'Second earthing up of ginger', layer: 'understory', species: 'Ginger', notes: 'Additional 10cm mounding' },
    ],
    spacingGuide: [
      { species: 'Mango', rowSpacing: '9m', plantSpacing: '9m', depth: '60cm', method: 'pit' },
      { species: 'Guava', rowSpacing: '6m', plantSpacing: '6m', depth: '45cm', method: 'pit' },
      { species: 'Ginger', rowSpacing: '30cm', plantSpacing: '25cm', depth: '5cm', method: 'furrow' },
      { species: 'Betel Leaf', rowSpacing: '90cm', plantSpacing: '90cm', depth: '15cm', method: 'mound' },
    ],
    irrigationSchedule: [
      { stage: 'Establishment', frequency: 'Every 3 days', method: 'Drip', amount: '20L per tree' },
      { stage: 'Summer (Mar–May)', frequency: 'Daily', method: 'Drip', amount: '40L per tree' },
      { stage: 'Monsoon', frequency: 'Based on rainfall', method: 'Supplemental', amount: 'Avoid waterlogging' },
      { stage: 'Flowering (Mango)', frequency: 'Reduce irrigation', method: 'Stress irrigation', amount: 'Light watering' },
      { stage: 'Fruit development', frequency: 'Every 2 days', method: 'Drip + basin', amount: '60L per tree' },
    ],
    fertilizerSchedule: [
      { month: 2, fertilizer: 'Urea', quantity: '200g per mango', method: 'Ring application' },
      { month: 4, fertilizer: 'DAP', quantity: '300g per tree', method: 'Band application' },
      { month: 6, fertilizer: 'MOP + Micronutrients', quantity: '200g + spray', method: 'Soil + foliar' },
      { month: 8, fertilizer: 'FYM', quantity: '20kg per tree', method: 'Basin incorporation' },
      { month: 10, fertilizer: 'SSP', quantity: '500g per tree', method: 'Pre-flowering boost' },
      { month: 3, fertilizer: 'Ginger: NPK complex', quantity: '100kg/ha', method: 'Side dressing' },
    ],
    pestManagement: [
      { pest: 'Mango hopper', symptom: 'Honeydew on leaves, sooty mold', treatment: 'Imidacloprid 0.3ml/L spray', preventive: 'Orchard sanitation, avoid dense planting' },
      { pest: 'Fruit fly', symptom: 'Maggots in ripe fruits', treatment: 'Methyl eugenol traps', preventive: 'Collect and destroy fallen fruits' },
      { pest: 'Powdery mildew', symptom: 'White powder on inflorescence', treatment: 'Sulfur spray 3g/L', preventive: 'Avoid excess nitrogen, good ventilation' },
      { pest: 'Guava wilt', symptom: 'Sudden wilting, root rot', treatment: 'Remove affected trees', preventive: 'Resistant rootstock, drainage' },
      { pest: 'Ginger soft rot', symptom: 'Yellowing, rotting rhizome', treatment: 'Drench with Bordeaux mixture', preventive: 'Seed treatment, raised beds' },
    ],
    harvestCalendar: [
      { species: 'Mango', firstHarvest: 'Year 4–5', peakSeason: 'April–June', method: 'Hand harvest with pole harvester', yield: '100–150 fruits/tree (mature)' },
      { species: 'Guava', firstHarvest: 'Year 2', peakSeason: 'Aug–Sept, Feb–Mar', method: 'Hand picking at color break', yield: '80–100 kg/tree/year' },
      { species: 'Ginger', firstHarvest: 'Month 8–9', peakSeason: 'December–February', method: 'Fork lifting, careful digging', yield: '15–20 tonnes/ha' },
      { species: 'Betel Leaf', firstHarvest: 'Month 8', peakSeason: 'Year-round', method: 'Selective leaf picking', yield: '40–50 leaves/vine/month' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹35,000/acre', primaryCrop: 'Ginger + Betel' },
      { year: 2, revenue: '₹65,000/acre', primaryCrop: 'Guava + Ginger' },
      { year: 3, revenue: '₹95,000/acre', primaryCrop: 'Guava + Betel' },
      { year: 4, revenue: '₹1,40,000/acre', primaryCrop: 'Mango (first) + Guava' },
      { year: 5, revenue: '₹2,00,000/acre', primaryCrop: 'Full production' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 4. ANDHRA COMMERCIAL
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-andhra',
    presetId: 'andhra-commercial',
    title: 'Andhra Commercial Intensive',
    region: 'Coastal Andhra & Rayalaseema',
    bestSeason: 'July–August (Southwest Monsoon)',
    soilRequirements: [
      'Sandy loam to clay loam',
      'pH 6.0–7.5',
      'Deep soil (>1.5m)',
      'Saline tolerance for coastal areas',
      'Good drainage',
    ],
    suitableStates: ['Andhra Pradesh', 'Telangana', 'Odisha', 'Tamil Nadu'],
    climateZone: 'Tropical Wet-Dry',
    annualRainfall: '900–1400 mm',
    altitude: '0–300 m MSL',
    soilPrep: [
      'Laser leveling for uniform water distribution',
      'Subsoiling to break compacted layers',
      'Apply 30 tonnes FYM/ha with green manure ploughing',
      'Dig areca pits (60cm cube) in grid pattern',
      'Apply chlorpyrifos dust to soil to control termites',
      'Install micro-irrigation system with automation',
      'Create field channels for drainage',
      'Apply zinc sulfate 25kg/ha for deficiency correction',
    ],
    nurseryWork: [
      'Areca: Select sprouted nuts (Mangala or Sreemangala variety)',
      'Jackfruit: Grafted seedlings of Sindoor or local varieties',
      'Pineapple: Suckers from high-yielding pest-free plants',
      'Passion fruit: Rooted cuttings of Purple variety',
      'Treat areca seedlings with Trichoderma before transplanting',
      'Grade pineapple suckers by size for uniform crop',
    ],
    plantingSequence: [
      { week: 1, activity: 'Transplant 12-month areca seedlings', layer: 'overstory', species: 'Areca', notes: '7m × 7m, east-west rows' },
      { week: 2, activity: 'Plant jackfruit in alternate rows', layer: 'overstory', species: 'Jackfruit', notes: '14m × 14m, between areca' },
      { week: 3, activity: 'Install passion fruit trellising', layer: 'vertical', species: 'Passion Fruit', notes: 'T-bar system 2m height' },
      { week: 4, activity: 'Plant passion fruit', layer: 'vertical', species: 'Passion Fruit', notes: '3m × 3m on trellis rows' },
      { week: 6, activity: 'Plant pineapple in beds', layer: 'understory', species: 'Pineapple', notes: 'Double row system, 90×60×30cm' },
      { week: 10, activity: 'First weeding and nitrogen application', layer: 'understory', species: 'Pineapple', notes: '20g urea per plant' },
      { week: 16, activity: 'Train passion fruit to trellis', layer: 'vertical', species: 'Passion Fruit', notes: 'Remove lateral shoots below wire' },
      { week: 24, activity: 'Ethrel application for pineapple flowering', layer: 'understory', species: 'Pineapple', notes: '100ppm solution, uniform flowering' },
    ],
    spacingGuide: [
      { species: 'Areca', rowSpacing: '7m', plantSpacing: '7m', depth: '45cm', method: 'pit' },
      { species: 'Jackfruit', rowSpacing: '14m', plantSpacing: '14m', depth: '60cm', method: 'pit' },
      { species: 'Pineapple', rowSpacing: '90cm', plantSpacing: '30cm', depth: '10cm', method: 'furrow' },
      { species: 'Passion Fruit', rowSpacing: '3m', plantSpacing: '3m', depth: '30cm', method: 'pit' },
    ],
    irrigationSchedule: [
      { stage: 'Establishment', frequency: 'Daily', method: 'Drip', amount: '4L per areca' },
      { stage: 'Vegetative growth', frequency: 'Alternate days', method: 'Drip', amount: '8L per areca' },
      { stage: 'Summer', frequency: 'Daily twice', method: 'Drip + sprinkler', amount: '15L per areca' },
      { stage: 'Pineapple flowering', frequency: 'Reduce irrigation', method: 'Stress', amount: 'Induce flowering' },
      { stage: 'Passion fruit fruiting', frequency: 'Every 2 days', method: 'Drip', amount: '10L per plant' },
    ],
    fertilizerSchedule: [
      { month: 1, fertilizer: 'Starter fertilizer 19:19:19', quantity: '50g per areca', method: 'Drip fertigation' },
      { month: 3, fertilizer: 'Urea', quantity: '100g per areca', method: 'Split application' },
      { month: 5, fertilizer: 'Ammonium sulfate', quantity: '150g per areca', method: 'Ring application' },
      { month: 7, fertilizer: 'MOP', quantity: '200g per areca', method: 'Pre-monsoon' },
      { month: 9, fertilizer: 'SSP + Borax', quantity: '250g + 10g', method: 'Basin application' },
      { month: 4, fertilizer: 'Pineapple: 12:32:16', quantity: '20g per plant', method: 'Side dressing' },
    ],
    pestManagement: [
      { pest: 'Yellow leaf disease (Areca)', symptom: 'Yellowing of leaves, phytoplasma', treatment: 'No cure, remove trees', preventive: 'Certified seedlings, leafhopper control' },
      { pest: 'Fruit borer (Jackfruit)', symptom: 'Bore holes in fruits', treatment: 'Carbaryl dust application', preventive: 'Fruit bagging, orchard hygiene' },
      { pest: 'Mealy bug (Pineapple)', symptom: 'White cottony masses, wilting', treatment: 'Dimethoate spray', preventive: 'Ant control, clean planting material' },
      { pest: 'Fusarium wilt (Passion fruit)', symptom: 'Sudden wilting, vascular browning', treatment: 'Remove affected plants', preventive: 'Resistant rootstock, soil solarization' },
      { pest: 'Phytophthora (Areca)', symptom: 'Nut fall, crown rot', treatment: 'Metalaxyl + Mancozeb spray', preventive: 'Drainage, Bordeaux paste on trunk' },
    ],
    harvestCalendar: [
      { species: 'Areca', firstHarvest: 'Year 6–7', peakSeason: 'November–March', method: 'Climbing, tender nuts', yield: '2–3 kg dry nuts/palm/year' },
      { species: 'Jackfruit', firstHarvest: 'Year 4–5', peakSeason: 'April–July', method: 'Cut mature fruits', yield: '30–50 fruits/tree' },
      { species: 'Pineapple', firstHarvest: 'Month 15–18', peakSeason: 'May–August', method: 'Twist and pull ripe fruit', yield: '40–50 tonnes/ha' },
      { species: 'Passion Fruit', firstHarvest: 'Month 8–10', peakSeason: 'Year-round', method: 'Collect fallen fruits', yield: '20–25 tonnes/ha' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹25,000/acre', primaryCrop: 'Passion Fruit' },
      { year: 2, revenue: '₹75,000/acre', primaryCrop: 'Pineapple + Passion Fruit' },
      { year: 3, revenue: '₹1,20,000/acre', primaryCrop: 'Pineapple (ratoon)' },
      { year: 4, revenue: '₹1,60,000/acre', primaryCrop: 'Jackfruit + Pineapple' },
      { year: 5, revenue: '₹2,20,000/acre', primaryCrop: 'Full production starts' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 5. MAHARASHTRA BALANCED
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-maharashtra',
    presetId: 'maharashtra-balanced',
    title: 'Maharashtra Balanced System',
    region: 'Western Maharashtra & Konkan',
    bestSeason: 'June (Early Monsoon)',
    soilRequirements: [
      'Medium black cotton soil or red laterite',
      'pH 6.5–8.0',
      'Deep soil preferred',
      'Good drainage for laterite',
      'High calcium content',
    ],
    suitableStates: ['Maharashtra', 'Goa', 'Karnataka', 'Gujarat'],
    climateZone: 'Tropical Monsoon',
    annualRainfall: '2500–4500 mm (Konkan) / 600–1000 mm (Western)',
    altitude: '0–800 m MSL',
    soilPrep: [
      'Clear jungle growth and peg positions in January–February',
      'Dig coconut pits (1.2m × 1.2m × 1.2m) during March–April',
      'Fill pits with red earth + husk ash + 20kg FYM',
      'Dig mango pits (1m cube) in alternate positions',
      'Install drip irrigation before onset of monsoon',
      'Apply dolomite lime 2kg per pit for acidic soils',
      'Create peripheral drainage system',
      'Plant Gliricidia for green manure on boundaries',
    ],
    nurseryWork: [
      'Coconut: Select Pratap or D×T hybrid seedlings',
      'Mango: Alphonso or Ratnagiri grafts from certified nurseries',
      'Black Pepper: Panniyur-1 rooted cuttings',
      'Turmeric: Salem variety rhizomes, 40–50g mother rhizomes',
      'Pre-treat all rhizomes with mancozeb (3g/L) for 30 minutes',
      'Acclimatize nursery plants to full sun gradually',
    ],
    plantingSequence: [
      { week: 1, activity: 'Plant coconut seedlings', layer: 'overstory', species: 'Coconut', notes: '8m × 8m square system' },
      { week: 2, activity: 'Plant mango grafts', layer: 'overstory', species: 'Mango', notes: 'Center of 4 coconuts, 8m apart' },
      { week: 3, activity: 'Install pepper standards', layer: 'vertical', species: 'Black Pepper', notes: 'On coconut trunks only' },
      { week: 4, activity: 'Plant pepper cuttings', layer: 'vertical', species: 'Black Pepper', notes: '2 cuttings per coconut' },
      { week: 5, activity: 'Prepare turmeric beds', layer: 'understory', species: 'Turmeric', notes: 'Raised beds between rows' },
      { week: 6, activity: 'Plant turmeric rhizomes', layer: 'understory', species: 'Turmeric', notes: '30cm × 20cm in beds' },
      { week: 10, activity: 'First weeding', layer: 'understory', species: 'All', notes: 'Manual weeding in beds' },
      { week: 14, activity: 'Mulching with coconut leaves', layer: 'understory', species: 'Turmeric', notes: 'Conserve moisture' },
    ],
    spacingGuide: [
      { species: 'Coconut', rowSpacing: '8m', plantSpacing: '8m', depth: '60cm', method: 'pit' },
      { species: 'Mango', rowSpacing: '8m', plantSpacing: '8m', depth: '60cm', method: 'pit' },
      { species: 'Black Pepper', rowSpacing: 'On coconut', plantSpacing: '2 per palm', depth: '15cm', method: 'pit' },
      { species: 'Turmeric', rowSpacing: '30cm', plantSpacing: '20cm', depth: '7cm', method: 'furrow' },
    ],
    irrigationSchedule: [
      { stage: 'Monsoon (June–Sept)', frequency: 'Natural', method: 'Rainfall', amount: 'Drainage focus' },
      { stage: 'Post-monsoon', frequency: 'Weekly', method: 'Drip', amount: '40L per tree' },
      { stage: 'Winter', frequency: 'Every 10 days', method: 'Drip + hose', amount: '60L per tree' },
      { stage: 'Summer', frequency: 'Every 3 days', method: 'Drip', amount: '100L per coconut' },
      { stage: 'Mango flowering', frequency: 'Minimal', method: 'Stress irrigation', amount: 'Reduce 50%' },
    ],
    fertilizerSchedule: [
      { month: 2, fertilizer: 'Groundnut cake slurry', quantity: '2kg per palm', method: 'Basin application' },
      { month: 4, fertilizer: 'NPK 19:19:19', quantity: '500g per tree', method: 'Fertigation' },
      { month: 6, fertilizer: 'Urea', quantity: '300g per palm', method: 'Ring application' },
      { month: 8, fertilizer: 'MOP + Mg sulfate', quantity: '400g + 50g per palm', method: 'Split dose' },
      { month: 10, fertilizer: 'Bone meal', quantity: '1kg per tree', method: 'Pre-flowering' },
      { month: 5, fertilizer: 'Turmeric: FYM + NPK', quantity: '30:60:30 kg/ha', method: 'Top dressing' },
    ],
    pestManagement: [
      { pest: 'Eriophyid mite (Coconut)', symptom: 'Button shedding, deformed nuts', treatment: 'Neem oil + sulfur spray', preventive: 'Root feeding with azadirachtin' },
      { pest: 'Stem borer (Mango)', symptom: 'Frass from bore holes', treatment: 'Inject dichlorvos', preventive: 'Trunk painting with carbaryl' },
      { pest: 'Pollu beetle (Pepper)', symptom: 'Feeding on developing spikes', treatment: 'Quinalphos 0.05% spray', preventive: 'Clean cultivation' },
      { pest: 'Leaf spot (Turmeric)', symptom: 'Brown spots on leaves', treatment: 'Mancozeb 2.5g/L spray', preventive: 'Crop rotation, resistant varieties' },
      { pest: 'Bud rot (Coconut)', symptom: 'Rotting of crown', treatment: 'Remove infected tissue + Bordeaux', preventive: 'Crown application of carboxyl paste' },
    ],
    harvestCalendar: [
      { species: 'Coconut', firstHarvest: 'Year 5–6', peakSeason: 'Year-round', method: 'Climbing/mechanical', yield: '100–150 nuts/palm' },
      { species: 'Mango', firstHarvest: 'Year 4–5', peakSeason: 'April–June', method: 'Hand picking', yield: '100–200 fruits/tree' },
      { species: 'Black Pepper', firstHarvest: 'Year 3', peakSeason: 'Jan–Feb', method: 'Hand harvest', yield: '2–3 kg dry/vine' },
      { species: 'Turmeric', firstHarvest: 'Month 8', peakSeason: 'Feb–March', method: 'Digging', yield: '25–30 tonnes fresh/ha' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹40,000/acre', primaryCrop: 'Turmeric' },
      { year: 2, revenue: '₹70,000/acre', primaryCrop: 'Turmeric (ratoon)' },
      { year: 3, revenue: '₹1,30,000/acre', primaryCrop: 'Pepper + Turmeric' },
      { year: 4, revenue: '₹2,00,000/acre', primaryCrop: 'Mango + Pepper' },
      { year: 5, revenue: '₹2,80,000/acre', primaryCrop: 'Full system production' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 6. COCONUT-COCOA PREMIUM
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-cocoa',
    presetId: 'coconut-cocoa-premium',
    title: 'Coconut-Cocoa Premium System',
    region: 'Kerala & Karnataka Midlands',
    bestSeason: 'June–July (Southwest Monsoon)',
    soilRequirements: [
      'Deep laterite or alluvial loam',
      'pH 6.0–7.0',
      'Organic matter > 3%',
      'Well-drained, no waterlogging',
      'High humidity tolerance',
    ],
    suitableStates: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
    climateZone: 'Tropical Humid',
    annualRainfall: '1500–3000 mm',
    altitude: '300–700 m MSL',
    soilPrep: [
      'Establish coconut garden 4–5 years before cocoa interplanting',
      'Ensure coconut canopy provides 50–60% shade',
      'Dig cocoa pits (45cm cube) between coconuts',
      'Apply 10kg FYM + 200g rock phosphate per pit',
      'Create raised beds if drainage is poor',
      'Install drip irrigation with shade-tolerant emitters',
      'Mulch heavily with cocoa husk or coconut leaves',
      'Control weeds thoroughly before planting',
    ],
    nurseryWork: [
      'Coconut: Already established (or plant COD tall variety)',
      'Cocoa: Hybrid seedlings (CCRP variety) from grafts',
      'Cardamom: Tissue culture plants (Njallani Green Gold)',
      'Black Pepper: Panniyur-1 rooted cuttings',
      'Vanilla: 3-node cuttings from certified gardens',
      'Harden cocoa seedlings under 50% shade for 1 month',
    ],
    plantingSequence: [
      { week: 1, activity: 'Plant cocoa seedlings', layer: 'middle', species: 'Cocoa', notes: 'Under coconut shade, 3m × 3m' },
      { week: 2, activity: 'Install temporary shade (pandal)', layer: 'middle', species: 'Cocoa', notes: '70% shade net if canopy thin' },
      { week: 3, activity: 'Plant cardamom in shaded gaps', layer: 'understory', species: 'Cardamom', notes: '2m × 1m under dense shade' },
      { week: 4, activity: 'Plant pepper on alternate coconuts', layer: 'vertical', species: 'Black Pepper', notes: '2 cuttings per palm' },
      { week: 5, activity: 'Plant vanilla on remaining coconuts', layer: 'vertical', species: 'Vanilla', notes: '1 cutting per palm' },
      { week: 8, activity: 'First weeding and mulching', layer: 'understory', species: 'All', notes: 'Heavy mulch 10cm thick' },
      { week: 12, activity: 'Shape cocoa (jorquette pruning)', layer: 'middle', species: 'Cocoa', notes: 'Single stem to 1.2m then branch' },
      { week: 20, activity: 'Train climbers up trunks', layer: 'vertical', species: 'Pepper/Vanilla', notes: 'Coir rope tying' },
    ],
    spacingGuide: [
      { species: 'Coconut', rowSpacing: '8m', plantSpacing: '8m', depth: '60cm', method: 'pit' },
      { species: 'Cocoa', rowSpacing: '3m', plantSpacing: '3m', depth: '30cm', method: 'pit' },
      { species: 'Cardamom', rowSpacing: '2m', plantSpacing: '1m', depth: '15cm', method: 'pit' },
      { species: 'Black Pepper', rowSpacing: 'On coconut', plantSpacing: '16m', depth: '15cm', method: 'pit' },
      { species: 'Vanilla', rowSpacing: 'On coconut', plantSpacing: '16m', depth: '10cm', method: 'mound' },
    ],
    irrigationSchedule: [
      { stage: 'Cocoa establishment', frequency: 'Every 2 days', method: 'Drip', amount: '8L per plant' },
      { stage: 'Monsoon (June–Sept)', frequency: 'Natural', method: 'Rainfall', amount: 'No irrigation needed' },
      { stage: 'Post-monsoon', frequency: 'Weekly', method: 'Drip', amount: '15L per cocoa' },
      { stage: 'Summer (stress avoidance)', frequency: 'Every 3 days', method: 'Drip + misting', amount: '20L per cocoa' },
      { stage: 'Cocoa pod development', frequency: 'Consistent moisture', method: 'Drip', amount: 'Avoid stress' },
    ],
    fertilizerSchedule: [
      { month: 2, fertilizer: 'NPK 10:5:20', quantity: '100g per cocoa', method: 'Ring application' },
      { month: 4, fertilizer: 'Vermicompost', quantity: '3kg per plant', method: 'Basin' },
      { month: 6, fertilizer: 'Urea', quantity: '50g per cocoa', method: 'Split' },
      { month: 8, fertilizer: 'Wood ash + dolomite', quantity: '500g per plant', method: 'Broadcast' },
      { month: 10, fertilizer: 'NPK + micronutrients', quantity: '150g per cocoa', method: 'Pre-flowering' },
      { month: 5, fertilizer: 'Cardamom: 32:60:30 NPK', quantity: 'kg/ha', method: 'Split dose' },
    ],
    pestManagement: [
      { pest: 'Black pod disease (Cocoa)', symptom: 'Black lesions on pods', treatment: 'Copper spray, remove affected pods', preventive: 'Regular harvest, good drainage' },
      { pest: 'Tea mosquito bug (Cocoa)', symptom: 'Necrotic lesions on pods', treatment: 'Quinalphos 0.05%', preventive: 'Shade regulation, avoid dense canopy' },
      { pest: 'Stem borer (Cocoa)', symptom: 'Galleries in trunk', treatment: 'Inject carbaryl paste', preventive: 'Paint trunk with Bordeaux' },
      { pest: 'Cherelle wilt', symptom: 'Small pod drop', treatment: 'Improve nutrition + irrigation', preventive: 'Balanced fertilization' },
      { pest: 'Root grub (Cardamom)', symptom: 'Yellowing, root damage', treatment: 'Chlorpyrifos drench', preventive: 'Light traps, crop rotation' },
    ],
    harvestCalendar: [
      { species: 'Coconut', firstHarvest: 'Established', peakSeason: 'Year-round', method: 'Climbing', yield: '80–100 nuts/palm' },
      { species: 'Cocoa', firstHarvest: 'Year 3', peakSeason: 'Oct–Dec, Apr–Jun', method: 'Secateurs, twice monthly', yield: '0.5–1.5 kg dry beans/tree' },
      { species: 'Cardamom', firstHarvest: 'Year 3', peakSeason: 'Aug–Feb', method: 'Hand picking', yield: '200–300 kg dry/ha' },
      { species: 'Black Pepper', firstHarvest: 'Year 3', peakSeason: 'Dec–Jan', method: 'Hand harvest', yield: '3–4 kg dry/vine' },
      { species: 'Vanilla', firstHarvest: 'Year 4', peakSeason: 'May–Jul', method: 'Hand harvest pods', yield: '500 kg green/ha' },
    ],
    revenueProjection: [
      { year: 1, revenue: '₹50,000/acre', primaryCrop: 'Coconut (existing)' },
      { year: 2, revenue: '₹70,000/acre', primaryCrop: 'Coconut + Cardamom' },
      { year: 3, revenue: '₹1,80,000/acre', primaryCrop: 'Cocoa + Pepper + Cardamom' },
      { year: 4, revenue: '₹3,50,000/acre', primaryCrop: 'Vanilla + Cocoa' },
      { year: 5, revenue: '₹5,00,000/acre', primaryCrop: 'Peak production all crops' },
    ],
  },
];

// Export helper to get guide by preset ID
export function getPlantingGuide(presetId: string): PlantingGuide | undefined {
  return plantingGuides.find((g) => g.presetId === presetId);
}

// Export all preset IDs
export const presetIds = plantingGuides.map((g) => g.presetId);
