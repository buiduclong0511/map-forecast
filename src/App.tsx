import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import styled from "styled-components";
import slug from "slug";
import RingLoader from "react-spinners/RingLoader";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import mapboxgl from "mapbox-gl";

import { MarkerIcon, Input, WeatherPopup, WeatherPopupMobile } from "src/Components";
import { weatherApi } from "src/Api";
import { sleep, useDebounce, useWindowDimensions } from "src/Hooks";
import { IViewport, ICoordinates, ILocation, IResponseWeather } from "src/Interface";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const App: React.FC = () => {
    const [viewport, setViewport] = useState<IViewport>({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 10,
        width: "100%",
        height: "100%",
        pitch: 40,
    });
    const [currentCoordinates, setCurrentCoordinates] = useState<ICoordinates>({
        latitude: 0,
        longitude: 0,
    });
    const [keySearch, setKeySearch] = useState<string>("");
    const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
    const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
    const [listLocations, setListLocations] = useState<ILocation[]>([]);
    const [isShowSearchResult, setIsShowSearchResult] = useState<boolean>(false);
    const [isFocusInput, setIsFocusInput] = useState<boolean>(false);
    const [isShowPopup, setIsShowPopUp] = useState<boolean>(false);
    const [currentWeather, setCurrentWeather] = useState<IResponseWeather | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setViewport((prev) => {
                    return {
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                });
                setIsLoadingWeather(true);
                weatherApi
                    .getCurrentWeather(`${position.coords.latitude},${position.coords.longitude}`)
                    .then((res: IResponseWeather) =>
                        setCurrentWeather({
                            ...res,
                            location: {
                                ...res.location,
                                name: "Your location",
                            },
                        })
                    )
                    .catch((err) => {
                        setCurrentWeather(null);
                        console.log(err);
                    })
                    .finally(() => setIsLoadingWeather(false));
            });
        }
    }, []);

    useEffect(() => {
        setIsShowSearchResult(isFocusInput);
    }, [isFocusInput]);

    useDebounce(
        () => {
            if (keySearch.trim()) {
                setIsLoadingLocations(true);
                weatherApi
                    .searchLocation(slug(keySearch.trim()))
                    .then((res: ILocation[]) => {
                        setListLocations(res);
                    })
                    .catch((err) => {
                        setListLocations([]);
                        console.log(err);
                    })
                    .finally(() => setIsLoadingLocations(false));
            } else {
                setListLocations([]);
            }
        },
        500,
        [keySearch]
    );

    const handleChangeKeySearch = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            setKeySearch(e.target.value);
        }
    };

    const handleFocusInput = () => {
        setIsFocusInput(true);
    };

    const handleBlurInput = async () => {
        await sleep(150);
        setIsFocusInput(false);
    };

    const handleClickLocation = (location: ILocation) => {
        setCurrentCoordinates({
            latitude: location.lat,
            longitude: location.lon,
        });
        setViewport((prev: IViewport) => {
            return {
                ...prev,
                latitude: location.lat,
                longitude: location.lon,
            };
        });
        setIsLoadingWeather(true);
        setCurrentWeather(null);
        setIsShowPopUp(true);
        weatherApi
            .getCurrentWeather(location.url)
            .then((res: IResponseWeather) => {
                setCurrentWeather(res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoadingWeather(false));
    };

    const handleTogglePopup = () => {
        setIsShowPopUp(!isShowPopup);
    };

    return (
        <Container className="App">
            <div className="toggleDarkMode">
                <DarkModeSwitch checked={darkMode} onChange={(e) => setDarkMode(e)} size={120} />
            </div>
            <div className="searchBox">
                <Input
                    value={keySearch}
                    onChange={handleChangeKeySearch}
                    placeholder="Enter city name"
                    onBlur={handleBlurInput}
                    onFocus={handleFocusInput}
                />
                {isShowSearchResult && (
                    <SearchResult>
                        {listLocations.length ? (
                            <div className="listLocations">
                                {listLocations.map((item: ILocation) => {
                                    const handleClick = () => handleClickLocation(item);
                                    return (
                                        <div
                                            className="resultItem"
                                            key={item.id}
                                            onClick={handleClick}
                                        >
                                            {item.name}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="noItem">No items</div>
                        )}
                    </SearchResult>
                )}
                {isLoadingLocations && (
                    <div className="loading">
                        <RingLoader size={25} color={darkMode ? "#fff" : "#000"} />
                    </div>
                )}
            </div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
                width="100%"
                height="100%"
                onViewportChange={(viewport: IViewport) => setViewport(viewport)}
                mapStyle={
                    darkMode ? "mapbox://styles/mapbox/dark-v9" : "mapbox://styles/mapbox/light-v9"
                }
            >
                <Marker
                    latitude={currentCoordinates.latitude}
                    longitude={currentCoordinates.longitude}
                    offsetLeft={-10}
                    offsetTop={-27}
                    onClick={handleTogglePopup}
                >
                    <MarkerIcon imgPath="images/map_pin_icon.png" />
                </Marker>
                {isShowPopup && width > 767 ? (
                    !isLoadingWeather ? (
                        currentWeather ? (
                            <Popup
                                latitude={currentCoordinates.latitude}
                                longitude={currentCoordinates.longitude}
                                closeButton={false}
                                anchor="top"
                            >
                                <WeatherPopup data={currentWeather} />
                            </Popup>
                        ) : (
                            <Popup
                                latitude={currentCoordinates.latitude}
                                longitude={currentCoordinates.longitude}
                                closeButton={false}
                                anchor="top"
                            >
                                <div className="noInfo">No information</div>
                            </Popup>
                        )
                    ) : (
                        <Popup
                            latitude={currentCoordinates.latitude}
                            longitude={currentCoordinates.longitude}
                            closeButton={false}
                            anchor="top"
                        >
                            <WeatherLoading>
                                <RingLoader size={30} color="#000" />
                            </WeatherLoading>
                        </Popup>
                    )
                ) : (
                    <></>
                )}
            </ReactMapGL>
            {width <= 767 && (
                <WeatherPopupMobile
                    data={currentWeather}
                    isShowPopup={isShowPopup}
                    isLoading={isLoadingWeather}
                    onClose={() => setIsShowPopUp(false)}
                />
            )}
        </Container>
    );
};

const Container = styled.div`
    height: 100vh;

    .searchBox {
        position: fixed;
        z-index: 1;
        top: 10px;
        right: 10px;

        .loading {
            position: absolute;
            top: 2px;
            right: calc(100% + 25px);
            /* transform: translateY(-50%); */
        }
    }

    .toggleDarkMode {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1;
        width: 30px;
        height: 30px;

        svg {
            width: 100%;
            height: 100%;
        }
    }
`;

const SearchResult = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    width: 100%;
    border: 1px solid #6b6969;
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.5);

    .listLocations {
        max-height: 200px;
        overflow-y: scroll;
        /* width */
        ::-webkit-scrollbar {
            width: 2px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #888;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .resultItem {
            padding: 5px 10px;
            cursor: pointer;

            &:hover {
                background-color: #ccc;
            }
        }
    }

    .noItem {
        padding: 5px 10px;
    }
`;

const WeatherLoading = styled.div`
    padding: 30px;

    > span {
        display: inline-block;
        position: relative;
        left: -5px;
    }
`;

export default App;
