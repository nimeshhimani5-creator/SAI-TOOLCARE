import { Product, RepairJob } from '../types';

export const SHOP_INFO = {
  name: "Om Sai Power Tools & Repairing Center",
  shortName: "Sai ToolCare",
  tagline: "Certified Power Tool Sales, 100% Genuine Spares & Precision In-Shop Repairs",
  phone: "+91 80774 66755",
  emergencyPhone: "+91 80774 66755",
  whatsapp: "+91 80774 66755",
  address: "Shop No. 4, Sai Complex, Station Road, Industrial Estate, Opp. Bus Depot",
  city: "Pune, Maharashtra - 411019",
  workingHours: "Monday – Saturday: 9:00 AM – 8:30 PM | Sunday: 9:00 AM – 1:30 PM",
  collectionNotice: "Orders & repairs are processed for live counter inspection, testing, and collection at our Station Road center. No third-party courier or home delivery."
};

export const WORKSHOP_METRICS = [
  { label: 'Workshop Experience', value: '15+ Years', subtext: 'Serving local contractors & fabricators' },
  { label: 'Tools Repaired', value: '14,200+', subtext: 'Grinders, hammers, drills & cutters' },
  { label: 'Genuine Spares', value: '650+ Parts', subtext: '100% pure copper armatures in stock' },
  { label: 'Customer Rating', value: '4.9 ★', subtext: 'Based on 850+ local Google reviews' }
];

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Inventory',
    description: 'Complete workshop stock of machines & precision spares',
    icon: 'Wrench',
    badge: 'Full Stock'
  },
  {
    id: 'power-tools',
    name: 'Power Machines',
    description: 'Heavy-duty angle grinders, demolition hammers & drills',
    icon: 'Zap',
    badge: 'Industrial Grade'
  },
  {
    id: 'spare-parts',
    name: 'Genuine Spares',
    description: 'Armatures, pure copper coils, carbon brushes & bearings',
    icon: 'Cpu',
    badge: '100% Copper'
  },
  {
    id: 'accessories',
    name: 'Blades & Bits',
    description: 'Laser diamond wheels, carbide bits & grinding discs',
    icon: 'Disc',
    badge: 'High Endurance'
  }
];

