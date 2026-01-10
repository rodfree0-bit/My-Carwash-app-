import { VehicleTypeConfig } from '../types';

export const DEFAULT_VEHICLE_TYPES: VehicleTypeConfig[] = [
    // CARS & SUVS
    {
        id: "compact_car",
        name: "Compact Car",
        mainCategory: "cars_suvs",
        subCategory: "car",
        size: "small",
        basePrice: 50,
        icon: "🚗",
        examples: ["Honda Civic", "Toyota Corolla", "Mazda 3"],
        description: "Small sedans and hatchbacks",
        active: true,
        order: 1
    },
    {
        id: "midsize_sedan",
        name: "Mid-Size Sedan",
        mainCategory: "cars_suvs",
        subCategory: "car",
        size: "medium",
        basePrice: 60,
        icon: "🚙",
        examples: ["Honda Accord", "Toyota Camry", "Nissan Altima"],
        description: "Standard 4-door sedans",
        active: true,
        order: 2
    },
    {
        id: "suv",
        name: "SUV",
        mainCategory: "cars_suvs",
        subCategory: "suv",
        size: "medium",
        basePrice: 70,
        icon: "🚐",
        examples: ["Honda CR-V", "Toyota RAV4", "Nissan Rogue"],
        description: "Compact and mid-size SUVs",
        active: true,
        order: 3
    },
    {
        id: "large_suv",
        name: "Large SUV",
        mainCategory: "cars_suvs",
        subCategory: "suv",
        size: "large",
        basePrice: 80,
        icon: "🚐",
        examples: ["Chevy Tahoe", "Ford Expedition", "Toyota Sequoia"],
        description: "Full-size SUVs with 3 rows",
        active: true,
        order: 4
    },

    // TRUCKS & PICKUPS
    {
        id: "compact_truck",
        name: "Compact Pickup",
        mainCategory: "trucks",
        subCategory: "pickup",
        size: "small",
        basePrice: 60,
        icon: "🛻",
        examples: ["Toyota Tacoma", "Chevy Colorado", "Ford Ranger"],
        description: "Mid-size pickup trucks",
        active: true,
        order: 5
    },
    {
        id: "fullsize_truck",
        name: "Full-Size Pickup",
        mainCategory: "trucks",
        subCategory: "pickup",
        size: "large",
        basePrice: 75,
        icon: "🛻",
        examples: ["Ford F-150", "Chevy Silverado 1500", "Ram 1500"],
        description: "Standard half-ton pickups",
        active: true,
        order: 6
    },
    {
        id: "heavy_duty_truck",
        name: "Heavy Duty Pickup",
        mainCategory: "trucks",
        subCategory: "pickup",
        size: "xlarge",
        basePrice: 90,
        icon: "🛻",
        examples: ["Ford F-250/350", "Chevy Silverado 2500/3500"],
        description: "Heavy duty work trucks",
        active: true,
        order: 7
    },

    // VANS
    {
        id: "minivan",
        name: "Minivan",
        mainCategory: "vans",
        subCategory: "van",
        size: "medium",
        basePrice: 55,
        icon: "🚐",
        examples: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica"],
        description: "Family minivans",
        active: true,
        order: 8
    },
    {
        id: "cargo_van",
        name: "Cargo Van",
        mainCategory: "vans",
        subCategory: "van",
        size: "large",
        basePrice: 65,
        icon: "🚐",
        examples: ["Ford Transit", "Mercedes Sprinter (Cargo)", "Ram ProMaster"],
        description: "Commercial cargo vans",
        active: true,
        order: 9
    },

    // RVS & MOTORHOMES
    {
        id: "class_b_rv",
        name: "Class B RV",
        mainCategory: "rvs",
        subCategory: "rv",
        size: "large",
        basePrice: 150,
        icon: "🚐",
        examples: ["Mercedes Sprinter RV", "Winnebago Revel"],
        description: "Camper vans",
        active: true,
        order: 10
    },
    {
        id: "class_c_rv",
        name: "Class C RV",
        mainCategory: "rvs",
        subCategory: "rv",
        size: "xlarge",
        basePrice: 250,
        icon: "🚐",
        examples: ["Winnebago Minnie Winnie", "Thor Motor Coach"],
        description: "Mid-size motorhomes with cab-over",
        active: true,
        order: 11
    },
    {
        id: "class_a_rv",
        name: "Class A RV",
        mainCategory: "rvs",
        subCategory: "rv",
        size: "massive",
        basePrice: 400,
        icon: "🚌",
        examples: ["Newmar Dutch Star", "Tiffin Allegro Bus"],
        description: "Large bus-style motorhomes",
        active: true,
        order: 12
    },

    // COMMERCIAL / SEMI TRUCKS
    {
        id: "semi_truck_cab",
        name: "Semi Truck (Cab Only)",
        mainCategory: "commercial",
        subCategory: "truck",
        size: "xlarge",
        basePrice: 150,
        icon: "🚛",
        examples: ["Peterbilt 389", "Kenworth W900", "Freightliner Cascadia"],
        description: "Commercial semi-truck cab without trailer",
        active: true,
        order: 13
    },
    {
        id: "semi_truck_trailer",
        name: "Semi Truck + Trailer",
        mainCategory: "commercial",
        subCategory: "truck",
        size: "massive",
        basePrice: 300,
        icon: "🚛",
        examples: ["Semi with 53' Trailer"],
        description: "Full commercial rig with trailer",
        active: true,
        order: 14
    }
];
