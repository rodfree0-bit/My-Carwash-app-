import { ServicePackage } from '../types';

export const DEFAULT_SERVICE_PACKAGES: ServicePackage[] = [
    {
        id: "package_basic",
        name: "Basic Wash",
        description: "Exterior wash, wheel cleaning, and tire shine.",
        price: {
            "compact_car": 30,
            "midsize_sedan": 35,
            "suv": 45,
            "large_suv": 55,
            "compact_truck": 45,
            "fullsize_truck": 55,
            "heavy_duty_truck": 65,
            "minivan": 50,
            "cargo_van": 60,
            "class_b_rv": 100,
            "class_c_rv": 150,
            "class_a_rv": 200,
            "semi_truck_cab": 100,
            "semi_truck_trailer": 200,
            // Fallbacks for legacy
            "sedan": 30,
            "SUV": 45,
            "Truck": 55,
            "Van": 50
        },
        duration: "45 min",
        features: ["Hand Wash", "Wheel Cleaning", "Tire Shine", "Exterior Windows"],

    },
    {
        id: "package_premium",
        name: "Premium Detail",
        description: "Full interior & exterior detail with wax.",
        price: {
            "compact_car": 100,
            "midsize_sedan": 120,
            "suv": 140,
            "large_suv": 160,
            "compact_truck": 140,
            "fullsize_truck": 160,
            "heavy_duty_truck": 180,
            "minivan": 150,
            "cargo_van": 170,
            "class_b_rv": 250,
            "class_c_rv": 350,
            "class_a_rv": 450,
            "semi_truck_cab": 250,
            "semi_truck_trailer": 450,
            "sedan": 120,
            "SUV": 140,
            "Truck": 160,
            "Van": 150
        },
        duration: "2 hours",
        features: ["Hand Wash & Wax", "Interior Vacuum", "Leather Clean/Condition", "Dashboard Wipe", "Door Jambs"],

    },
    {
        id: "package_deluxe",
        name: "Showroom Deluxe",
        description: "The ultimate restoration package. Paint correction not included.",
        price: {
            "compact_car": 200,
            "midsize_sedan": 220,
            "suv": 250,
            "large_suv": 300,
            "compact_truck": 250,
            "fullsize_truck": 300,
            "heavy_duty_truck": 350,
            "minivan": 280,
            "cargo_van": 320,
            "class_b_rv": 500,
            "class_c_rv": 700,
            "class_a_rv": 900,
            "semi_truck_cab": 500,
            "semi_truck_trailer": 900,
            "sedan": 220,
            "SUV": 250,
            "Truck": 300,
            "Van": 280
        },
        duration: "4 hours",
        features: ["Clay Bar", "Machine Buff & Wax", "Shampoo Carpets/Seats", "Steam Clean Vents", "Engine Bay Detail"],

    }
];
