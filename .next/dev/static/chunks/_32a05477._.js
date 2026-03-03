(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/data/planting-guides.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Planting Guides Data
 * Comprehensive guides for all 6 regional preset models
 * Based on Indian agricultural research and best practices
 */ __turbopack_context__.s([
    "getPlantingGuide",
    ()=>getPlantingGuide,
    "plantingGuides",
    ()=>plantingGuides,
    "presetIds",
    ()=>presetIds
]);
const plantingGuides = [
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
            'Depth > 2m for coconut roots'
        ],
        suitableStates: [
            'Kerala',
            'Karnataka',
            'Tamil Nadu',
            'Goa'
        ],
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
            'Apply 2kg lime per pit if soil pH < 5.5'
        ],
        nurseryWork: [
            'Select 10–12 month old coconut seedlings (Chowghat Dwarf variety)',
            'Choose seedlings with 6+ leaves, thick collar, early splitting',
            'Procure disease-free banana suckers (Nendran or Robusta) weighing 1.5–2kg',
            'Treat banana suckers with Pseudomonas (20g/L) for 30 minutes',
            'Source high-yielding black pepper cuttings (Panniyur-1) from certified nurseries',
            'Root pepper cuttings in poly bags 3 months before transplanting',
            'Prepare turmeric rhizomes (Salem or Erode local) weighing 30–40g each',
            'Treat turmeric with Trichoderma (5g/L) to prevent rhizome rot'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Plant coconut seedlings in prepared pits',
                layer: 'overstory',
                species: 'Coconut',
                notes: 'Water immediately, provide shade cloth for 2 weeks'
            },
            {
                week: 2,
                activity: 'Install black pepper stakes at coconut base',
                layer: 'vertical',
                species: 'Black Pepper',
                notes: '2 cuttings per coconut, north-south orientation'
            },
            {
                week: 3,
                activity: 'Plant banana suckers in between coconut rows',
                layer: 'middle',
                species: 'Banana',
                notes: '3m from coconuts, avoid low-lying areas'
            },
            {
                week: 4,
                activity: 'Prepare beds for turmeric planting',
                layer: 'understory',
                species: 'Turmeric',
                notes: 'Raised beds 15cm high, 1m wide'
            },
            {
                week: 5,
                activity: 'Plant turmeric rhizomes in prepared beds',
                layer: 'understory',
                species: 'Turmeric',
                notes: '30×25cm spacing, 5cm depth'
            },
            {
                week: 8,
                activity: 'First weeding and mulching',
                layer: 'understory',
                species: 'All',
                notes: 'Use coconut fronds as mulch'
            },
            {
                week: 12,
                activity: 'Apply first fertilizer dose',
                layer: 'overstory',
                species: 'Coconut',
                notes: 'NPK 500g per palm in circular basin'
            },
            {
                week: 16,
                activity: 'Train pepper vines to coconut trunk',
                layer: 'vertical',
                species: 'Black Pepper',
                notes: 'Use coir rope, tie loosely every 30cm'
            }
        ],
        spacingGuide: [
            {
                species: 'Coconut',
                rowSpacing: '8m',
                plantSpacing: '8m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Black Pepper',
                rowSpacing: 'On coconut',
                plantSpacing: '2 per palm',
                depth: '15cm',
                method: 'pit'
            },
            {
                species: 'Banana',
                rowSpacing: '4m',
                plantSpacing: '3m',
                depth: '45cm',
                method: 'pit'
            },
            {
                species: 'Turmeric',
                rowSpacing: '30cm',
                plantSpacing: '25cm',
                depth: '5cm',
                method: 'furrow'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Establishment (Month 1–3)',
                frequency: 'Every 2 days',
                method: 'Drip irrigation',
                amount: '40L per coconut'
            },
            {
                stage: 'Active growth (Month 4–8)',
                frequency: 'Every 4 days',
                method: 'Drip + sprinkler',
                amount: '80L per coconut'
            },
            {
                stage: 'Monsoon (June–September)',
                frequency: 'As needed',
                method: 'Natural rainfall',
                amount: 'Supplemental only'
            },
            {
                stage: 'Summer (March–May)',
                frequency: 'Every 2 days',
                method: 'Drip irrigation',
                amount: '100L per coconut'
            },
            {
                stage: 'Fruiting (Year 3+)',
                frequency: 'Every 3 days',
                method: 'Basin irrigation',
                amount: '200L per coconut'
            }
        ],
        fertilizerSchedule: [
            {
                month: 1,
                fertilizer: 'Organic starter (FYM + Neem cake)',
                quantity: '20kg per coconut',
                method: 'Basin application'
            },
            {
                month: 3,
                fertilizer: 'NPK 13:5:24',
                quantity: '500g per palm',
                method: 'Ring application 1m from trunk'
            },
            {
                month: 6,
                fertilizer: 'Urea + MOP',
                quantity: '300g + 500g per palm',
                method: 'Split application'
            },
            {
                month: 9,
                fertilizer: 'Bone meal + Wood ash',
                quantity: '2kg per palm',
                method: 'Broadcasting in basin'
            },
            {
                month: 12,
                fertilizer: 'Complete fertilizer + micronutrients',
                quantity: '1kg NPK + Borax 50g',
                method: 'Ring application'
            },
            {
                month: 4,
                fertilizer: 'Banana: 10:26:26 NPK',
                quantity: '200g per plant',
                method: 'Side dressing'
            },
            {
                month: 7,
                fertilizer: 'Banana: Urea',
                quantity: '100g per plant',
                method: 'Foliar spray 1%'
            },
            {
                month: 5,
                fertilizer: 'Turmeric: FYM top dress',
                quantity: '5 tonnes/ha',
                method: 'Between rows'
            }
        ],
        pestManagement: [
            {
                pest: 'Rhinoceros Beetle (Coconut)',
                symptom: 'V-shaped cuts on unopened fronds, bore holes',
                treatment: 'Hook out beetles, apply Metarhizium to breeding sites',
                preventive: 'Fill leaf axils with sand + carbaryl (1:20)'
            },
            {
                pest: 'Red Palm Weevil',
                symptom: 'Yellowing crown, toppling of crown',
                treatment: 'Inject trunk with imidacloprid',
                preventive: 'Avoid crown damage, treat wounds with Bordeaux paste'
            },
            {
                pest: 'Quick Wilt (Pepper)',
                symptom: 'Sudden wilting, root rot',
                treatment: 'Drench with Metalaxyl (2g/L)',
                preventive: 'Improve drainage, apply Trichoderma'
            },
            {
                pest: 'Banana Pseudostem Weevil',
                symptom: 'Tunneling in pseudostem, oozing',
                treatment: 'Trap with split pseudostem, apply chlorpyrifos',
                preventive: 'Clean cultivation, destroy crop residues'
            },
            {
                pest: 'Shoot Borer (Turmeric)',
                symptom: 'Dead hearts, wilting',
                treatment: 'Spray quinalphos 0.05%',
                preventive: 'Deep summer ploughing, crop rotation'
            }
        ],
        harvestCalendar: [
            {
                species: 'Coconut',
                firstHarvest: 'Year 5–6',
                peakSeason: 'Year-round (peak Mar–May)',
                method: 'Climbing or mechanical harvester',
                yield: '80–120 nuts/palm/year'
            },
            {
                species: 'Black Pepper',
                firstHarvest: 'Year 3',
                peakSeason: 'December–January',
                method: 'Hand picking when berries turn red',
                yield: '2–4 kg dry/vine'
            },
            {
                species: 'Banana',
                firstHarvest: 'Month 12–14',
                peakSeason: 'Continuous after establishment',
                method: 'Cut bunch when fingers plump',
                yield: '15–25 kg/bunch'
            },
            {
                species: 'Turmeric',
                firstHarvest: 'Month 8–9',
                peakSeason: 'January–March',
                method: 'Dig rhizomes when leaves yellow',
                yield: '20–25 tonnes fresh/ha'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹45,000/acre',
                primaryCrop: 'Banana + Turmeric'
            },
            {
                year: 2,
                revenue: '₹75,000/acre',
                primaryCrop: 'Banana + Turmeric'
            },
            {
                year: 3,
                revenue: '₹1,20,000/acre',
                primaryCrop: 'Pepper + Banana'
            },
            {
                year: 4,
                revenue: '₹1,80,000/acre',
                primaryCrop: 'Pepper + Coconut (first)'
            },
            {
                year: 5,
                revenue: '₹2,50,000/acre',
                primaryCrop: 'Full production all crops'
            }
        ]
    },
    // ═══════════════════════════════════════════════════════════════════════
    // 2. KARNATAKA SPICE GARDEN
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'guide-karnataka',
        presetId: 'karnataka-garden',
        title: 'Karnataka Spice Garden',
        region: 'Kodagu & Chikmagalur',
        bestSeason: 'May–June (Pre-monsoon showers)',
        soilRequirements: [
            'Forest loam or laterite',
            'pH 6.0–7.0',
            'Rich in organic matter (>3%)',
            'Good water retention',
            'Partial shade tolerance'
        ],
        suitableStates: [
            'Karnataka',
            'Kerala',
            'Tamil Nadu'
        ],
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
            'Establish windbreaks with Casuarina on exposed edges'
        ],
        nurseryWork: [
            'Silver Oak: Sow seeds in nursery beds during March',
            'Papaya: Select Taiwan Red Lady or Coorg Honey Dew varieties',
            'Cardamom: Procure tissue culture plants (Malabar or Mysore)',
            'Vanilla: Obtain 3-node cuttings from certified disease-free gardens',
            'Root vanilla cuttings in shade house for 6 months before field planting',
            'Harden off all seedlings 2 weeks before transplanting'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Plant Silver Oak seedlings',
                layer: 'overstory',
                species: 'Silver Oak',
                notes: '10m × 10m spacing, marking with pegs'
            },
            {
                week: 2,
                activity: 'Establish vanilla support structures',
                layer: 'vertical',
                species: 'Vanilla',
                notes: 'Use Gliricidia or Erythrina as live supports'
            },
            {
                week: 3,
                activity: 'Plant papaya seedlings',
                layer: 'middle',
                species: 'Papaya',
                notes: '3m × 3m, in pits 45cm deep'
            },
            {
                week: 4,
                activity: 'Plant vanilla cuttings at base of supports',
                layer: 'vertical',
                species: 'Vanilla',
                notes: 'Bury 2 nodes, train upward'
            },
            {
                week: 6,
                activity: 'Plant cardamom in shaded areas',
                layer: 'understory',
                species: 'Cardamom',
                notes: '2m × 2m, under Silver Oak canopy'
            },
            {
                week: 8,
                activity: 'First mulching and shade regulation',
                layer: 'understory',
                species: 'Cardamom',
                notes: '50–70% shade optimal'
            },
            {
                week: 12,
                activity: 'Train vanilla vines to horizontal growth',
                layer: 'vertical',
                species: 'Vanilla',
                notes: 'Loop vines at 2m height'
            },
            {
                week: 20,
                activity: 'Thinning of papaya (remove males)',
                layer: 'middle',
                species: 'Papaya',
                notes: 'Retain 1 male per 10 females'
            }
        ],
        spacingGuide: [
            {
                species: 'Silver Oak',
                rowSpacing: '10m',
                plantSpacing: '10m',
                depth: '45cm',
                method: 'pit'
            },
            {
                species: 'Papaya',
                rowSpacing: '3m',
                plantSpacing: '3m',
                depth: '30cm',
                method: 'pit'
            },
            {
                species: 'Cardamom',
                rowSpacing: '2m',
                plantSpacing: '2m',
                depth: '15cm',
                method: 'pit'
            },
            {
                species: 'Vanilla',
                rowSpacing: '3m',
                plantSpacing: '2.5m',
                depth: '10cm',
                method: 'mound'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Establishment',
                frequency: 'Daily',
                method: 'Sprinkler',
                amount: '5mm/day'
            },
            {
                stage: 'Vegetative growth',
                frequency: 'Alternate days',
                method: 'Drip',
                amount: '4L/plant'
            },
            {
                stage: 'Flowering (Cardamom)',
                frequency: 'Daily light irrigation',
                method: 'Misting',
                amount: '80% humidity maintenance'
            },
            {
                stage: 'Dry season',
                frequency: 'Every 2 days',
                method: 'Drip',
                amount: '8L/plant'
            },
            {
                stage: 'Vanilla flowering',
                frequency: 'Maintain stress',
                method: 'Reduce irrigation',
                amount: '50% reduction for 6 weeks'
            }
        ],
        fertilizerSchedule: [
            {
                month: 2,
                fertilizer: 'NPK 10:10:10',
                quantity: '200g per cardamom clump',
                method: 'Ring application'
            },
            {
                month: 4,
                fertilizer: 'Vermicompost',
                quantity: '5kg per papaya',
                method: 'Basin application'
            },
            {
                month: 6,
                fertilizer: 'Potash (MOP)',
                quantity: '150g per vanilla vine',
                method: 'Drip fertigation'
            },
            {
                month: 8,
                fertilizer: 'Micronutrient spray (Zn, Mg, B)',
                quantity: '0.5% solution',
                method: 'Foliar spray'
            },
            {
                month: 10,
                fertilizer: 'Organic cake mixture',
                quantity: '1kg per cardamom',
                method: 'Top dressing'
            },
            {
                month: 12,
                fertilizer: 'FYM + wood ash',
                quantity: '10kg per tree',
                method: 'Broadcasting'
            }
        ],
        pestManagement: [
            {
                pest: 'Thrips (Cardamom)',
                symptom: 'Silvery streaks on leaves, malformed capsules',
                treatment: 'Spray imidacloprid 0.3ml/L',
                preventive: 'Maintain shade, avoid water stress'
            },
            {
                pest: 'Katte disease (Cardamom)',
                symptom: 'Mosaic patterns on leaves',
                treatment: 'Remove and burn affected plants',
                preventive: 'Aphid vector control, disease-free planting material'
            },
            {
                pest: 'Root rot (Vanilla)',
                symptom: 'Yellowing, stem base rotting',
                treatment: 'Drench with copper oxychloride',
                preventive: 'Avoid waterlogging, raised beds'
            },
            {
                pest: 'Papaya ring spot virus',
                symptom: 'Ring patterns on fruits, leaf distortion',
                treatment: 'No cure, remove affected plants',
                preventive: 'Resistant varieties, aphid control'
            },
            {
                pest: 'Coffee berry borer (if intercropped)',
                symptom: 'Holes in berries',
                treatment: 'Beauveria bassiana spray',
                preventive: 'Timely harvest, sanitation'
            }
        ],
        harvestCalendar: [
            {
                species: 'Silver Oak',
                firstHarvest: 'Year 8–10',
                peakSeason: 'Continuous pruning',
                method: 'Selective pruning for timber',
                yield: '40–60 cu.ft/tree at maturity'
            },
            {
                species: 'Papaya',
                firstHarvest: 'Month 10–12',
                peakSeason: 'Year-round',
                method: 'Twist and pull ripe fruits',
                yield: '50–80 kg/plant/year'
            },
            {
                species: 'Cardamom',
                firstHarvest: 'Year 3',
                peakSeason: 'August–February',
                method: 'Hand picking, 6–8 rounds',
                yield: '150–250 kg dry/ha'
            },
            {
                species: 'Vanilla',
                firstHarvest: 'Year 4',
                peakSeason: 'May–July',
                method: 'Hand harvest mature pods',
                yield: '400–600 kg green/ha'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹30,000/acre',
                primaryCrop: 'Papaya (first fruits)'
            },
            {
                year: 2,
                revenue: '₹80,000/acre',
                primaryCrop: 'Papaya'
            },
            {
                year: 3,
                revenue: '₹1,50,000/acre',
                primaryCrop: 'Cardamom + Papaya'
            },
            {
                year: 4,
                revenue: '₹3,00,000/acre',
                primaryCrop: 'Vanilla + Cardamom'
            },
            {
                year: 5,
                revenue: '₹4,50,000/acre',
                primaryCrop: 'Full production (Vanilla peak)'
            }
        ]
    },
    // ═══════════════════════════════════════════════════════════════════════
    // 3. TAMIL NADU TROPICAL
    // ═══════════════════════════════════════════════════════════════════════
    {
        id: 'guide-tamilnadu',
        presetId: 'tamilnadu-tropical',
        title: 'Tamil Nadu Tropical Garden',
        region: 'Coimbatore & Nilgiris Foothills',
        bestSeason: 'October–November (Northeast Monsoon)',
        soilRequirements: [
            'Red sandy loam',
            'pH 6.5–7.5',
            'Good drainage essential',
            'Moderate organic matter',
            'Calcium-rich soils preferred'
        ],
        suitableStates: [
            'Tamil Nadu',
            'Karnataka',
            'Andhra Pradesh'
        ],
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
            'Apply gypsum 500kg/ha if soil is sodic'
        ],
        nurseryWork: [
            'Mango: Procure grafted Alphonso/Banganapalli from certified nursery',
            'Guava: Select Taiwan Pink or Allahabad Safeda grafts',
            'Ginger: Seed rhizomes from high-yield variety (Rio de Janeiro)',
            'Betel Leaf: Obtain disease-free vines from established gardens',
            'Treat all planting material with Trichoderma + Pseudomonas',
            'Harden mango grafts under 50% shade for 2 weeks'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Plant mango grafts in prepared pits',
                layer: 'overstory',
                species: 'Mango',
                notes: 'Graft union 15cm above soil'
            },
            {
                week: 2,
                activity: 'Install betel leaf pandals/supports',
                layer: 'vertical',
                species: 'Betel Leaf',
                notes: 'Use bamboo frame 2m height'
            },
            {
                week: 3,
                activity: 'Plant guava between mango rows',
                layer: 'middle',
                species: 'Guava',
                notes: '6m × 6m pattern, staggered'
            },
            {
                week: 4,
                activity: 'Prepare ginger beds and plant',
                layer: 'understory',
                species: 'Ginger',
                notes: '25cm × 25cm spacing in beds'
            },
            {
                week: 5,
                activity: 'Plant betel leaf cuttings',
                layer: 'vertical',
                species: 'Betel Leaf',
                notes: '90cm × 90cm under pandal'
            },
            {
                week: 8,
                activity: 'First earthing up of ginger',
                layer: 'understory',
                species: 'Ginger',
                notes: 'Hill soil to 10cm around plants'
            },
            {
                week: 12,
                activity: 'Mulch all trees with paddy straw',
                layer: 'overstory',
                species: 'All trees',
                notes: '15cm thick layer in basin'
            },
            {
                week: 16,
                activity: 'Second earthing up of ginger',
                layer: 'understory',
                species: 'Ginger',
                notes: 'Additional 10cm mounding'
            }
        ],
        spacingGuide: [
            {
                species: 'Mango',
                rowSpacing: '9m',
                plantSpacing: '9m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Guava',
                rowSpacing: '6m',
                plantSpacing: '6m',
                depth: '45cm',
                method: 'pit'
            },
            {
                species: 'Ginger',
                rowSpacing: '30cm',
                plantSpacing: '25cm',
                depth: '5cm',
                method: 'furrow'
            },
            {
                species: 'Betel Leaf',
                rowSpacing: '90cm',
                plantSpacing: '90cm',
                depth: '15cm',
                method: 'mound'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Establishment',
                frequency: 'Every 3 days',
                method: 'Drip',
                amount: '20L per tree'
            },
            {
                stage: 'Summer (Mar–May)',
                frequency: 'Daily',
                method: 'Drip',
                amount: '40L per tree'
            },
            {
                stage: 'Monsoon',
                frequency: 'Based on rainfall',
                method: 'Supplemental',
                amount: 'Avoid waterlogging'
            },
            {
                stage: 'Flowering (Mango)',
                frequency: 'Reduce irrigation',
                method: 'Stress irrigation',
                amount: 'Light watering'
            },
            {
                stage: 'Fruit development',
                frequency: 'Every 2 days',
                method: 'Drip + basin',
                amount: '60L per tree'
            }
        ],
        fertilizerSchedule: [
            {
                month: 2,
                fertilizer: 'Urea',
                quantity: '200g per mango',
                method: 'Ring application'
            },
            {
                month: 4,
                fertilizer: 'DAP',
                quantity: '300g per tree',
                method: 'Band application'
            },
            {
                month: 6,
                fertilizer: 'MOP + Micronutrients',
                quantity: '200g + spray',
                method: 'Soil + foliar'
            },
            {
                month: 8,
                fertilizer: 'FYM',
                quantity: '20kg per tree',
                method: 'Basin incorporation'
            },
            {
                month: 10,
                fertilizer: 'SSP',
                quantity: '500g per tree',
                method: 'Pre-flowering boost'
            },
            {
                month: 3,
                fertilizer: 'Ginger: NPK complex',
                quantity: '100kg/ha',
                method: 'Side dressing'
            }
        ],
        pestManagement: [
            {
                pest: 'Mango hopper',
                symptom: 'Honeydew on leaves, sooty mold',
                treatment: 'Imidacloprid 0.3ml/L spray',
                preventive: 'Orchard sanitation, avoid dense planting'
            },
            {
                pest: 'Fruit fly',
                symptom: 'Maggots in ripe fruits',
                treatment: 'Methyl eugenol traps',
                preventive: 'Collect and destroy fallen fruits'
            },
            {
                pest: 'Powdery mildew',
                symptom: 'White powder on inflorescence',
                treatment: 'Sulfur spray 3g/L',
                preventive: 'Avoid excess nitrogen, good ventilation'
            },
            {
                pest: 'Guava wilt',
                symptom: 'Sudden wilting, root rot',
                treatment: 'Remove affected trees',
                preventive: 'Resistant rootstock, drainage'
            },
            {
                pest: 'Ginger soft rot',
                symptom: 'Yellowing, rotting rhizome',
                treatment: 'Drench with Bordeaux mixture',
                preventive: 'Seed treatment, raised beds'
            }
        ],
        harvestCalendar: [
            {
                species: 'Mango',
                firstHarvest: 'Year 4–5',
                peakSeason: 'April–June',
                method: 'Hand harvest with pole harvester',
                yield: '100–150 fruits/tree (mature)'
            },
            {
                species: 'Guava',
                firstHarvest: 'Year 2',
                peakSeason: 'Aug–Sept, Feb–Mar',
                method: 'Hand picking at color break',
                yield: '80–100 kg/tree/year'
            },
            {
                species: 'Ginger',
                firstHarvest: 'Month 8–9',
                peakSeason: 'December–February',
                method: 'Fork lifting, careful digging',
                yield: '15–20 tonnes/ha'
            },
            {
                species: 'Betel Leaf',
                firstHarvest: 'Month 8',
                peakSeason: 'Year-round',
                method: 'Selective leaf picking',
                yield: '40–50 leaves/vine/month'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹35,000/acre',
                primaryCrop: 'Ginger + Betel'
            },
            {
                year: 2,
                revenue: '₹65,000/acre',
                primaryCrop: 'Guava + Ginger'
            },
            {
                year: 3,
                revenue: '₹95,000/acre',
                primaryCrop: 'Guava + Betel'
            },
            {
                year: 4,
                revenue: '₹1,40,000/acre',
                primaryCrop: 'Mango (first) + Guava'
            },
            {
                year: 5,
                revenue: '₹2,00,000/acre',
                primaryCrop: 'Full production'
            }
        ]
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
            'Good drainage'
        ],
        suitableStates: [
            'Andhra Pradesh',
            'Telangana',
            'Odisha',
            'Tamil Nadu'
        ],
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
            'Apply zinc sulfate 25kg/ha for deficiency correction'
        ],
        nurseryWork: [
            'Areca: Select sprouted nuts (Mangala or Sreemangala variety)',
            'Jackfruit: Grafted seedlings of Sindoor or local varieties',
            'Pineapple: Suckers from high-yielding pest-free plants',
            'Passion fruit: Rooted cuttings of Purple variety',
            'Treat areca seedlings with Trichoderma before transplanting',
            'Grade pineapple suckers by size for uniform crop'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Transplant 12-month areca seedlings',
                layer: 'overstory',
                species: 'Areca',
                notes: '7m × 7m, east-west rows'
            },
            {
                week: 2,
                activity: 'Plant jackfruit in alternate rows',
                layer: 'overstory',
                species: 'Jackfruit',
                notes: '14m × 14m, between areca'
            },
            {
                week: 3,
                activity: 'Install passion fruit trellising',
                layer: 'vertical',
                species: 'Passion Fruit',
                notes: 'T-bar system 2m height'
            },
            {
                week: 4,
                activity: 'Plant passion fruit',
                layer: 'vertical',
                species: 'Passion Fruit',
                notes: '3m × 3m on trellis rows'
            },
            {
                week: 6,
                activity: 'Plant pineapple in beds',
                layer: 'understory',
                species: 'Pineapple',
                notes: 'Double row system, 90×60×30cm'
            },
            {
                week: 10,
                activity: 'First weeding and nitrogen application',
                layer: 'understory',
                species: 'Pineapple',
                notes: '20g urea per plant'
            },
            {
                week: 16,
                activity: 'Train passion fruit to trellis',
                layer: 'vertical',
                species: 'Passion Fruit',
                notes: 'Remove lateral shoots below wire'
            },
            {
                week: 24,
                activity: 'Ethrel application for pineapple flowering',
                layer: 'understory',
                species: 'Pineapple',
                notes: '100ppm solution, uniform flowering'
            }
        ],
        spacingGuide: [
            {
                species: 'Areca',
                rowSpacing: '7m',
                plantSpacing: '7m',
                depth: '45cm',
                method: 'pit'
            },
            {
                species: 'Jackfruit',
                rowSpacing: '14m',
                plantSpacing: '14m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Pineapple',
                rowSpacing: '90cm',
                plantSpacing: '30cm',
                depth: '10cm',
                method: 'furrow'
            },
            {
                species: 'Passion Fruit',
                rowSpacing: '3m',
                plantSpacing: '3m',
                depth: '30cm',
                method: 'pit'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Establishment',
                frequency: 'Daily',
                method: 'Drip',
                amount: '4L per areca'
            },
            {
                stage: 'Vegetative growth',
                frequency: 'Alternate days',
                method: 'Drip',
                amount: '8L per areca'
            },
            {
                stage: 'Summer',
                frequency: 'Daily twice',
                method: 'Drip + sprinkler',
                amount: '15L per areca'
            },
            {
                stage: 'Pineapple flowering',
                frequency: 'Reduce irrigation',
                method: 'Stress',
                amount: 'Induce flowering'
            },
            {
                stage: 'Passion fruit fruiting',
                frequency: 'Every 2 days',
                method: 'Drip',
                amount: '10L per plant'
            }
        ],
        fertilizerSchedule: [
            {
                month: 1,
                fertilizer: 'Starter fertilizer 19:19:19',
                quantity: '50g per areca',
                method: 'Drip fertigation'
            },
            {
                month: 3,
                fertilizer: 'Urea',
                quantity: '100g per areca',
                method: 'Split application'
            },
            {
                month: 5,
                fertilizer: 'Ammonium sulfate',
                quantity: '150g per areca',
                method: 'Ring application'
            },
            {
                month: 7,
                fertilizer: 'MOP',
                quantity: '200g per areca',
                method: 'Pre-monsoon'
            },
            {
                month: 9,
                fertilizer: 'SSP + Borax',
                quantity: '250g + 10g',
                method: 'Basin application'
            },
            {
                month: 4,
                fertilizer: 'Pineapple: 12:32:16',
                quantity: '20g per plant',
                method: 'Side dressing'
            }
        ],
        pestManagement: [
            {
                pest: 'Yellow leaf disease (Areca)',
                symptom: 'Yellowing of leaves, phytoplasma',
                treatment: 'No cure, remove trees',
                preventive: 'Certified seedlings, leafhopper control'
            },
            {
                pest: 'Fruit borer (Jackfruit)',
                symptom: 'Bore holes in fruits',
                treatment: 'Carbaryl dust application',
                preventive: 'Fruit bagging, orchard hygiene'
            },
            {
                pest: 'Mealy bug (Pineapple)',
                symptom: 'White cottony masses, wilting',
                treatment: 'Dimethoate spray',
                preventive: 'Ant control, clean planting material'
            },
            {
                pest: 'Fusarium wilt (Passion fruit)',
                symptom: 'Sudden wilting, vascular browning',
                treatment: 'Remove affected plants',
                preventive: 'Resistant rootstock, soil solarization'
            },
            {
                pest: 'Phytophthora (Areca)',
                symptom: 'Nut fall, crown rot',
                treatment: 'Metalaxyl + Mancozeb spray',
                preventive: 'Drainage, Bordeaux paste on trunk'
            }
        ],
        harvestCalendar: [
            {
                species: 'Areca',
                firstHarvest: 'Year 6–7',
                peakSeason: 'November–March',
                method: 'Climbing, tender nuts',
                yield: '2–3 kg dry nuts/palm/year'
            },
            {
                species: 'Jackfruit',
                firstHarvest: 'Year 4–5',
                peakSeason: 'April–July',
                method: 'Cut mature fruits',
                yield: '30–50 fruits/tree'
            },
            {
                species: 'Pineapple',
                firstHarvest: 'Month 15–18',
                peakSeason: 'May–August',
                method: 'Twist and pull ripe fruit',
                yield: '40–50 tonnes/ha'
            },
            {
                species: 'Passion Fruit',
                firstHarvest: 'Month 8–10',
                peakSeason: 'Year-round',
                method: 'Collect fallen fruits',
                yield: '20–25 tonnes/ha'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹25,000/acre',
                primaryCrop: 'Passion Fruit'
            },
            {
                year: 2,
                revenue: '₹75,000/acre',
                primaryCrop: 'Pineapple + Passion Fruit'
            },
            {
                year: 3,
                revenue: '₹1,20,000/acre',
                primaryCrop: 'Pineapple (ratoon)'
            },
            {
                year: 4,
                revenue: '₹1,60,000/acre',
                primaryCrop: 'Jackfruit + Pineapple'
            },
            {
                year: 5,
                revenue: '₹2,20,000/acre',
                primaryCrop: 'Full production starts'
            }
        ]
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
            'High calcium content'
        ],
        suitableStates: [
            'Maharashtra',
            'Goa',
            'Karnataka',
            'Gujarat'
        ],
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
            'Plant Gliricidia for green manure on boundaries'
        ],
        nurseryWork: [
            'Coconut: Select Pratap or D×T hybrid seedlings',
            'Mango: Alphonso or Ratnagiri grafts from certified nurseries',
            'Black Pepper: Panniyur-1 rooted cuttings',
            'Turmeric: Salem variety rhizomes, 40–50g mother rhizomes',
            'Pre-treat all rhizomes with mancozeb (3g/L) for 30 minutes',
            'Acclimatize nursery plants to full sun gradually'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Plant coconut seedlings',
                layer: 'overstory',
                species: 'Coconut',
                notes: '8m × 8m square system'
            },
            {
                week: 2,
                activity: 'Plant mango grafts',
                layer: 'overstory',
                species: 'Mango',
                notes: 'Center of 4 coconuts, 8m apart'
            },
            {
                week: 3,
                activity: 'Install pepper standards',
                layer: 'vertical',
                species: 'Black Pepper',
                notes: 'On coconut trunks only'
            },
            {
                week: 4,
                activity: 'Plant pepper cuttings',
                layer: 'vertical',
                species: 'Black Pepper',
                notes: '2 cuttings per coconut'
            },
            {
                week: 5,
                activity: 'Prepare turmeric beds',
                layer: 'understory',
                species: 'Turmeric',
                notes: 'Raised beds between rows'
            },
            {
                week: 6,
                activity: 'Plant turmeric rhizomes',
                layer: 'understory',
                species: 'Turmeric',
                notes: '30cm × 20cm in beds'
            },
            {
                week: 10,
                activity: 'First weeding',
                layer: 'understory',
                species: 'All',
                notes: 'Manual weeding in beds'
            },
            {
                week: 14,
                activity: 'Mulching with coconut leaves',
                layer: 'understory',
                species: 'Turmeric',
                notes: 'Conserve moisture'
            }
        ],
        spacingGuide: [
            {
                species: 'Coconut',
                rowSpacing: '8m',
                plantSpacing: '8m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Mango',
                rowSpacing: '8m',
                plantSpacing: '8m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Black Pepper',
                rowSpacing: 'On coconut',
                plantSpacing: '2 per palm',
                depth: '15cm',
                method: 'pit'
            },
            {
                species: 'Turmeric',
                rowSpacing: '30cm',
                plantSpacing: '20cm',
                depth: '7cm',
                method: 'furrow'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Monsoon (June–Sept)',
                frequency: 'Natural',
                method: 'Rainfall',
                amount: 'Drainage focus'
            },
            {
                stage: 'Post-monsoon',
                frequency: 'Weekly',
                method: 'Drip',
                amount: '40L per tree'
            },
            {
                stage: 'Winter',
                frequency: 'Every 10 days',
                method: 'Drip + hose',
                amount: '60L per tree'
            },
            {
                stage: 'Summer',
                frequency: 'Every 3 days',
                method: 'Drip',
                amount: '100L per coconut'
            },
            {
                stage: 'Mango flowering',
                frequency: 'Minimal',
                method: 'Stress irrigation',
                amount: 'Reduce 50%'
            }
        ],
        fertilizerSchedule: [
            {
                month: 2,
                fertilizer: 'Groundnut cake slurry',
                quantity: '2kg per palm',
                method: 'Basin application'
            },
            {
                month: 4,
                fertilizer: 'NPK 19:19:19',
                quantity: '500g per tree',
                method: 'Fertigation'
            },
            {
                month: 6,
                fertilizer: 'Urea',
                quantity: '300g per palm',
                method: 'Ring application'
            },
            {
                month: 8,
                fertilizer: 'MOP + Mg sulfate',
                quantity: '400g + 50g per palm',
                method: 'Split dose'
            },
            {
                month: 10,
                fertilizer: 'Bone meal',
                quantity: '1kg per tree',
                method: 'Pre-flowering'
            },
            {
                month: 5,
                fertilizer: 'Turmeric: FYM + NPK',
                quantity: '30:60:30 kg/ha',
                method: 'Top dressing'
            }
        ],
        pestManagement: [
            {
                pest: 'Eriophyid mite (Coconut)',
                symptom: 'Button shedding, deformed nuts',
                treatment: 'Neem oil + sulfur spray',
                preventive: 'Root feeding with azadirachtin'
            },
            {
                pest: 'Stem borer (Mango)',
                symptom: 'Frass from bore holes',
                treatment: 'Inject dichlorvos',
                preventive: 'Trunk painting with carbaryl'
            },
            {
                pest: 'Pollu beetle (Pepper)',
                symptom: 'Feeding on developing spikes',
                treatment: 'Quinalphos 0.05% spray',
                preventive: 'Clean cultivation'
            },
            {
                pest: 'Leaf spot (Turmeric)',
                symptom: 'Brown spots on leaves',
                treatment: 'Mancozeb 2.5g/L spray',
                preventive: 'Crop rotation, resistant varieties'
            },
            {
                pest: 'Bud rot (Coconut)',
                symptom: 'Rotting of crown',
                treatment: 'Remove infected tissue + Bordeaux',
                preventive: 'Crown application of carboxyl paste'
            }
        ],
        harvestCalendar: [
            {
                species: 'Coconut',
                firstHarvest: 'Year 5–6',
                peakSeason: 'Year-round',
                method: 'Climbing/mechanical',
                yield: '100–150 nuts/palm'
            },
            {
                species: 'Mango',
                firstHarvest: 'Year 4–5',
                peakSeason: 'April–June',
                method: 'Hand picking',
                yield: '100–200 fruits/tree'
            },
            {
                species: 'Black Pepper',
                firstHarvest: 'Year 3',
                peakSeason: 'Jan–Feb',
                method: 'Hand harvest',
                yield: '2–3 kg dry/vine'
            },
            {
                species: 'Turmeric',
                firstHarvest: 'Month 8',
                peakSeason: 'Feb–March',
                method: 'Digging',
                yield: '25–30 tonnes fresh/ha'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹40,000/acre',
                primaryCrop: 'Turmeric'
            },
            {
                year: 2,
                revenue: '₹70,000/acre',
                primaryCrop: 'Turmeric (ratoon)'
            },
            {
                year: 3,
                revenue: '₹1,30,000/acre',
                primaryCrop: 'Pepper + Turmeric'
            },
            {
                year: 4,
                revenue: '₹2,00,000/acre',
                primaryCrop: 'Mango + Pepper'
            },
            {
                year: 5,
                revenue: '₹2,80,000/acre',
                primaryCrop: 'Full system production'
            }
        ]
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
            'High humidity tolerance'
        ],
        suitableStates: [
            'Kerala',
            'Karnataka',
            'Tamil Nadu',
            'Andhra Pradesh'
        ],
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
            'Control weeds thoroughly before planting'
        ],
        nurseryWork: [
            'Coconut: Already established (or plant COD tall variety)',
            'Cocoa: Hybrid seedlings (CCRP variety) from grafts',
            'Cardamom: Tissue culture plants (Njallani Green Gold)',
            'Black Pepper: Panniyur-1 rooted cuttings',
            'Vanilla: 3-node cuttings from certified gardens',
            'Harden cocoa seedlings under 50% shade for 1 month'
        ],
        plantingSequence: [
            {
                week: 1,
                activity: 'Plant cocoa seedlings',
                layer: 'middle',
                species: 'Cocoa',
                notes: 'Under coconut shade, 3m × 3m'
            },
            {
                week: 2,
                activity: 'Install temporary shade (pandal)',
                layer: 'middle',
                species: 'Cocoa',
                notes: '70% shade net if canopy thin'
            },
            {
                week: 3,
                activity: 'Plant cardamom in shaded gaps',
                layer: 'understory',
                species: 'Cardamom',
                notes: '2m × 1m under dense shade'
            },
            {
                week: 4,
                activity: 'Plant pepper on alternate coconuts',
                layer: 'vertical',
                species: 'Black Pepper',
                notes: '2 cuttings per palm'
            },
            {
                week: 5,
                activity: 'Plant vanilla on remaining coconuts',
                layer: 'vertical',
                species: 'Vanilla',
                notes: '1 cutting per palm'
            },
            {
                week: 8,
                activity: 'First weeding and mulching',
                layer: 'understory',
                species: 'All',
                notes: 'Heavy mulch 10cm thick'
            },
            {
                week: 12,
                activity: 'Shape cocoa (jorquette pruning)',
                layer: 'middle',
                species: 'Cocoa',
                notes: 'Single stem to 1.2m then branch'
            },
            {
                week: 20,
                activity: 'Train climbers up trunks',
                layer: 'vertical',
                species: 'Pepper/Vanilla',
                notes: 'Coir rope tying'
            }
        ],
        spacingGuide: [
            {
                species: 'Coconut',
                rowSpacing: '8m',
                plantSpacing: '8m',
                depth: '60cm',
                method: 'pit'
            },
            {
                species: 'Cocoa',
                rowSpacing: '3m',
                plantSpacing: '3m',
                depth: '30cm',
                method: 'pit'
            },
            {
                species: 'Cardamom',
                rowSpacing: '2m',
                plantSpacing: '1m',
                depth: '15cm',
                method: 'pit'
            },
            {
                species: 'Black Pepper',
                rowSpacing: 'On coconut',
                plantSpacing: '16m',
                depth: '15cm',
                method: 'pit'
            },
            {
                species: 'Vanilla',
                rowSpacing: 'On coconut',
                plantSpacing: '16m',
                depth: '10cm',
                method: 'mound'
            }
        ],
        irrigationSchedule: [
            {
                stage: 'Cocoa establishment',
                frequency: 'Every 2 days',
                method: 'Drip',
                amount: '8L per plant'
            },
            {
                stage: 'Monsoon (June–Sept)',
                frequency: 'Natural',
                method: 'Rainfall',
                amount: 'No irrigation needed'
            },
            {
                stage: 'Post-monsoon',
                frequency: 'Weekly',
                method: 'Drip',
                amount: '15L per cocoa'
            },
            {
                stage: 'Summer (stress avoidance)',
                frequency: 'Every 3 days',
                method: 'Drip + misting',
                amount: '20L per cocoa'
            },
            {
                stage: 'Cocoa pod development',
                frequency: 'Consistent moisture',
                method: 'Drip',
                amount: 'Avoid stress'
            }
        ],
        fertilizerSchedule: [
            {
                month: 2,
                fertilizer: 'NPK 10:5:20',
                quantity: '100g per cocoa',
                method: 'Ring application'
            },
            {
                month: 4,
                fertilizer: 'Vermicompost',
                quantity: '3kg per plant',
                method: 'Basin'
            },
            {
                month: 6,
                fertilizer: 'Urea',
                quantity: '50g per cocoa',
                method: 'Split'
            },
            {
                month: 8,
                fertilizer: 'Wood ash + dolomite',
                quantity: '500g per plant',
                method: 'Broadcast'
            },
            {
                month: 10,
                fertilizer: 'NPK + micronutrients',
                quantity: '150g per cocoa',
                method: 'Pre-flowering'
            },
            {
                month: 5,
                fertilizer: 'Cardamom: 32:60:30 NPK',
                quantity: 'kg/ha',
                method: 'Split dose'
            }
        ],
        pestManagement: [
            {
                pest: 'Black pod disease (Cocoa)',
                symptom: 'Black lesions on pods',
                treatment: 'Copper spray, remove affected pods',
                preventive: 'Regular harvest, good drainage'
            },
            {
                pest: 'Tea mosquito bug (Cocoa)',
                symptom: 'Necrotic lesions on pods',
                treatment: 'Quinalphos 0.05%',
                preventive: 'Shade regulation, avoid dense canopy'
            },
            {
                pest: 'Stem borer (Cocoa)',
                symptom: 'Galleries in trunk',
                treatment: 'Inject carbaryl paste',
                preventive: 'Paint trunk with Bordeaux'
            },
            {
                pest: 'Cherelle wilt',
                symptom: 'Small pod drop',
                treatment: 'Improve nutrition + irrigation',
                preventive: 'Balanced fertilization'
            },
            {
                pest: 'Root grub (Cardamom)',
                symptom: 'Yellowing, root damage',
                treatment: 'Chlorpyrifos drench',
                preventive: 'Light traps, crop rotation'
            }
        ],
        harvestCalendar: [
            {
                species: 'Coconut',
                firstHarvest: 'Established',
                peakSeason: 'Year-round',
                method: 'Climbing',
                yield: '80–100 nuts/palm'
            },
            {
                species: 'Cocoa',
                firstHarvest: 'Year 3',
                peakSeason: 'Oct–Dec, Apr–Jun',
                method: 'Secateurs, twice monthly',
                yield: '0.5–1.5 kg dry beans/tree'
            },
            {
                species: 'Cardamom',
                firstHarvest: 'Year 3',
                peakSeason: 'Aug–Feb',
                method: 'Hand picking',
                yield: '200–300 kg dry/ha'
            },
            {
                species: 'Black Pepper',
                firstHarvest: 'Year 3',
                peakSeason: 'Dec–Jan',
                method: 'Hand harvest',
                yield: '3–4 kg dry/vine'
            },
            {
                species: 'Vanilla',
                firstHarvest: 'Year 4',
                peakSeason: 'May–Jul',
                method: 'Hand harvest pods',
                yield: '500 kg green/ha'
            }
        ],
        revenueProjection: [
            {
                year: 1,
                revenue: '₹50,000/acre',
                primaryCrop: 'Coconut (existing)'
            },
            {
                year: 2,
                revenue: '₹70,000/acre',
                primaryCrop: 'Coconut + Cardamom'
            },
            {
                year: 3,
                revenue: '₹1,80,000/acre',
                primaryCrop: 'Cocoa + Pepper + Cardamom'
            },
            {
                year: 4,
                revenue: '₹3,50,000/acre',
                primaryCrop: 'Vanilla + Cocoa'
            },
            {
                year: 5,
                revenue: '₹5,00,000/acre',
                primaryCrop: 'Peak production all crops'
            }
        ]
    }
];
function getPlantingGuide(presetId) {
    return plantingGuides.find((g)=>g.presetId === presetId);
}
const presetIds = plantingGuides.map((g)=>g.presetId);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/designer/PlantingGuidePanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlantingGuidePanel",
    ()=>PlantingGuidePanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$planting$2d$guides$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/planting-guides.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════
