export interface TrackingPacketType {
  _id?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Top-level fields
  protocol: string;
  packet_type: string;
  timestamp: Date;
  raw_data?: string;
  lastUpdate?: Date;

  // Header and device info
  header?: string;
  vendor_id?: string;
  firmware_version?: string;
  message_type?: string;
  message_id?: number;
  message_description?: string;
  packet_status?: string;

  // Device identification
  imei?: string;
  vehicle_reg_no?: string;

  // GPS information
  fix_status?: boolean;
  date?: string;
  time?: string;
  formatted_datetime?: string;
  latitude: number;
  latitude_dir: string;
  longitude: number;
  longitude_dir: string;
  speed_kmh: number;
  heading: number;
  satellites: number;
  altitude_m: number;
  pdop: number;
  hdop: number;

  // Vehicle status
  operator_name?: string;
  ignition?: boolean;
  main_power?: boolean;
  main_voltage: number;
  battery_voltage: number;
  emergency_status?: boolean;
  tamper_alert?: string;

  // Network information
  gsm_signal: number;
  mcc?: number;
  mnc?: number;
  lac?: string;
  cell_id?: string;

  // Neighbor cells
  neighbor_cell_1_signal: number;
  neighbor_cell_1_lac?: string;
  neighbor_cell_1_cell_id?: string;
  neighbor_cell_2_signal: number;
  neighbor_cell_2_lac?: string;
  neighbor_cell_2_cell_id?: string;
  neighbor_cell_3_signal: number;
  neighbor_cell_3_lac?: string;
  neighbor_cell_3_cell_id?: string;
  neighbor_cell_4_signal: number;
  neighbor_cell_4_lac?: string;
  neighbor_cell_4_cell_id?: string;

  // IO status
  digital_inputs: string;
  digital_outputs: string;
  frame_number: string;
  analog_input_1: number;
  analog_input_2: number;

  // Additional information
  delta_distance: string;
  ota_response?: string;
  checksum?: string;
  lastUpdatedAtISTStored?: string;
  new?: boolean; 
  // Geospatial location
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Optional: Create a more specific type for frontend use
export interface GPSTrackingData {
  // Core GPS data
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading: number;
  altitude_m: number;
  
  // Vehicle info
  vehicle_reg_no?: string;
  imei?: string;
  
  // Status
  ignition?: boolean;
  main_power?: boolean;
  main_voltage: number;
  battery_voltage: number;
  
  // Network
  gsm_signal: number;
  operator_name?: string;
  
  // Timestamps
  timestamp: Date;
  formatted_datetime?: string;
  
  // Location for maps
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// For your live tracking component, you can create a simplified interface
export interface LiveTrackingData {
  lat: number;
  lng: number;
  location: string;
  speed: string;
  imei: string;
  battery: number;
  ignition: string;
  lastUpdated: string;
  powerStatus: string;
  heading: number;
  satellites: number;
  gsm_signal: number;
  vehicle_reg_no?: string;
  formatted_datetime?: string;
}

// Conversion utility function
export const convertTrackingPacketToLiveData = (packet: TrackingPacketType): LiveTrackingData => {
  return {
    lat: packet.latitude || 0,
    lng: packet.longitude || 0,
    location: `${packet.latitude}, ${packet.longitude}`,
    speed: `${packet.speed_kmh || 0}`,
    imei: packet.imei || 'Unknown',
    battery: packet.battery_voltage || 0,
    ignition: packet.ignition ? 'On' : 'Off',
    lastUpdated: new Date(packet.timestamp).toLocaleString(),
    powerStatus: packet.main_power ? 'Connected' : 'Disconnected',
    heading: packet.heading || 0,
    satellites: packet.satellites || 0,
    gsm_signal: packet.gsm_signal || 0,
    vehicle_reg_no: packet.vehicle_reg_no,
    formatted_datetime: packet.formatted_datetime || '',
  };
};