const RAW_PRODUCTS: Product[] = [
  /* =========================================================================
     1. BOSCH (Germany) - Power Tools & Genuine Spares
     ========================================================================= */
  {
    id: 'prod-bosch-01',
    name: 'Bosch GWS 600 Professional 4-Inch Angle Grinder (670W / 100mm)',
    brand: 'Bosch',
    modelNumber: 'GWS 600 (06013750FA)',
    category: 'power-tools',
    price: 2450,
    originalPrice: 2899,
    inStock: true,
    stockCount: 16,
    rating: 4.8,
    reviewsCount: 52,
    description: 'Industrial 670W compact angle grinder engineered for metal fabrication, deburring, and masonry cutting. Features spiral bevel gears for smooth torque and burst-proof wheel guard.',
    specifications: {
      'Rated Input Power': '670 W',
      'Disc Diameter': '100 mm (4")',
      'No-Load Speed': '11,000 RPM',
      'Spindle Thread': 'M 10',
      'Machine Weight': '1.8 kg',
      'Warranty': '6 Months Authorized Manufacturer Warranty'
    },
    badge: 'Bosch Best Seller',
    imageIcon: 'Zap',
    brandColor: '#005691',
    compatibility: 'Standard 100mm Grinding & Cutting Discs'
  },
  {
    id: 'prod-bosch-02',
    name: 'Bosch GBH 2-26 DRE Professional Rotary Hammer (800W / SDS Plus)',
    brand: 'Bosch',
    modelNumber: 'GBH 2-26 DRE (0611253768)',
    category: 'power-tools',
    price: 6850,
    originalPrice: 8200,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewsCount: 38,
    description: 'The contractor benchmark for concrete drilling and light chiseling. 3-mode operation (drilling, hammer drilling, and chiseling) with 2.7 Joules impact energy and rotation stop.',
    specifications: {
      'Rated Input Power': '800 W',
      'Impact Energy': '2.7 Joules',
      'Drilling Dia (Concrete)': '4 – 26 mm',
      'Tool Holder': 'SDS Plus',
      'Weight': '2.8 kg',
      'Features': 'Overload Clutch & Forward/Reverse Rotation'
    },
    badge: 'Contractor Gold Standard',
    imageIcon: 'Zap',
    brandColor: '#005691',
    compatibility: 'SDS Plus Drill Bits & Chisels'
  },
  {
    id: 'prod-bosch-03',
    name: 'Bosch GDC 120 Professional High-Power Marble Cutter (1200W / 110mm)',
    brand: 'Bosch',
    modelNumber: 'GDC 120 (06013930FA)',
    category: 'power-tools',
    price: 2950,
    originalPrice: 3450,
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewsCount: 29,
    description: 'Compact and high-torque 1200W marble, granite, and tile cutter. Features wide base plate, ergonomic handle grip, and high RPM motor for chip-free wet and dry slab cutting.',
    specifications: {
      'Rated Power': '1,200 W',
      'Blade Diameter': '110 mm',
      'No-Load Speed': '12,000 RPM',
      'Max Cutting Depth': '34 mm (90°)',
      'Weight': '2.5 kg'
    },
    badge: 'Fast Slab Cutter',
    imageIcon: 'Zap',
    brandColor: '#005691',
    compatibility: '110mm Marble & Granite Blades'
  },
  {
    id: 'prod-bosch-04',
    name: '100% Pure Copper Armature for Bosch GWS 600 / GWS 6-100 Grinder',
    brand: 'Bosch Original Spares',
    modelNumber: 'ARM-B-GWS600',
    category: 'spare-parts',
    price: 680,
    originalPrice: 850,
    inStock: true,
    stockCount: 28,
    rating: 4.9,
    reviewsCount: 76,
    description: 'Factory dynamic-balanced rotor with 100% electrolytic pure copper coils and epoxy heat shielding. Prevents commutator grooving, overheating, and loss of torque.',
    specifications: {
      'Winding Wire': '100% Electrolytic Virgin Copper Wire',
      'Coating': '200°C Heat-Resistant Epoxy Shield',
      'Balancing': 'Dynamic Electronic Balanced with Fan & Commutator',
      'Compatibility': 'Bosch GWS 600, GWS 6-100, GWS 060'
    },
    badge: '100% Genuine Copper',
    imageIcon: 'Cpu',
    brandColor: '#005691',
    compatibility: 'Fits Bosch GWS 600, GWS 6-100, GWS 060'
  },
  {
    id: 'prod-bosch-05',
    name: '100% Pure Copper Armature for Bosch GBH 2-26 DRE Rotary Hammer',
    brand: 'Bosch Original Spares',
    modelNumber: 'ARM-B-GBH226',
    category: 'spare-parts',
    price: 1150,
    originalPrice: 1400,
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewsCount: 31,
    description: 'Heavy-duty impact hammer rotor with reinforced helical gear teeth and high-grade copper windings. Built to withstand high shock vibration during masonry hammering.',
    specifications: {
      'Winding Material': 'High-Grade Electrolytic Copper',
      'Gear Teeth': 'Precision Helical Ground Pinion Gear',
      'Insulation': 'Reinforced Slot Insulation Paper',
      'Compatibility': 'Bosch GBH 2-26 DRE, GBH 2-26 DFR'
    },
    badge: 'Heavy Shock Rated',
    imageIcon: 'Cpu',
    brandColor: '#005691',
    compatibility: 'Fits Bosch GBH 2-26 DRE / DFR'
  },
  {
    id: 'prod-bosch-06',
    name: 'Bosch GWS 600 Stator Field Coil Assembly (Pure Copper)',
    brand: 'Bosch Original Spares',
    modelNumber: 'FLD-B-GWS600',
    category: 'spare-parts',
    price: 420,
    originalPrice: 520,
    inStock: true,
    stockCount: 22,
    rating: 4.8,
    reviewsCount: 19,
    description: 'OEM copper stator magnet coil assembly for 4-inch grinders. Heat-varnished with terminal leads for direct bolt-in fitment into motor housing.',
    specifications: {
      'Winding': 'Pure Copper Magnet Wire',
      'Core': 'Silicon Steel Lamination Stack',
      'Compatibility': 'Bosch GWS 600, GWS 6-100'
    },
    badge: 'OEM Fitment',
    imageIcon: 'Cpu',
    brandColor: '#005691',
    compatibility: 'Fits Bosch GWS 600 Housing'
  },
  {
    id: 'prod-bosch-07',
    name: 'Bosch Auto-Cut Carbon Brush Pair with Disconnect Spring Pin',
    brand: 'Bosch Original Spares',
    modelNumber: 'CB-B-GWS600',
    category: 'spare-parts',
    price: 140,
    originalPrice: 190,
    inStock: true,
    stockCount: 65,
    rating: 4.8,
    reviewsCount: 44,
    description: 'High-density graphite carbon brushes with auto-stop spring pin. Automatically shuts down the circuit when worn down to protect the commutator from damage.',
    specifications: {
      'Quantity': '1 Pair (2 Pieces)',
      'Pin Feature': 'Auto-Stop Spring Disconnect Pin',
      'Lead Wire': 'Braided Copper Shunt with Brass Eyelet',
      'Compatibility': 'Bosch GWS 6-100, GWS 600, GDC 120'
    },
    badge: 'Armature Protector',
    imageIcon: 'Cpu',
    brandColor: '#005691',
    compatibility: 'Fits Bosch Grinders & Cutters'
  },

  /* =========================================================================
     2. MAKITA (Japan) - Power Tools & Genuine Spares
     ========================================================================= */
  {
    id: 'prod-makita-01',
    name: 'Makita 9554NB Industrial 4-Inch Angle Grinder (710W / Heavy Duty)',
    brand: 'Makita',
    modelNumber: '9554NB',
    category: 'power-tools',
    price: 2950,
    originalPrice: 3500,
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewsCount: 48,
    description: 'Japanese engineered 710W industrial angle grinder with labyrinth dust construction that seals bearings and motor from fabrication metal dust and grinding swarf.',
    specifications: {
      'Continuous Rating Input': '710 W',
      'Wheel Diameter': '100 mm (4")',
      'No-Load Speed': '10,000 RPM',
      'Spindle Thread': 'M 10',
      'Net Weight': '1.8 kg'
    },
    badge: 'Labyrinth Dust Seal',
    imageIcon: 'Zap',
    brandColor: '#007880',
    compatibility: 'Standard 100mm Grinding Discs'
  },
  {
    id: 'prod-makita-02',
    name: 'Makita HM0810 Industrial Demolition Hammer Breaker (900W / 17mm Hex)',
    brand: 'Makita',
    modelNumber: 'HM0810',
    category: 'power-tools',
    price: 11500,
    originalPrice: 13500,
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviewsCount: 22,
    description: 'Legendary heavy demolition hammer for concrete breaking, slab chipping, and trench opening. Packs 2,900 blows per minute with durable grease-packed piston chamber.',
    specifications: {
      'Continuous Rating': '900 W',
      'Blows Per Minute': '2,900 BPM',
      'Shank Size': '17 mm Hexagonal',
      'Overall Length': '410 mm',
      'Net Weight': '5.5 kg'
    },
    badge: 'Concrete Breaker King',
    imageIcon: 'Zap',
    brandColor: '#007880',
    compatibility: '17mm Hex Bull Point & Flat Chisels'
  },
  {
    id: 'prod-makita-03',
    name: '100% Pure Copper Armature for Makita 9554NB / 9557NB Grinder',
    brand: 'Makita Genuine Parts',
    modelNumber: 'ARM-M-9554',
    category: 'spare-parts',
    price: 720,
    originalPrice: 890,
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewsCount: 41,
    description: 'Original specification replacement rotor with pure electrolytic copper winding wire, epoxy insulation coating, and high-temp fan for Makita 9554NB grinders.',
    specifications: {
      'Winding Material': 'Pure Electrolytic Copper',
      'Epoxy Shield': 'Anti-dust protective powder coating',
      'Balancing': 'Factory Balanced commutator & fan',
      'Compatibility': 'Makita 9554NB, 9557NB, 9558NB'
    },
    badge: '100% Genuine Copper',
    imageIcon: 'Cpu',
    brandColor: '#007880',
    compatibility: 'Fits Makita 9554NB / 9557NB'
  },
  {
    id: 'prod-makita-04',
    name: '100% Pure Copper Armature for Makita HM0810 Demolition Hammer',
    brand: 'Makita Genuine Parts',
    modelNumber: 'ARM-M-HM0810',
    category: 'spare-parts',
    price: 1450,
    originalPrice: 1750,
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 17,
    description: 'High-torque breaker rotor with heat-treated helical drive gear pinion. Engineered to withstand continuous pounding and heavy current draw.',
    specifications: {
      'Winding': 'Class-H High Temp Pure Copper',
      'Gear Teeth': 'Hardened Steel Helical Pinion',
      'Compatibility': 'Makita HM0810 & HM0810T'
    },
    badge: 'Demolition Tough',
    imageIcon: 'Cpu',
    brandColor: '#007880',
    compatibility: 'Fits Makita HM0810 Breakers'
  },
  {
    id: 'prod-makita-05',
    name: 'Makita HM0810 Piston, Striker & O-Ring Seal Complete Overhaul Kit',
    brand: 'Makita Genuine Parts',
    modelNumber: 'PST-M-HM0810',
    category: 'spare-parts',
    price: 580,
    originalPrice: 750,
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewsCount: 14,
    description: 'Complete mechanical maintenance kit including precision ground aluminum piston, hardened tool-steel striker, piston pin, and high-temperature fluororubber O-rings.',
    specifications: {
      'Includes': 'Piston, Striker, Pin & 2 Fluororubber O-Rings',
      'Application': 'Restores full impact power to weak hammers',
      'Compatibility': 'Makita HM0810, M0810B'
    },
    badge: 'Impact Restorer',
    imageIcon: 'Cpu',
    brandColor: '#007880',
    compatibility: 'Fits Makita HM0810 Piston Chamber'
  },

  /* =========================================================================
     3. DEWALT (USA) - Power Tools & Genuine Spares
     ========================================================================= */
  {
    id: 'prod-dewalt-01',
    name: 'DeWalt DW801 Heavy-Duty 4-Inch Angle Grinder (850W / High Torque)',
    brand: 'DeWalt',
    modelNumber: 'DW801',
    category: 'power-tools',
    price: 2850,
    originalPrice: 3400,
    inStock: true,
    stockCount: 10,
    rating: 4.8,
    reviewsCount: 36,
    description: 'High-power 850W angle grinder designed for intense fabrication cutting and weld dressing. Features advanced fan system for maximum airflow and paddle safety switch.',
    specifications: {
      'Power Input': '850 W',
      'No-Load Speed': '11,000 RPM',
      'Max Disc Diameter': '100 mm',
      'Switch Type': 'Slide Switch with Lock-on',
      'Weight': '1.8 kg'
    },
    badge: 'DeWalt Yellow & Black',
    imageIcon: 'Zap',
    brandColor: '#febd11',
    compatibility: 'Standard 100mm Grinding Discs'
  },
  {
    id: 'prod-dewalt-02',
    name: 'DeWalt D25133K SDS Plus 3-Mode Rotary Hammer (800W / 26mm)',
    brand: 'DeWalt',
    modelNumber: 'D25133K',
    category: 'power-tools',
    price: 7450,
    originalPrice: 8900,
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewsCount: 25,
    description: 'Heavy duty 800W hammer drill delivering 2.6 Joules of impact energy. Built with mechanical safety clutch and improved sealing for maximum protection against concrete dust ingress.',
    specifications: {
      'Power Input': '800 W',
      'Impact Energy': '2.6 Joules',
      'Blows Per Minute': '0 – 5,500 BPM',
      'Drilling Capacity': '26 mm (Concrete)',
      'Tool Holder': 'SDS Plus'
    },
    badge: 'Extreme Performance',
    imageIcon: 'Zap',
    brandColor: '#febd11',
    compatibility: 'SDS Plus Drill Bits'
  },
  {
    id: 'prod-dewalt-03',
    name: '100% Pure Copper Armature for DeWalt DW801 Angle Grinder',
    brand: 'DeWalt Spares',
    modelNumber: 'ARM-DW-801',
    category: 'spare-parts',
    price: 780,
    originalPrice: 950,
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewsCount: 32,
    description: 'Factory dynamic-balanced rotor wound with high-purity electrolytic copper and sealed with high-temperature epoxy. Ensures maximum torque delivery and prevents burnout.',
    specifications: {
      'Winding Material': 'Pure Electrolytic Copper',
      'Coating': 'Thermal Powder Epoxy Insulated',
      'Compatibility': 'DeWalt DW801, DW802'
    },
    badge: '100% Genuine Copper',
    imageIcon: 'Cpu',
    brandColor: '#febd11',
    compatibility: 'Fits DeWalt DW801 Grinders'
  },
  {
    id: 'prod-dewalt-04',
    name: 'DeWalt Heavy-Duty Dust-Sealed Switch Assembly for Grinders',
    brand: 'DeWalt Spares',
    modelNumber: 'SW-DW-801',
    category: 'spare-parts',
    price: 280,
    originalPrice: 380,
    inStock: true,
    stockCount: 24,
    rating: 4.7,
    reviewsCount: 18,
    description: 'Dust-tight micro switch assembly with silver-alloy contacts. Resists internal arcing and dust accumulation in dirty metalworking and stone cutting environments.',
    specifications: {
      'Contact Material': 'Silver-Alloy Heavy Duty Contacts',
      'Dust Protection': 'Internal Rubber Bellows Gasket',
      'Compatibility': 'DeWalt DW801, DW803'
    },
    badge: 'Dust Sealed',
    imageIcon: 'Cpu',
    brandColor: '#febd11',
    compatibility: 'Fits DeWalt DW801 Housing'
  },

  /* =========================================================================
     4. DONGCHENG (Industrial Standard) - Power Tools & Genuine Spares
     ========================================================================= */
  {
    id: 'prod-dongcheng-01',
    name: 'Dongcheng DSM03-100A Industrial 4-Inch Angle Grinder (710W)',
    brand: 'Dongcheng',
    modelNumber: 'DSM03-100A',
    category: 'power-tools',
    price: 1750,
    originalPrice: 2100,
    inStock: true,
    stockCount: 22,
    rating: 4.8,
    reviewsCount: 68,
    description: 'The contractor favorite across India. 710W high-speed motor with slender grip circumference for fatigue-free operation during metal fabrication and pipe cutting.',
    specifications: {
      'Rated Power Input': '710 W',
      'Max Wheel Diameter': '100 mm',
      'No-Load Speed': '13,000 RPM',
      'Spindle Thread': 'M 10',
      'Net Weight': '1.6 kg'
    },
    badge: 'Workshop Workhorse',
    imageIcon: 'Zap',
    brandColor: '#d32f2f',
    compatibility: 'Standard 100mm Grinding Discs'
  },
  {
    id: 'prod-dongcheng-02',
    name: 'Dongcheng DZE02-110 High-Power Marble Cutter (1240W / 110mm)',
    brand: 'Dongcheng',
    modelNumber: 'DZE02-110',
    category: 'power-tools',
    price: 2150,
    originalPrice: 2600,
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewsCount: 54,
    description: 'Heavy duty 1240W stone cutter with wide steel base plate and dustproof motor. Popular among tile layers and granite installers for fast, deep cuts.',
    specifications: {
      'Rated Power Input': '1,240 W',
      'Blade Diameter': '110 mm',
      'No-Load Speed': '13,000 RPM',
      'Max Cutting Depth': '30 mm',
      'Net Weight': '3.0 kg'
    },
    badge: 'Granite & Tile Pro',
    imageIcon: 'Zap',
    brandColor: '#d32f2f',
    compatibility: '110mm Diamond Cutting Blades'
  },
  {
    id: 'prod-dongcheng-03',
    name: 'Dongcheng DZG6 Industrial Demolition Breaker Hammer (900W / 17mm)',
    brand: 'Dongcheng',
    modelNumber: 'DZG6',
    category: 'power-tools',
    price: 5850,
    originalPrice: 6900,
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviewsCount: 33,
    description: 'Rugged 900W concrete chipping hammer with all-metal gearcase. Engineered for building renovation, wall chiseling, tile stripping, and floor breaking.',
    specifications: {
      'Rated Power Input': '900 W',
      'Impact Frequency': '2,900 BPM',
      'Shank Size': '17 mm Hexagonal',
      'Net Weight': '6.8 kg',
      'Case': 'Heavy Steel Toolbox Included'
    },
    badge: 'Demolition Value',
    imageIcon: 'Zap',
    brandColor: '#d32f2f',
    compatibility: '17mm Hex Breaker Chisels'
  },
  {
    id: 'prod-dongcheng-04',
    name: '100% Pure Copper Armature for Dongcheng DSM03-100A Grinder',
    brand: 'Dongcheng Spares',
    modelNumber: 'ARM-DC-03100',
    category: 'spare-parts',
    price: 590,
    originalPrice: 720,
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    reviewsCount: 61,
    description: 'High-RPM replacement rotor wound with electrolytic copper and reinforced with high-density cooling fan. Factory dynamically balanced for smooth rotation.',
    specifications: {
      'Winding Wire': '100% Pure Electrolytic Copper',
      'Coating': 'Vibration-Resistant Epoxy Varnish',
      'Compatibility': 'Dongcheng DSM03-100A, DSM02-100A'
    },
    badge: '100% Genuine Copper',
    imageIcon: 'Cpu',
    brandColor: '#d32f2f',
    compatibility: 'Fits Dongcheng DSM03-100A'
  },
  {
    id: 'prod-dongcheng-05',
    name: '100% Pure Copper Armature for Dongcheng DZE02-110 Marble Cutter',
    brand: 'Dongcheng Spares',
    modelNumber: 'ARM-DC-02110',
    category: 'spare-parts',
    price: 690,
    originalPrice: 850,
    inStock: true,
    stockCount: 26,
    rating: 4.9,
    reviewsCount: 42,
    description: 'High-torque marble cutter armature with heavy copper windings and heavy-duty commutator segments. Built to endure continuous wet and dry stone cutting loads.',
    specifications: {
      'Winding Material': 'Class-H High Temp Pure Copper',
      'Balancing': 'Dynamic Electronic Balanced',
      'Compatibility': 'Dongcheng DZE02-110, DZE110'
    },
    badge: 'High Torque Armature',
    imageIcon: 'Cpu',
    brandColor: '#d32f2f',
    compatibility: 'Fits Dongcheng DZE02-110 Cutters'
  },
  {
    id: 'prod-dongcheng-06',
    name: 'Dongcheng High-Current Dustproof Trigger Switch for Marble Cutters',
    brand: 'Dongcheng Spares',
    modelNumber: 'SW-DC-110',
    category: 'spare-parts',
    price: 190,
    originalPrice: 250,
    inStock: true,
    stockCount: 30,
    rating: 4.7,
    reviewsCount: 21,
    description: 'Trigger switch with lock-on pin and internal dust diaphragm. Designed to handle frequent on/off cycling and high current stone cutting spikes.',
    specifications: {
      'Rating': '10A 250V AC',
      'Dust Protection': 'Internal Rubber Dust Boot',
      'Compatibility': 'Dongcheng DZE02-110, DZE110'
    },
    badge: 'High Current Rated',
    imageIcon: 'Cpu',
    brandColor: '#d32f2f',
    compatibility: 'Fits Dongcheng Marble Cutters'
  },

  /* =========================================================================
     5. HiKOKI / HITACHI (Japan) - Power Tools & Genuine Spares
     ========================================================================= */
  {
    id: 'prod-hikoki-01',
    name: 'HiKOKI G10SS2 Heavy-Duty 4-Inch Angle Grinder (600W / High Durability)',
    brand: 'HiKOKI',
    modelNumber: 'G10SS2',
    category: 'power-tools',
    price: 2350,
    originalPrice: 2750,
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewsCount: 37,
    description: 'Formerly Hitachi Power Tools. Features best-in-class overload durability and slim 197mm grip circumference. Built with dust-resistant motor cooling layout.',
    specifications: {
      'Capacity': '100 mm (4")',
      'Power Input': '600 W',
      'No-Load Speed': '11,500 RPM',
      'Spindle Thread': 'M 10',
      'Weight': '1.7 kg'
    },
    badge: 'Hitachi Heritage',
    imageIcon: 'Zap',
    brandColor: '#008450',
    compatibility: 'Standard 100mm Grinding Discs'
  },
  {
    id: 'prod-hikoki-02',
    name: '100% Pure Copper Armature for HiKOKI G10SS2 / Hitachi G10',
    brand: 'HiKOKI Spares',
    modelNumber: 'ARM-H-G10SS2',
    category: 'spare-parts',
    price: 650,
    originalPrice: 799,
    inStock: true,
    stockCount: 22,
    rating: 4.9,
    reviewsCount: 28,
    description: 'Factory dynamic-balanced replacement rotor with Grade-A electrolytic copper coils and high-tensile drive pinion gear for HiKOKI G10SS2 grinders.',
    specifications: {
      'Winding': '100% Pure Electrolytic Copper Wire',
      'Coating': 'Thermal Shield Epoxy Insulated',
      'Compatibility': 'HiKOKI G10SS2, Hitachi G10SF3'
    },
    badge: '100% Genuine Copper',
    imageIcon: 'Cpu',
    brandColor: '#008450',
    compatibility: 'Fits HiKOKI G10SS2 / Hitachi G10'
  },

  /* =========================================================================
     6. ACCESSORIES & WORKSHOP CONSUMABLES
     ========================================================================= */
  {
    id: 'prod-acc-01',
    name: 'Norton 4-Inch Turbo Rim Laser Diamond Marble & Granite Blade',
    brand: 'Norton Diamond',
    modelNumber: 'TURBO-110-GOLD',
    category: 'accessories',
    price: 290,
    originalPrice: 380,
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewsCount: 62,
    description: 'Laser-welded diamond continuous turbo rim engineered for rapid, chip-free precision cutting in hard granite, marble, porcelain tiles, and cured reinforced concrete.',
    specifications: {
      'Blade Diameter': '110 mm (4.3")',
      'Bore Size': '20 mm (Includes 16mm reducer ring)',
      'Max Speed': '13,800 RPM',
      'Operation Mode': 'Dry & Wet Cutting compatible'
    },
    badge: 'Laser Welded Pro',
    imageIcon: 'Disc',
    brandColor: '#f97316',
    compatibility: 'Fits all 110mm Marble Cutters'
  },
  {
    id: 'prod-acc-02',
    name: 'Bosch Professional Inox Stainless & Mild Steel Cutting Disc (Pack of 10)',
    brand: 'Bosch Accessories',
    modelNumber: 'CUT-B-100-10PK',
    category: 'accessories',
    price: 350,
    originalPrice: 450,
    inStock: true,
    stockCount: 38,
    rating: 4.8,
    reviewsCount: 41,
    description: 'Ultra-thin 1.2mm precision abrasive cutting discs with dual fiberglass reinforcing mesh. Delivers fast, burr-free cuts with zero iron, sulfur, or chlorine contaminants.',
    specifications: {
      'Quantity': 'Pack of 10 Discs',
      'Dimensions': '100 x 1.2 x 16 mm',
      'Max Speed': '15,300 RPM (80 m/s)',
      'Application': 'Stainless Steel (Inox), Mild Steel, Pipes'
    },
    badge: 'Clean Cut Pack',
    imageIcon: 'Disc',
    brandColor: '#005691',
    compatibility: 'Fits all 4-Inch Angle Grinders'
  },
  {
    id: 'prod-acc-03',
    name: 'C&U 608-2RS High-RPM Rubber-Sealed Armature Ball Bearing (Pack of 2)',
    brand: 'C&U Bearings',
    modelNumber: 'BRG-608-2RS',
    category: 'spare-parts',
    price: 95,
    originalPrice: 140,
    inStock: true,
    stockCount: 80,
    rating: 4.9,
    reviewsCount: 56,
    description: 'Heavy duty deep groove miniature ball bearings with dual synthetic rubber contact seals (2RS). Withstands 36,000 RPM motor shaft rotation with zero dust ingress.',
    specifications: {
      'Internal Bore': '8 mm',
      'Outer Diameter': '22 mm',
      'Width': '7 mm',
      'Seal Type': 'Dual Rubber Contact Seals (2RS)',
      'Grease': 'Pre-packed with Kyodo Yushi high-temp grease'
    },
    badge: 'Armature Bearing',
    imageIcon: 'Cpu',
    brandColor: '#475569',
    compatibility: 'Fits Bosch, Makita & Dongcheng Armatures'
  },
  {
    id: 'prod-acc-04',
    name: 'Universal Heavy-Duty Spindle Flange Lock Nut Set with Spanner Pin (M10)',
    brand: 'Sai Workshop Hardware',
    modelNumber: 'NUT-FLANGE-M10',
    category: 'spare-parts',
    price: 120,
    originalPrice: 160,
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewsCount: 23,
    description: 'High-tensile forged steel inner and outer lock nut pair with 2-pin universal tightening spanner wrench. Knurled bottom surface prevents blade slippage under heavy load.',
    specifications: {
      'Thread Size': 'M 10 Standard Metric',
      'Material': 'Heat Treated Forged Carbon Steel',
      'Includes': 'Inner Flange, Outer Lock Nut, Two-Pin Spanner'
    },
    badge: 'Universal M10',
    imageIcon: 'Cpu',
    brandColor: '#475569',
    compatibility: 'Fits all 4-Inch Angle Grinders'
  }
];

