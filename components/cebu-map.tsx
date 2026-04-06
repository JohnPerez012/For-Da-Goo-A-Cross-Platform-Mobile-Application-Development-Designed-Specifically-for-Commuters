import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Polygon, Polyline } from 'react-native-maps';
import { SharedLocation } from '../hooks/use-location-sharing';


interface CebuMapProps {
  sharedLocations?: Record<string, SharedLocation>;
  activeRoute: string;   // The Route selected in the dropdown
  showBoundary: boolean; // Managed by the dropdown "Toggle Boundary"
}

export function CebuMap({ sharedLocations, activeRoute, showBoundary }: CebuMapProps) {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Square boundary with 4 adjustable corners
  // You can modify these values to adjust each corner independently
  const BOUNDARY_CORNERS = {
    topLeft: {
      latitude: 11.30107,   // North latitude
      longitude: 123.49031, // West longitude
    },
    topRight: {
      latitude: 11.24181,   // North latitude
      longitude: 124.54687, // East longitude
    },
    bottomLeft: {
      latitude: 10.10010,    // South latitude
      longitude: 123.19611, // West longitude
    },
    bottomRight: {
      latitude: 10.13795,    // South latitude
      longitude: 124.22894, // East longitude
    },
  };

  // Calculate bounds from corners for constraint logic
  const DAANBANTAYAN_BOUNDS = {
    northEast: {
      latitude: Math.max(BOUNDARY_CORNERS.topLeft.latitude, BOUNDARY_CORNERS.topRight.latitude),
      longitude: Math.max(BOUNDARY_CORNERS.topRight.longitude, BOUNDARY_CORNERS.bottomRight.longitude),
    },
    southWest: {
      latitude: Math.min(BOUNDARY_CORNERS.bottomLeft.latitude, BOUNDARY_CORNERS.bottomRight.latitude),
      longitude: Math.min(BOUNDARY_CORNERS.topLeft.longitude, BOUNDARY_CORNERS.bottomLeft.longitude),
    },
  };

  // Public Transportation Routes
  // Via Kawit Route - Adjust these coordinates based on actual route waypoints
  const KAWIT_ROUTE = [
    { latitude: 10.31099, longitude: 123.92085 }, // Cebu North Terminal (start)
    { latitude: 10.32573, longitude: 123.93788 }, 
    { latitude: 10.33863, longitude: 123.95499 }, 
    { latitude: 10.38729, longitude: 124.00120 }, 
    { latitude: 10.52128, longitude: 124.02924 }, 
    { latitude: 10.52128, longitude: 124.02924 }, 
    { latitude: 10.72555, longitude: 124.01415 },
    { latitude: 10.95713, longitude: 123.96174 }, // Route waypoint 4
    { latitude: 11.04627, longitude: 124.00156 }, 
    { latitude: 11.06294, longitude: 123.97032 }, 
    { latitude: 11.0800, longitude: 123.97457 }, //Dayhagon
    { latitude: 11.09339, longitude: 123.96564 }, 
    { latitude: 11.18564, longitude: 123.94558 }, //Kawit Waypoint
    { latitude: 11.21172, longitude: 123.96893 }, 
    { latitude: 11.22440, longitude: 123.99091 }, //PayPay
    { latitude: 11.24673, longitude: 124.00167 }, // CTU Daanbantayan (end)
  ];

  // Via Bagay Route - Adjust these coordinates based on actual route waypoints
  const BAGAY_ROUTE = [
    { latitude: 10.311349, longitude: 123.921219 }, // Cebu North Terminal (start)
    { latitude: 10.310922, longitude: 123.921549}, //Sergio Osmena Av.
    { latitude: 10.314635, longitude: 123.9261571}, //Ouano Av.
    { latitude: 10.315311, longitude: 123.925653},//
    { latitude: 10.316134, longitude: 123.924429},  //Ouano Av.
    { latitude: 10.317991, longitude:  123.925331},  //M. Logarta
    { latitude: 10.320440, longitude:  123.925964},  
    { latitude: 10.321222, longitude:  123.925749},  
    { latitude: 10.323079, longitude: 123.924429},  
    { latitude: 10.328990, longitude: 123.931028},  //Lopez
    { latitude: 10.338967, longitude: 123.945137},  //M.C BRIONES 1 
    { latitude: 10.339898, longitude: 123.946265},  //M.C BRIONES 2 
    { latitude: 10.340741, longitude: 123.946891},  //M.C BRIONES 3 
    { latitude: 10.341493, longitude: 123.947265},  //M.C BRIONES 4 
    { latitude: 10.342768, longitude: 123.947632},  //M.C BRIONES 5
    { latitude: 10.344218, longitude: 123.947622},  //Central Neutical H.
    { latitude: 10.352920, longitude: 123.949740},  //Central Neutical H. 2
    { latitude: 10.356369, longitude: 123.950124 }, //Central Neutical H. 3
    { latitude: 10.361271, longitude: 123.949675}, //Central Neutical H. 4
    { latitude: 10.364345, longitude: 123.950163}, //Central Neutical H. 5
    { latitude: 10.368841, longitude: 123.953059}, //Central Neutical H. 6
    { latitude: 10.370424, longitude: 123.953209}, //Central Neutical H. 7
    { latitude: 10.374181, longitude: 123.955227}, //Central Neutical H. 8
    { latitude: 10.375574, longitude: 123.956397}, //Central Neutical H. 9
    { latitude: 10.376228, longitude: 123.957556}, //Central Neutical H. 10
    { latitude: 10.376376, longitude: 123.958940}, //Central Neutical H. 11
    { latitude: 10.376573, longitude: 123.960122}, //Central Neutical H. 12
    { latitude: 10.376956, longitude: 123.961482}, //Central Neutical H. 13
    { latitude: 10.378990, longitude: 123.964274}, //Central Neutical H. 14
    { latitude: 10.380710, longitude: 123.967911}, //Cebu N Rd
    { latitude: 10.381189, longitude: 123.969672}, //Cebu N Rd2
    { latitude: 10.381817, longitude: 123.970639}, //Cebu N Rd3
    { latitude: 10.383986, longitude: 123.973450}, //Cebu N Rd4
    { latitude: 10.385558, longitude: 123.976454}, //Cebu N Rd5
    { latitude: 10.386962, longitude: 123.978160}, //Cebu N Rd6
    { latitude: 10.392747, longitude: 123.984307}, //Central Neutical H. 
    { latitude: 10.394674, longitude: 123.986043}, //Central Neutical H. 2
    { latitude: 10.396410, longitude: 123.987737}, //Central Neutical H. 3
    { latitude: 10.400565, longitude: 123.990290}, //Central Neutical H. 4
    { latitude: 10.401356, longitude: 123.991251}, //near BAjac Rd
    { latitude: 10.400750, longitude: 123.996005}, //near RCBC BRANCH - LILOAN
    { latitude: 10.399233, longitude: 123.999908}, //CURVE LANE 1
    { latitude: 10.399473, longitude: 124.000205}, //CURVE LANE 2
    { latitude: 10.408664, longitude: 123.997673}, //NEAR WEBER HOTEL
    { latitude: 10.415467, longitude: 123.997231}, //NEAR Seafront Beach
    { latitude: 10.422962, longitude: 123.998272}, //Central Neutical H. 
    { latitude: 10.431767, longitude: 124.004241}, //Central Neutical H. 2
    { latitude: 10.434454, longitude: 124.006916}, //Central Neutical H. 3 
    { latitude: 10.436288, longitude: 124.008426}, //Central Neutical H. 4
    { latitude: 10.438785, longitude: 124.009012}, //Central Neutical H.
    { latitude: 10.442096, longitude: 124.009583}, //Central Neutical H. 5
    { latitude: 10.446989, longitude: 124.010049}, //Central Neutical H. 6
    { latitude: 10.451638, longitude: 124.012146}, //Near Jolibee Compostela
    { latitude: 10.459293, longitude: 124.014594},//C.N.H
    { latitude: 10.468582, longitude: 124.017375},//C.N.H
    { latitude: 10.480046, longitude: 124.021486},//C.N.H
    { latitude: 10.481719, longitude: 124.022478}, //Near St. Francis of Asisi Church
    { latitude: 10.483546, longitude: 124.024107 }, // daNAO area
    { latitude: 10.487508, longitude: 124.026831 }, // daNAO area
    { latitude: 10.495399, longitude: 124.030856 }, // daNAO area
    { latitude: 10.503931, longitude: 124.031205 }, // nEAR CAR TINT SERVICING
    { latitude: 10.506526, longitude: 124.030339 }, // daNAO area
    { latitude: 10.509502, longitude: 124.027549 }, // daNAO area
    { latitude: 10.510445, longitude: 124.026940 }, // Near Costanera Beach
    { latitude: 10.519269, longitude: 124.028538 }, // daNAO area
    { latitude: 10.520968, longitude: 124.029311 }, // Near Port of danao
    { latitude: 10.521345, longitude: 124.029248 }, // daNAO area
    { latitude: 10.525169, longitude: 124.024372 }, // C.N.H
    { latitude: 10.526681, longitude: 124.023930 }, //C.N.H
    { latitude: 10.527324, longitude: 124.024039 }, // D. DURANO ST.
    { latitude: 10.530091, longitude: 124.025136 }, // daNAO area
    { latitude: 10.531042, longitude: 124.025326 }, // daNAO area
    { latitude: 10.532618, longitude: 124.025275 }, // daNAO areA
    { latitude: 10.568392, longitude: 124.020723 }, // C.N.H
    { latitude: 10.581218, longitude: 124.018089 }, // cTU CARMEN
    { latitude: 10.583307, longitude: 124.017404 }, // C.N.H
    { latitude: 10.588803, longitude: 124.017833 }, // CARNEN AREA
    { latitude: 10.591685, longitude: 124.018243 }, // PAZ RESIDENCE
    { latitude: 10.594105, longitude: 124.018778 }, // Cogon East
    { latitude: 10.597118, longitude: 124.020038 }, 
    { latitude: 10.597707, longitude: 124.020458 }, // Bus stop carmen
    { latitude: 10.599371, longitude: 124.021629 }, // C.N.H
    { latitude: 10.604377, longitude: 124.023030 }, // C.N.H
    { latitude: 10.606801, longitude: 124.024199 }, // C.N.H
    { latitude: 10.607386, longitude: 124.025156 }, // C.N.H
    { latitude: 10.615343, longitude: 124.027348 }, // C.N.H
    { latitude: 10.618523, longitude: 124.027322 }, // C.N.H
    { latitude: 10.623280, longitude: 124.026209 }, // C.N.H
    { latitude: 10.626620, longitude: 124.026718 }, // Heramiz Becach Park
    { latitude: 10.630377, longitude: 124.027633 }, // CATMON CEBU
    { latitude: 10.631213, longitude: 124.028267 }, // C.N.H
    { latitude: 10.631809, longitude: 124.028299 }, // Ranola Beach Resort km46
    { latitude: 10.632181, longitude: 124.027874 }, // C.N.H
    { latitude: 10.632761, longitude: 124.027898 }, // Ranola Beach Resort
    { latitude: 10.633176, longitude: 124.028314 }, // C.N.H
    { latitude: 10.633837, longitude: 124.028358 }, // C.N.H
    { latitude: 10.634634, longitude: 124.027548 }, // Turtle Point RJY
    { latitude: 10.635416, longitude: 124.027026 }, // Chillin Pont Snack Corner
    { latitude: 10.635660, longitude: 124.026436 }, // C.N.H
    { latitude: 10.637451, longitude: 124.025469 }, // C.N.H
    { latitude: 10.639423, longitude: 124.025001 }, // C.N.H
    { latitude: 10.643742, longitude: 124.025272 }, // Near St. Joseph the Worker Parish
    { latitude: 10.645105, longitude: 124.025914 }, // C.N.H
    { latitude: 10.647887, longitude: 124.025526 }, // Near Bercede Bay REsort 
    { latitude: 10.650544, longitude: 124.024109 }, // C.N.H
    { latitude: 10.654101, longitude: 124.022213 }, // C.N.H
    { latitude: 10.660528, longitude: 124.020344 }, // Near TUrtle Beach
    { latitude: 10.664204, longitude: 124.020838 }, // C.N.H
    { latitude: 10.667845, longitude: 124.020997 }, // C.N.H
    { latitude: 10.671345, longitude: 124.020160 }, // C.N.H
    { latitude: 10.673003, longitude: 124.019339 }, // C.N.H
    { latitude: 10.675527, longitude: 124.017553 }, // Near Casa Antonia Beach Resort
    { latitude: 10.676290, longitude: 124.017003 }, // C.N.H
    { latitude: 10.677156, longitude: 124.016992 }, // C.N.H
    { latitude: 10.678244, longitude: 124.016273 }, // C.N.H
    { latitude: 10.679047, longitude: 124.016215 }, // C.N.H
    { latitude: 10.679963, longitude: 124.015885 }, // C.N.H
    { latitude: 10.684393, longitude: 124.015205 }, // C.N.H
    { latitude: 10.689622, longitude: 124.015302 }, // C.N.H
    { latitude: 10.691731, longitude: 124.014226 }, // Near Catmon Beaach Resort
    { latitude: 10.695056, longitude: 124.014044 }, // Near Aya Beach Resort
    { latitude: 10.697680, longitude: 124.013092 }, // Toledos Beach Resort
    { latitude: 10.698956, longitude: 124.011995 }, // C.N.H
    { latitude: 10.701375, longitude: 124.011428 }, // C.N.H
    { latitude: 10.710416, longitude: 124.013933 }, // C.N.H
    { latitude: 10.711005, longitude: 124.013750 }, // Las FLores Hotel
    { latitude: 10.712695, longitude: 124.012098 }, // C.N.H
    { latitude: 10.713346, longitude: 124.011712 }, // Near J&G Motor Parts & auto supply
    { latitude: 10.717359, longitude: 124.011084 }, // C.N.H
    { latitude: 10.722239, longitude: 124.012550 }, // C.N.H
    { latitude: 10.723913, longitude: 124.014195 }, // C.N.H
    { latitude: 10.725073, longitude: 124.014698 }, // C.N.H
    { latitude: 10.726728, longitude: 124.014331 }, // C.N.H  
    { latitude: 10.730151, longitude: 124.012124 }, // C.N.H
    { latitude: 10.736845, longitude: 124.009767 }, // Near Petron
    { latitude: 10.740400, longitude: 124.009195 }, // Cebu North Coast Resort
    { latitude: 10.742788, longitude: 124.006606 }, // C.N.H
    { latitude: 10.743951, longitude: 124.006604 }, // C.N.H
    { latitude: 10.748286, longitude: 124.004234 }, // SOGOD
    { latitude: 10.752089, longitude: 124.004202 }, // C.N.H
    { latitude: 10.753352, longitude: 124.003665 }, // C.N.H
    { latitude: 10.754278, longitude: 124.004153 }, // C.N.H
    { latitude: 10.755187, longitude: 124.004059 }, // nEAR SOGOD FITNESS GYM
    { latitude: 10.756501, longitude: 124.003234 }, // C.N.H
    { latitude: 10.756912, longitude: 124.003157 }, // C.N.H
    { latitude: 10.756977, longitude: 124.003201 }, // C.N.H
    { latitude: 10.759632, longitude: 124.004635 }, // C.N.H
    { latitude: 10.761911, longitude: 124.005454 }, // C.N.H
    { latitude: 10.762577, longitude: 124.005523 }, // C.N.H
    { latitude: 10.764331, longitude: 124.006372 }, // lHOYD water refilling station
    { latitude: 10.765042, longitude: 124.006494 }, // C.N.H
    { latitude: 10.767799, longitude: 124.005488 }, // C.N.H
    { latitude: 10.772304, longitude: 124.006258 }, // Julie's Bakeshop
    { latitude: 10.773027, longitude: 124.006003 }, // Avery & Eli Store
    { latitude: 10.773250, longitude: 124.005586 }, // C.N.H
    { latitude: 10.773387, longitude: 124.004943 }, // C.N.H
    { latitude: 10.773619, longitude: 124.004664 }, // C.N.H
    { latitude: 10.774481, longitude: 124.004369 }, //  AJL Motorcycle parts
    { latitude: 10.774599, longitude: 124.003355 }, // C.N.H
    { latitude: 10.775062, longitude: 124.002720 }, // C.N.H
    { latitude: 10.775866, longitude: 124.002741 }, // C.N.H
    { latitude: 10.776196, longitude: 124.003372 }, // C.N.H
    { latitude: 10.777214, longitude: 124.002752 }, // C.N.H
    { latitude: 10.778222, longitude: 124.002645 }, // C.N.H
    { latitude: 10.778374, longitude: 124.002087 }, // C.N.H
    { latitude: 10.779283, longitude: 124.001595 }, // C.N.H
    { latitude: 10.780182, longitude: 124.000377 }, // Rattan Furniture in sogod/vulcanizing shop
    { latitude: 10.781594, longitude: 123.999431 }, // C.N.H
    { latitude: 10.782399, longitude: 123.997956 }, // Near Cadulang 2 maringondon
    { latitude: 10.783675, longitude: 123.997590 }, // C.N.H
    { latitude: 10.784864, longitude: 123.997388 }, // Near Candung waiting shed
    { latitude: 10.785364, longitude: 123.996319 }, // C.N.H
    { latitude: 10.785923, longitude: 123.995832 }, // LMJ MOTTO PARTS 
    { latitude: 10.787168, longitude: 123.996093 }, // C.N.H
    { latitude: 10.788038, longitude: 123.996487 }, // C.N.H
    { latitude: 10.788896, longitude: 123.996443 }, // C.N.H
    { latitude: 10.792481, longitude: 123.996235 }, // C.N.H
    { latitude: 10.793147, longitude: 123.995711 }, // C.N.H
    { latitude: 10.794113, longitude: 123.996017 }, // C.N.H
    { latitude: 10.795122, longitude: 123.994902 }, // C.N.H
    { latitude: 10.796420, longitude: 123.994607 }, // C.N.H
    { latitude: 10.796270, longitude: 123.993373 }, // C.N.H
    { latitude: 10.798886, longitude: 123.992961 }, // dUMANGAS
    { latitude: 10.800024, longitude: 123.993385 }, // C.N.H
    { latitude: 10.801595, longitude: 123.993380 }, // C.N.H
    { latitude: 10.803141, longitude: 123.992352 }, // C.N.H
    { latitude: 10.806151, longitude: 123.993213 }, // nEAR Liki Brangay hall
    { latitude: 10.809580, longitude: 123.991654 }, // C.N.H
    { latitude: 10.813230, longitude: 123.988963 }, // C.N.H
    { latitude: 10.814084, longitude: 123.986485 }, // Route waypoint 3
    { latitude: 10.815952, longitude: 123.986173 }, // C.N.H
    { latitude: 10.81844, longitude: 123.98661 }, // C.N.H 
    { latitude: 10.82068, longitude: 123.98554 }, // C.N.H
    { latitude: 10.82312, longitude: 123.98483}, // C.N.H
    { latitude: 10.82527, longitude: 123.98543 }, // C.N.H
    { latitude: 10.82676, longitude: 123.98541 }, // C.N.H
    { latitude: 10.827950, longitude: 123.985884 }, // C.N.H
    { latitude: 10.83084, longitude: 123.98552 }, // C.N.H
    { latitude: 10.83228, longitude: 123.98498 }, // C.N.H
    { latitude: 10.833554, longitude: 123.984832 }, // C.N.H
    { latitude: 10.834420, longitude: 123.984237 }, // Near Clavera Covered Court
    { latitude: 10.838668, longitude: 123.983609 }, // C.N.H
    { latitude: 10.83933, longitude: 123.982836 }, // C.N.H
    { latitude: 10.839894, longitude: 123.981538 }, // Near Brgy. Laaw Sport complex
    { latitude: 10.841381, longitude: 123.980724 }, // C.N.H
    { latitude: 10.842514, longitude: 123.980973 }, // Laaw Elementary school
    { latitude: 10.847008, longitude: 123.980550 }, // C.N.H
    { latitude: 10.847799, longitude: 123.981028 }, // C.N.H
    { latitude: 10.849011, longitude: 123.980799 }, // C.N.H
    { latitude: 10.850462, longitude: 123.980203 }, // C.N.H
    { latitude: 10.852243, longitude: 123.980359 }, // C.N.H
    { latitude: 10.853159, longitude: 123.980437 }, // C.N.H
    { latitude: 10.853630, longitude: 123.981545 }, // BorBon Area
    { latitude: 10.854152, longitude: 123.982103 }, // Sagay GYM
    { latitude: 10.855152, longitude: 123.982220 }, // Cls Bakeshop
    { latitude: 10.856729, longitude: 123.981565 }, // C.N.H
    { latitude: 10.858205, longitude: 123.981571 }, // C.N.H
    { latitude: 10.860254, longitude: 123.980595 }, // C.N.H
    { latitude: 10.861244, longitude: 123.979616 }, // Near Bible Baptist temple
    { latitude: 10.862774, longitude: 123.979158 }, // C.N.H
    { latitude: 10.864216, longitude: 123.979107 }, // C.N.H
    { latitude: 10.869075, longitude: 123.977682 }, // Borbon Area
    { latitude: 10.870016, longitude: 123.978047 }, // C.N.H
    { latitude: 10.871547, longitude: 123.978023 }, // C.N.H
    { latitude: 10.872563, longitude: 123.977731 }, // C.N.H
    { latitude: 10.873336, longitude: 123.978076 }, // Near Cecit Store
    { latitude: 10.875522, longitude: 123.976968 }, // UPMC MOTOR PARTS
    { latitude: 10.876387, longitude: 123.976957 }, // C.N.H
    { latitude: 10.876811, longitude: 123.977128 }, // C.N.H
    { latitude: 10.877991, longitude: 123.977119 }, // bORBON aREA
    { latitude: 10.879602, longitude: 123.976467 }, // Don Gregorio An
    { latitude: 10.880154, longitude: 123.9754972 }, // C.N.H
    { latitude: 10.880615, longitude: 123.975285 }, // C.N.H
    { latitude: 10.882168, longitude: 123.975123 }, // Kusina Ni Nancy
    { latitude: 10.887065, longitude: 123.973669 }, // C.N.H
    { latitude: 10.890990, longitude: 123.973573 }, // Aqua orio Refilling Station
    { latitude: 10.892461, longitude: 123.972472 }, // Tabogon Area
    { latitude: 10.897171, longitude: 123.970053 }, // C.N.H
    { latitude: 10.897885, longitude: 123.968793 }, //Koro Store
    { latitude: 10.899902, longitude: 123.968495 }, // C.N.H
    { latitude: 10.901325, longitude: 123.967714 }, // C.N.H
    { latitude: 10.902093, longitude: 123.967140 }, // TAbogon area
    { latitude: 10.904464, longitude: 123.967062 }, // TAbogon area
    { latitude: 10.905617, longitude: 123.969706 }, // Near Mira's Closet
    { latitude: 10.907092, longitude: 123.971729 }, // Petron gas station (TAbogon)
    { latitude: 10.90777, longitude: 123.971932 }, // TAbogon area
    { latitude: 10.908914, longitude: 123.971546 }, // TAbogon area
    { latitude: 10.910147, longitude: 123.971637 }, // TAbogon area
    { latitude: 10.910869, longitude: 123.970919 }, // TAbogon area
    { latitude: 10.910252, longitude: 123.969057 }, // TAbogon area
    { latitude: 10.910469, longitude: 123.968561 }, // TAbogon area
    { latitude: 10.914746, longitude: 123.966291 }, // NeAR Edwin's Carenderia
    { latitude: 10.915452, longitude: 123.963153 }, // Near New  Japanese Surrender Site Marker
    { latitude: 10.916747, longitude: 123.962220 }, // saN rEMIGIO area
    { latitude: 10.920888, longitude: 123.964726 }, // Near Villa Fejuruba
    { latitude: 10.922296, longitude: 123.964539 }, // saN rEMIGIO area
    { latitude: 10.923471, longitude:  123.963566 }, // saN rEMIGIO area
    { latitude: 10.929130, longitude: 123.962162 }, // Near Jill Store
    { latitude: 10.929928, longitude: 123.960346 }, // saN rEMIGIO area
    { latitude: 10.933290, longitude: 123.961318 }, // saN rEMIGIO area
    { latitude: 10.93573, longitude: 123.963192 }, // saN rEMIGIO area
    { latitude: 10.936450, longitude: 123.965900 }, // TAbogon area
    { latitude: 10.939460, longitude: 123.966326 }, // TAbogon area
    { latitude: 10.940630, longitude: 123.965270 }, // Tabogon area
    { latitude: 10.943172, longitude: 123.964486 }, // Tabogoon area
    { latitude: 10.946332, longitude: 123.965389 }, // TAbogon area
    { latitude: 10.947436, longitude: 123.964759 }, //  Tabogon area
    { latitude: 10.949710, longitude: 123.964759 }, // Near Ailleen store TAbogon area
    { latitude: 10.955746, longitude: 123.961250 }, // Bogo City
    { latitude: 10.957134, longitude: 123.961659 }, // Bogo City
    { latitude: 10.958856, longitude: 123.960961 }, // Bogo City
    { latitude: 10.960060, longitude: 123.962454 }, // Near 6ds bakeshop
    { latitude: 10.961956, longitude: 123.963312 }, // Bogo City
    { latitude: 10.962989, longitude: 123.962990 }, // Bogo City
    { latitude: 10.967370, longitude: 123.963290 }, // Bogo City
    { latitude: 10.968950, longitude: 123.963870 }, // Near San Antonio De Padua Chapel
    { latitude: 10.971626, longitude: 123.967539 }, // Bogo City
    { latitude: 10.973121, longitude: 123.967603 }, // Near Htg Hardware - tabogon
    { latitude: 10.975017, longitude: 123.968505 }, // Tabogon Area
    { latitude: 10.975502, longitude: 123.969363 }, // Tabogon Area
    { latitude: 10.979507, longitude: 123.971420 }, // Bible baptist Temple - Bogo City
    { latitude: 10.982036, longitude: 123.974414 }, // Bogo City
    { latitude: 10.986244, longitude: 123.974508 }, // Bogo City
    { latitude: 10.988516, longitude: 123.976929 }, // Near Oasis Store - Bogo City
    { latitude: 10.990500, longitude: 123.978224 }, // Bogo City
    { latitude: 10.995043, longitude: 123.979053 }, // Bogo City
    { latitude: 10.998862, longitude: 123.981505}, // Bogo City
    { latitude: 11.00200, longitude: 123.983238 }, // Bogo City
    { latitude: 11.003033, longitude: 123.985115 }, // Bogo City
    { latitude: 11.002791, longitude: 123.986070 }, // Bogo City
    { latitude: 11.003623, longitude: 123.987562 }, // near Holy Family Of Nazareth Parasish - Bogo City
    { latitude: 11.007450, longitude: 123.988164 }, // La paz Bogo City
    { latitude: 11.009195, longitude:  123.988947 }, // Bogo City
    { latitude: 11.016966, longitude: 123.994613 }, // Bogo City
    { latitude: 11.025522, longitude: 123.998868 }, // Citi Hardware -  Bogo City
    { latitude: 11.040713, longitude: 124.003125 }, // Bogo City
    { latitude: 11.045419, longitude: 124.002738 }, // Rodgers' Store - Bogo City
    { latitude: 11.046262, longitude: 124.002830 }, // Polambato takdan 2 - Bogo City
    { latitude: 11.045431, longitude: 124.000276 }, // Bogo City
    { latitude: 11.045393, longitude: 123.999755 }, // Cogon  -  Bogo City
    { latitude: 11.045936, longitude: 123.998125 }, // Seaoil - Bogo City
    { latitude: 11.046050, longitude: 123.996306 }, // Bogo City
    { latitude: 11.048245, longitude: 123.992679 }, // Bogo City
    { latitude: 11.051622, longitude: 123.988090 }, // Near the church in Bogo City Meeting hall
    { latitude: 11.052134, longitude: 123.986491 }, // Bogo City
    { latitude: 11.053694, longitude: 123.984882 }, // Bogo City
    { latitude: 11.060813, longitude: 123.974973 }, // Bogo City
    { latitude: 11.062470, longitude: 123.972165 }, // Vito's Carenederia - Bogo City
    { latitude: 11.065898, longitude: 123.971879 }, //  Bogo City
    { latitude: 11.075924, longitude: 123.973288 }, // Don Pedro Rodriguez Bogo City
    { latitude: 11.079160, longitude: 123.974562 }, // Medellin Area
    { latitude: 11.081588, longitude: 123.975789 }, // Medellin Area
    { latitude: 11.088161, longitude: 123.980475 }, // Sitio Curvada Medellin Area
    { latitude: 11.109986, longitude: 123.984505 }, // Medellin Area
    { latitude: 11.135924, longitude: 124.001244 }, // near The aisle Medellin Area
    { latitude: 11.141637, longitude: 124.003378 }, // Medellin Area
    { latitude: 11.147561, longitude: 124.003639 }, // FHE HARDWARE - Medellin Area
    { latitude: 11.149716, longitude: 124.004984 }, // Medellin Area
    { latitude: 11.155470, longitude: 124.005314 }, // Nippon Paint - Medellin Area
    { latitude: 11.157129, longitude: 124.004010 }, // Medellin Area
    { latitude: 11.159330, longitude: 124.003016 }, // Medellin Area
    { latitude: 11.161990, longitude: 124.003991 }, // Medellin Area
    { latitude: 11.163110, longitude: 124.003594 }, // Medellin Area
    { latitude: 11.163477, longitude: 124.002113 }, // Medellin Area
    { latitude: 11.164475, longitude: 124.001521 }, // Medellin Area
    { latitude: 11.164995, longitude: 123.999665 }, // Medellin Area
    { latitude: 11.16604, longitude: 123.999060 }, // Medellin Area
    { latitude: 11.168664, longitude: 123.998955 }, // Medellin Area
    { latitude: 11.17015, longitude: 123.998335 }, // Medellin Area
    { latitude: 11.173086, longitude: 123.999614 }, // Medellin Area
    { latitude: 11.175523, longitude: 123.999650 }, // Municipality of Medellin Area
    { latitude: 11.178368, longitude: 124.001994 }, // Medellin Area
    { latitude: 11.179068, longitude: 124.001936 }, // Medellin Area
    { latitude: 11.180065, longitude: 124.000760 }, // Medellin Area
    { latitude: 11.181741, longitude: 124.000760 }, // Medellin Area
    { latitude: 11.183687, longitude: 124.002771 }, // Boboy Store - Daanbantayan
    { latitude: 11.184668, longitude: 124.004428 }, // Near Gloria Store - Daanbantayan Area
    { latitude: 11.184321, longitude: 124.005544 }, // Daanbantayan Area
    { latitude: 11.184778, longitude: 124.007180 }, // Daanbantayan Area
    { latitude: 11.189139, longitude: 124.009675 }, // Mainline Garden Cafe - Daanbantayan Area
    { latitude: 11.197873, longitude: 124.012797 }, // Daanbantayan Area
    { latitude: 11.200326, longitude: 124.014629 }, // Daanbantayan Area
    { latitude: 11.207067, longitude: 124.016554 }, // Daanbantayan Area
    { latitude: 11.222152, longitude: 124.014948 }, // Daanbantayan Area
    { latitude: 11.225819, longitude: 124.015948 }, // Daanbantayan Area
    { latitude: 11.246656, longitude: 124.008001 }, // Near Mfc Petron - Daanbantayan Area
    { latitude: 11.247606, longitude: 124.006821 }, // Dela Ramas Cakeshop - Daanbantayan Area
    { latitude: 11.248928, longitude: 124.0027519 }, // Daanbantayan Area
    { latitude: 11.249744, longitude: 124.001182 }, // J&T Home - Daanbantayan Area
    { latitude: 11.256495, longitude: 124.002333 }, // FB Fuel Station Daanbantayan Area
    { latitude: 11.266909, longitude: 124.006756 }, // Daanbantayan Area
    { latitude: 11.267705, longitude: 124.007381 }, // Daanbantayan Area
    { latitude: 11.268172, longitude: 124.008482 }, // Daanbantayan Area
    { latitude: 11.26656, longitude: 124.00854 }, // CTU Daanbantayan (end)
  ];

  // Custom map style to hide all default POI markers
  const customMapStyle = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "on" }]
    }
  ];

  // Center of Daanbantayan (calculated from boundary corners)
  const initialRegion = {
    latitude: 11.24955,  // Center latitude
    longitude: 125.05286, // Center longitude
    latitudeDelta: 0.25,
    longitudeDelta: 0.20,
  };

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions to use this feature.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Animate map to user's location
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );

      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
      setIsLoadingLocation(false);
    }
  };

