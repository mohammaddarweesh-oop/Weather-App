import {
  Button,
  Container,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import "./App.css";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import "moment/min/locales";
moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
let directionn = "rtl";

function App() {
  const [temp, setTemp] = useState({
    number: null,
    desription: "",
    min: null,
    max: null,
    icon: "",
    name: "",
  });
  const [lang, setLang] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  // for translate
  const { t, i18n } = useTranslation();

  function convertToCelicus(num) {
    return Math.round(num - 272.15);
  }

  function languageHandler() {
    if (lang === "en") {
      directionn = "rtl";
      setLang("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
      setDateAndTime(moment().format("MMMM - Do - YYYY"));
    } else {
      directionn = "ltr";
      setLang("en");
      i18n.changeLanguage("en");
      moment.locale("en");
      setDateAndTime(moment().format("MMMM - Do - YYYY"));
    }
  }
  useEffect(() => {
    i18n.changeLanguage("ar");
  }, []);
  let cancelAxios = useRef(null);
  useEffect(() => {
    // Make a request for a user with a given ID
    setDateAndTime(moment().format("MMMM - Do - YYYY"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.95522&lon=35.94503&appid=2975db32b6fc2b420da88b074a37265a",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        console.log(response);
        setTemp({
          number: convertToCelicus(response.data.main.temp),
          desription: response.data.weather[0].description,
          min: convertToCelicus(response.data.main.temp_min),
          max: convertToCelicus(response.data.main.temp_max),
          icon: response.data.weather[0].icon,
          name: response.data.name,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      console.log("cancel");
      cancelAxios();
    };
  }, []);
  return (
    <div className="App" style={{ direction: directionn }}>
      {/* lang === "ar" ? "rtl" : "ltr"  */}
      <ThemeProvider theme={theme}>
        <Container maxWidth={"sm"}>
          <div className="container-card">
            {/* content */}
            <div className="card">
              {/* city & time */}
              <div className="city-time">
                <Typography
                  variant="h2"
                  component="h2"
                  className="text-selection"
                >
                  {/* عمان */}
                  {t(temp.name)}
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  className="text-selection"
                >
                  {dateAndTime}
                </Typography>
              </div>
              {/* city & time */}
              <hr />
              {/* degree & discribtion */}
              <div className="weather-details">
                <div className="temp">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h1"
                      component="h2"
                      className="text-selection"
                    >
                      {temp.number}
                    </Typography>
                    <img
                      src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`}
                      alt=""
                    />
                  </div>

                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-selection"
                  >
                    {t(temp.desription)}
                  </Typography>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <h5 className="text-selection">
                      {" "}
                      {t("min")} : {temp.min}
                    </h5>
                    {/* <Divider orientation="vertical" flexItem /> */}
                    <h5 style={{ padding: "0 5px" }} className="text-selection">
                      |
                    </h5>
                    <h5 className="text-selection">
                      {t("max")} : {temp.max}
                    </h5>
                  </div>
                </div>
                <div>
                  <CloudIcon className="cloud-icon" />
                </div>
              </div>
              {/* degree & discribtion */}
            </div>
            {/* content */}
            <div
              style={{ display: "flex", justifyContent: "end", width: "100%" }}
            >
              <Button
                variant="text"
                style={{ color: "white", marginTop: "20px" }}
                onClick={languageHandler}
              >
                {lang === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
