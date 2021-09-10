import styled from "styled-components";

import { IResponseWeather } from "src/Interface";
import React, { memo } from "react";
import { RingLoader } from "react-spinners";

export const WeatherPopup: React.FC<{ data: IResponseWeather }> = memo(
    ({ data }) => {
        return (
            <Wrapper>
                <div className="heading">Location: {data.location.name}</div>
                <div className="main">
                    <div className="image">
                        <img src={data.current.condition.icon} alt="" />
                        <p className="text">{data.current.condition.text}</p>
                    </div>
                    <div className="weather">
                        <div className="day">{`${new Date().getDate()}/${
                            new Date().getMonth() + 1
                        }`}</div>
                        <div className="temp">
                            <span>Temperature: </span>
                            <span className="c">
                                {data.current.temp_c}
                                °C
                            </span>
                            <span className="f">
                                {data.current.temp_f}
                                °F
                            </span>
                        </div>
                        <div className="wind">
                            Wind Speed: {data.current.wind_kph} Km/h
                        </div>
                        <div className="uv">UV: {data.current.uv}</div>
                    </div>
                </div>
                <div className="forecast">
                    {data.forecast.forecastday.map((item, index) => {
                        return (
                            <div key={index} className="forecastItem">
                                <div className="day">
                                    {`${new Date(item.date).getDate()}/${
                                        new Date(item.date).getMonth() + 1
                                    }`}
                                </div>
                                <div className="image">
                                    <img src={item.day.condition.icon} alt="" />
                                </div>
                                <div className="temp">
                                    {item.day.mintemp_c.toFixed(1)} -{" "}
                                    {item.day.maxtemp_c.toFixed(1)}°C
                                    <br />
                                    {item.day.mintemp_f.toFixed(1)} -{" "}
                                    {item.day.maxtemp_f.toFixed(1)}°F
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Wrapper>
        );
    }
);

export const WeatherPopupMobile: React.FC<{
    data: IResponseWeather | null;
    isShowPopup: boolean;
    isLoading: boolean;
    onClose: () => any;
}> = memo(({ data, isShowPopup, isLoading, onClose }) => {
    return (
        <WrapperMobile isShowPopup={isShowPopup}>
            <button className="closeBtn" onClick={onClose}>
                &times;
            </button>
            {!isLoading ? (
                data ? (
                    <>
                        <div className="heading">
                            Location: {data.location.name}
                        </div>
                        <div className="main">
                            <div className="image">
                                <img src={data.current.condition.icon} alt="" />
                                <p className="text">
                                    {data.current.condition.text}
                                </p>
                            </div>
                            <div className="weather">
                                <div className="day">{`${new Date().getDate()}/${
                                    new Date().getMonth() + 1
                                }`}</div>
                                <div className="temp">
                                    <span>Temperature: </span>
                                    <span className="c">
                                        {data.current.temp_c}
                                        °C
                                    </span>
                                    <span className="f">
                                        {data.current.temp_f}
                                        °F
                                    </span>
                                </div>
                                <div className="wind">
                                    Wind Speed: {data.current.wind_kph} Km/h
                                </div>
                                <div className="uv">UV: {data.current.uv}</div>
                            </div>
                        </div>
                        <div className="forecast">
                            {data.forecast.forecastday.map((item, index) => {
                                return (
                                    <div key={index} className="forecastItem">
                                        <div className="day">
                                            {`${new Date(
                                                item.date
                                            ).getDate()}/${
                                                new Date(item.date).getMonth() +
                                                1
                                            }`}
                                        </div>
                                        <div className="image">
                                            <img
                                                src={item.day.condition.icon}
                                                alt=""
                                            />
                                        </div>
                                        <div className="temp">
                                            {item.day.mintemp_c.toFixed(1)} -{" "}
                                            {item.day.maxtemp_c.toFixed(1)}°C
                                            <br />
                                            {item.day.mintemp_f.toFixed(
                                                1
                                            )} - {item.day.maxtemp_f.toFixed(1)}
                                            °F
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <></>
                )
            ) : (
                <div className="loading">
                    <RingLoader size={30} color="#000" />
                </div>
            )}
        </WrapperMobile>
    );
});

const Wrapper = styled.div`
    .heading {
        text-align: center;
        padding: 0 10px;
        font-size: 20px;
        font-weight: 700;
    }

    .day {
        font-weight: 700;
    }

    .main {
        display: flex;
        align-items: stretch;
        padding-bottom: 10px;
        font-size: 14px;

        .image {
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .weather {
            padding: 10px;

            .f {
                margin-left: 10px;
            }
        }
    }

    .forecast {
        padding-top: 5px;
        border-top: 1px solid #ccc;
        display: flex;

        .forecastItem {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            .temp {
                font-size: 13px;
            }
        }
    }
`;

const WrapperMobile = styled(Wrapper)<{ isShowPopup: boolean }>`
    z-index: 1;
    position: fixed;
    bottom: ${(p) => (p.isShowPopup ? 0 : "-1000px")};
    left: 0;
    background-color: #fff;
    width: 100%;
    padding: 10px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    border-top: 1px solid #ccc;
    transition: 700ms;

    .closeBtn {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 5px;
        font-size: 20px;
    }

    .loading {
        padding: 30px;
        width: 100%;
        display: flex;
        justify-content: center;

        > span {
            display: inline-block;
            position: relative;
            left: -5px;
        }
    }

    .heading {
        text-align: left;
        padding-left: 10px;
    }
`;