return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} // This makes the blue dot appear
        showsMyLocationButton={true}   // Shows the button you noticed in the corner
        followsUserLocation={false}    // Keeps the map from "snapping" back if you scroll away
        initialRegion={{
          latitude: 10.3157, // Cebu City center
          longitude: 123.8854,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {/* ONLY SHOW BOUNDARY IF PROP IS TRUE */}
        {showBoundary && (
          <Polygon
            coordinates={[
              BOUNDARY_CORNERS.topLeft,
              BOUNDARY_CORNERS.topRight,
              BOUNDARY_CORNERS.bottomRight,
              BOUNDARY_CORNERS.bottomLeft,
            ]}
            strokeColor="rgba(255, 0, 0, 0.5)"
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeWidth={2}
          />
        )}

        {/* Via Kawit Route - Hidden if "None" or "Via Bagay" is selected */}
        {(activeRoute === 'Via Kawit' || activeRoute === 'Both' || activeRoute === 'Select Route') && (
          <Polyline
            coordinates={KAWIT_ROUTE}
            strokeColor="#4285F4"
            strokeWidth={4}
          />  
        )}

        {/* Via Bagay Route - Hidden if "None" or "Via Kawit" is selected */}
        {(activeRoute === 'Via Bagay' || activeRoute === 'Both' || activeRoute === 'Select Route') && (
          <Polyline
            coordinates={BAGAY_ROUTE}
            strokeColor="#EA4335"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,           // <--- Essential for Full Screen
    width: '100%',
    // Removed borderRadius and margin to fill the whole screen
    position: 'relative',
    backgroundColor: '#fff', 
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Better than 100% for Maps
  },
  // ... rest of your buttons (they look great!)
  button: {
    position: 'absolute',
    bottom: 17, // Pushed up slightly for better thumb reach
    right: 20,
    backgroundColor: '#4285F4',
    paddingVertical: 12, // Slightly larger for better touch target
    paddingHorizontal: 20,
    borderRadius: 30,    // Rounder "Pill" shape looks more modern
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  boundaryButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#EA4335',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
