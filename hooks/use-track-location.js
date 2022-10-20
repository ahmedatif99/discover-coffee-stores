import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store.context";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErroMsg] = useState("");
  // const [latlong, setLatlong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatlong(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationErroMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErroMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErroMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      //   status.textContent = "Locationg...";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return { handleTrackLocation, locationErrorMsg, isFindingLocation };
};

export default useTrackLocation;
