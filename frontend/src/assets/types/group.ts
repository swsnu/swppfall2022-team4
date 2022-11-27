export type geolocationResponseType = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
};

export type listGeoStateType = {
  center: {
    lat: number | null;
    lng: number | null;
  };
  errMsg: string | null;
  isLoading: boolean;
};
  
export type co2regionResponseType = {
  region_type: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  code: string;
  x: number;
  y: number;
};

export type coordinateType = {
  lat: number | null;
  lng: number | null;
}

export type co2addResponseType = {
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null,
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
  }
}

export type keywordSearchResultType = {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
};