const TABS = [
    {
        key: 'overview',
        label: 'Overview',
        icon: '📋'
    },
    {
        key: 'timeline',
        label: 'Timeline',
        icon: '📅'
    },
    {
        key: 'spacing',
        label: 'Spacing',
        icon: '📏'
    },
    {
        key: 'irrigation',
        label: 'Irrigation',
        icon: '💧'
    },
    {
        key: 'fertiliser',
        label: 'Fertiliser',
        icon: '🌱'
    },
    {
        key: 'pest',
        label: 'Pest Mgmt',
        icon: '🐛'
    },
    {
        key: 'harvest',
        label: 'Harvest',
        icon: '🌾'
    }
];
// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function InfoCard({ label, value, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-green-900/30 rounded-lg p-3 border border-green-700/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-green-400/70 mb-1",
                children: [
                    icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-1",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 69,
                        columnNumber: 18
                    }, this),
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-white font-medium",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c = InfoCard;
function SectionTitle({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
        className: "text-sm font-semibold text-green-300 mb-2 flex items-center gap-2",
        children: children
    }, void 0, false, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c1 = SectionTitle;
function BulletList({ items }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "text-xs text-gray-300 space-y-1",
        children: items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex items-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-green-500 mt-0.5",
                        children: "•"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: item
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                ]
            }, idx, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c2 = BulletList;
