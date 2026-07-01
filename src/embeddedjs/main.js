import Poco from "commodetto/Poco";
import Vibes from "pebble/vibes";

// inspired by SweWeek from chrobe

let render = new Poco(screen);

const font = new render.Font("Bitham-Black", 30);
const gothic = new render.Font("Gothic-Regular", 28);
const gothicBold = new render.Font("Gothic-Bold", 28);

const roboto = new render.Font("Roboto-Bold", 49);
const robotoCondensed = new render.Font("Roboto-Condensed", 21);

const black = render.makeColor(0, 0, 0);
const red = render.makeColor(255, 0, 0);
const white = render.makeColor(255, 255, 255);
const gray = render.makeColor(128, 128, 128);


const days = [
	"söndag",
	"måndag",
	"tisdag",
	"onsdag",
	"torsdag",
	"fredag",
	"lördag",
	"söndag"
];

const monthNames = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december"
];

function getISOWeekNumber(date = new Date()) {
  // Create a copy of the date to avoid mutating the original
  const currentTarget = new Date(date.valueOf());
  
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const dayNr = (date.getDay() + 6) % 7;
  currentTarget.setDate(currentTarget.getDate() - dayNr + 3);
  
  // Get first Thursday of the year
  const firstThursday = currentTarget.valueOf();
  currentTarget.setMonth(0, 1);
  if (currentTarget.getDay() !== 4) {
    currentTarget.setMonth(0, 1 + ((4 - currentTarget.getDay() + 7) % 7));
  }
  
  // Calculate full weeks between dates
  const weekNumber = 1 + Math.ceil((firstThursday - currentTarget) / 604800000);
  return "v." + weekNumber;
}

function drawTextCenter(string, font, color, height) {
  const fontWidth = render.getTextWidth(string, font);
  render.drawText(string, font, color, (render.width - fontWidth) / 2, height);
}

function draw() {
	render.begin();
	render.fillRectangle(black, 0, 0, render.width, render.height);

  const currentDate = new Date();
  
  const hour = String(currentDate.getHours()).padStart(2, "0");
  const minute = String(currentDate.getMinutes()).padStart(2, "0");
	const time = `${hour}:${minute}`;
  
  const year = String(currentDate.getFullYear());
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0")
  const date = `${day} ${month} ${year}`;
  
  const weekday = days[new Date().getDay()];
  const monthName = monthNames[currentDate.getMonth()];
  const weekNumber = getISOWeekNumber(currentDate);
  
  const padding = 8;

  drawTextCenter(weekday, gothic, white, padding);
  drawTextCenter(currentDate.getDate() + " " + monthName, gothic, white, gothic.height + padding);
  
  render.drawLine(25, render.height / 3, render.width - 25, render.height / 3, white, 3);

	drawTextCenter(time, roboto, white, (render.height - roboto.height) / 2);
  
  render.drawLine(25, (render.height / 3) * 2, render.width - 25, (render.height / 3) * 2, white, 3);

  drawTextCenter(weekNumber, gothic, white, (render.height - (font.height * 2) - padding));
	drawTextCenter(date, gothic, white, (render.height - font.height) - padding);
  
  if (!isConnected) render.drawText("!", font, red, render.width -20, render.height - 40);
  
	render.end();
}

let isConnected = true;

function checkConnection() {
    isConnected = watch.connected.app;
    if (!isConnected) Vibes.shortPulse();
    draw();
}
watch.addEventListener("connected", checkConnection);
checkConnection();


watch.addEventListener('minutechange', draw);