export const getProductDefaultImage = (name: string, model: string, cat: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/';
  const lower = (name + ' ' + model + ' ' + cat).toLowerCase();

  // 1. Pure Copper Armatures & Rotors
  if (lower.includes('armature') || lower.includes('rotor')) {
    return `${base}images/copper-armature.jpg`;
  }

  // 2. Stator Field Coils
  if (lower.includes('stator') || lower.includes('field coil')) {
    return `${base}images/stator-coil.jpg`;
  }

  // 3. Auto-Cut Motor Carbon Brushes
  if (lower.includes('carbon brush') || lower.includes('cb-')) {
    return `${base}images/carbon-brushes.jpg`;
  }

  // 4. Armature Ball Bearings
  if (lower.includes('bearing') || lower.includes('608-2rs') || lower.includes('629-2rs')) {
    return `${base}images/ball-bearings.jpg`;
  }

  // 5. Switches
  if (lower.includes('switch')) {
    return `${base}images/switch-assembly.jpg`;
  }

  // 6. Flange Nut & Spanner Sets
  if (lower.includes('flange') || lower.includes('nut') || lower.includes('spanner')) {
    return `${base}images/flange-nut.jpg`;
  }

  // 7. Demolition Hammer Piston Overhaul Kits
  if (lower.includes('piston') || lower.includes('striker') || lower.includes('overhaul')) {
    return `${base}images/piston-kit.jpg`;
  }

  // 8. Diamond Blades & Cutting Discs
  if (lower.includes('blade') || lower.includes('turbo') || lower.includes('cutting disc') || lower.includes('wheel')) {
    return `${base}images/diamond-blade.jpg`;
  }

  // 9. Demolition Breaker Hammers
  if (lower.includes('demolition') || lower.includes('breaker') || lower.includes('hm0810') || lower.includes('h41sst')) {
    return `${base}images/demolition-hammer.jpg`;
  }

  // 10. Marble & Tile Cutters
  if (lower.includes('marble') || lower.includes('tile cutter') || lower.includes('cutter') || lower.includes('4100nh') || lower.includes('gdc 120')) {
    return `${base}images/marble-cutter.jpg`;
  }

  // 11. Rotary Hammers & SDS Drills
  if (lower.includes('rotary hammer') || lower.includes('hammer drill') || lower.includes('gbh 2-26') || lower.includes('d25133k') || lower.includes('drill')) {
    return `${base}images/rotary-hammer.jpg`;
  }

  // 12. Angle Grinders
  if (lower.includes('grinder') || lower.includes('gws 600') || lower.includes('9554nb') || lower.includes('dw801')) {
    return `${base}images/angle-grinder.jpg`;
  }

  return `${base}images/copper-armature.jpg`;
};

