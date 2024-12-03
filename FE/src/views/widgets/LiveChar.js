import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody } from "@coreui/react";
import { CChart } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";

const LiveChar = () => {
  const data_humidity = useRef([]);
  const data_temperature = useRef([]);
  const data_light = useRef([]);
  const timeline = useRef([]);
  const [liveData, setLiveData] = useState({
    light: 0,
    humidity: 0,
    temperature: 0,
  });

  const fetchData = () => {
    fetch("http://localhost:3001/sensor/latest", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const currentTime = new Date().toLocaleTimeString();

          if (data_humidity.current.length >= 10) {
            data_humidity.current.shift();
            data_temperature.current.shift();
            data_light.current.shift();
            timeline.current.shift();
          }

          data_humidity.current.push(data.humidity);
          data_temperature.current.push(data.temperature);
          data_light.current.push(data.light);
          timeline.current.push(currentTime);

          setLiveData(data);
        }
      })
      .catch((err) => console.log("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CCard className="mb-4" style={{ height: "500px" }}>
      <CCardBody>
        <h4 className="card-title mb-0">Dữ liệu trực tiếp</h4>
        <p className="small text-medium-emphasis">
          {`Nhiệt độ: ${liveData.temperature.toFixed(2)} °C | Độ ẩm: ${liveData.humidity} % | Ánh sáng: ${liveData.light} LUX`}
        </p>
        <CChart
          type="bar"
          style={{ height: "300px" }}
          data={{
            labels: timeline.current,
            datasets: [
              {
                label: "Nhiệt độ (°C)",
                type: "bar",
                backgroundColor: getStyle("--cui-success"),
                borderColor: getStyle("--cui-success"),
                data: data_temperature.current,
                order: 2,
                yAxisID: "y-left",
              },
              {
                label: "Độ ẩm (%)",
                type: "bar",
                backgroundColor: getStyle("--cui-info"),
                borderColor: getStyle("--cui-info"),
                data: data_humidity.current,
                order: 2,
                yAxisID: "y-left",
              },
              {
                label: "Ánh sáng (LUX)",
                type: "line",
                backgroundColor: "transparent",
                borderColor: getStyle("--cui-warning"),
                pointHoverBackgroundColor: getStyle("--cui-warning"),
                borderWidth: 2,
                data: data_light.current,
                order: 1,
                yAxisID: "y-right",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                display: true,
              },
            },
            scales: {
              x: {
                grid: {
                  drawOnChartArea: false,
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              "y-left": {
                type: "linear",
                position: "left",
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                },
                title: {
                  display: true,
                  text: "Nhiệt độ (°C) và Độ ẩm (%)",
                },
              },
              "y-right": {
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                },
                grid: {
                  drawOnChartArea: false,
                },
                title: {
                  display: true,
                  text: "Ánh sáng (LUX)",
                },
              },
            },
            elements: {
              line: {
                tension: 0.4,
              },
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
              },
            },
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default LiveChar;