// ═══════════════════════════════════════════════════════════════════════
// TAB CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function OverviewTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "Best Season",
                        value: guide.bestSeason,
                        icon: "🗓️"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "Region",
                        value: guide.region,
                        icon: "📍"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "Climate",
                        value: guide.climateZone,
                        icon: "🌡️"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "Rainfall",
                        value: guide.annualRainfall,
                        icon: "🌧️"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "Altitude",
                        value: guide.altitude,
                        icon: "⛰️"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoCard, {
                        label: "States",
                        value: guide.suitableStates.slice(0, 2).join(', '),
                        icon: "🗺️"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "🪨 Soil Requirements"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BulletList, {
                        items: guide.soilRequirements
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "🚜 Soil Preparation"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BulletList, {
                        items: guide.soilPrep.slice(0, 5)
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    guide.soilPrep.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-green-500/70 mt-1 italic",
                        children: [
                            "+",
                            guide.soilPrep.length - 5,
                            " more steps..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "🌿 Nursery Work"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BulletList, {
                        items: guide.nurseryWork.slice(0, 4)
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    guide.nurseryWork.length > 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-green-500/70 mt-1 italic",
                        children: [
                            "+",
                            guide.nurseryWork.length - 4,
                            " more items..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "💰 Revenue Projection"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-3 border border-green-600/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400",
                                        children: "Year 5 Projected"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-green-400",
                                        children: guide.revenueProjection[4]?.revenue || 'N/A'
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500 mt-1",
                                children: [
                                    "Primary: ",
                                    guide.revenueProjection[4]?.primaryCrop || 'Full System'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c3 = OverviewTab;
function TimelineTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "📅 Planting Sequence"
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-4 top-0 bottom-0 w-0.5 bg-green-700/50"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    guide.plantingSequence.map((step, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative pl-10 pb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `absolute left-2.5 w-3 h-3 rounded-full border-2 ${step.layer === 'overstory' ? 'bg-green-600 border-green-400' : step.layer === 'middle' ? 'bg-yellow-600 border-yellow-400' : step.layer === 'understory' ? 'bg-orange-600 border-orange-400' : 'bg-purple-600 border-purple-400'}`
                                }, void 0, false, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800/50 rounded-lg p-3 border border-gray-700/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-medium text-green-400",
                                                    children: [
                                                        "Week ",
                                                        step.week
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-[10px] px-1.5 py-0.5 rounded uppercase ${step.layer === 'overstory' ? 'bg-green-900/50 text-green-400' : step.layer === 'middle' ? 'bg-yellow-900/50 text-yellow-400' : step.layer === 'understory' ? 'bg-orange-900/50 text-orange-400' : 'bg-purple-900/50 text-purple-400'}`,
                                                    children: step.layer
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-white mb-1",
                                            children: step.activity
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-green-500",
                                                    children: step.species
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500",
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-400",
                                                    children: step.notes
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_c4 = TimelineTab;
function SpacingTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "📏 Spacing Guide"
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "text-left text-green-400/70 border-b border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "pb-2 pr-2",
                                        children: "Species"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "pb-2 pr-2",
                                        children: "Row"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "pb-2 pr-2",
                                        children: "Plant"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "pb-2 pr-2",
                                        children: "Depth"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "pb-2",
                                        children: "Method"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: guide.spacingGuide.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-gray-800/50 text-gray-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 pr-2 font-medium text-white",
                                            children: row.species
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 244,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 pr-2",
                                            children: row.rowSpacing
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 247,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 pr-2",
                                            children: row.plantSpacing
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 248,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 pr-2",
                                            children: row.depth
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 249,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 capitalize text-green-400",
                                            children: row.method
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-green-900/20 rounded-lg p-3 border border-green-700/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-400",
                    children: [
                        "💡 ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-green-400",
                            children: "Tip:"
                        }, void 0, false, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 260,
                            columnNumber: 14
                        }, this),
                        " Use the measurement overlay tool in the designer to visualize actual spacing on your farm layout."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 259,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
_c5 = SpacingTab;
function IrrigationTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "💧 Irrigation Schedule"
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            guide.irrigationSchedule.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-900/20 rounded-lg p-3 border border-blue-700/30",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-blue-300",
                                    children: item.stage
                                }, void 0, false, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded",
                                    children: item.frequency
                                }, void 0, false, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500",
                                            children: "Method:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300",
                                            children: item.method
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 289,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500",
                                            children: "Amount:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300",
                                            children: item.amount
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this)
                    ]
                }, idx, true, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 274,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
_c6 = IrrigationTab;
function FertiliserTab({ guide }) {
    // Group by month for better organization
    const sorted = [
        ...guide.fertilizerSchedule
    ].sort((a, b)=>a.month - b.month);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "🌱 Fertiliser Schedule"
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: sorted.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-amber-900/20 rounded-lg p-3 border border-amber-700/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-amber-300",
                                        children: [
                                            "Month ",
                                            item.month
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs bg-amber-800/50 text-amber-300 px-2 py-0.5 rounded",
                                        children: item.method
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white mb-1",
                                children: item.fertilizer
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-400",
                                children: [
                                    "Qty: ",
                                    item.quantity
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 326,
                                columnNumber: 13
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
_c7 = FertiliserTab;
function PestTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                children: "🐛 Pest Management"
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            guide.pestManagement.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-900/20 rounded-lg p-3 border border-red-700/30",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start mb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-red-300",
                                children: item.pest
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 344,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 343,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500",
                                            children: "Symptom:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 348,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300",
                                            children: item.symptom
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-400",
                                            children: "Treatment:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300",
                                            children: item.treatment
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-green-400",
                                            children: "Preventive:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-300",
                                            children: item.preventive
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 357,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 346,
                            columnNumber: 11
                        }, this)
                    ]
                }, idx, true, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 339,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 336,
        columnNumber: 5
    }, this);
}
_c8 = PestTab;
function HarvestTab({ guide }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "🌾 Harvest Calendar"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    guide.harvestCalendar.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-emerald-900/20 rounded-lg p-3 border border-emerald-700/30 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-emerald-300",
                                            children: item.species
                                        }, void 0, false, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 378,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs bg-emerald-800/50 text-emerald-300 px-2 py-0.5 rounded",
                                            children: [
                                                "First: ",
                                                item.firstHarvest
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 381,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 377,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2 text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500",
                                                    children: "Peak:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 387,
                                                    columnNumber: 17
                                                }, this),
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300",
                                                    children: item.peakSeason
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500",
                                                    children: "Yield:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this),
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-green-400",
                                                    children: item.yield
                                                }, void 0, false, {
                                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 385,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-400 mt-1",
                                    children: [
                                        "Method: ",
                                        item.method
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                    lineNumber: 395,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        children: "💰 5-Year Revenue Projection"
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 404,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: guide.revenueProjection.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between bg-gray-800/50 rounded-lg p-2 border border-gray-700/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "Year ",
                                                    item.year
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                lineNumber: 412,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-400",
                                                children: item.primaryCrop
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                                lineNumber: 413,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 411,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-green-400",
                                        children: item.revenue
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                        lineNumber: 415,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 405,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 403,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 368,
        columnNumber: 5
    }, this);
}
_c9 = HarvestTab;
function PlantingGuidePanel({ presetId }) {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const guide = presetId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$planting$2d$guides$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlantingGuide"])(presetId) : null;
    // ─────────────────────────────────────────────────────────────────────
    // Print / Export Handler
    // ─────────────────────────────────────────────────────────────────────
    const handlePrint = ()=>{
        if (!guide) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        // Generate printable HTML content
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${guide.title} - Planting Guide</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            max-width: 800px; 
            margin: 0 auto;
            color: #333;
          }
          h1 { color: #166534; border-bottom: 2px solid #166534; padding-bottom: 10px; }
          h2 { color: #15803d; margin-top: 24px; }
          h3 { color: #166534; margin-top: 16px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f0fdf4; }
          .info-box { background: #f0fdf4; padding: 12px; border-radius: 8px; margin: 10px 0; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 4px; }
          .section { page-break-inside: avoid; margin-bottom: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>🌿 ${guide.title}</h1>
        
        <div class="info-box">
          <div class="info-grid">
            <div><strong>Region:</strong> ${guide.region}</div>
            <div><strong>Best Season:</strong> ${guide.bestSeason}</div>
            <div><strong>Climate:</strong> ${guide.climateZone}</div>
            <div><strong>Annual Rainfall:</strong> ${guide.annualRainfall}</div>
            <div><strong>Altitude:</strong> ${guide.altitude}</div>
            <div><strong>Suitable States:</strong> ${guide.suitableStates.join(', ')}</div>
          </div>
        </div>

        <div class="section">
          <h2>🪨 Soil Requirements</h2>
          <ul>${guide.soilRequirements.map((s)=>`<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>🚜 Soil Preparation</h2>
          <ul>${guide.soilPrep.map((s)=>`<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>🌿 Nursery Work</h2>
          <ul>${guide.nurseryWork.map((s)=>`<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>📅 Planting Sequence</h2>
          <table>
            <tr><th>Week</th><th>Activity</th><th>Layer</th><th>Species</th><th>Notes</th></tr>
            ${guide.plantingSequence.map((s)=>`<tr><td>${s.week}</td><td>${s.activity}</td><td>${s.layer}</td><td>${s.species}</td><td>${s.notes}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>📏 Spacing Guide</h2>
          <table>
            <tr><th>Species</th><th>Row Spacing</th><th>Plant Spacing</th><th>Depth</th><th>Method</th></tr>
            ${guide.spacingGuide.map((s)=>`<tr><td>${s.species}</td><td>${s.rowSpacing}</td><td>${s.plantSpacing}</td><td>${s.depth}</td><td>${s.method}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>💧 Irrigation Schedule</h2>
          <table>
            <tr><th>Stage</th><th>Frequency</th><th>Method</th><th>Amount</th></tr>
            ${guide.irrigationSchedule.map((s)=>`<tr><td>${s.stage}</td><td>${s.frequency}</td><td>${s.method}</td><td>${s.amount}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>🌱 Fertiliser Schedule</h2>
          <table>
            <tr><th>Month</th><th>Fertilizer</th><th>Quantity</th><th>Method</th></tr>
            ${guide.fertilizerSchedule.map((s)=>`<tr><td>${s.month}</td><td>${s.fertilizer}</td><td>${s.quantity}</td><td>${s.method}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>🐛 Pest Management</h2>
          <table>
            <tr><th>Pest</th><th>Symptom</th><th>Treatment</th><th>Preventive</th></tr>
            ${guide.pestManagement.map((s)=>`<tr><td>${s.pest}</td><td>${s.symptom}</td><td>${s.treatment}</td><td>${s.preventive}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>🌾 Harvest Calendar</h2>
          <table>
            <tr><th>Species</th><th>First Harvest</th><th>Peak Season</th><th>Method</th><th>Expected Yield</th></tr>
            ${guide.harvestCalendar.map((s)=>`<tr><td>${s.species}</td><td>${s.firstHarvest}</td><td>${s.peakSeason}</td><td>${s.method}</td><td>${s.yield}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>💰 Revenue Projection (5-Year)</h2>
          <table>
            <tr><th>Year</th><th>Primary Crop</th><th>Projected Revenue</th></tr>
            ${guide.revenueProjection.map((s)=>`<tr><td>Year ${s.year}</td><td>${s.primaryCrop}</td><td>${s.revenue}</td></tr>`).join('')}
          </table>
        </div>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Generated by MultiSow - Multi-Tier Crop System Designer
        </p>
      </body>
      </html>
    `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };
    // ─────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────
    if (!presetId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full text-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-4xl mb-3",
                    children: "📚"
                }, void 0, false, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 615,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-400",
                    children: "Select a preset to view its planting guide"
                }, void 0, false, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 616,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
            lineNumber: 614,
            columnNumber: 7
        }, this);
    }
    if (!guide) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center h-full text-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-4xl mb-3",
                    children: "🔍"
                }, void 0, false, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 626,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-400",
                    children: "No planting guide available for this preset"
                }, void 0, false, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 627,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-500 mt-1",
                    children: [
                        "Preset ID: ",
                        presetId
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                    lineNumber: 630,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
            lineNumber: 625,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-3 py-2 border-b border-gray-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-green-400 truncate",
                        children: guide.title
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 639,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePrint,
                        className: "flex items-center gap-1 px-2 py-1 text-xs bg-green-800 hover:bg-green-700 text-white rounded transition-colors",
                        title: "Print / Export PDF",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "🖨️"
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 647,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Export"
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 638,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex overflow-x-auto border-b border-gray-700 bg-gray-900/50",
                children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.key),
                        className: `flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab.key ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mr-1",
                                children: tab.icon
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 664,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                                lineNumber: 665,
                                columnNumber: 13
                            }, this)
                        ]
                    }, tab.key, true, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 655,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 653,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: contentRef,
                className: "flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-700",
                children: [
                    activeTab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OverviewTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 675,
                        columnNumber: 38
                    }, this),
                    activeTab === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimelineTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 676,
                        columnNumber: 38
                    }, this),
                    activeTab === 'spacing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpacingTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 677,
                        columnNumber: 37
                    }, this),
                    activeTab === 'irrigation' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IrrigationTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 678,
                        columnNumber: 40
                    }, this),
                    activeTab === 'fertiliser' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FertiliserTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 679,
                        columnNumber: 40
                    }, this),
                    activeTab === 'pest' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PestTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 680,
                        columnNumber: 34
                    }, this),
                    activeTab === 'harvest' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HarvestTab, {
                        guide: guide
                    }, void 0, false, {
                        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                        lineNumber: 681,
                        columnNumber: 37
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
                lineNumber: 671,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/PlantingGuidePanel.tsx",
        lineNumber: 636,
        columnNumber: 5
    }, this);
}
_s(PlantingGuidePanel, "jxOTJl0jSaZrRdp69WLewKQ6owQ=");
_c10 = PlantingGuidePanel;
const __TURBOPACK__default__export__ = PlantingGuidePanel;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "InfoCard");
__turbopack_context__.k.register(_c1, "SectionTitle");
__turbopack_context__.k.register(_c2, "BulletList");
__turbopack_context__.k.register(_c3, "OverviewTab");
__turbopack_context__.k.register(_c4, "TimelineTab");
__turbopack_context__.k.register(_c5, "SpacingTab");
__turbopack_context__.k.register(_c6, "IrrigationTab");
__turbopack_context__.k.register(_c7, "FertiliserTab");
__turbopack_context__.k.register(_c8, "PestTab");
__turbopack_context__.k.register(_c9, "HarvestTab");
__turbopack_context__.k.register(_c10, "PlantingGuidePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/designer/DesignerSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$farm$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/farm/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$farm$2f$CompatibilityWarnings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/farm/CompatibilityWarnings.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$designer$2f$PlantingGuidePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/designer/PlantingGuidePanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// DesignerSidebar.tsx
// Right panel for farm designer (Phase 2 + Phase 7/8/9)
'use client';
;
;
;
const TAB_ITEMS = [
    {
        key: 'status',
        label: 'Status',
        icon: '📊'
    },
    {
        key: 'compatibility',
        label: 'Check',
        icon: '✅'
    },
    {
        key: 'overlays',
        label: 'Layers',
        icon: '🗺️'
    },
    {
        key: 'guide',
        label: 'Guide',
        icon: '📚'
    }
];
const DesignerSidebar = ({ compatibilityWarnings = [], plants = [], season = 0, overlays = {
    sunlight: false,
    rootCompetition: false,
    waterZones: false
}, selectedPresetId = null })=>{
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('status');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-80 shrink-0 bg-[#0F1A0F] border-l border-green-900/30 h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b border-green-900/30",
                children: TAB_ITEMS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.key),
                        className: `flex-1 px-2 py-3 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${activeTab === tab.key ? 'text-green-400 bg-green-900/20 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base",
                                children: tab.icon
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, tab.key, true, {
                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: [
                    activeTab === 'status' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-400 font-bold text-lg",
                                children: "Farm Status"
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-white text-sm font-semibold mb-3",
                                        children: "Statistics"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-neutral-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Total Plants:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 73,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-green-400",
                                                        children: plants.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 74,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-neutral-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Current Season:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-green-400",
                                                        children: season < 12 ? `Month ${season + 1}` : `Year ${Math.floor(season / 12) + 1}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 76,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-neutral-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Active Overlays:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-green-400",
                                                        children: Object.values(overlays).filter(Boolean).length
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            plants.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-white text-sm font-semibold mb-3",
                                        children: "Layer Distribution"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            'canopy',
                                            'mid',
                                            'ground'
                                        ].map((layer)=>{
                                            const count = plants.filter((p)=>p.layer === layer).length;
                                            const percentage = plants.length > 0 ? Math.round(count / plants.length * 100) : 0;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-gray-400 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "capitalize",
                                                                children: layer
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    count,
                                                                    " (",
                                                                    percentage,
                                                                    "%)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 103,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-1.5 bg-gray-800 rounded overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `h-full rounded ${layer === 'canopy' ? 'bg-green-500' : layer === 'mid' ? 'bg-yellow-500' : 'bg-orange-500'}`,
                                                            style: {
                                                                width: `${percentage}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                            lineNumber: 106,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, layer, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 100,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 95,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-4 border-t border-green-900/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-green-400 text-xs font-semibold mb-2",
                                        children: "Quick Tips"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "text-xs text-neutral-400 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "• Use Ctrl+Z / Ctrl+Y to undo/redo"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "• Toggle overlays to analyze farm conditions"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "• Season timeline shows growth stages"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: "• Check compatibility before planting"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'compatibility' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-400 font-bold text-lg",
                                children: "Compatibility"
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            plants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center py-8 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-4xl mb-3",
                                        children: "🌱"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400",
                                        children: "Add plants to see compatibility analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 145,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$farm$2f$CompatibilityWarnings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompatibilitySummary"], {
                                warnings: compatibilityWarnings,
                                totalPlants: plants.length
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 pt-4 border-t border-green-900/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-xs font-semibold text-gray-400 mb-3",
                                        children: "Warning Types"
                                    }, void 0, false, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-red-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-red-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Critical - Immediate action needed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-yellow-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-yellow-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Warning - Review recommended"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-blue-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-blue-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Info - Optional optimization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'overlays' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-400 font-bold text-lg",
                                children: "Analysis Layers"
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-3 rounded border ${overlays.sunlight ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : 'bg-gray-800/30 border-gray-700/30 text-gray-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "☀️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium",
                                                                children: "Sunlight Map"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs px-2 py-0.5 rounded ${overlays.sunlight ? 'bg-yellow-600/50' : 'bg-gray-700/50'}`,
                                                        children: overlays.sunlight ? 'ON' : 'OFF'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs mt-1 opacity-70",
                                                children: "Shows light intensity and shade zones"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-3 rounded border ${overlays.rootCompetition ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'bg-gray-800/30 border-gray-700/30 text-gray-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "🌱"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium",
                                                                children: "Root Competition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 215,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs px-2 py-0.5 rounded ${overlays.rootCompetition ? 'bg-orange-600/50' : 'bg-gray-700/50'}`,
                                                        children: overlays.rootCompetition ? 'ON' : 'OFF'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 212,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs mt-1 opacity-70",
                                                children: "Visualizes underground root spread"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-3 rounded border ${overlays.waterZones ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-gray-800/30 border-gray-700/30 text-gray-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: "💧"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium",
                                                                children: "Water Zones"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                                lineNumber: 236,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs px-2 py-0.5 rounded ${overlays.waterZones ? 'bg-blue-600/50' : 'bg-gray-700/50'}`,
                                                        children: overlays.waterZones ? 'ON' : 'OFF'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 233,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs mt-1 opacity-70",
                                                children: "Displays irrigation coverage"
                                            }, void 0, false, {
                                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-4 border-t border-green-900/30",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400",
                                    children: "💡 Toggle overlays from the left panel for detailed visualization."
                                }, void 0, false, {
                                    fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'guide' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$designer$2f$PlantingGuidePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        presetId: selectedPresetId
                    }, void 0, false, {
                        fileName: "[project]/components/designer/DesignerSidebar.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/designer/DesignerSidebar.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/designer/DesignerSidebar.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DesignerSidebar, "B2HQPbe00Jadl4YtuFyEnd8OrP8=");
_c = DesignerSidebar;
const __TURBOPACK__default__export__ = DesignerSidebar;
var _c;
__turbopack_context__.k.register(_c, "DesignerSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/designer/DesignerSidebar.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/designer/DesignerSidebar.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_32a05477._.js.map