export const MOCK_PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  imageUrl: p.imageUrl || getProductDefaultImage(p.name, p.modelNumber, p.category)
}));


export const SAMPLE_REPAIRS: { [key: string]: RepairJob } = {
  'REP-1001': {
    referenceId: 'REP-1001',
    customerName: 'Ramesh Patil',
    phone: '9876543210',
    toolType: 'Angle Grinder',
    brandModel: 'Bosch GWS 600 (100mm)',
    issueDescription: 'Heavy sparking from motor vents, severe burning smell, and sudden loss of speed under cutting pressure.',
    status: 'in_progress',
    statusLabel: 'Repair in Progress',
    submittedAt: 'Today at 10:15 AM',
    estimatedCost: 750,
    technicianName: 'Santosh (Senior Tool Specialist)',
    timeline: [
      {
        status: 'requested',
        label: 'Repair Booking Submitted',
        timestamp: '16 Oct, 10:15 AM',
        completed: true,
        notes: 'Tool brand, model, and symptoms logged online.'
      },
      {
        status: 'received_at_shop',
        label: 'Tool Received at Counter',
        timestamp: '16 Oct, 11:30 AM',
        completed: true,
        notes: 'Machine handed over at Om Sai Service Center desk. Inspection slip issued.'
      },
      {
        status: 'inspection',
        label: 'Diagnostic Bench Inspection',
        timestamp: '16 Oct, 02:00 PM',
        completed: true,
        notes: 'Commutator scored; brushes worn past safe threshold. Field coil tested 100% healthy.'
      },
      {
        status: 'awaiting_customer_approval',
        label: 'Estimate Sent & Confirmed',
        timestamp: '16 Oct, 02:30 PM',
        completed: true,
        notes: 'Estimate ₹750 (New Copper Armature + Auto-Cut Carbon Brushes + Full Servicing).'
      },
      {
        status: 'approved',
        label: 'Approved by Customer',
        timestamp: '16 Oct, 03:00 PM',
        completed: true,
        notes: 'Customer confirmed via WhatsApp/Call.'
      },
      {
        status: 'in_progress',
        label: 'Parts Assembly & Bench Testing',
        timestamp: '16 Oct, 04:30 PM',
        completed: true,
        notes: 'New armature installed, fresh gearbox grease packed. Undergoing RPM load test.'
      },
      {
        status: 'ready_for_collection',
        label: 'Ready for Counter Collection',
        timestamp: 'Expected today by 7:30 PM',
        completed: false,
        notes: 'Customer will test tool at counter before paying.'
      },
      {
        status: 'completed',
        label: 'Collected & Tested',
        timestamp: 'Pending customer pickup',
        completed: false
      }
    ]
  },
  'REP-1002': {
    referenceId: 'REP-1002',
    customerName: 'Ganesh Shinde (Civil Contractor)',
    phone: '9922114455',
    toolType: 'Demolition Hammer',
    brandModel: 'Makita M0810B (Hex 17)',
    issueDescription: 'Motor runs at full power but piston fails to hammer concrete. Grease oozing from nose cylinder.',
    status: 'ready_for_collection',
    statusLabel: 'Ready for Collection',
    submittedAt: 'Yesterday at 04:00 PM',
    estimatedCost: 1100,
    technicianName: 'Sachin (Hammer Specialist)',
    timeline: [
      {
        status: 'requested',
        label: 'Repair Request Submitted',
        timestamp: '15 Oct, 04:00 PM',
        completed: true
      },
      {
        status: 'received_at_shop',
        label: 'Tool Received at Shop',
        timestamp: '15 Oct, 05:00 PM',
        completed: true
      },
      {
        status: 'inspection',
        label: 'Cylinder Disassembly & Check',
        timestamp: '16 Oct, 09:30 AM',
        completed: true,
        notes: 'Striker O-ring torn, striker sleeve clogged with hardened debris.'
      },
      {
        status: 'approved',
        label: 'Estimate Approved',
        timestamp: '16 Oct, 11:00 AM',
        completed: true,
        notes: 'Approved quote of ₹1,100 (Makita OEM Seal Kit + Hammer Grease).'
      },
      {
        status: 'in_progress',
        label: 'Seals Replaced & Lubricated',
        timestamp: '16 Oct, 01:15 PM',
        completed: true,
        notes: 'Assembled, fresh grease packed, air valve cleared.'
      },
      {
        status: 'ready_for_collection',
        label: 'Tested & Ready at Counter',
        timestamp: '16 Oct, 03:45 PM',
        completed: true,
        notes: 'Tested on test concrete block at shop. Ready for collection with ticket.'
      },
      {
        status: 'completed',
        label: 'Collected & Closed',
        timestamp: 'Pending pickup',
        completed: false
      }
    ]
  }
};

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Balasaheb Jadhav',
    role: 'Steel Fabrication Contractor',
    comment: 'Om Sai Power Tools is our go-to shop for 4-inch grinder armatures and cutting blades. You can inspect the copper winding right in front of you. Their repair team replaced our Bosch grinder armature in 3 hours!',
    rating: 5,
    location: 'Bhosari MIDC'
  },
  {
    id: 't-2',
    name: 'Vikram Salunkhe',
    role: 'Interior Carpenter & Modular Works',
    comment: 'The in-shop testing policy is the best part. When my Dongcheng drill stopped working, they opened it at the counter, showed me the chipped brushes, and only charged ₹140. Honest service.',
    rating: 5,
    location: 'Chinchwad Station'
  },
  {
    id: 't-3',
    name: 'Pradeep Sharma',
    role: 'Civil & Tile Contractor',
    comment: 'We buy Norton marble blades in bulk here. No fake parts, pure original stock. The ticket tracking also keeps my site supervisors informed on our demolition hammer repair status.',
    rating: 5,
    location: 'Pimpri Industrial Zone'
  }
];

