// This code is responsible for handling the booking of sports slots
// It generates available slots and allows users to book them

const fs = require("fs");
const clubs = require("./../data/SPORTS_DATA.json"); //This is the data for the clubs(venues, address, sports,etc)
const path = require("path");
const booking_path = path.join(__dirname, "../data/BOOKED_DATA.json"); //This is the data for the booked slots

//This code generates the slots for the booking
//It generates slots from 10:00 to 18:00
function generateslots(time, date) {
  const slots = [];
  const startHour = 10;
  const endHour = 18;
  const today = new Date();
  const[day,month,year]=date.split("/");
  const inputDate = new Date(year, month - 1, day);
  const isToday =
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear();

  let start = isToday ? today.getHours() + 1 : startHour;
  if (start < startHour) start = startHour;

  for (let hour = start; hour <= endHour; hour++) {
    slots.push(`${hour}:00`);
  }
  return slots;
}
//This code is for getting the bookings for a particular venue and date(GET request)
const getBookings = (req, res) => {
  const { venue, date } = req.query;

  const[day,month,year]=date.split("/");
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  if (inputDate < today) {
    return res.status(400).json({ error: "Date must be today or in the future." });
  }

  const now = new Date();
  const hour = now.getHours();
  const slots = generateslots(hour, date);
  //filtering the booked slots
  const booking = JSON.parse(fs.readFileSync(booking_path));
  const booked = booking
    .filter((b) => b.venue === venue && b.date === date)
    .map((b) => b.time);

  
  //filtering the booked slots
  const available = slots
    .filter((s) => !booked.includes(s))
    .map((s) => ({ s }));

  res.json(available);
};
//This code is for booking a slot(POST request)
const bookslot = (req, res) => {
  const { venue, sports, date, time } = req.body;
  //Checking if the slot is already booked
  //This is concurrency check
  const booking = JSON.parse(fs.readFileSync(booking_path));
  const booked = booking.some(
    (b) =>
      b.venue === venue &&
      b.sports === sports &&
      b.date === date &&
      b.time === time
  );

  const club_2 = clubs[0][venue];

  if (booked) {
    return res.status(400).json({
      status: "fail",
      message: "Slot already booked",
    });
  }
  //Pushing the booking data to the booked data
  booking.push({
    venue,
    address: club_2.address,
    sports,
    date,
    time,
  });
  fs.writeFileSync(booking_path, JSON.stringify(booking, null, 2));
  return res.status(200).json({
    status: "success",
    data: {
      booking: {
        venue,
        address: club_2.address,
        sports,
        date,
        time,
      },
    },
  });
};
//This code is for getting the venue details(GET request)
const getVenueDetails = (req, res) => {
  const { venue } = req.params;

  const venuesData = clubs[0]; 
  if (venue) {
    const venueInfo = venuesData[venue];
    if (!venueInfo) {
      return res.status(404).json({
        status: "fail",
        message: "Venue not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        venue,
        address: venueInfo.address,
        sports: venueInfo.sports,
      },
    });
  }
};

module.exports = {
  getBookings,
  bookslot,
  getVenueDetails,
};