export const FAQS = [
  {
    question: 'Why is there no courier or home delivery?',
    answer: 'As stated in our operating policy, power tools and high-precision armatures require hands-on physical inspection and testing. Customers visit our Station Road center to verify fitment, test machine RPM, and avoid delivery damage.'
  },
  {
    question: 'Do you use 100% genuine copper armatures?',
    answer: 'Yes! All our armatures (Bosch, Makita, Dongcheng, Hitachi) are strictly electrolytic pure copper with epoxy heat shielding and factory dynamic balancing. We never stock cheap aluminum or mixed wire rotors.'
  },
  {
    question: 'How does the diagnostic estimate work?',
    answer: 'Our technicians inspect the tool on the test bench and check armature resistance, coil continuity, and bearings. We call or message you the exact estimate before replacing any parts. We start work only after your approval.'
  },
  {
    question: 'Can I test my repaired machine before paying?',
    answer: 'Absolutely. We have a dedicated testing counter at the shop equipped with current meters, test wood, and concrete blocks so you can operate the tool under load before finalizing payment.'
  }
];

export const SAMPLE_ORDERS: import('../types').CounterOrder[] = [
  {
    orderRef: 'TC-RES-8821',
    customerName: 'Mahesh Gaikwad (Fabricator)',
    phone: '+91 98220 11452',
    status: 'pending_collection',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 45 * 3600 * 1000).toISOString(),
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      },
      {
        product: MOCK_PRODUCTS[3],
        quantity: 2
      }
    ],
    totalAmount: 2760
  },
  {
    orderRef: 'TC-RES-8809',
    customerName: 'Santosh Kulkarni (Carpenter)',
    phone: '+91 97654 33210',
    status: 'pending_collection',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 34 * 3600 * 1000).toISOString(),
    items: [
      {
        product: MOCK_PRODUCTS[2],
        quantity: 2
      }
    ],
    totalAmount: 1780
  },
  {
    orderRef: 'TC-RES-8755',
    customerName: 'Rajendra Jagtap (Civil Engg)',
    phone: '+91 94225 66781',
    status: 'collected',
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    collectedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    collectedBy: 'Himani (Owner & Founder)',
    paymentMethod: 'upi_counter',
    items: [
      {
        product: MOCK_PRODUCTS[1],
        quantity: 1
      }
    ],
    totalAmount: 2150
  }
];

